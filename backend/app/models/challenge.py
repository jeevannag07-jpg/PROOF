from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    
    # Real-World Engineering Mission Attributes (Additive)
    real_world_context = Column(Text, nullable=True)
    affected_users = Column(Text, nullable=True)
    domain = Column(String(100), nullable=True, default="General")
    subdomain = Column(String(100), nullable=True)
    estimated_time = Column(String(50), nullable=True, default="3–5 hours")
    skills_required = Column(String(255), nullable=True)
    suggested_technologies = Column(Text, nullable=True)
    constraints = Column(Text, nullable=True)
    expected_outcome = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=True)
    evaluation_criteria = Column(Text, nullable=True)
    impact_description = Column(Text, nullable=True)
    
    # Legacy & Categorization Compatibility
    challenge_type = Column(String(50), default="CHALLENGE") # CHALLENGE or MISSION
    difficulty = Column(String(50), default="Intermediate") # Beginner, Intermediate, Advanced
    estimated_hours = Column(String(50), default="3–5 hours")
    category = Column(String(50), default="Backend")
    skills = Column(String(255), default="Backend,System Design")
    skills_demonstrated = Column(Text, nullable=True)
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    attempts = relationship("ChallengeAttempt", back_populates="challenge", cascade="all, delete-orphan")
    reels = relationship("Reel", back_populates="challenge")
