from typing import List, Dict
import re
from deck_engine.deck_schemas import DeckFinancialOutput, ExtractedDeckSection

class FinancialsExtractor:
    @staticmethod
    def extract(sections: List[ExtractedDeckSection]) -> DeckFinancialOutput:
        fin_text = ""
        for sec in sections:
            if sec.section_type in ["Financials", "Fundraising", "Business Model"]:
                fin_text += sec.extracted_text + " "
                
        lower_text = fin_text.lower()
        
        output = DeckFinancialOutput()
        
        # Simple extraction logic
        if "revenue" in lower_text or "arr" in lower_text:
            output.current_revenue = "Extracted revenue metric (Requires manual review)"
            
        if "burn" in lower_text:
            output.burn_rate = "Mentioned"
        else:
            output.flags.append("Missing burn rate")
            
        if "runway" in lower_text or "months" in lower_text:
            output.runway = "Mentioned"
        else:
            output.flags.append("Missing runway")
            
        if "raise" in lower_text or "raising" in lower_text or "ask" in lower_text:
            output.fundraising_ask = "Extracted fundraising ask"
            
        if "use of funds" not in lower_text:
            output.flags.append("No explicit use of funds breakdown")
            
        if "valuation" not in lower_text and "cap" not in lower_text:
            output.flags.append("No valuation or cap mentioned")
            
        return output
