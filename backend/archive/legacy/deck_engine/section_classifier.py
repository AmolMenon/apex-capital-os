from typing import List, Dict
from deck_engine.deck_schemas import ExtractedDeckSection

class SectionClassifier:
    """
    Classifies parsed chunks of text into standard deck sections.
    """
    
    @staticmethod
    def classify(parsed_sections: List[Dict[str, str]]) -> List[ExtractedDeckSection]:
        results = []
        
        for section in parsed_sections:
            header = section["header"]
            content = section["content"]
            
            # Simple heuristic classification based on the parser's assigned header
            relevance = "Medium"
            note = ""
            
            if "Problem" in header:
                relevance = "High"
                if len(content) < 50:
                    note = "Problem description is too brief."
                else:
                    note = "Clear problem statement."
            elif "Solution" in header:
                relevance = "High"
                if "AI" in content or "platform" in content:
                    note = "Contains buzzwords, needs to be evaluated for substance."
                else:
                    note = "Solution seems straightforward."
            elif "Traction" in header:
                relevance = "High"
                note = "Critical section: Needs quantitative verification."
            elif "Financials" in header or "Fundraising" in header:
                relevance = "High"
                note = "Requires unit economic analysis."
                
            results.append(
                ExtractedDeckSection(
                    section_type=header,
                    confidence=0.85, # Mock confidence
                    extracted_text=content,
                    investor_relevance=relevance,
                    quality_note=note or "Standard section"
                )
            )
            
        return results
