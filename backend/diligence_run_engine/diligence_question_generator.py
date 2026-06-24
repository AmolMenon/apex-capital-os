from typing import List, Dict

class DiligenceQuestionGenerator:
    @staticmethod
    def generate(gaps: List[Dict[str, str]]) -> List[Dict[str, str]]:
        questions = []
        for gap in gaps:
            g = gap["gap"]
            if "Cap Table" in g:
                questions.append({
                    "question": "Can you provide the latest cap table?",
                    "why": "Needed to verify ownership and round math.",
                    "priority": "High"
                })
            elif "Financial Model" in g:
                questions.append({
                    "question": "Can you provide the latest financial model with historicals and projections?",
                    "why": "Needed to verify revenue, burn, and runway.",
                    "priority": "High"
                })
            elif "Customer" in g:
                questions.append({
                    "question": "Can you provide 2-3 customer references we can speak with?",
                    "why": "Needed to validate product value and retention.",
                    "priority": "Medium"
                })
            elif "ARR" in g:
                questions.append({
                    "question": "What is the current ARR and growth rate?",
                    "why": "Needed to support valuation.",
                    "priority": "High"
                })
            elif "Retention" in g:
                questions.append({
                    "question": "Can you share monthly usage or logo retention cohorts?",
                    "why": "Needed to verify product stickiness.",
                    "priority": "Medium"
                })
        return questions
