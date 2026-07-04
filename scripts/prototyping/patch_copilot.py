with open("backend/partner_copilot_engine/copilot_orchestrator.py", "r") as f:
    content = f.read()

import_statement = "from data_room_engine.data_room_orchestrator import get_or_create_data_room_report\n"
if "get_or_create_data_room_report" not in content:
    content = import_statement + content

injection_point = """
    # Inject Data Room context into the copilot prompt
    try:
        report = get_or_create_data_room_report(db, deal_id)
        if report.data_room_completeness_score > 0:
            private_metrics_str = "\\n".join([f"{m.metric_name}: {m.metric_value} ({m.confidence} confidence)" for m in report.metrics_extracted])
            context_str += f"\\n\\nPRIVATE DATA ROOM EVIDENCE:\\n{private_metrics_str}\\n\\nContradictions: {len(report.contradictions)}"
        else:
            context_str += "\\n\\nPRIVATE DATA ROOM EVIDENCE: No private data room has been uploaded for this deal."
    except Exception as e:
        print(f"Data room copilot err: {e}")
        pass
"""

if "PRIVATE DATA ROOM EVIDENCE" not in content:
    content = content.replace('context_str = f"Deal Info:\\n{json.dumps(deal_data, indent=2)}"', 'context_str = f"Deal Info:\\n{json.dumps(deal_data, indent=2)}"\n' + injection_point)

with open("backend/partner_copilot_engine/copilot_orchestrator.py", "w") as f:
    f.write(content)
