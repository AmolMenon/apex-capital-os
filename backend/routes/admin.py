from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.database import get_db
from db.models import DomainEvent, ReviewRun, Recommendation

router = APIRouter(prefix="/api/admin/alpha", tags=["Admin Alpha"])

@router.get("/metrics")
def get_alpha_metrics(db: Session = Depends(get_db)):
    # 1. Active Users (Count of UserSignedUp events)
    active_users = db.query(func.count(DomainEvent.id)).filter(DomainEvent.event_type == "UserSignedUp").scalar() or 0
    
    # 2. Reviews Generated
    reviews_generated = db.query(func.count(DomainEvent.id)).filter(DomainEvent.event_type == "ReviewCompleted").scalar() or 0
    
    # 3. Average Review Time (from ReviewRun)
    avg_latency = db.query(func.avg(ReviewRun.duration_ms)).scalar() or 0
    
    # 4. Action Completion
    actions_completed = db.query(func.count(DomainEvent.id)).filter(DomainEvent.event_type == "ActionCompleted").scalar() or 0
    
    # 5. Feedback Volume
    feedback_volume = db.query(func.count(DomainEvent.id)).filter(DomainEvent.event_type == "FeedbackSubmitted").scalar() or 0
    
    # 6. Errors
    errors = db.query(func.count(DomainEvent.id)).filter(DomainEvent.event_type == "Error").scalar() or 0
    
    return {
        "activeUsers": active_users,
        "reviewsGenerated": reviews_generated,
        "averageReviewTimeMs": int(avg_latency),
        "actionsCompleted": actions_completed,
        "feedbackVolume": feedback_volume,
        "errors": errors,
        "mostCommonDropoff": "UploadDeck" # Mocked drop-off step for now
    }
