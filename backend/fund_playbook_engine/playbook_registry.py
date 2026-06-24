from .playbook_fixtures import DEFAULT_PLAYBOOKS
from .playbook_schemas import FundPlaybook
from typing import List, Dict

class PlaybookRegistry:
    def __init__(self):
        self.playbooks: Dict[str, FundPlaybook] = {p.playbook_id: p for p in DEFAULT_PLAYBOOKS}
        self.active_playbook_id = "apex_default"
        
    def get_all(self) -> List[FundPlaybook]:
        return list(self.playbooks.values())
        
    def get(self, playbook_id: str) -> FundPlaybook:
        return self.playbooks.get(playbook_id)
        
    def set_active(self, playbook_id: str):
        if playbook_id in self.playbooks:
            self.active_playbook_id = playbook_id
            
    def get_active(self) -> FundPlaybook:
        return self.playbooks.get(self.active_playbook_id)

playbook_registry = PlaybookRegistry()
