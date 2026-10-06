from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class Capability(Base):
    __tablename__ = "capabilities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill = Column(String(100), nullable=False) # Python, Backend, AI/ML, System Design, Databases, Cloud, DevOps, APIs, Testing, Security
    score = Column(Integer, default=50, nullable=False)
    confidence = Column(String(50), default="MEDIUM") # LOW, MEDIUM, HIGH
    evidence_count = Column(Integer, default=1)
    history_data = Column(Text, default="[]") # JSON list of { "date": "...", "score": 65 }
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="capabilities")
