from repositories.base import CRUDBase
from db.models import Task
from schemas.task import TaskCreate, TaskUpdate

class CRUDTask(CRUDBase[Task, TaskCreate, TaskUpdate]):
    pass

task_repo = CRUDTask(Task)
