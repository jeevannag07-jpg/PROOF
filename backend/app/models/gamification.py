from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class ReputationEvent(Base):
    __tablename__ = "reputation_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source_type = Column(String(50), nullable=False) # e.g. VERIFICATION, REVIEW, MISSION
    source_id = Column(Integer, nullable=False) # e.g. Submission.id, Review.id
    event_type = Column(String(100), nullable=False) # e.g. VERIFIED_SOLUTION, PASSED_REVIEW
    xp_awarded = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    badge_name = Column(String(100), nullable=False) # e.g. Verified Builder
    awarded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    milestone_name = Column(String(100), nullable=False)
    awarded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
