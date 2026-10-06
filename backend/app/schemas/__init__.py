from pydantic import BaseModel, Field, model_validator
from typing import Optional, List, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    username: str
    email: str
    role: str = "BUILDER"
    bio: Optional[str] = None
    title: Optional[str] = "Software Engineer"
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class CapabilityOut(BaseModel):
    id: int
    skill: str
    score: int
    confidence: str
    evidence_count: int
    history_data: Optional[str] = "[]"
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

class UserOut(UserBase):
    id: int
    overall_capability: int
    evidence_confidence: str
    verified_projects_count: int
    expert_reviews_count: int
    deployments_count: int
    streak_days: int
    github_username: Optional[str] = None
    github_connected: Optional[str] = "DEMO_NOT_CONNECTED"
    capabilities: List[CapabilityOut] = []
    created_at: datetime

    model_config = {"from_attributes": True}

# Challenge Schemas
class ChallengeBase(BaseModel):
    title: str
    slug: str
    description: str
    problem_statement: str
    
    # Real-World Mission Attributes
    real_world_context: Optional[str] = None
    affected_users: Optional[str] = None
    domain: Optional[str] = "General"
    subdomain: Optional[str] = None
    estimated_time: Optional[str] = "3–5 hours"
    skills_required: Optional[str] = None
    suggested_technologies: Optional[str] = None
    constraints: Optional[str] = None
    expected_outcome: Optional[str] = None
    expected_output: Optional[str] = None
    evaluation_criteria: Optional[str] = None
    impact_description: Optional[str] = None

    # Legacy Compatibility
    challenge_type: str = "CHALLENGE"
    difficulty: str = "Intermediate"
    estimated_hours: str = "3–5 hours"
    category: str = "Backend"
    skills: str = "Backend,System Design"
    skills_demonstrated: Optional[str] = None
    status: str = "ACTIVE"

class ChallengeCreate(ChallengeBase):
    pass

class ChallengeOut(ChallengeBase):
    id: int
    created_at: datetime
    builders_count: int = 0
    submissions_count: int = 0
    verified_count: int = 0

    model_config = {"from_attributes": True}

# Attempt Schemas
class AttemptCreate(BaseModel):
    challenge_id: int

class AttemptOut(BaseModel):
    id: int
    user_id: int
    challenge_id: int
    status: str
    started_at: datetime
    submitted_at: Optional[datetime] = None
    challenge: Optional[ChallengeOut] = None

    model_config = {"from_attributes": True}

# Architecture Schemas
class ArchitectureBase(BaseModel):
    diagram_data: str
    description: Optional[str] = None
    system_flow: Optional[str] = None
    scaling_strategy: Optional[str] = None
    failure_points: Optional[str] = None

class ArchitectureCreate(ArchitectureBase):
    submission_id: int

class ArchitectureOut(ArchitectureBase):
    id: int
    submission_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

# Technical Decision Schemas
class TechnicalDecisionBase(BaseModel):
    title: str
    decision: str
    context: str
    alternatives: str
    tradeoffs: str
    result: str

class TechnicalDecisionCreate(TechnicalDecisionBase):
    submission_id: int

class TechnicalDecisionOut(TechnicalDecisionBase):
    id: int
    submission_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

# Evidence Schemas
class EvidenceBase(BaseModel):
    type: str
    title: str
    url: Optional[str] = None
    description: Optional[str] = None
    metrics_data: Optional[str] = None

class EvidenceCreate(EvidenceBase):
    submission_id: int

class EvidenceOut(EvidenceBase):
    id: int
    submission_id: int
    verification_status: str
    created_at: datetime

    model_config = {"from_attributes": True}

# Verification Result Schemas
class VerificationResultOut(BaseModel):
    id: int
    submission_id: int
    repository_check: bool
    build_check: bool
    test_check: bool
    benchmark_check: bool
    security_check: bool
    reproducibility_check: bool
    overall_status: str
    confidence: str
    details: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

# Technical Defense Schemas
class TechnicalQuestionBase(BaseModel):
    question: str
    answer: Optional[str] = None

class TechnicalQuestionCreate(TechnicalQuestionBase):
    submission_id: int

class TechnicalQuestionOut(TechnicalQuestionBase):
    id: int
    submission_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class TechnicalAnswerUpdate(BaseModel):
    answer: str

# Review Schemas
class ReviewBase(BaseModel):
    architecture_score: float = 8.0
    code_quality_score: float = 8.0
    scalability_score: float = 8.0
    technical_reasoning_score: float = 8.0
    testing_score: float = 8.0
    overall_score: Optional[float] = None
    feedback: str
    strengths: str
    improvements: str
    reviewer_insight: Optional[str] = None

    # Alternative field aliases / compatibility attributes
    tradeoff_reasoning_score: Optional[float] = None
    testing_rigor_score: Optional[float] = None
    general_feedback: Optional[str] = None
    improvements_needed: Optional[str] = None
    non_obvious_insight: Optional[str] = None
    decision: Optional[str] = "VERIFIED"

    @model_validator(mode="before")
    @classmethod
    def populate_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "technical_reasoning_score" not in data and "tradeoff_reasoning_score" in data:
                data["technical_reasoning_score"] = data["tradeoff_reasoning_score"]
            if "testing_score" not in data and "testing_rigor_score" in data:
                data["testing_score"] = data["testing_rigor_score"]
            if "feedback" not in data and "general_feedback" in data:
                data["feedback"] = data["general_feedback"]
            if "improvements" not in data and "improvements_needed" in data:
                data["improvements"] = data["improvements_needed"]
            if "reviewer_insight" not in data and "non_obvious_insight" in data:
                data["reviewer_insight"] = data["non_obvious_insight"]
        return data

class ReviewCreate(ReviewBase):
    submission_id: int

class ReviewOut(ReviewBase):
    id: int
    submission_id: int
    reviewer_id: int
    reviewer: Optional[UserBase] = None
    status: str
    created_at: datetime

    @model_validator(mode="after")
    def sync_aliases(self) -> "ReviewOut":
        if self.general_feedback is None:
            self.general_feedback = self.feedback
        if self.tradeoff_reasoning_score is None:
            self.tradeoff_reasoning_score = self.technical_reasoning_score
        if self.testing_rigor_score is None:
            self.testing_rigor_score = self.testing_score
        if self.improvements_needed is None:
            self.improvements_needed = self.improvements
        if self.non_obvious_insight is None:
            self.non_obvious_insight = self.reviewer_insight
        return self

    model_config = {"from_attributes": True}

# Submission Schemas
class SubmissionCreate(BaseModel):
    attempt_id: Optional[int] = None
    title: str
    description: str
    repository_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    tags: Optional[str] = "Backend,System Design"

class SubmissionOut(BaseModel):
    id: int
    attempt_id: Optional[int]
    user_id: int
    title: str
    description: str
    repository_url: Optional[str]
    live_demo_url: Optional[str]
    status: str
    tags: str
    capability_impact: Optional[str] = "{}"
    created_at: datetime
    user: Optional[UserBase] = None
    architecture: Optional[ArchitectureOut] = None
    decisions: List[TechnicalDecisionOut] = []
    evidence_items: List[EvidenceOut] = []
    verification: Optional[VerificationResultOut] = None
    defense_questions: List[TechnicalQuestionOut] = []
    reviews: List[ReviewOut] = []

    model_config = {"from_attributes": True}

# Reel Schemas
class ReelBase(BaseModel):
    title: str
    caption: str
    reel_type: str = "BUILD"
    metrics_before: Optional[str] = None
    metrics_after: Optional[str] = None
    hook_quote: Optional[str] = None
    code_snippet: Optional[str] = None
    tags: Optional[str] = "Backend,Performance"
    project_id: Optional[int] = None
    challenge_id: Optional[int] = None
    media_url: Optional[str] = None
    media_path: Optional[str] = None
    media_type: Optional[str] = "CODE_ONLY"
    thumbnail_url: Optional[str] = None
    aspect_ratio: Optional[str] = "9:16"
    duration_seconds: Optional[int] = None

class ReelCreate(ReelBase):
    pass

class ReelOut(ReelBase):
    id: int
    user_id: int
    user: Optional[UserBase] = None
    views_count: int
    saves_count: int
    created_at: datetime

    model_config = {"from_attributes": True}

class UploadUrlRequest(BaseModel):
    filename: str
    content_type: str
    size: int

class UploadUrlResponse(BaseModel):
    upload_url: str
    media_path: str
    public_url: str
    media_type: str


# Social Schemas
class CommentCreate(BaseModel):
    reel_id: Optional[int] = None
    submission_id: Optional[int] = None
    text: str
    is_technical_question: bool = False

class CommentOut(BaseModel):
    id: int
    user_id: int
    user: Optional[UserBase] = None
    reel_id: Optional[int] = None
    submission_id: Optional[int] = None
    text: str
    is_technical_question: bool
    created_at: datetime

    model_config = {"from_attributes": True}

# Opportunity Schemas
class OpportunityCreate(BaseModel):
    developer_id: int
    title: str
    company_name: Optional[str] = "Tech Infrastructure Labs"
    location: Optional[str] = "Remote / San Francisco"
    salary_range: Optional[str] = "$160k - $220k"
    description: str
    match_reasons: Optional[str] = "[]"

class OpportunityStatusUpdate(BaseModel):
    status: str # NEW, INTERESTED, IN_DISCUSSION, INTERVIEW, CLOSED

class OpportunityOut(BaseModel):
    id: int
    recruiter_id: int
    developer_id: int
    recruiter: Optional[UserBase] = None
    developer: Optional[UserBase] = None
    title: str
    company_name: str
    location: str
    salary_range: str
    description: str
    match_reasons: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
