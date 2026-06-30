import os
import sys
import json
from datetime import datetime, timedelta

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db.database import SessionLocal
from db.models import Deal, DemoSeedStatus, DiligenceRunModel, OperationTask, ICPacket, DealWarRoomModel

def seed_demo_data():
    db = SessionLocal()
    try:
        status = db.query(DemoSeedStatus).first()
        if status and status.is_seeded:
            # For this update, we always want to re-seed if we run this script.
            pass

        print("Seeding demo data with 20 realistic startups...")
        
        # Clear existing deals for a fresh start
        db.query(Deal).delete()
        db.commit()

        startups = [
            {"startup_name": "BharatVector AI", "sector": "AI Infrastructure", "stage": "Pre-Seed", "business_model": "B2B SaaS / API", "status": "Claim Verification", "description": "Building the foundational AI infrastructure for India's 1B+ non-English speakers."},
            {"startup_name": "NeuralDesk", "sector": "Enterprise SaaS", "stage": "Seed", "business_model": "B2B SaaS", "status": "Due Diligence", "description": "AI-first helpdesk for modern teams."},
            {"startup_name": "ScaleGraph", "sector": "AI Foundation Models", "stage": "Series A", "business_model": "API", "status": "AI Research", "description": "Developing large language models for specialized financial workflows."},
            {"startup_name": "DataFlow Dynamics", "sector": "Data Infrastructure", "stage": "Growth", "business_model": "B2B SaaS", "status": "IC Memo", "description": "Real-time stream processing for high-frequency trading firms."},
            {"startup_name": "ComputeAI", "sector": "Cloud Infrastructure", "stage": "Seed", "business_model": "IaaS", "status": "Deal Intake", "description": "Serverless GPU orchestration for agentic AI workloads."},
            {"startup_name": "Lumina Health", "sector": "HealthTech", "stage": "Series A", "business_model": "B2B2C", "status": "Startup Eval", "description": "AI-driven personalized healthcare pathways."},
            {"startup_name": "FinGuard", "sector": "FinTech", "stage": "Series B", "business_model": "B2B SaaS", "status": "Portfolio Tracking", "description": "Next-gen fraud detection using behavioral biometrics."},
            {"startup_name": "AeroShift", "sector": "Aerospace", "stage": "Seed", "business_model": "Hardware/Software", "status": "Due Diligence", "description": "Autonomous drone logistics for mid-mile delivery."},
            {"startup_name": "EcoChain", "sector": "ClimateTech", "stage": "Pre-Seed", "business_model": "SaaS", "status": "Deal Intake", "description": "Supply chain carbon footprint tracking and optimization."},
            {"startup_name": "QuantumLeap", "sector": "DeepTech", "stage": "Series A", "business_model": "Hardware", "status": "Investment Thesis", "description": "Room-temperature quantum computing interfaces."},
            {"startup_name": "MetaRetail", "sector": "E-commerce", "stage": "Seed", "business_model": "B2B SaaS", "status": "Claim Verification", "description": "AR/VR shopping experiences for Shopify merchants."},
            {"startup_name": "CyberShield", "sector": "Cybersecurity", "stage": "Series B", "business_model": "Enterprise Software", "status": "IC Memo", "description": "Zero-trust network architecture for remote teams."},
            {"startup_name": "AgriGrow", "sector": "AgriTech", "stage": "Seed", "business_model": "Hardware/SaaS", "status": "AI Research", "description": "Precision agriculture sensors powered by ML."},
            {"startup_name": "EduNova", "sector": "EdTech", "stage": "Series A", "business_model": "B2C Subscription", "status": "Startup Eval", "description": "Personalized learning platform for K-12 students."},
            {"startup_name": "SpaceLink", "sector": "SpaceTech", "stage": "Growth", "business_model": "Infrastructure", "status": "Portfolio Tracking", "description": "Low-latency satellite internet for maritime and aviation."},
            {"startup_name": "BioForge", "sector": "BioTech", "stage": "Series A", "business_model": "R&D", "status": "Investment Thesis", "description": "Synthetic biology platform for custom protein design."},
            {"startup_name": "AutoDrive", "sector": "Mobility", "stage": "Seed", "business_model": "Software", "status": "Due Diligence", "description": "Level 4 autonomous driving software for commercial trucking."},
            {"startup_name": "PropTech Solutions", "sector": "Real Estate", "stage": "Pre-Seed", "business_model": "Marketplace", "status": "Deal Intake", "description": "AI-powered property valuation and matching platform."},
            {"startup_name": "LegalAI", "sector": "LegalTech", "stage": "Seed", "business_model": "B2B SaaS", "status": "Claim Verification", "description": "Automated contract review and generation using LLMs."},
            {"startup_name": "RoboOps", "sector": "Robotics", "stage": "Series A", "business_model": "Hardware/SaaS", "status": "IC Memo", "description": "Collaborative robots for warehouse automation."}
        ]

        deals_data = []
        for i, s in enumerate(startups):
            s['id'] = 1000 + i
            s['is_demo'] = True
            s['recommendation'] = "Investigate"
            s['evidence_confidence'] = "Medium"
            s['trust_score'] = 75
            s['ic_readiness'] = "Not Ready"
            s['founder_name'] = f"Founder {i+1}"
            s['arr'] = (i + 1) * 1000000
            s['valuation'] = (i + 1) * 10000000
            deals_data.append(s)

        for data in deals_data:
            deal = Deal(**data)
            db.add(deal)
            db.commit()
            db.refresh(deal)

        # Ensure seed status is marked as true
        new_status = DemoSeedStatus(is_seeded=True)
        db.add(new_status)
        db.commit()

        print("Demo data seeded successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding demo data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
