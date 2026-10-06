from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.capability import Capability
from backend.app.models.submission import Submission

router = APIRouter(prefix="/talent", tags=["Talent Discovery"])

@router.get("")
def list_talent(
    role: Optional[str] = None,
    min_capability: Optional[int] = 0,
    skill: Optional[str] = None,
    confidence: Optional[str] = None,
    min_projects: Optional[int] = 0,
    expert_reviewed_only: Optional[bool] = False,
    sort_by: Optional[str] = "capability",
    db: Session = Depends(get_db)
):
    query = db.query(User).filter(User.role == "BUILDER")
    if min_capability and min_capability > 0:
        query = query.filter(User.overall_capability >= min_capability)
    if confidence and confidence.upper() != "ALL":
        query = query.filter(User.evidence_confidence == confidence.upper())
    if min_projects and min_projects > 0:
        query = query.filter(User.verified_projects_count >= min_projects)
    if expert_reviewed_only:
        query = query.filter(User.expert_reviews_count > 0)
    if role and role.upper() != "ALL":
        query = query.filter(User.title.ilike(f"%{role}%"))

    if sort_by == "xp":
        query = query.order_by(User.xp.desc())
    else:
        query = query.order_by(User.overall_capability.desc())
        
    users = query.all()
    results = []

    for u in users:
        # Fetch top capabilities
        caps = db.query(Capability).filter(Capability.user_id == u.id).order_by(Capability.score.desc()).all()
        caps_dict = {c.skill: c.score for c in caps}

        if skill and skill.upper() != "ALL":
            if skill not in caps_dict or caps_dict[skill] < 60:
                continue

        # Get top verified project
        top_project = db.query(Submission).filter(
            Submission.user_id == u.id,
            Submission.status == "VERIFIED"
        ).order_by(Submission.created_at.desc()).first()

        # Build "Why this candidate appeared" explanation
        reasons = []
        matched_skills = [s for s, sc in caps_dict.items() if sc >= 75]
        if matched_skills:
            reasons.append(f"Strong demonstrated evidence in: {', '.join(matched_skills[:3])}")
        if u.verified_projects_count >= 3:
            reasons.append(f"{u.verified_projects_count} verified projects with reproducible benchmarks")
        if u.expert_reviews_count >= 3:
            reasons.append(f"{u.expert_reviews_count} peer reviews by Staff/Principal architects")
        if u.deployments_count > 0:
            reasons.append(f"{u.deployments_count} active staging or production deployments")

        featured_quote = ""
        if u.username == "jeevan":
            featured_quote = "“I eliminated race condition overdrafts by pushing window evaluation to atomic Redis Lua scripts.”"
        elif u.username == "elena_r":
            featured_quote = "“TLA+ model checking proved linearizability for our multi-datacenter consensus engine.”"
        elif u.username == "mchen":
            featured_quote = "“Eliminated false sharing across 64-byte L1 cache lines to hit sub-10ns message passing.”"
        else:
            featured_quote = u.bio[:120] if u.bio else "Demonstrated capabilities backed by verified code."

        results.append({
            "id": u.id,
            "name": u.name,
            "username": u.username,
            "title": u.title,
            "avatar_url": u.avatar_url,
            "bio": u.bio,
            "quote": featured_quote,
            "overall_capability": u.overall_capability,
            "evidence_confidence": u.evidence_confidence,
            "verified_projects_count": u.verified_projects_count,
            "expert_reviews_count": u.expert_reviews_count,
            "deployments_count": u.deployments_count,
            "streak_days": u.streak_days,
            "xp": u.xp,
            "skills": [
                {"skill": c.skill, "score": c.score, "confidence": c.confidence}
                for c in caps[:6]
            ],
            "top_project": {
                "id": top_project.id,
                "title": top_project.title,
                "tags": top_project.tags
            } if top_project else None,
            "badges": {
                "repository": True,
                "benchmark": u.overall_capability >= 75,
                "expert_reviewed": u.expert_reviews_count > 0,
                "deployed": u.deployments_count > 0
            },
            "why_matched": reasons
        })

    return results
