from sqlalchemy.orm import Session
from db.database import SessionLocal, engine, Base
from db.models import Deal, Workspace
from datetime import datetime
from seed.real_startups import get_real_startups

# Recreate the database structure
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    # Create default Demo Workspace
    demo_workspace = db.query(Workspace).filter(Workspace.slug == "demo").first()
    if not demo_workspace:
        demo_workspace = Workspace(name="Demo Workspace", slug="demo")
        db.add(demo_workspace)
        db.commit()
        db.refresh(demo_workspace)
    
    # Clear existing
    db.query(Deal).delete()
    
    deals = [
        Deal(workspace_id=demo_workspace.id, deal_type="demo", 
            startup_name="NeuralDesk",
            sector="AI SaaS",
            sub_sector="Enterprise workflow automation",
            geography="India / US expansion",
            stage="Seed",
            business_model="B2B SaaS with usage-based AI automation layer",
            description="NeuralDesk helps mid-market operations teams automate repetitive internal workflows across support, finance, and sales operations using AI agents connected to existing SaaS tools.",
            founder_background="Ex-operator from a high-growth SaaS company. Strong workflow automation experience. Technical co-founder with AI infrastructure background. Early customer access through prior enterprise network.",
            market_size=15000.0,
            growth_rate=31.0, # 31% MoM
            revenue=4200000.0, # ₹42L ARR
            mrr=350000.0,
            arr=4200000.0,
            users=150,
            customers=18,
            retention_rate=118.0,
            churn_rate=0.0,
            gross_margin=84.0,
            cac=45000.0,
            ltv=500000.0,
            funding_raised=35000000.0, # ₹3.5Cr raised
            valuation=350000000.0,
            competitors="UiPath (RPA, legacy), Scale AI (Horizontal, expensive), incumbent SaaS platforms adding native AI automation.",
            status="Watchlist",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        ),
        Deal(workspace_id=demo_workspace.id, deal_type="demo", 
            startup_name="VetPulse AI",
            sector="Consumer Health",
            sub_sector="Pet Care",
            geography="Austin, TX",
            stage="Series A",
            business_model="D2C Subscription",
            description="VetPulse AI provides a preventative health subscription for dogs. It pairs an FDA-cleared smart collar that tracks biometric anomalies (heart rate variability, sleep quality, activity) with a customized monthly supplement pack tailored to the dog's specific aging curve and breed.",
            founder_background="CEO: Mike Roberts (Serial D2C founder, previously exited a $50M grooming brand to Petco). Chief Veterinary Officer: Dr. Emily Stone (DVM, former head of preventative medicine at Banfield).",
            market_size=45000.0,
            growth_rate=80.0,
            revenue=4200000.0,
            mrr=350000.0,
            arr=4200000.0,
            users=15000,
            customers=15000,
            retention_rate=88.0,
            churn_rate=12.0,
            gross_margin=62.0,
            cac=85.0,
            ltv=600.0,
            funding_raised=4000000.0,
            valuation=35000000.0,
            competitors="Fi Collar (Hardware only), The Farmer's Dog (Food only), Whistle (Legacy tracker).",
            status="Invested",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        ),
        Deal(workspace_id=demo_workspace.id, deal_type="demo", 
            startup_name="CarbonLoop",
            sector="Climate Tech",
            sub_sector="Carbon Intelligence",
            geography="London, UK",
            stage="Seed",
            business_model="B2B SaaS",
            description="CarbonLoop helps Fortune 500 manufacturing companies map and reduce their Scope 3 supply chain emissions. Instead of relying on industry averages, they use satellite imagery and API integrations into tier-2 supplier utility meters to generate audit-grade carbon accounting.",
            founder_background="CEO: James Thorne (Former McKinsey sustainability partner). CTO: Elena Rostova (Ex-Palantir forward deployed engineer). Deep enterprise sales network but highly technical.",
            market_size=8000.0,
            growth_rate=300.0,
            revenue=250000.0,
            mrr=20800.0,
            arr=250000.0,
            users=8,
            customers=8,
            retention_rate=100.0,
            churn_rate=0.0,
            gross_margin=85.0,
            cac=45000.0,
            ltv=300000.0,
            funding_raised=1500000.0,
            valuation=22000000.0,
            competitors="Watershed (Broad, expensive), Persefoni (Finance-focused), Emitwise.",
            status="Watchlist",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        ),
        Deal(workspace_id=demo_workspace.id, deal_type="demo", 
            startup_name="PayNest",
            sector="Fintech",
            sub_sector="Embedded Finance",
            geography="New York, NY",
            stage="Series B",
            business_model="B2B2B API / Take Rate",
            description="PayNest provides an API infrastructure that allows vertical SaaS platforms (like software for plumbers, salon owners, or gym managers) to instantly offer embedded working capital loans to their end merchants. PayNest handles underwriting, compliance, and capital provision.",
            founder_background="CEO: David Kim (Ex-Stripe Capital PM). CRO: Sarah Lopez (Ex-Square partnerships). The team knows embedded lending better than anyone.",
            market_size=25000.0,
            growth_rate=120.0,
            revenue=12000000.0,
            mrr=1000000.0,
            arr=12000000.0,
            users=45000,
            customers=25, # The SaaS platforms
            retention_rate=95.0,
            churn_rate=5.0,
            gross_margin=55.0, # Cost of capital eats into gross
            cac=150000.0,
            ltv=1200000.0,
            funding_raised=25000000.0,
            valuation=150000000.0,
            competitors="Parafin (Direct competitor), Stripe Capital (Not white-label), traditional factoring companies.",
            status="Screening",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        ),
        Deal(workspace_id=demo_workspace.id, deal_type="demo", 
            startup_name="BioSignal Labs",
            sector="Bioinformatics",
            sub_sector="Deeptech",
            geography="Boston, MA",
            stage="Pre-Seed",
            business_model="Milestone / Licensing",
            description="BioSignal Labs is building a foundational AI model trained entirely on single-cell spatial transcriptomics data. Their platform predicts off-target toxicity for novel oncology drugs 4x faster than in-vitro testing, allowing pharma companies to fail bad drugs sooner in the pipeline.",
            founder_background="CEO/CTO: Dr. Marcus Vance (MIT PhD in Computational Biology, 15 peer-reviewed papers on spatial transcriptomics). Sole founder, very academic, needs business leadership.",
            market_size=5000.0,
            growth_rate=0.0,
            revenue=0.0, # Pre-revenue
            mrr=0.0,
            arr=0.0,
            users=0,
            customers=0,
            retention_rate=0.0,
            churn_rate=0.0,
            gross_margin=0.0,
            cac=0.0,
            ltv=0.0,
            funding_raised=0.0,
            valuation=8000000.0, # High tech valuation
            competitors="Recursion Pharma (Broader scope), Insitro, traditional CROs.",
            status="New",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
    ]
    
    # Add real benchmark startups
    real_startups = get_real_startups()
    for deal in real_startups:
        deal.workspace_id = demo_workspace.id
        deals.append(deal)
        
    for deal in deals:
        db.add(deal)
        
    db.commit()
    db.close()
    print("Database seeded with fictional demo companies and real benchmark startups.")

if __name__ == "__main__":
    seed_database()
