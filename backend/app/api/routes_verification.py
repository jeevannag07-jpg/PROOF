from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from backend.app.core.database import get_db
from backend.app.models.submission import Submission
from backend.app.models.verification import VerificationResult
from backend.app.schemas import VerificationResultOut
from backend.app.services.verification_engine import verification_engine
from backend.app.services.capability_engine import capability_engine
from backend.app.services.auth_service import get_current_user_required
from backend.app.models.user import User

router = APIRouter(prefix="/verification", tags=["Verification"])

@router.post("/{submission_id}/run")
async def trigger_verification(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    result = await verification_engine.run_verification(db, sub)
    capability_engine.recalculate_user_capability(db, sub.user_id)

    return {
        "status": sub.status,
        "verification": {
            "overall_status": result.overall_status,
            "confidence": result.confidence,
            "repository_check": result.repository_check,
            "build_check": result.build_check,
            "test_check": result.test_check,
            "benchmark_check": result.benchmark_check,
            "security_check": result.security_check,
            "reproducibility_check": result.reproducibility_check,
            "details": json.loads(result.details) if result.details else {}
        }
    }

@router.get("/{submission_id}", response_model=VerificationResultOut)
def get_verification_status(submission_id: int, db: Session = Depends(get_db)):
    result = db.query(VerificationResult).filter(VerificationResult.submission_id == submission_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Verification not found for this submission")
    return result
