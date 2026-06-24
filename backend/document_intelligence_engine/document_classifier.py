import os
from typing import Optional
from document_intelligence_engine.document_schemas import DocumentTypeClassification

class DocumentClassifier:
    
    @staticmethod
    def classify(filename: str, mime_type: str, extracted_text: str = "") -> DocumentTypeClassification:
        filename_lower = filename.lower()
        text_lower = extracted_text.lower()[:5000] # Use first 5000 chars for classification
        
        # Heuristics for Pitch Deck
        if any(w in filename_lower for w in ["deck", "pitch", "overview", "presentation"]):
            return DocumentTypeClassification(
                predicted_type="pitch_deck",
                confidence="High",
                reasons=["Filename indicates a pitch deck"],
                needs_user_confirmation=False
            )
            
        if any(w in text_lower for w in ["problem", "solution", "market size", "competitive landscape", "fundraising ask", "use of funds"]):
            return DocumentTypeClassification(
                predicted_type="pitch_deck",
                confidence="Medium",
                reasons=["Extracted text contains typical pitch deck sections"],
                needs_user_confirmation=True
            )

        # Heuristics for Financial Model
        if any(w in filename_lower for w in ["financial model", "p&l", "forecast", "projection"]):
            return DocumentTypeClassification(
                predicted_type="financial_model",
                confidence="High",
                reasons=["Filename indicates a financial model"],
                needs_user_confirmation=False
            )
            
        # Heuristics for Cap Table
        if any(w in filename_lower for w in ["cap table", "capitalization", "shareholding", "esop"]):
            return DocumentTypeClassification(
                predicted_type="cap_table",
                confidence="High",
                reasons=["Filename indicates a cap table"],
                needs_user_confirmation=False
            )
            
        # Heuristics for Customer Reference
        if any(w in filename_lower for w in ["customer", "reference", "case study", "testimonial"]):
            return DocumentTypeClassification(
                predicted_type="customer_reference",
                confidence="High",
                reasons=["Filename indicates customer references"],
                needs_user_confirmation=False
            )

        # Heuristics for KPI Sheet
        if any(w in filename_lower for w in ["kpi", "metrics", "dashboard", "cohort"]):
            return DocumentTypeClassification(
                predicted_type="kpi_sheet",
                confidence="High",
                reasons=["Filename indicates a KPI sheet"],
                needs_user_confirmation=False
            )
            
        # Heuristics for Legal
        if any(w in filename_lower for w in ["term sheet", "spa", "sha", "bylaws", "incorporation", "legal"]):
            return DocumentTypeClassification(
                predicted_type="legal_document",
                confidence="High",
                reasons=["Filename indicates legal document"],
                needs_user_confirmation=False
            )

        return DocumentTypeClassification(
            predicted_type="unknown",
            confidence="Low",
            reasons=["No strong heuristics matched"],
            needs_user_confirmation=True
        )
