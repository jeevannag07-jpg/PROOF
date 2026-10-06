from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models.review import Review, ReviewerReputation
from backend.app.models.submission import Submission
from backend.app.models.user import User
from backend.app.schemas import ReviewOut, ReviewCreate
from backend.app.services.auth_service import get_current_user_required
from backend.app.services.capability_engine import capability_engine

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("", response_model=List[ReviewOut])
def list_reviews(
    submission_id: Optional[int] = None,
    reviewer_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Review)
    if submission_id:
        query = query.filter(Review.submission_id == submission_id)
    if reviewer_id:
        query = query.filter(Review.reviewer_id == reviewer_id)
    return query.order_by(Review.created_at.desc()).all()

@router.get("/{id}", response_model=ReviewOut)
def get_review(id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.post("", response_model=ReviewOut)
def create_review(
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    # Enforce reviewer authorization
    if current_user.role not in ["REVIEWER", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only authorized reviewers or administrators can submit technical reviews."
        )

    sub = db.query(Submission).filter(Submission.id == review_in.submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    if sub.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reviewers cannot review their own submissions."
        )

    # Validate feedback
    if not review_in.feedback or not review_in.feedback.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Detailed technical feedback is required."
        )
    if not review_in.strengths or not review_in.strengths.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Key architectural strengths must be specified."
        )
    if not review_in.improvements or not review_in.improvements.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Improvement recommendations must be specified."
        )

    # Validate score bounds
    scores = [
        review_in.architecture_score,
        review_in.code_quality_score,
        review_in.scalability_score,
        review_in.technical_reasoning_score,
        review_in.testing_score
    ]
    for s in scores:
        if s < 0.0 or s > 10.0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="All rubric scores must be between 0.0 and 10.0."
            )

    overall = sum(scores) / 5.0

    # Check for duplicate/existing review by this reviewer on this submission
    existing_review = db.query(Review).filter(
        Review.submission_id == review_in.submission_id,
        Review.reviewer_id == current_user.id
    ).first()

    if existing_review:
        # Update existing review
        existing_review.architecture_score = review_in.architecture_score
        existing_review.code_quality_score = review_in.code_quality_score
        existing_review.scalability_score = review_in.scalability_score
        existing_review.technical_reasoning_score = review_in.technical_reasoning_score
        existing_review.testing_score = review_in.testing_score
        existing_review.overall_score = round(overall, 2)
        existing_review.feedback = review_in.feedback.strip()
        existing_review.strengths = review_in.strengths.strip()
        existing_review.improvements = review_in.improvements.strip()
        existing_review.reviewer_insight = review_in.reviewer_insight.strip() if review_in.reviewer_insight else None
        existing_review.status = "PUBLISHED"
        review = existing_review
    else:
        review = Review(
            submission_id=review_in.submission_id,
            reviewer_id=current_user.id,
            architecture_score=review_in.architecture_score,
            code_quality_score=review_in.code_quality_score,
            scalability_score=review_in.scalability_score,
            technical_reasoning_score=review_in.technical_reasoning_score,
            testing_score=review_in.testing_score,
            overall_score=round(overall, 2),
            feedback=review_in.feedback.strip(),
            strengths=review_in.strengths.strip(),
            improvements=review_in.improvements.strip(),
            reviewer_insight=review_in.reviewer_insight.strip() if review_in.reviewer_insight else None,
            status="PUBLISHED"
        )
        db.add(review)

    # Ensure submission is marked VERIFIED
    sub.status = "VERIFIED"

    # Update Reviewer reputation count
    rep = db.query(ReviewerReputation).filter(ReviewerReputation.reviewer_id == current_user.id).first()
    if rep:
        rep.reviews_completed = (rep.reviews_completed or 0) + 1
    else:
        rep = ReviewerReputation(
            reviewer_id=current_user.id,
            domain="Distributed Systems & Backend",
            reviews_completed=1,
            agreement_score=95.0,
            helpfulness_score=95.0,
            reputation_level="STAFF"
        )
        db.add(rep)

    db.commit()
    db.refresh(review)

    # Recalculate candidate capability
    capability_engine.recalculate_user_capability(db, sub.user_id)

    return review
