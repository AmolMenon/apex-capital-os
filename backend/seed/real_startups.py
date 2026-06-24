from datetime import datetime
import json
from db.models import Deal
from public_data_engine.public_data_schemas import CompanyPublicProfile, Source

def get_sarvam_ai():
    profile = CompanyPublicProfile(
        company_name="Sarvam AI",
        sector="AI Infrastructure",
        geography="India",
        stage="Series A",
        business_model="B2B AI Models",
        public_description="Indian AI company focused on sovereign AI and Indian languages.",
        known_funding_rounds=["Announced $41M Series A led by Lightspeed."],
        known_investors=["Lightspeed", "Peak XV", "Khosla Ventures"],
        known_valuation_if_public="Not Public",
        public_sources=[
            Source(
                source_title="Sarvam AI emerges from stealth with $41M from Lightspeed, Peak XV",
                source_type="news article",
                source_url="https://techcrunch.com",
                date_published="2023",
                claims_supported=["$41M Series A", "Lightspeed, Peak XV, Khosla Ventures investment"],
                confidence="High",
                verification_status="Media reported"
            )
        ],
        unavailable_metrics=["ARR", "gross margin", "CAC", "retention", "enterprise customer concentration"],
        analyst_assumptions=["Likely pre-revenue or early revenue given the stage.", "Targeting government and large enterprise contracts in India."],
        source_quality_score=8,
        data_confidence="Medium",
        last_updated=datetime.utcnow().isoformat()
    )
    
    return Deal(
        startup_name="Sarvam AI",
        sector="AI",
        sub_sector="Foundation Models",
        geography="India",
        stage="Series A",
        business_model="B2B Enterprise",
        description="Indian AI company focused on sovereign AI and Indian languages.",
        deal_type="real_benchmark",
        is_public_benchmark=True,
        public_profile_json=profile.json(),
        status="New",
        # Keep private metrics empty/None as they are unknown
    )

def get_zepto():
    profile = CompanyPublicProfile(
        company_name="Zepto",
        sector="Quick Commerce",
        geography="India",
        stage="Late-stage",
        business_model="B2C Delivery",
        public_description="Indian quick commerce company offering 10-minute grocery delivery.",
        known_funding_rounds=["Reported $450M funding round at $7B valuation in 2025."],
        known_investors=["StepStone Group", "Nexus Venture Partners", "Glade Brook Capital"],
        known_valuation_if_public="$7B",
        public_sources=[
            Source(
                source_title="Zepto closes $450M round at $7B valuation",
                source_type="news article",
                source_url="https://techcrunch.com",
                date_published="2025",
                claims_supported=["$450M funding", "$7B valuation"],
                confidence="High",
                verification_status="Media reported"
            )
        ],
        unavailable_metrics=["exact unit economics by city/dark store", "EBITDA margin", "exact CAC vs LTV per cohort"],
        analyst_assumptions=["High cash burn despite increasing scale", "Strong network density in Tier 1 cities"],
        source_quality_score=9,
        data_confidence="High",
        last_updated=datetime.utcnow().isoformat()
    )
    
    return Deal(
        startup_name="Zepto",
        sector="Consumer",
        sub_sector="Quick Commerce",
        geography="India",
        stage="Late Stage",
        business_model="B2C",
        description="Quick commerce platform for 10-minute grocery delivery.",
        deal_type="real_benchmark",
        is_public_benchmark=True,
        public_profile_json=profile.json(),
        status="New"
    )

def get_mistral():
    profile = CompanyPublicProfile(
        company_name="Mistral AI",
        sector="AI",
        geography="France",
        stage="Growth Stage",
        business_model="Open & Proprietary Models",
        public_description="French AI company building state-of-the-art foundation models.",
        known_funding_rounds=["Announced €1.7B Series C at €11.7B post-money valuation."],
        known_investors=["a16z", "Lightspeed", "Microsoft", "Nvidia"],
        known_valuation_if_public="€11.7B",
        public_sources=[
            Source(
                source_title="Mistral AI raises €1.7B at €11.7B valuation",
                source_type="company announcement",
                source_url="https://mistral.ai",
                date_published="2024",
                claims_supported=["€1.7B funding", "€11.7B valuation"],
                confidence="High",
                verification_status="Verified public source"
            )
        ],
        unavailable_metrics=["detailed enterprise revenue mix", "API vs self-hosted compute margins"],
        analyst_assumptions=["Aggressive talent acquisition costs", "Model training heavily subsidized by compute partners"],
        source_quality_score=10,
        data_confidence="High",
        last_updated=datetime.utcnow().isoformat()
    )
    
    return Deal(
        startup_name="Mistral AI",
        sector="AI",
        sub_sector="Foundation Models",
        geography="France",
        stage="Growth Stage",
        business_model="B2B",
        description="Global frontier AI benchmark building efficient foundation models.",
        deal_type="real_benchmark",
        is_public_benchmark=True,
        public_profile_json=profile.json(),
        status="New"
    )

def get_truefan():
    profile = CompanyPublicProfile(
        company_name="TrueFan AI",
        sector="AI Video",
        geography="India",
        stage="Growth Stage",
        business_model="B2B2C",
        public_description="AI-generated personalized video content for brands and enterprises.",
        known_funding_rounds=["Reported $10M round led by Baring PE India and Z3Partners."],
        known_investors=["Baring PE India", "Z3Partners"],
        known_valuation_if_public="Not Public",
        public_sources=[
            Source(
                source_title="TrueFan raises $10M",
                source_type="news article",
                source_url="https://entrackr.com",
                date_published="2024",
                claims_supported=["$10M round"],
                confidence="Medium",
                verification_status="Media reported"
            )
        ],
        unavailable_metrics=["enterprise retention", "gross margin per video", "customer ROI"],
        analyst_assumptions=["Strong early traction with media brands", "Competition from generic AI video generation tools"],
        source_quality_score=7,
        data_confidence="Medium",
        last_updated=datetime.utcnow().isoformat()
    )
    
    return Deal(
        startup_name="TrueFan AI",
        sector="Generative Media",
        sub_sector="AI Video",
        geography="India",
        stage="Growth Stage",
        business_model="B2B2C",
        description="AI-generated personalized video content for brands and enterprises.",
        deal_type="real_benchmark",
        is_public_benchmark=True,
        public_profile_json=profile.json(),
        status="New"
    )

def get_integra():
    profile = CompanyPublicProfile(
        company_name="Integra Robotics",
        sector="Deeptech",
        geography="India",
        stage="Pre-Series A",
        business_model="Hardware & SaaS",
        public_description="Robotics, human-in-the-loop data flywheel, assistive/deeptech hardware-software systems.",
        known_funding_rounds=["Reported $1.12M Pre-Series A round."],
        known_investors=["Finvolve", "India Accelerator", "GrowthCap Venture Fund"],
        known_valuation_if_public="Not Public",
        public_sources=[
            Source(
                source_title="Integra Robotics secures $1.12M in Pre-Series A",
                source_type="news article",
                source_url="https://inc42.com",
                date_published="2024",
                claims_supported=["$1.12M round", "Investors: Finvolve, India Accelerator"],
                confidence="Medium",
                verification_status="Media reported"
            )
        ],
        unavailable_metrics=["hardware/software margins", "deployment cycles", "customer adoption rate"],
        analyst_assumptions=["Capital intensive R&D phase", "Long sales cycles for enterprise robotics"],
        source_quality_score=7,
        data_confidence="Medium",
        last_updated=datetime.utcnow().isoformat()
    )
    
    return Deal(
        startup_name="Integra Robotics",
        sector="Deeptech",
        sub_sector="Robotics",
        geography="India",
        stage="Pre-Series A",
        business_model="B2B",
        description="Robotics company building assistive deeptech systems.",
        deal_type="real_benchmark",
        is_public_benchmark=True,
        public_profile_json=profile.json(),
        status="New"
    )

def get_supertails():
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
    
    return Deal(
        startup_name="Supertails",
        sector="Consumer",
        sub_sector="Pet Care",
        geography="India",
        stage="Series C",
        business_model="B2C",
        description="Digital-first pet care platform offering pet supplies, vet consultations, and training.",
        deal_type="real_benchmark",
        is_public_benchmark=True,
        public_profile_json=profile.json(),
        status="New"
    )

def get_real_startups():
    return [
        get_sarvam_ai(),
        get_zepto(),
        get_mistral(),
        get_truefan(),
        get_integra(),
        get_supertails()
    ]
