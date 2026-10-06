from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import os
import httpx
from backend.app.core.config import settings
from backend.app.core.database import get_db
from backend.app.models.reel import Reel
from backend.app.models.social import Comment, Save
from backend.app.models.user import User
from backend.app.models.submission import Submission
from backend.app.models.challenge import Challenge
from backend.app.schemas import ReelOut, ReelCreate, CommentOut, CommentCreate, UploadUrlRequest, UploadUrlResponse
from backend.app.services.auth_service import get_current_user_required, get_current_user_strict
from backend.app.services.storage_service import storage_service, _upload_tickets, MAX_FILE_SIZE_BYTES

router = APIRouter(prefix="/reels", tags=["Reels"])

@router.get("")
def list_reels(
    feed: Optional[str] = "FOR_YOU", # FOR_YOU, FOLLOWING, CHALLENGES
    reel_type: Optional[str] = None, # BUILD, DECISION, DEBUG, ARCHITECTURE, GROWTH, CHALLENGE
    db: Session = Depends(get_db)
):
    query = db.query(Reel)
    if reel_type and reel_type.upper() != "ALL":
        query = query.filter(Reel.reel_type == reel_type.upper())
    elif feed == "CHALLENGES":
        query = query.filter(Reel.challenge_id.isnot(None))

    reels = query.order_by(Reel.created_at.desc()).all()
    results = []
    for r in reels:
        results.append({
            "id": r.id,
            "title": r.title,
            "caption": r.caption,
            "reel_type": r.reel_type,
            "metrics_before": r.metrics_before,
            "metrics_after": r.metrics_after,
            "hook_quote": r.hook_quote,
            "code_snippet": r.code_snippet,
            "tags": r.tags,
            "media_url": r.media_url,
            "media_path": r.media_path,
            "media_type": r.media_type or "CODE_ONLY",
            "thumbnail_url": r.thumbnail_url,
            "aspect_ratio": r.aspect_ratio or "9:16",
            "duration_seconds": r.duration_seconds,
            "views_count": r.views_count,
            "saves_count": r.saves_count,
            "created_at": r.created_at,
            "user": {
                "id": r.user.id,
                "name": r.user.name,
                "username": r.user.username,
                "title": r.user.title,
                "avatar_url": r.user.avatar_url,
                "overall_capability": r.user.overall_capability,
                "evidence_confidence": r.user.evidence_confidence
            } if r.user else None,
            "project": {
                "id": r.project.id,
                "title": r.project.title,
                "status": r.project.status,
                "tags": r.project.tags
            } if r.project else None,
            "challenge": {
                "id": r.challenge.id,
                "title": r.challenge.title,
                "slug": r.challenge.slug,
                "difficulty": r.challenge.difficulty,
                "estimated_hours": r.challenge.estimated_hours,
                "skills": r.challenge.skills
            } if r.challenge else None,
            "comments_count": len(r.comments)
        })
    return results

@router.get("/{id}")
def get_reel(id: int, db: Session = Depends(get_db)):
    r = db.query(Reel).filter(Reel.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reel not found")

    comments = [
        {
            "id": c.id,
            "text": c.text,
            "is_technical_question": c.is_technical_question,
            "created_at": c.created_at,
            "user": {
                "id": c.user.id,
                "name": c.user.name,
                "username": c.user.username,
                "avatar_url": c.user.avatar_url,
                "title": c.user.title
            } if c.user else None
        } for c in r.comments
    ]

    return {
        "id": r.id,
        "title": r.title,
        "caption": r.caption,
        "reel_type": r.reel_type,
        "metrics_before": r.metrics_before,
        "metrics_after": r.metrics_after,
        "hook_quote": r.hook_quote,
        "code_snippet": r.code_snippet,
        "tags": r.tags,
        "media_url": r.media_url,
        "media_path": r.media_path,
        "media_type": r.media_type or "CODE_ONLY",
        "thumbnail_url": r.thumbnail_url,
        "aspect_ratio": r.aspect_ratio or "9:16",
        "duration_seconds": r.duration_seconds,
        "views_count": r.views_count,
        "saves_count": r.saves_count,
        "created_at": r.created_at,
        "user": {
            "id": r.user.id,
            "name": r.user.name,
            "username": r.user.username,
            "title": r.user.title,
            "avatar_url": r.user.avatar_url,
            "overall_capability": r.user.overall_capability,
            "evidence_confidence": r.user.evidence_confidence
        } if r.user else None,
        "project": {
            "id": r.project.id,
            "title": r.project.title,
            "status": r.project.status,
            "tags": r.project.tags
        } if r.project else None,
        "challenge": {
            "id": r.challenge.id,
            "title": r.challenge.title,
            "slug": r.challenge.slug,
            "difficulty": r.challenge.difficulty,
            "estimated_hours": r.challenge.estimated_hours,
            "skills": r.challenge.skills
        } if r.challenge else None,
        "comments": comments
    }

@router.post("/upload-url", response_model=UploadUrlResponse)
async def get_upload_url(
    req: UploadUrlRequest,
    current_user: User = Depends(get_current_user_strict)
):
    return await storage_service.create_upload_ticket(
        user_id=current_user.id,
        filename=req.filename,
        content_type=req.content_type,
        size=req.size,
        is_thumbnail=False
    )

@router.post("/thumbnail-upload-url", response_model=UploadUrlResponse)
async def get_thumbnail_upload_url(
    req: UploadUrlRequest,
    current_user: User = Depends(get_current_user_strict)
):
    return await storage_service.create_upload_ticket(
        user_id=current_user.id,
        filename=req.filename,
        content_type=req.content_type,
        size=req.size,
        is_thumbnail=True
    )

@router.put("/upload-direct/{ticket_id}")
async def direct_upload(ticket_id: str, request: Request):
    ticket = _upload_tickets.get(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Invalid or expired upload ticket.")

    body = await request.body()
    if len(body) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Uploaded file exceeds 50 MB.")

    if settings.SUPABASE_SERVICE_ROLE_KEY:
        try:
            endpoint = f"{settings.SUPABASE_URL.rstrip('/')}/storage/v1/object/{settings.SUPABASE_STORAGE_BUCKET}/{ticket['media_path']}"
            headers = {
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                "Content-Type": ticket["content_type"]
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                await client.post(endpoint, content=body, headers=headers)
        except Exception as e:
            print(f"Supabase Storage direct proxy note: {e}")

    # Ensure local static directory is also written for instant playback
    local_upload_dir = os.path.join(os.getcwd(), "frontend", "public", "uploads")
    target_local_path = os.path.join(local_upload_dir, ticket["media_path"].replace("/", os.sep))
    os.makedirs(os.path.dirname(target_local_path), exist_ok=True)
    with open(target_local_path, "wb") as f:
        f.write(body)

    return {"message": "Upload successful", "media_path": ticket["media_path"]}

@router.post("", response_model=ReelOut)
def create_reel(
    reel_in: ReelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    reel = Reel(
        user_id=current_user.id,
        project_id=reel_in.project_id,
        challenge_id=reel_in.challenge_id,
        title=reel_in.title,
        caption=reel_in.caption,
        reel_type=reel_in.reel_type,
        metrics_before=reel_in.metrics_before,
        metrics_after=reel_in.metrics_after,
        hook_quote=reel_in.hook_quote,
        code_snippet=reel_in.code_snippet,
        tags=reel_in.tags or "Backend,Performance",
        media_url=reel_in.media_url,
        media_path=reel_in.media_path,
        media_type=reel_in.media_type or "CODE_ONLY",
        thumbnail_url=reel_in.thumbnail_url,
        aspect_ratio=reel_in.aspect_ratio or "9:16",
        duration_seconds=reel_in.duration_seconds,
        views_count=1,
        saves_count=0
    )
    db.add(reel)
    db.commit()
    db.refresh(reel)
    return reel

@router.post("/{id}/comments")
def add_comment(
    id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    reel = db.query(Reel).filter(Reel.id == id).first()
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")

    comment = Comment(
        reel_id=id,
        user_id=current_user.id,
        text=comment_in.text,
        is_technical_question=comment_in.is_technical_question
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return {"message": "Comment posted", "id": comment.id}

@router.post("/{id}/save")
def toggle_save(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    reel = db.query(Reel).filter(Reel.id == id).first()
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")

    existing = db.query(Save).filter(Save.user_id == current_user.id, Save.reel_id == id).first()
    if existing:
        db.delete(existing)
        reel.saves_count = max(0, reel.saves_count - 1)
        saved = False
    else:
        new_save = Save(user_id=current_user.id, reel_id=id)
        db.add(new_save)
        reel.saves_count += 1
        saved = True

    db.commit()
    return {"saved": saved, "saves_count": reel.saves_count}

