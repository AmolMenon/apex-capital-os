from .fund_os_schemas import FundOSMetadata

def get_fund_os_status() -> FundOSMetadata:
    return FundOSMetadata(
        status="Online",
        mock_fixtures_loaded=True,
        fund_profile_loaded=True,
        lp_pipeline_loaded=True,
        data_room_checklist_loaded=True,
        lp_report_available=True,
        routes_healthy=True
    )
