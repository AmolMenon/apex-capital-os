from typing import List
from .fund_os_schemas import FundDataRoomItem
from .fund_os_fixtures import MOCK_DATA_ROOM

def get_fund_data_room() -> List[FundDataRoomItem]:
    """
    Returns the checklist for LP diligence data room materials.
    """
    return [FundDataRoomItem(**item) for item in MOCK_DATA_ROOM]

def update_fund_data_room_item(item_id: str, payload: dict) -> FundDataRoomItem:
    """
    Update a data room item status (mock).
    """
    for idx, item in enumerate(MOCK_DATA_ROOM):
        if item["item_id"] == item_id:
            MOCK_DATA_ROOM[idx].update(payload)
            return FundDataRoomItem(**MOCK_DATA_ROOM[idx])
    raise ValueError("Item not found")
