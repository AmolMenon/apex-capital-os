from .fund_os_schemas import FundConstructionPlan
from .fund_os_fixtures import MOCK_FUND_PROFILE

def generate_fund_construction() -> FundConstructionPlan:
    """
    Models the planned vs actual fund deployment based on portfolio inputs.
    In a live system, this would map actual portfolio data against MOCK_FUND_PROFILE['portfolio_construction_target'].
    """
    
    target = MOCK_FUND_PROFILE["portfolio_construction_target"]
    
    plan = {
        "target_portfolio_model": {
            "max_companies": target["max_companies"],
            "min_companies": target["min_companies"],
            "avg_initial_check": 30000000.0, # 3 Cr
            "total_initial_deployment": 900000000.0 # 90 Cr total target initially? The math would be based on 60% of 100Cr = 60Cr
        },
        "actual_portfolio_model": {
            "current_companies": 12,
            "avg_initial_check": 20800000.0,
            "total_initial_deployed": 250000000.0 # 25 Cr
        },
        "deployment_progress": {
            "planned_pct": 25.0,
            "actual_pct": 25.0,
            "status": "On Track"
        },
        "reserve_allocation": {
            "planned_reserves_pct": 40.0,
            "actual_reserves_held_pct": 40.0,
            "reserves_deployed_pct": 0.0
        },
        "sector_exposure": {
            "AI": {"target": 40.0, "actual": 45.0, "status": "Overweight"},
            "healthcare": {"target": 20.0, "actual": 15.0, "status": "Underweight"},
            "deeptech": {"target": 20.0, "actual": 25.0, "status": "Overweight"},
            "commerce": {"target": 20.0, "actual": 15.0, "status": "Underweight"}
        },
        "stage_exposure": {
            "pre-seed": {"target": 30.0, "actual": 40.0},
            "seed": {"target": 50.0, "actual": 45.0},
            "Series A": {"target": 20.0, "actual": 15.0}
        },
        "ownership_distribution": {
            "target": "8% - 12%",
            "actual_weighted": "10.5%",
            "highest": "15%",
            "lowest": "4%"
        },
        "concentration_risk": {
            "top_3_assets_pct": 28.0,
            "warning": "Monitoring early over-exposure to AI Application Layer."
        },
        "follow_on_capacity": {
            "capacity": 400000000.0, # 40 Cr
            "allocated_to_winners": 150000000.0,
            "unallocated_reserves": 250000000.0
        },
        "gaps_vs_target": {
            "recommendations": [
                "Increase sourcing in healthcare platforms to hit 20% target.",
                "Pace AI application layer investments carefully to avoid >50% concentration.",
                "Maintain 40% reserves as companies hit Series A milestones."
            ]
        }
    }
    
    return FundConstructionPlan(**plan)
