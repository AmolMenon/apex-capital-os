from datetime import datetime

def generate_source_registry() -> list:
    today = datetime.now().strftime("%Y-%m-%d")
    return [
        {
            "module": "Market Research",
            "source_type": "Market report placeholder",
            "confidence": "Medium",
            "last_updated": today,
            "verification_status": "Partially verified"
        },
        {
            "module": "Competitor Research",
            "source_type": "Analyst estimate",
            "confidence": "Low",
            "last_updated": today,
            "verification_status": "Unverified"
        },
        {
            "module": "Customer Personas",
            "source_type": "Founder-provided data",
            "confidence": "Low",
            "last_updated": today,
            "verification_status": "Needs follow-up"
        },
        {
            "module": "Pricing Research",
            "source_type": "Internal heuristic",
            "confidence": "High",
            "last_updated": today,
            "verification_status": "Verified"
        },
        {
            "module": "TAM/SAM/SOM",
            "source_type": "Public database placeholder",
            "confidence": "Medium",
            "last_updated": today,
            "verification_status": "Partially verified"
        }
    ]
