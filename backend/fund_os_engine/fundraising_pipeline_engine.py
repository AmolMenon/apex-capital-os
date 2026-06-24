from typing import List
from .fund_os_schemas import FundraisingPipelineItem
from .fund_os_fixtures import MOCK_PIPELINE

def get_fundraising_pipeline() -> List[FundraisingPipelineItem]:
    """
    Returns the CRM pipeline of prospective LPs.
    """
    return [FundraisingPipelineItem(**item) for item in MOCK_PIPELINE]

def update_fundraising_pipeline_item(item_id: str, payload: dict) -> FundraisingPipelineItem:
    """
    Update a pipeline item (mock).
    """
    for idx, item in enumerate(MOCK_PIPELINE):
        if item["item_id"] == item_id:
            MOCK_PIPELINE[idx].update(payload)
            return FundraisingPipelineItem(**MOCK_PIPELINE[idx])
    raise ValueError("Item not found")
