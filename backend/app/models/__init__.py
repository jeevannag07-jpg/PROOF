from backend.app.core.database import Base
from backend.app.models.user import User
from backend.app.models.challenge import Challenge
from backend.app.models.attempt import ChallengeAttempt
from backend.app.models.submission import Submission
from backend.app.models.architecture import Architecture
from backend.app.models.decision import TechnicalDecision
from backend.app.models.evidence import Evidence
from backend.app.models.verification import VerificationResult
from backend.app.models.defense import TechnicalQuestion
from backend.app.models.review import Review, ReviewerReputation
from backend.app.models.capability import Capability
from backend.app.models.reel import Reel
from backend.app.models.social import Comment, Follow, Save
from backend.app.models.opportunity import Opportunity
from backend.app.models.gamification import ReputationEvent, Badge, Milestone

__all__ = [
    "Base",
    "User",
    "Challenge",
    "ChallengeAttempt",
    "Submission",
    "Architecture",
    "TechnicalDecision",
    "Evidence",
    "VerificationResult",
    "TechnicalQuestion",
    "Review",
    "ReviewerReputation",
    "Capability",
    "Reel",
    "Comment",
    "Follow",
    "Save",
    "Opportunity",
    "ReputationEvent",
    "Badge",
    "Milestone",
]
