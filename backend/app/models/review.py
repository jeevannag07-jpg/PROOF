from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    architecture_score = Column(Float, nullable=False, default=8.0)
    code_quality_score = Column(Float, nullable=False, default=8.0)
    scalability_score = Column(Float, nullable=False, default=8.0)
    technical_reasoning_score = Column(Float, nullable=False, default=8.0)
    testing_score = Column(Float, nullable=False, default=8.0)
    overall_score = Column(Float, nullable=False, default=8.0)
    feedback = Column(Text, nullable=False)
    strengths = Column(Text, nullable=False)
    improvements = Column(Text, nullable=False)
    reviewer_insight = Column(Text, nullable=True)
    status = Column(String(50), default="PUBLISHED")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("Submission", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews_given")

class ReviewerReputation(Base):
    __tablename__ = "reviewer_reputation"

    id = Column(Integer, primary_key=True, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    domain = Column(String(100), default="Distributed Systems & Backend")
    reviews_completed = Column(Integer, default=0)
    agreement_score = Column(Float, default=94.5)
    helpfulness_score = Column(Float, default=96.0)
    reputation_level = Column(String(50), default="STAFF") # SENIOR, STAFF, PRINCIPAL

    reviewer = relationship("User", back_populates="reputation")
