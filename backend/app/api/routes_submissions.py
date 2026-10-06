from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import json
from datetime import datetime, timezone
from backend.app.core.database import get_db
from backend.app.models.submission import Submission
from backend.app.models.architecture import Architecture
from backend.app.models.decision import TechnicalDecision
from backend.app.models.evidence import Evidence
from backend.app.models.defense import TechnicalQuestion
from backend.app.models.user import User
from backend.app.schemas import (
    SubmissionOut, SubmissionCreate, ArchitectureBase,
    TechnicalDecisionBase, EvidenceBase, TechnicalAnswerUpdate
)
from backend.app.services.auth_service import get_current_user_required
from backend.app.services.verification_engine import verification_engine
from backend.app.services.capability_engine import capability_engine
from backend.app.services.gamification_engine import gamification_engine

router = APIRouter(prefix="/submissions", tags=["Submissions"])

@router.get("/{id}", response_model=SubmissionOut)
def get_submission(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    if sub.user_id != current_user.id and sub.status not in ["VERIFIED", "COMPLETED"] and current_user.role not in ["REVIEWER", "ADMIN", "RECRUITER"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this submission")
    return sub

@router.post("", response_model=SubmissionOut)
def create_submission(
    sub_in: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    sub = Submission(
        attempt_id=sub_in.attempt_id,
        user_id=current_user.id,
        title=sub_in.title,
        description=sub_in.description,
        repository_url=sub_in.repository_url,
        live_demo_url=sub_in.live_demo_url,
        status="DRAFT",
        tags=sub_in.tags or "Backend,System Design"
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub

@router.put("/{id}", response_model=SubmissionOut)
def update_submission(
    id: int,
    sub_in: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    if sub.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this submission")

    if "title" in sub_in:
        sub.title = sub_in["title"]
    if "description" in sub_in:
        sub.description = sub_in["description"]
    if "repository_url" in sub_in:
        sub.repository_url = sub_in["repository_url"]
    if "live_demo_url" in sub_in:
        sub.live_demo_url = sub_in["live_demo_url"]
    if "tags" in sub_in:
        sub.tags = sub_in["tags"]
    if "status" in sub_in:
        sub.status = sub_in["status"]

    sub.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(sub)
    return sub

@router.post("/{id}/architecture")
def save_architecture(
    id: int,
    arch_in: ArchitectureBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    if sub.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this submission")

    arch = db.query(Architecture).filter(Architecture.submission_id == id).first()
    if not arch:
        arch = Architecture(
            submission_id=id,
            diagram_data=arch_in.diagram_data,
            description=arch_in.description,
            system_flow=arch_in.system_flow,
            scaling_strategy=arch_in.scaling_strategy,
            failure_points=arch_in.failure_points
        )
        db.add(arch)
    else:
        arch.diagram_data = arch_in.diagram_data
        arch.description = arch_in.description
        arch.system_flow = arch_in.system_flow
        arch.scaling_strategy = arch_in.scaling_strategy
        arch.failure_points = arch_in.failure_points
        arch.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(arch)
    return {"message": "Architecture saved successfully", "id": arch.id}

@router.post("/{id}/decisions")
def add_decision(
    id: int,
    dec_in: TechnicalDecisionBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    if sub.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this submission")

    dec = TechnicalDecision(
        submission_id=id,
        title=dec_in.title,
        decision=dec_in.decision,
        context=dec_in.context,
        alternatives=dec_in.alternatives,
        tradeoffs=dec_in.tradeoffs,
        result=dec_in.result
    )
    db.add(dec)
    db.commit()
    db.refresh(dec)
    return {"message": "Technical decision recorded", "id": dec.id}

@router.post("/{id}/evidence")
def add_evidence(
    id: int,
    ev_in: EvidenceBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    if sub.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this submission")

    ev = Evidence(
        submission_id=id,
        type=ev_in.type.upper(),
        title=ev_in.title,
        url=ev_in.url,
        description=ev_in.description,
        verification_status="VERIFIED",
        metrics_data=ev_in.metrics_data or "{}"
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return {"message": "Evidence item recorded", "id": ev.id}

@router.put("/defense/{question_id}/answer")
def answer_defense_question(
    question_id: int,
    answer_in: TechnicalAnswerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    question = db.query(TechnicalQuestion).filter(TechnicalQuestion.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    sub = db.query(Submission).filter(Submission.id == question.submission_id).first()
    if not sub or sub.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to answer this question")

    question.answer = answer_in.answer
    db.commit()
    db.refresh(question)
    return {"message": "Technical defense answer recorded", "question_id": question.id}

@router.post("/{id}/submit")
async def submit_for_verification(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    if sub.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to submit this submission")

    # Run verification engine
    result = await verification_engine.run_verification(db, sub)

    # Recalculate capability scores
    capability_engine.recalculate_user_capability(db, sub.user_id)

    # Trigger gamification for submission
    gamification_engine.process_event(db, sub.user_id, "SUBMISSION", sub.id, "SUBMITTED_SOLUTION", 10)

    if result.overall_status == "VERIFIED":
        gamification_engine.process_event(db, sub.user_id, "VERIFICATION", result.id, "VERIFIED_SOLUTION", 100)

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
