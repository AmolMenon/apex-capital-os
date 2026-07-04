from sqlalchemy.orm import Session
from database import crud
from . import reddit_research_engine
from . import review_platform_engine
from . import social_signal_engine
from . import app_store_review_engine
from . import hackernews_forum_engine
from . import producthunt_engine
from . import github_signal_engine
from . import competitor_signal_engine
from . import pain_point_extractor
from . import reputation_risk_detector
from . import public_sentiment_analyzer
from . import platform_bias_detector
from . import platform_diligence_report_builder
import uuid
import json

def run_platform_diligence(db: Session, deal_id: int, config: dict):
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise ValueError(f"Deal with ID {deal_id} not found")
        
    deal_name = deal.company.name if deal.company else "Unknown Startup"
    
    run_id = str(uuid.uuid4())
    db_run = crud.create_platform_diligence_run(db, deal_id, run_id, json.dumps(config))
    
    try:
        platforms_checked = []
        reddit_findings = []
        if config.get("include_reddit", True):
            reddit_findings = reddit_research_engine.run_reddit_research(deal_name, config)
            platforms_checked.append("reddit")
            
        review_findings = []
        if config.get("include_reviews", True):
            review_findings = review_platform_engine.run_review_platform_research(deal_name, config)
            platforms_checked.append("g2")
            platforms_checked.append("capterra")

        social_findings = []
        if config.get("include_social", True):
            social_findings = social_signal_engine.run_social_signal_research(deal_name, config)
            platforms_checked.append("x_twitter")
            
        competitor_findings = []
        if config.get("include_competitors", True):
            competitor_findings = competitor_signal_engine.run_competitor_research(deal_name, config)
            
        all_signals = reddit_findings + review_findings + social_findings
        
        # Save signals to DB
        for signal in all_signals:
            signal["run_id"] = run_id
            signal["deal_id"] = deal_id
            crud.create_platform_signal(db, signal)
            
        pain_points = pain_point_extractor.extract_pain_points(deal_name, all_signals)
        reputation_risks = reputation_risk_detector.detect_reputation_risks(deal_name, all_signals)
        sentiment_summary = public_sentiment_analyzer.analyze_sentiment(deal_name, all_signals)
        bias_warning = platform_bias_detector.generate_bias_warning(platforms_checked)
        
        data = {
            "platforms_checked": platforms_checked,
            "reddit_findings": reddit_findings,
            "review_platform_findings": review_findings,
            "social_findings": social_findings,
            "competitor_findings": competitor_findings,
            "pain_points": pain_points,
            "reputation_risks": reputation_risks,
            "sentiment_summary": sentiment_summary,
            "bias_warning": bias_warning
        }
        
        report = platform_diligence_report_builder.build_diligence_report(deal_id, run_id, deal_name, data)
        
        db_run = crud.update_platform_diligence_run(db, run_id, "completed", report.model_dump_json())
        return report
        
    except Exception as e:
        db_run = crud.update_platform_diligence_run(db, run_id, "failed", json.dumps({"error": str(e)}))
        raise e
