from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct, or_
from typing import List, Optional
from datetime import datetime, timezone
from backend.app.core.database import get_db
from backend.app.models.challenge import Challenge
from backend.app.models.attempt import ChallengeAttempt
from backend.app.models.submission import Submission
from backend.app.models.user import User
from backend.app.schemas import ChallengeOut, ChallengeCreate
from backend.app.services.auth_service import get_current_user_required

router = APIRouter(prefix="/challenges", tags=["Challenges"])

def _get_challenge_counts(db: Session, challenge_ids: List[int]):
    """Helper to query builders_count, submissions_count, and verified_count in a single batch query."""
    if not challenge_ids:
        return {}

    # Query counts grouped by challenge_id
    results = db.query(
        ChallengeAttempt.challenge_id,
        func.count(distinct(ChallengeAttempt.id)).label("builders_count"),
        func.count(distinct(Submission.id)).label("submissions_count"),
        func.count(distinct(func.nullif(Submission.status != 'VERIFIED', True))).label("verified_count")
    ).outerjoin(
        Submission, Submission.attempt_id == ChallengeAttempt.id
    ).filter(
        ChallengeAttempt.challenge_id.in_(challenge_ids)
    ).group_by(ChallengeAttempt.challenge_id).all()

    counts_map = {}
    for r in results:
        counts_map[r[0]] = {
            "builders_count": r[1] or 0,
            "submissions_count": r[2] or 0,
            "verified_count": r[3] or 0
        }
    return counts_map

@router.get("", response_model=List[ChallengeOut])
def list_challenges(
    domain: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    challenge_type: Optional[str] = None,
    search: Optional[str] = None,
    skill: Optional[str] = None,
    sort: Optional[str] = None, # POPULAR, NEWEST, ACTIVE
    limit: Optional[int] = 150,
    offset: Optional[int] = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Challenge).filter(Challenge.status == "ACTIVE")

    # Type filter
    if challenge_type and challenge_type.upper() != "ALL":
        query = query.filter(Challenge.challenge_type.ilike(challenge_type))

    # Domain / Category filter
    effective_domain = domain or category
    if effective_domain and effective_domain.upper() != "ALL":
        query = query.filter(
            or_(
                Challenge.domain.ilike(f"%{effective_domain}%"),
                Challenge.category.ilike(f"%{effective_domain}%")
            )
        )

    # Difficulty filter
    if difficulty and difficulty.upper() != "ALL":
        query = query.filter(Challenge.difficulty.ilike(difficulty))

    # Skill filter
    if skill and skill.upper() != "ALL":
        query = query.filter(
            or_(
                Challenge.skills_required.ilike(f"%{skill}%"),
                Challenge.skills.ilike(f"%{skill}%")
            )
        )

    # Keyword search
    if search:
        s = f"%{search}%"
        query = query.filter(
            or_(
                Challenge.title.ilike(s),
                Challenge.problem_statement.ilike(s),
                Challenge.skills_required.ilike(s),
                Challenge.domain.ilike(s),
                Challenge.subdomain.ilike(s),
                Challenge.real_world_context.ilike(s),
                Challenge.description.ilike(s)
            )
        )

    # Ordering
    if sort == "NEWEST":
        query = query.order_by(Challenge.created_at.desc(), Challenge.id.desc())
    else:
        query = query.order_by(Challenge.id.asc())

    challenges = query.offset(offset).limit(limit).all()

    # Populate dynamic aggregate counts
    challenge_ids = [c.id for c in challenges]
    counts_map = _get_challenge_counts(db, challenge_ids)

    out_list = []
    for c in challenges:
        c_counts = counts_map.get(c.id, {"builders_count": 0, "submissions_count": 0, "verified_count": 0})
        # Set dynamic attribute values on the model instance for pydantic serialization
        c.builders_count = c_counts["builders_count"]
        c.submissions_count = c_counts["submissions_count"]
        c.verified_count = c_counts["verified_count"]
        out_list.append(c)

    # If sorted by POPULAR, sort by builders_count desc in-memory
    if sort == "POPULAR":
        out_list.sort(key=lambda x: (x.builders_count, x.submissions_count), reverse=True)

    return out_list

@router.get("/{id_or_slug}", response_model=ChallengeOut)
def get_challenge(id_or_slug: str, db: Session = Depends(get_db)):
    if id_or_slug.isdigit():
        challenge = db.query(Challenge).filter(Challenge.id == int(id_or_slug)).first()
    else:
        challenge = db.query(Challenge).filter(Challenge.slug == id_or_slug).first()

    if not challenge:
        raise HTTPException(status_code=404, detail="Mission not found")

    # Fetch counts
    counts_map = _get_challenge_counts(db, [challenge.id])
    c_counts = counts_map.get(challenge.id, {"builders_count": 0, "submissions_count": 0, "verified_count": 0})
    challenge.builders_count = c_counts["builders_count"]
    challenge.submissions_count = c_counts["submissions_count"]
    challenge.verified_count = c_counts["verified_count"]

    return challenge

@router.post("/{id_or_slug}/start")
def start_mission(
    id_or_slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Start an engineering mission for the authenticated user, returning attempt and draft submission IDs."""
    if id_or_slug.isdigit():
        challenge = db.query(Challenge).filter(Challenge.id == int(id_or_slug)).first()
    else:
        challenge = db.query(Challenge).filter(Challenge.slug == id_or_slug).first()

    if not challenge:
        raise HTTPException(status_code=404, detail="Mission not found")

    # Check for existing attempt
    attempt = db.query(ChallengeAttempt).filter(
        ChallengeAttempt.user_id == current_user.id,
        ChallengeAttempt.challenge_id == challenge.id
    ).first()

    if not attempt:
        attempt = ChallengeAttempt(
            user_id=current_user.id,
            challenge_id=challenge.id,
            status="IN_PROGRESS",
            started_at=datetime.now(timezone.utc)
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)

    # Ensure draft submission exists
    submission = db.query(Submission).filter(Submission.attempt_id == attempt.id).first()
    if not submission:
        submission = Submission(
            attempt_id=attempt.id,
            user_id=current_user.id,
            title=f"Submission: {challenge.title}",
            description=f"Demonstrated solution for {challenge.title}",
            status="DRAFT",
            tags=challenge.skills_required or challenge.skills or "Engineering"
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)

    return {
        "message": "Mission started successfully",
        "attempt_id": attempt.id,
        "challenge_id": challenge.id,
        "status": attempt.status,
        "submission_id": submission.id
    }

@router.post("", response_model=ChallengeOut)
def create_challenge(challenge_in: ChallengeCreate, db: Session = Depends(get_db)):
    existing = db.query(Challenge).filter(Challenge.slug == challenge_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Challenge with this slug already exists")
    chal = Challenge(**challenge_in.model_dump())
    db.add(chal)
    db.commit()
    db.refresh(chal)
    chal.builders_count = 0
    chal.submissions_count = 0
    chal.verified_count = 0
    return chal
