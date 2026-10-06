from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.capability import Capability
from backend.app.schemas import CapabilityOut
from backend.app.services.capability_engine import capability_engine
from backend.app.services.auth_service import get_current_user_required

router = APIRouter(prefix="/capabilities", tags=["Capabilities"])

@router.get("/{username}")
def get_user_capabilities(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    capabilities = db.query(Capability).filter(Capability.user_id == user.id).all()
    caps_data = [
        {
            "id": c.id,
            "skill": c.skill,
            "score": c.score,
            "confidence": c.confidence,
            "evidence_count": c.evidence_count,
            "history_data": c.history_data,
            "updated_at": c.updated_at
        } for c in capabilities
    ]

    return {
        "user_id": user.id,
        "username": user.username,
        "name": user.name,
        "title": user.title,
        "overall_capability": user.overall_capability,
        "evidence_confidence": user.evidence_confidence,
        "verified_projects_count": user.verified_projects_count,
        "expert_reviews_count": user.expert_reviews_count,
        "deployments_count": user.deployments_count,
        "streak_days": user.streak_days,
        "capabilities": caps_data
    }

@router.post("/recalculate")
def recalculate_current_user_capabilities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    stats = capability_engine.recalculate_user_capability(db, current_user.id)
    return {
        "message": "Capabilities successfully recalculated from verified evidence",
        "stats": stats
    }
