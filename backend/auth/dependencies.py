from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from auth.jwt_handler import decode_access_token
from db.database import get_db
from db.models import User, RoleEnum
from core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    if not settings.ENABLE_AUTH:
        return User(id=1, email="demo@apexcapital.com", name="Demo User", role="Admin", is_active=True)
        
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    token_data = decode_access_token(token)
    user = db.query(User).filter(User.id == int(token_data.user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def require_roles(allowed_roles: list[RoleEnum]):
    def role_checker(current_user: User = Depends(get_current_active_user)):
        if current_user.role not in [role.value for role in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted for your role"
            )
        return current_user
    return role_checker

# Predefined dependencies
require_admin = require_roles([RoleEnum.ADMIN])
require_partner = require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER])
require_principal = require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL])
require_associate = require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE])
require_analyst = require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE, RoleEnum.ANALYST])

from db.models import WorkspaceMembership, Decision, Evidence, Claim, Assumption, EvidenceConflict, ChallengeTask, ChallengeFinding, ReasoningRun

def require_decision_access(
    decision_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Decision:
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Decision not found")
        
    if decision.workspace_id:
        membership = db.query(WorkspaceMembership).filter(
            WorkspaceMembership.user_id == current_user.id,
            WorkspaceMembership.workspace_id == decision.workspace_id
        ).first()
        if not membership:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Decision not found")
            
    return decision

def require_evidence_access(
    evidence_id: int,
    decision: Decision = Depends(require_decision_access),
    db: Session = Depends(get_db)
) -> Evidence:
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence or evidence.decision_id != decision.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evidence not found")
    return evidence

def require_claim_access(
    claim_id: int,
    decision: Decision = Depends(require_decision_access),
    db: Session = Depends(get_db)
) -> Claim:
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim or claim.decision_id != decision.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")
    return claim

def require_assumption_access(
    assumption_id: int,
    decision: Decision = Depends(require_decision_access),
    db: Session = Depends(get_db)
) -> Assumption:
    assumption = db.query(Assumption).filter(Assumption.id == assumption_id).first()
    if not assumption or assumption.decision_id != decision.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assumption not found")
    return assumption

def require_conflict_access(
    conflict_id: int,
    decision: Decision = Depends(require_decision_access),
    db: Session = Depends(get_db)
) -> EvidenceConflict:
    conflict = db.query(EvidenceConflict).filter(EvidenceConflict.id == conflict_id).first()
    if not conflict or conflict.decision_id != decision.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conflict not found")
    return conflict

def require_task_access(
    task_id: int,
    decision: Decision = Depends(require_decision_access),
    db: Session = Depends(get_db)
) -> ChallengeTask:
    task = db.query(ChallengeTask).filter(ChallengeTask.id == task_id).first()
    if not task or task.decision_id != decision.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

def require_finding_access(
    finding_id: int,
    decision: Decision = Depends(require_decision_access),
    db: Session = Depends(get_db)
) -> ChallengeFinding:
    finding = db.query(ChallengeFinding).filter(ChallengeFinding.id == finding_id).first()
    if not finding or finding.decision_id != decision.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Finding not found")
    return finding

def require_run_access(
    run_id: int,
    decision: Decision = Depends(require_decision_access),
    db: Session = Depends(get_db)
) -> ReasoningRun:
    run = db.query(ReasoningRun).filter(ReasoningRun.id == run_id).first()
    if not run or run.decision_id != decision.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    return run
