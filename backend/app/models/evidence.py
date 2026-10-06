from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False) # REPOSITORY, LIVE_DEMO, BENCHMARK, TEST, DEPLOYMENT, ARCHITECTURE, VIDEO, SCREENSHOT
    title = Column(String(200), nullable=False)
    url = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    verification_status = Column(String(50), default="PENDING") # PENDING, VERIFIED, FAILED
    metrics_data = Column(Text, nullable=True) # JSON details like RPS, latency, test count
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("Submission", back_populates="evidence_items")
