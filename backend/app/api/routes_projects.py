from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models.submission import Submission
from backend.app.schemas import SubmissionOut

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[SubmissionOut])
def list_projects(
    skill: Optional[str] = None,
    search: Optional[str] = None,
    status: Optional[str] = "VERIFIED",
    db: Session = Depends(get_db)
):
    query = db.query(Submission)
    if status and status.upper() != "ALL":
        query = query.filter(Submission.status == status)
    if skill and skill.upper() != "ALL":
        query = query.filter(Submission.tags.ilike(f"%{skill}%"))
    if search:
        query = query.filter(
            (Submission.title.ilike(f"%{search}%")) |
            (Submission.description.ilike(f"%{search}%")) |
            (Submission.tags.ilike(f"%{search}%"))
        )
    return query.order_by(Submission.created_at.desc()).all()

@router.get("/{id}", response_model=SubmissionOut)
def get_project_detail(id: int, db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Project not found")
    return sub
