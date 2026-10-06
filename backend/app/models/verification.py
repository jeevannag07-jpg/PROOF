from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id", ondelete="CASCADE"), unique=True, nullable=False)
    repository_check = Column(Boolean, default=False)
    build_check = Column(Boolean, default=False)
    test_check = Column(Boolean, default=False)
    benchmark_check = Column(Boolean, default=False)
    security_check = Column(Boolean, default=False)
    reproducibility_check = Column(Boolean, default=False)
    overall_status = Column(String(50), default="PENDING") # PENDING, VERIFIED, FAILED
    confidence = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH
    details = Column(Text, nullable=True) # JSON check logs and breakdown
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("Submission", back_populates="verification")
