from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from backend.app.core.database import get_db
from backend.app.models.attempt import ChallengeAttempt
from backend.app.models.challenge import Challenge
from backend.app.models.submission import Submission
from backend.app.models.user import User
from backend.app.schemas import AttemptOut, AttemptCreate
from backend.app.services.auth_service import get_current_user_required

router = APIRouter(prefix="/attempts", tags=["Attempts"])

@router.post("", response_model=AttemptOut)
def start_or_get_attempt(
    attempt_in: AttemptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    challenge = db.query(Challenge).filter(Challenge.id == attempt_in.challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    # Check existing attempt
    existing = db.query(ChallengeAttempt).filter(
        ChallengeAttempt.user_id == current_user.id,
        ChallengeAttempt.challenge_id == attempt_in.challenge_id
    ).first()

    if existing:
        return existing

    new_attempt = ChallengeAttempt(
        user_id=current_user.id,
        challenge_id=attempt_in.challenge_id,
        status="IN_PROGRESS",
        started_at=datetime.now(timezone.utc)
    )
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    # Automatically create a draft submission associated with this attempt
    draft_sub = Submission(
        attempt_id=new_attempt.id,
        user_id=current_user.id,
        title=f"Submission: {challenge.title}",
        description=f"Demonstrated solution for {challenge.title}",
        status="DRAFT",
        tags=challenge.skills
    )
    db.add(draft_sub)
    db.commit()

    return new_attempt

@router.get("/user", response_model=List[AttemptOut])
def get_user_attempts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    attempts = db.query(ChallengeAttempt).filter(
        ChallengeAttempt.user_id == current_user.id
    ).order_by(ChallengeAttempt.started_at.desc()).all()
    return attempts

@router.get("/{id}")
def get_attempt_detail(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    attempt = db.query(ChallengeAttempt).filter(ChallengeAttempt.id == id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this attempt")

    submission = db.query(Submission).filter(Submission.attempt_id == attempt.id).first()

    return {
        "attempt": {
            "id": attempt.id,
            "status": attempt.status,
            "started_at": attempt.started_at,
            "submitted_at": attempt.submitted_at,
            "user_id": attempt.user_id
        },
        "challenge": {
            "id": attempt.challenge.id,
            "title": attempt.challenge.title,
            "slug": attempt.challenge.slug,
            "description": attempt.challenge.description,
            "problem_statement": attempt.challenge.problem_statement,
            "constraints": attempt.challenge.constraints,
            "expected_output": attempt.challenge.expected_output,
            "evaluation_criteria": attempt.challenge.evaluation_criteria,
            "difficulty": attempt.challenge.difficulty,
            "category": attempt.challenge.category,
            "skills": attempt.challenge.skills
        },
        "submission_id": submission.id if submission else None
    }
