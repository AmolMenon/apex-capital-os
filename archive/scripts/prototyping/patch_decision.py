with open("backend/decision_engine/decision_orchestrator.py", "r") as f:
    content = f.read()

import_statement = "from data_room_engine.data_room_orchestrator import get_or_create_data_room_report\nfrom database import SessionLocal\n"
if "get_or_create_data_room_report" not in content:
    content = import_statement + content

# Find where to inject data room logic
injection_point = """
    # Data Room Impact
    db = SessionLocal()
    try:
        deal_id = deal.get("id")
        if deal_id:
            try:
                report = get_or_create_data_room_report(db, deal_id)
                score = report.data_room_completeness_score
                if score > 0:
                    calibrated["reasons"].append(f"Private data room parsed (Completeness: {score}/100).")
                    if report.decision_impact.get("ic_readiness_change"):
                        calibrated["final_recommendation"] = f"{calibrated['final_recommendation']} | Data Room Impact: {report.decision_impact.get('ic_readiness_change')}"
                    
                    if report.contradictions:
                        calibrated["blocking_issues"].extend([f"Data Room Contradiction: {c.issue}" for c in report.contradictions])
                    
                    if report.decision_impact.get("blockers_added"):
                        calibrated["blocking_issues"].append(report.decision_impact["blockers_added"])
                        
                    if score >= 80:
                        positive_signals.append("Comprehensive private diligence materials uploaded.")
            except Exception as e:
                print(f"Data room err: {e}")
                pass
    finally:
        db.close()
"""

if "# Data Room Impact" not in content:
    content = content.replace("    # Web Research Impact", injection_point + "\n    # Web Research Impact")

with open("backend/decision_engine/decision_orchestrator.py", "w") as f:
    f.write(content)
