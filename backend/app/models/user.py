from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="BUILDER", nullable=False) # BUILDER, REVIEWER, RECRUITER
    avatar_url = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    title = Column(String(100), default="Software Engineer")
    github_username = Column(String(100), nullable=True)
    github_connected = Column(String(50), default="DEMO_NOT_CONNECTED") # CONNECTED, DEMO_NOT_CONNECTED
    overall_capability = Column(Integer, default=0)
    evidence_confidence = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH
    verified_projects_count = Column(Integer, default=0)
    expert_reviews_count = Column(Integer, default=0)
    deployments_count = Column(Integer, default=0)
    streak_days = Column(Integer, default=7)
    xp = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    attempts = relationship("ChallengeAttempt", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="user", cascade="all, delete-orphan")
    capabilities = relationship("Capability", back_populates="user", cascade="all, delete-orphan")
    reviews_given = relationship("Review", back_populates="reviewer", cascade="all, delete-orphan")
    reputation = relationship("ReviewerReputation", back_populates="reviewer", uselist=False, cascade="all, delete-orphan")
    reels = relationship("Reel", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
