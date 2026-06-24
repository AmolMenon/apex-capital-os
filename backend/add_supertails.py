import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from db.database import SessionLocal, engine, Base
from db.models import Deal, Workspace
from public_data_engine.public_data_schemas import CompanyPublicProfile, Source
from datetime import datetime

def add_supertails():
    db = SessionLocal()
    demo_workspace = db.query(Workspace).filter(Workspace.slug == "demo").first()
    
    if db.query(Deal).filter(Deal.startup_name == "Supertails").first():
        print("Supertails already exists.")
        return
        
    profile = CompanyPublicProfile(
        company_name="Supertails",
        sector="Consumer / E-commerce",
        geography="India",
        stage="Series B",
        business_model="B2C E-commerce & Pet Care",
        public_description="Digital-first pet care platform offering pet supplies, online vet consultations, and training.",
        known_funding_rounds=["Raised $15M Series B led by RPSG Capital Ventures."],
        known_investors=["RPSG Capital Ventures", "Fireside Ventures", "Saama Capital"],
        known_valuation_if_public="Not Public",
        public_sources=[
            Source(
                source_title="Supertails raises $15M in Series B",
                source_type="news article",
                source_url="https://inc42.com",
                date_published="2024",
                claims_supported=["$15M round", "Investors: RPSG, Fireside"],
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
    
    deal = Deal(
        workspace_id=demo_workspace.id if demo_workspace else 1,
        startup_name="Supertails",
        sector="Consumer",
        sub_sector="Pet Care",
        geography="India",
        stage="Series B",
        business_model="B2C",
        description="Digital-first pet care platform offering pet supplies, vet consultations, and training.",
        deal_type="real_benchmark",
        is_public_benchmark=True,
        public_profile_json=profile.json(),
        status="New"
    )
    
    db.add(deal)
    db.commit()
    print("Added Supertails")

if __name__ == "__main__":
    add_supertails()
