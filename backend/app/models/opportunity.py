from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    developer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    company_name = Column(String(100), default="High-Growth Infrastructure Lab")
    location = Column(String(100), default="Remote / San Francisco")
    salary_range = Column(String(100), default="$160k - $220k + Equity")
    description = Column(Text, nullable=False)
    match_reasons = Column(Text, default="[]") # JSON list of strings explaining capability matches
    status = Column(String(50), default="NEW") # NEW, INTERESTED, IN_DISCUSSION, INTERVIEW, CLOSED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    recruiter = relationship("User", foreign_keys=[recruiter_id])
    developer = relationship("User", foreign_keys=[developer_id])
