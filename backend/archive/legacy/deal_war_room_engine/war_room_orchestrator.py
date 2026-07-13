from data_room_engine.data_room_orchestrator import get_or_create_data_room_report
from sqlalchemy.orm import Session
from database import crud
from deal_war_room_engine.war_room_fixtures import get_sarvam_mock, get_default_mock
from deal_war_room_engine.bharatvector_mock import get_bharatvector_mock

def run_deal_war_room(deal_id: int, db: Session):
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise ValueError("Deal not found")

    # In APP_MODE=live, we would call all the sub-engines here.
    # For now, we fallback to our rich deterministic mocks to ensure reliability.
    
    company_name = deal.startup_name
    
    if company_name == "Sarvam AI":
        war_room_output = get_sarvam_mock()
    elif deal_id == 999 or company_name == "BharatVector AI":
        war_room_output = get_bharatvector_mock(str(deal_id))
    else:
        war_room_output = get_default_mock(company_name, str(deal_id), deal)
        

    # Integrate Data Room
    try:
        report = get_or_create_data_room_report(db, deal_id)
        if report.data_room_completeness_score > 0:
            # Inject data room insights into war room
            if "Data Room Insights" not in war_room_output.investment_thesis:
                war_room_output.investment_thesis += f"\n\n[Data Room Insight]: {report.decision_impact.get('next_diligence_action', '')}"
            if report.contradictions and "Data Room Contradiction" not in war_room_output.anti_thesis:
                war_room_output.anti_thesis += f"\n\n[Data Room Contradiction]: {report.contradictions[0].issue} - {report.contradictions[0].evidence_b}"
            
            # Inject into IC Simulation
            ic_sim = war_room_output.ic_simulation
            if ic_sim and report.metrics_extracted:
                ic_sim.partner_debates.append({
                    "topic": "Private Data Room Review",
                    "skeptic_view": f"We found contradictions: {report.contradictions[0].issue if report.contradictions else 'Need to verify gross margins.'}",
                    "sponsor_response": f"But we verified {report.metrics_extracted[0].metric_name} is {report.metrics_extracted[0].metric_value} with {report.metrics_extracted[0].confidence} confidence.",
                    "conclusion": report.decision_impact.get('blockers_added', 'Proceed to next diligence step.')
                })
    except Exception as e:
        print(f"Data room war room err: {e}")
        pass

    # Persist to database
    war_room_data = war_room_output.dict()
    db_war_room = crud.create_war_room(db, deal_id, war_room_data)
    
    return war_room_output
