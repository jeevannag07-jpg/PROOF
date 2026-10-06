from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class Reel(Base):
    __tablename__ = "reels"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("submissions.id", ondelete="SET NULL"), nullable=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    caption = Column(Text, nullable=False)
    reel_type = Column(String(50), default="BUILD") # BUILD, DECISION, DEBUG, ARCHITECTURE, GROWTH, CHALLENGE
    metrics_before = Column(String(100), nullable=True) # e.g. "900ms"
    metrics_after = Column(String(100), nullable=True) # e.g. "120ms"
    hook_quote = Column(Text, nullable=True) # e.g. "I found the database query was the real bottleneck."
    code_snippet = Column(Text, nullable=True)
    tags = Column(String(255), default="Backend,Performance,System Design")
    media_url = Column(String(500), nullable=True)
    media_path = Column(String(255), nullable=True)
    media_type = Column(String(50), default="CODE_ONLY", nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    aspect_ratio = Column(String(20), default="9:16", nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    views_count = Column(Integer, default=1420)
    saves_count = Column(Integer, default=184)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="reels")
    project = relationship("Submission", back_populates="reels")
    challenge = relationship("Challenge", back_populates="reels")
    comments = relationship("Comment", back_populates="reel", cascade="all, delete-orphan")
