from .playbook_schemas import PlaybookSimulationResult, FundPlaybook

def simulate_deal(deal, company_name: str, playbook: FundPlaybook) -> PlaybookSimulationResult:
    # Deterministic mock simulation logic based on company name
    import json
    
    # Parse dynamic profile if available
    sector = "Technology"
    biggest_blocker_ai = "Wrapper vs Foundation model risk"
    biggest_blocker_evidence = "Missing verified financial data room"
    if deal and deal.public_profile_json:
        try:
            profile = json.loads(deal.public_profile_json)
            sector = profile.get("sector", "Technology")
            unavailable = profile.get("unavailable_metrics", [])
            if unavailable:
                biggest_blocker_evidence = f"Missing verified {unavailable[0]}"
            biggest_blocker_ai = f"Does not fit AI Native thesis. Sector is {sector}." if "AI" not in sector else "Wrapper vs Foundation model risk"
        except Exception:
            pass

    if company_name not in ["NeuralDesk", "Zepto"]:
        if playbook.playbook_id == "ai_native":
            return PlaybookSimulationResult(
                company_name=company_name, playbook_id=playbook.playbook_id, playbook_name=playbook.playbook_name,
                base_score=75, playbook_adjusted_score=88 if "AI" in sector else 40, recommendation="Investigate Deeply" if "AI" in sector else "Pass",
                gates_triggered=[], biggest_blocker=biggest_blocker_ai, required_next_action="Technical diligence" if "AI" in sector else "Archive"
            )
        elif playbook.playbook_id == "evidence_heavy":
            return PlaybookSimulationResult(
                company_name=company_name, playbook_id=playbook.playbook_id, playbook_name=playbook.playbook_name,
                base_score=75, playbook_adjusted_score=45, recommendation="Pass / Monitor",
                gates_triggered=["min_data_room_completeness", "required_retention_data"],
                biggest_blocker=biggest_blocker_evidence, required_next_action="Request Data Room"
            )
        else:
            return PlaybookSimulationResult(
                company_name=company_name, playbook_id=playbook.playbook_id, playbook_name=playbook.playbook_name,
                base_score=75, playbook_adjusted_score=75, recommendation="Monitor",
                gates_triggered=["public_benchmark_only"],
                biggest_blocker="Cannot invest on public data alone", required_next_action="Get founder meeting"
            )
    elif company_name == "NeuralDesk":
        return PlaybookSimulationResult(
            company_name=company_name, playbook_id=playbook.playbook_id, playbook_name=playbook.playbook_name,
            base_score=80, playbook_adjusted_score=80 + (10 if playbook.playbook_id == 'evidence_heavy' else 0),
            recommendation="IC Ready" if playbook.playbook_id == 'evidence_heavy' else "Strong Buy",
            gates_triggered=[], biggest_blocker="Valuation", required_next_action="Negotiate term sheet"
        )
    else:
        return PlaybookSimulationResult(
            company_name=company_name, playbook_id=playbook.playbook_id, playbook_name=playbook.playbook_name,
            base_score=60, playbook_adjusted_score=60, recommendation="Pass",
            gates_triggered=["min_evidence_score_for_ic"], biggest_blocker="Poor traction signals", required_next_action="Archive"
        )
