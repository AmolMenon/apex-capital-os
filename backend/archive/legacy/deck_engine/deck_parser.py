import re
from typing import List, Dict

class DeckParser:
    """
    A simple deterministic parser that takes raw deck text and attempts
    to chunk it into semantic sections based on common pitch deck keywords.
    """
    
    SECTION_KEYWORDS = {
        "Problem": ["problem", "the pain", "why it's broken", "challenge"],
        "Solution": ["solution", "how it works", "our product", "what we do", "introducing"],
        "Market": ["market", "tam", "sam", "som", "opportunity", "market size"],
        "Product": ["product", "features", "demo", "platform"],
        "Business Model": ["business model", "pricing", "revenue model", "how we make money"],
        "Traction": ["traction", "metrics", "growth", "milestones", "customers"],
        "Competition": ["competition", "competitive landscape", "competitors", "why us"],
        "Team": ["team", "leadership", "founders", "about us"],
        "Financials": ["financials", "projections", "revenue projection", "p&l"],
        "Fundraising": ["the ask", "fundraising", "use of funds", "round"],
        "Roadmap": ["roadmap", "future", "vision", "next steps"],
        "Risks": ["risks", "challenges", "mitigation"]
    }

    @staticmethod
    def parse_text(raw_text: str) -> List[Dict[str, str]]:
        if not raw_text:
            return []
            
        lines = raw_text.split('\n')
        sections = []
        current_section = "Executive Summary"
        current_content = []
        
        for line in lines:
            line_clean = line.strip()
            if not line_clean:
                continue
                
            # Check if line looks like a header
            is_header = False
            if len(line_clean) < 50: # Headers are usually short
                line_lower = line_clean.lower()
                for sec_name, keywords in DeckParser.SECTION_KEYWORDS.items():
                    if any(kw in line_lower for kw in keywords):
                        # Save previous section
                        if current_content:
                            sections.append({
                                "header": current_section,
                                "content": " ".join(current_content)
                            })
                        
                        current_section = sec_name
                        current_content = []
                        is_header = True
                        break
            
            if not is_header:
                current_content.append(line_clean)
                
        # Append the last section
        if current_content:
            sections.append({
                "header": current_section,
                "content": " ".join(current_content)
            })
            
        return sections
