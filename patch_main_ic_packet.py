with open("backend/main.py", "r") as f:
    content = f.read()

import_statement = "from data_room_engine.data_room_orchestrator import get_or_create_data_room_report\n"
if "get_or_create_data_room_report" not in content:
    content = import_statement + content

injection_point = """
    # Inject Data Room into One Pager (IC Packet)
    try:
        report = get_or_create_data_room_report(db, deal.id)
        if report.data_room_completeness_score > 0:
            if "Data Room Review" not in one_pager["executive_summary"]:
                metrics_str = ", ".join([f"{m.metric_name}: {m.metric_value}" for m in report.metrics_extracted[:3]])
                one_pager["executive_summary"] += f"\\n\\n### Data Room Review\\nCompleteness: {report.completeness_level} ({report.data_room_completeness_score}/100).\\nKey Metrics Verified: {metrics_str}.\\nContradictions: {len(report.contradictions)} identified."
                one_pager["diligence_requirements"].extend(report.recommended_diligence_actions)
    except Exception as e:
        print(f"Data room ic packet err: {e}")
        pass
"""

# Let's find exactly where to inject. `return one_pager` is inside `get_one_pager`. 
# We'll just replace the return inside get_one_pager.
# Actually, wait, there might be multiple `return one_pager`.
# I'll use a regex to inject it before `return one_pager` in the `get_one_pager` function.
import re
# Find the get_one_pager block
match = re.search(r"def get_one_pager\(.*?return one_pager", content, re.DOTALL)
if match:
    block = match.group(0)
    if "Data Room Review" not in block:
        new_block = block.replace("    return one_pager", injection_point + "\n    return one_pager")
        content = content.replace(block, new_block)

with open("backend/main.py", "w") as f:
    f.write(content)
