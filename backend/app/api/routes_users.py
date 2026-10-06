from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.capability import Capability
from backend.app.models.submission import Submission
from backend.app.models.decision import TechnicalDecision
from backend.app.schemas import UserOut
from backend.app.services.auth_service import get_current_user_required
from backend.app.models.gamification import Badge, Milestone

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{username}", response_model=UserOut)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{username}/profile-full")
def get_user_full_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Capabilities
    capabilities = db.query(Capability).filter(Capability.user_id == user.id).all()
    caps_data = [
        {
            "id": c.id,
            "skill": c.skill,
            "score": c.score,
            "confidence": c.confidence,
            "evidence_count": c.evidence_count,
            "history": c.history_data
        } for c in capabilities
    ]

    # Verified projects
    verified_submissions = db.query(Submission).filter(
        Submission.user_id == user.id,
        Submission.status == "VERIFIED"
    ).all()
    projects_data = [
        {
            "id": s.id,
            "title": s.title,
            "description": s.description,
            "tags": s.tags,
            "capability_impact": s.capability_impact,
            "repository_url": s.repository_url,
            "live_demo_url": s.live_demo_url,
            "reviews_count": len(s.reviews),
            "created_at": s.created_at
        } for s in verified_submissions
    ]

    # Timeline of Technical Decisions
    decisions = db.query(TechnicalDecision).join(Submission).filter(
        Submission.user_id == user.id
    ).order_by(TechnicalDecision.created_at.desc()).limit(10).all()
    decisions_data = [
        {
            "id": d.id,
            "project_title": d.submission.title,
            "title": d.title,
            "decision": d.decision,
            "context": d.context,
            "alternatives": d.alternatives,
            "tradeoffs": d.tradeoffs,
            "result": d.result,
            "created_at": d.created_at
        } for d in decisions
    ]

    # Reviewer Insights
    reviews = []
    for s in verified_submissions:
        for r in s.reviews:
            reviews.append({
                "id": r.id,
                "project_title": s.title,
                "reviewer_name": r.reviewer.name if r.reviewer else "Anonymous Reviewer",
                "reviewer_title": r.reviewer.title if r.reviewer else "Staff Engineer",
                "overall_score": r.overall_score,
                "architecture_score": r.architecture_score,
                "feedback": r.feedback,
                "strengths": r.strengths,
                "improvements": r.improvements,
                "reviewer_insight": r.reviewer_insight,
                "created_at": r.created_at
            })

    # Gamification
    badges = db.query(Badge).filter(Badge.user_id == user.id).all()
    milestones = db.query(Milestone).filter(Milestone.user_id == user.id).all()

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "title": user.title,
            "bio": user.bio,
            "avatar_url": user.avatar_url,
            "github_username": user.github_username,
            "github_connected": user.github_connected,
            "overall_capability": user.overall_capability,
            "evidence_confidence": user.evidence_confidence,
            "verified_projects_count": user.verified_projects_count,
            "expert_reviews_count": user.expert_reviews_count,
            "deployments_count": user.deployments_count,
            "streak_days": user.streak_days,
            "xp": user.xp
        },
        "capabilities": caps_data,
        "verified_projects": projects_data,
        "technical_decisions": decisions_data,
        "reviewer_insights": reviews,
        "badges": [{"name": b.badge_name, "awarded_at": b.awarded_at} for b in badges],
        "milestones": [{"name": m.milestone_name, "awarded_at": m.awarded_at} for m in milestones]
    }
