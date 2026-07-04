import unicodedata
import fitz  # PyMuPDF
import hashlib
import re
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from db.models import Document, Chunk
import os

class IngestionService:
    @staticmethod
    def normalize_text(text: str) -> str:
        """
        Canonical text normalization for deterministic provenance matching.
        Handles unicode, whitespace, line breaks, hyphenation, and PDF ligatures.
        """
        if not text:
            return ""
            
        # NFKC normalization for unicode equivalences
        text = unicodedata.normalize("NFKC", text)
        
        # Replace common ligatures (fi, fl, ffi, ffl, etc.)
        # NFKC handles most, but we explicitly handle hyphenated line breaks
        text = re.sub(r'([a-zA-Z])-\n([a-zA-Z])', r'\1\2', text)
        
        # Normalize all whitespace (including newlines) to single spaces
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()

    @staticmethod
    def parse_pdf(file_path: str) -> List[Dict[str, Any]]:
        """
        Parses a PDF using PyMuPDF and extracts text chunks per page.
        """
        chunks = []
        doc = fitz.open(file_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text("text")
            
            # Basic chunking: one chunk per page for now, but in production
            # we'd split long pages by paragraph/token limit.
            if text.strip():
                chunks.append({
                    "content": text.strip(),
                    "page_number": page_num + 1,
                    "chunk_index": page_num
                })
        doc.close()
        return chunks

    @staticmethod
    def parse_text(content: str) -> List[Dict[str, Any]]:
        """
        Parses raw text and chunks it by paragraphs.
        """
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        chunks = []
        for i, para in enumerate(paragraphs):
            chunks.append({
                "content": para,
                "page_number": None,
                "chunk_index": i
            })
        return chunks

    @staticmethod
    def ingest_document(db: Session, decision_id: int, file_path: str, filename: str, file_type: str) -> Document:
        """
        Ingests a document, parses chunks, and saves to the database.
        """
        # Read content to hash it
        with open(file_path, "rb") as f:
            file_bytes = f.read()
        content_hash = hashlib.sha256(file_bytes).hexdigest()
        
        # Create Document record
        document = Document(
            decision_id=decision_id,
            filename=filename,
            file_type=file_type,
            content_hash=content_hash,
            metadata_json="{}"
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        
        # Parse chunks
        chunks_data = []
        if file_type.lower() == "pdf":
            chunks_data = IngestionService.parse_pdf(file_path)
        elif file_type.lower() in ["txt", "md"]:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            chunks_data = IngestionService.parse_text(content)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
            
        # Create Chunk records
        for chunk_data in chunks_data:
            chunk = Chunk(
                document_id=document.id,
                chunk_index=chunk_data["chunk_index"],
                content=chunk_data["content"],
                canonical_content=IngestionService.normalize_text(chunk_data["content"]),
                page_number=chunk_data.get("page_number")
            )
            db.add(chunk)
            
        db.commit()
        return document
