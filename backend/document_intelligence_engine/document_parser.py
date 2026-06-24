import os
import traceback
from typing import Dict, Any, Tuple

from document_intelligence_engine.document_schemas import DocumentParseResult

# Optional dependencies for parsing
try:
    import PyPDF2
    HAS_PYPDF2 = True
except ImportError:
    HAS_PYPDF2 = False

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False

class DocumentParser:
    """
    Base Document Parser that routes files to specific parsing logic.
    Gracefully degrades if parsing fails or libraries are missing.
    """
    
    def parse(self, file_path: str, mime_type: str, document_type: str) -> Tuple[DocumentParseResult, str]:
        """
        Returns (DocumentParseResult, extracted_text)
        """
        extracted_text = ""
        result = DocumentParseResult(status="processing")
        
        _, ext = os.path.splitext(file_path.lower())
        
        try:
            if ext == ".pdf":
                extracted_text = self._parse_pdf(file_path, result)
            elif ext in [".csv", ".xlsx"]:
                extracted_text = self._parse_spreadsheet(file_path, result, ext)
            elif ext in [".txt", ".md"]:
                extracted_text = self._parse_text(file_path, result)
            elif ext in [".pptx", ".docx"]:
                # Basic mock extraction for office files if no dedicated lib
                extracted_text = f"Mock extracted text from {ext} file."
                result.warnings.append(f"Full text extraction for {ext} requires python-docx/python-pptx. Basic parsing used.")
            else:
                result.status = "unsupported"
                result.error_message = f"Unsupported file extension: {ext}"
                return result, ""
                
            if result.status == "processing":
                result.status = "parsed"
                
        except Exception as e:
            result.status = "failed"
            result.error_message = str(e)
            result.warnings.append(traceback.format_exc())
            
        return result, extracted_text
        
    def _parse_pdf(self, file_path: str, result: DocumentParseResult) -> str:
        if not HAS_PYPDF2:
            result.warnings.append("PyPDF2 is not installed. PDF text extraction is limited or skipped.")
            return "PDF content (extraction skipped due to missing PyPDF2)"
            
        text_content = []
        try:
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for i, page in enumerate(reader.pages):
                    page_text = page.extract_text()
                    if page_text:
                        text_content.append(f"--- Page {i+1} ---\n{page_text}")
        except Exception as e:
            result.warnings.append(f"PDF parsing error: {str(e)}")
            
        if not text_content:
            result.warnings.append("Could not extract any text from PDF. It may be an image-based PDF (OCR not supported).")
            
        return "\n".join(text_content)
        
    def _parse_spreadsheet(self, file_path: str, result: DocumentParseResult, ext: str) -> str:
        if not HAS_PANDAS:
            result.warnings.append("pandas is not installed. Spreadsheet extraction is limited.")
            return f"Spreadsheet data from {ext}"
            
        try:
            if ext == ".csv":
                df = pd.read_csv(file_path)
                return df.to_string()
            else:
                # xlsx
                xls = pd.ExcelFile(file_path)
                sheets_text = []
                for sheet_name in xls.sheet_names:
                    df = pd.read_excel(xls, sheet_name=sheet_name)
                    sheets_text.append(f"--- Sheet: {sheet_name} ---\n{df.to_string()}")
                return "\n".join(sheets_text)
        except Exception as e:
            result.warnings.append(f"Spreadsheet parsing error: {str(e)}")
            return ""

    def _parse_text(self, file_path: str, result: DocumentParseResult) -> str:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except UnicodeDecodeError:
            with open(file_path, "r", encoding="latin-1") as f:
                return f.read()
