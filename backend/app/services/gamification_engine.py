from sqlalchemy.orm import Session
from datetime import datetime, timezone
from backend.app.models.user import User
from backend.app.models.gamification import ReputationEvent, Badge, Milestone
from backend.app.models.submission import Submission

class GamificationEngine:
    
    def process_event(self, db: Session, user_id: int, source_type: str, source_id: int, event_type: str, xp_to_award: int):
        # Check idempotency
        existing_event = db.query(ReputationEvent).filter(
            ReputationEvent.user_id == user_id,
            ReputationEvent.source_type == source_type,
            ReputationEvent.source_id == source_id,
            ReputationEvent.event_type == event_type
        ).first()

        if existing_event:
            return None # Already awarded

        # Create event
        event = ReputationEvent(
            user_id=user_id,
            source_type=source_type,
            source_id=source_id,
            event_type=event_type,
            xp_awarded=xp_to_award
        )
        db.add(event)
        
        # Add XP to user
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.xp = (user.xp or 0) + xp_to_award
            
        db.commit()
        db.refresh(event)
        
        # Check for milestones and badges
        self.evaluate_milestones_and_badges(db, user_id)
        
        return event

    def evaluate_milestones_and_badges(self, db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return
            
        # Count verified submissions
        verified_subs = db.query(Submission).filter(
            Submission.user_id == user_id,
            Submission.status == "VERIFIED"
        ).count()
        
        # 1. Milestone: First Verified Solution
        if verified_subs >= 1:
            self._award_milestone(db, user_id, "First Verified Solution")
            
        # 2. Milestone: 5 Verified Solutions
        if verified_subs >= 5:
            self._award_milestone(db, user_id, "5 Verified Solutions")
            self._award_badge(db, user_id, "Verified Builder")
            
        # 3. Milestone: 10 Verified Solutions
        if verified_subs >= 10:
            self._award_milestone(db, user_id, "10 Verified Solutions")
            self._award_badge(db, user_id, "Consistent Verified Builder")
            
    def _award_milestone(self, db: Session, user_id: int, milestone_name: str):
        exists = db.query(Milestone).filter_by(user_id=user_id, milestone_name=milestone_name).first()
        if not exists:
            ms = Milestone(user_id=user_id, milestone_name=milestone_name)
            db.add(ms)
            db.commit()
            
    def _award_badge(self, db: Session, user_id: int, badge_name: str):
        exists = db.query(Badge).filter_by(user_id=user_id, badge_name=badge_name).first()
        if not exists:
            badge = Badge(user_id=user_id, badge_name=badge_name)
            db.add(badge)
            db.commit()

gamification_engine = GamificationEngine()
