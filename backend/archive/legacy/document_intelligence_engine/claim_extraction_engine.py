from typing import List
from document_intelligence_engine.document_schemas import ExtractedDocumentClaim
from document_intelligence_engine.pitch_deck_parser import PitchDeckParser
from document_intelligence_engine.spreadsheet_parser import SpreadsheetParser
from document_intelligence_engine.cap_table_parser import CapTableParser
from document_intelligence_engine.financial_model_parser import FinancialModelParser

class ClaimExtractionEngine:
    
    @staticmethod
    def extract_claims(text: str, document_id: str, document_type: str) -> List[ExtractedDocumentClaim]:
        if document_type == "pitch_deck":
            return PitchDeckParser.extract_claims(text, document_id)
        elif document_type == "financial_model":
            return FinancialModelParser.extract_claims(text, document_id)
        elif document_type == "cap_table":
            return CapTableParser.extract_claims(text, document_id)
        elif document_type == "kpi_sheet" or document_type == "spreadsheet":
            return SpreadsheetParser.extract_claims(text, document_id)
        
        # Default extraction
        return []

    @staticmethod
    def generate_summary(text: str, document_type: str) -> str:
        if document_type == "pitch_deck":
            return PitchDeckParser.get_summary(text)
        elif document_type == "financial_model":
            return FinancialModelParser.get_summary(text)
        elif document_type == "cap_table":
            return CapTableParser.get_summary(text)
        elif document_type == "kpi_sheet":
            return SpreadsheetParser.get_summary(text)
            
        return "Document parsed successfully."
