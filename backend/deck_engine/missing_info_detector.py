from typing import List
from deck_engine.deck_schemas import MissingDeckSectionOutput, ExtractedDeckSection

class MissingInfoDetector:
    REQUIRED_SECTIONS = [
        "Problem",
        "Solution",
        "Market",
        "Traction",
        "Business Model",
        "Competition",
        "Team",
        "Financials",
        "Fundraising"
    ]
    
    @staticmethod
    def detect(sections: List[ExtractedDeckSection]) -> List[MissingDeckSectionOutput]:
        found_sections = [sec.section_type for sec in sections]
        missing = []
        
        for req in MissingInfoDetector.REQUIRED_SECTIONS:
            if req not in found_sections:
                # Assign severities based on type
                if req in ["Problem", "Solution", "Fundraising"]:
                    severity = "Critical"
                    why = f"A deck without a {req} is fundamentally broken for fundraising."
                    fix = f"Add a dedicated {req} slide."
                    question = f"Can you clearly articulate the {req}?"
                elif req in ["Traction", "Financials", "Competition"]:
                    severity = "High"
                    why = f"Investors need to see {req} to evaluate the risk profile."
                    fix = f"Include {req} metrics or landscape."
                    question = f"What does your {req} look like right now?"
                else:
                    severity = "Medium"
                    why = f"Missing {req} leaves open questions."
                    fix = f"Add a {req} slide."
                    question = f"Can you walk us through the {req}?"
                    
                missing.append(MissingDeckSectionOutput(
                    section_name=req,
                    severity=severity,
                    why_it_matters=why,
                    suggested_fix=fix,
                    likely_investor_question=question
                ))
                
        return missing
