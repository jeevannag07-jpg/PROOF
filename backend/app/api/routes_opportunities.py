from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime, timezone
from backend.app.core.database import get_db
from backend.app.models.opportunity import Opportunity
from backend.app.models.user import User
from backend.app.schemas import OpportunityOut, OpportunityCreate, OpportunityStatusUpdate
from backend.app.services.auth_service import get_current_user_required

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

@router.get("", response_model=List[OpportunityOut])
def list_opportunities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    if current_user.role == "RECRUITER":
        opps = db.query(Opportunity).filter(Opportunity.recruiter_id == current_user.id).order_by(Opportunity.created_at.desc()).all()
    else:
        opps = db.query(Opportunity).filter(Opportunity.developer_id == current_user.id).order_by(Opportunity.created_at.desc()).all()
    return opps

@router.post("", response_model=OpportunityOut)
def create_opportunity(
    opp_in: OpportunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    dev = db.query(User).filter(User.id == opp_in.developer_id).first()
    if not dev:
        raise HTTPException(status_code=404, detail="Developer not found")

    opp = Opportunity(
        recruiter_id=current_user.id,
        developer_id=opp_in.developer_id,
        title=opp_in.title,
        company_name=opp_in.company_name or "High-Growth Infrastructure Lab",
        location=opp_in.location or "Remote / San Francisco",
        salary_range=opp_in.salary_range or "$180,000 - $240,000",
        description=opp_in.description,
        match_reasons=opp_in.match_reasons or "[]",
        status="NEW"
    )
    db.add(opp)
    db.commit()
    db.refresh(opp)
    return opp

@router.put("/{id}/status", response_model=OpportunityOut)
def update_opportunity_status(
    id: int,
    status_update: OpportunityStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    opp = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    if current_user.id != opp.recruiter_id and current_user.id != opp.developer_id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized to update this opportunity")

    opp.status = status_update.status.upper()
    opp.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(opp)
    return opp
