from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("challenge_attempts.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    repository_url = Column(String(255), nullable=True)
    live_demo_url = Column(String(255), nullable=True)
    status = Column(String(50), default="SUBMITTED") # DRAFT, SUBMITTED, VERIFYING, VERIFIED, NEEDS_REVISION, REJECTED
    tags = Column(String(255), default="Backend,System Design")
    capability_impact = Column(Text, default="{}") # JSON dict of skill -> points
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="submissions")
    attempt = relationship("ChallengeAttempt", back_populates="submission")
    architecture = relationship("Architecture", back_populates="submission", uselist=False, cascade="all, delete-orphan")
    decisions = relationship("TechnicalDecision", back_populates="submission", cascade="all, delete-orphan")
    evidence_items = relationship("Evidence", back_populates="submission", cascade="all, delete-orphan")
    verification = relationship("VerificationResult", back_populates="submission", uselist=False, cascade="all, delete-orphan")
    defense_questions = relationship("TechnicalQuestion", back_populates="submission", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="submission", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="submission", cascade="all, delete-orphan")
    reels = relationship("Reel", back_populates="project")
