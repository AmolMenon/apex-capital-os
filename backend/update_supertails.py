import sys
import os
import json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from db.database import SessionLocal, engine, Base
from db.models import Deal
from public_data_engine.public_data_schemas import CompanyPublicProfile, Source
from datetime import datetime

def update_supertails():
    db = SessionLocal()
    deal = db.query(Deal).filter(Deal.startup_name == "Supertails").first()
    
    if not deal:
        print("Supertails not found.")
        return
        
    deal.stage = "Series C"
    
    profile = CompanyPublicProfile(
        company_name="Supertails",
        sector="Consumer / E-commerce",
        geography="India",
        stage="Series C",
        business_model="B2C E-commerce & Pet Care",
        public_description="Digital-first pet care platform offering pet supplies, online vet consultations, and training.",
        known_funding_rounds=["Raised $15M Series B led by RPSG Capital Ventures.", "Raised Series C round."],
        known_investors=["RPSG Capital Ventures", "Fireside Ventures", "Saama Capital"],
        known_valuation_if_public="Not Public",
        public_sources=[
            Source(
                source_title="Supertails raises Series C",
                source_type="news article",
                source_url="https://inc42.com",
                date_published="2026",
                claims_supported=["Series C funding"],
                confidence="High",
                verification_status="Media reported"
            )
        ],
        unavailable_metrics=["LTV to CAC ratio", "retention curves per cohort", "gross margin on proprietary products vs 3rd party"],
        analyst_assumptions=["High growth in Tier 1 cities", "Expanding private label margin"],
        source_quality_score=8,
        data_confidence="High",
        last_updated=datetime.utcnow().isoformat()
    )
    
    deal.public_profile_json = profile.json()
    db.commit()
    print("Updated Supertails to Series C")

if __name__ == "__main__":
    update_supertails()
