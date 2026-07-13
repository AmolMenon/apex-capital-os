from .fund_profile_engine import get_fund_profile
from .fund_construction_engine import generate_fund_construction
from .fund_performance_engine import get_fund_performance
from .lp_reporting_engine import generate_lp_report
from .lp_relationship_engine import get_lps, get_lp_by_id
from .fundraising_pipeline_engine import get_fundraising_pipeline, update_fundraising_pipeline_item
from .fund_data_room_engine import get_fund_data_room, update_fund_data_room_item
from .capital_call_engine import generate_capital_call_plan
from .distribution_planning_engine import get_distribution_planning
from .fund_risk_engine import get_fund_risks
from .concentration_analysis_engine import get_concentration_analysis
from .fund_narrative_engine import generate_fund_narrative
from .gp_cockpit_engine import get_gp_cockpit
from .institutional_lp_questions_engine import get_institutional_lp_questions
from .fund_os_report_builder import get_fund_os_status

class FundOSOrchestrator:
    @staticmethod
    def get_status(): return get_fund_os_status()
    @staticmethod
    def get_profile(): return get_fund_profile()
    @staticmethod
    def get_construction(): return generate_fund_construction()
    @staticmethod
    def get_performance(): return get_fund_performance()
    @staticmethod
    def get_concentration(): return get_concentration_analysis()
    @staticmethod
    def get_risks(): return get_fund_risks()
    @staticmethod
    def get_cockpit(): return get_gp_cockpit()
    
    @staticmethod
    def get_lps(): return get_lps()
    @staticmethod
    def get_lp(lp_id: str): return get_lp_by_id(lp_id)
    
    @staticmethod
    def get_pipeline(): return get_fundraising_pipeline()
    @staticmethod
    def update_pipeline(item_id: str, payload: dict): return update_fundraising_pipeline_item(item_id, payload)
    
    @staticmethod
    def get_lp_questions(): return get_institutional_lp_questions()
    @staticmethod
    def get_lp_report(): return generate_lp_report()
    
    @staticmethod
    def get_data_room(): return get_fund_data_room()
    @staticmethod
    def update_data_room(item_id: str, payload: dict): return update_fund_data_room_item(item_id, payload)
    
    @staticmethod
    def get_capital_calls(): 
        # Return a mock list of history
        return []
        
    @staticmethod
    def plan_capital_call(payload: dict = None): return generate_capital_call_plan(payload)
    
    @staticmethod
    def get_distributions(): return get_distribution_planning()
    
    @staticmethod
    def get_narrative(): return generate_fund_narrative()
