from typing import List
from deck_engine.deck_schemas import DeckTractionOutput, ExtractedDeckSection

class TractionExtractor:
    @staticmethod
    def extract(sections: List[ExtractedDeckSection]) -> DeckTractionOutput:
        trac_text = ""
        for sec in sections:
            if sec.section_type in ["Traction", "Product", "Market"]:
                trac_text += sec.extracted_text + " "
                
        lower_text = trac_text.lower()
        output = DeckTractionOutput()
        
        if "arr" in lower_text:
            output.arr = "Extracted ARR"
        if "mrr" in lower_text:
            output.mrr = "Extracted MRR"
        if "customers" in lower_text or "logos" in lower_text:
            output.customers = "Mentioned"
            output.notable_logos = ["Logo 1", "Logo 2"] # Mocked
            
        if "retention" in lower_text or "ndr" in lower_text:
            output.retention = "Mentioned"
            
        if "cac" in lower_text:
            output.cac = "Mentioned"
            
        return output
