with open("backend/deal_war_room_engine/war_room_orchestrator.py", "r") as f:
    content = f.read()

import_statement = "from data_room_engine.data_room_orchestrator import get_or_create_data_room_report\n"
if "get_or_create_data_room_report" not in content:
    content = import_statement + content

injection_point = """
    # Integrate Data Room
    try:
        report = get_or_create_data_room_report(db, deal_id)
        if report.data_room_completeness_score > 0:
            # Inject data room insights into war room
            if "Data Room Insights" not in war_room_output.investment_thesis:
                war_room_output.investment_thesis += f"\\n\\n[Data Room Insight]: {report.decision_impact.get('next_diligence_action', '')}"
            if report.contradictions and "Data Room Contradiction" not in war_room_output.anti_thesis:
                war_room_output.anti_thesis += f"\\n\\n[Data Room Contradiction]: {report.contradictions[0].issue} - {report.contradictions[0].evidence_b}"
            
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
"""

if "# Integrate Data Room" not in content:
    content = content.replace("    # Persist to database", injection_point + "\n    # Persist to database")

with open("backend/deal_war_room_engine/war_room_orchestrator.py", "w") as f:
    f.write(content)
