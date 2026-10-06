from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class TechnicalDecision(Base):
    __tablename__ = "technical_decisions"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    decision = Column(Text, nullable=False)
    context = Column(Text, nullable=False)
    alternatives = Column(Text, nullable=False)
    tradeoffs = Column(Text, nullable=False)
    result = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("Submission", back_populates="decisions")
