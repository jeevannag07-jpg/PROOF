import json
from datetime import datetime, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.user import User
from backend.app.models.capability import Capability
from backend.app.models.submission import Submission
from backend.app.models.review import Review
from backend.app.models.evidence import Evidence
from backend.app.models.decision import TechnicalDecision
from backend.app.models.defense import TechnicalQuestion

CORE_SKILLS = [
    "Backend",
    "Python",
    "AI/ML",
    "System Design",
    "Databases",
    "Cloud",
    "DevOps",
    "APIs",
    "Testing",
    "Security"
]

class CapabilityEngine:
    def recalculate_user_capability(self, db: Session, user_id: int) -> Dict[str, Any]:
        """
        Recalculates technical capability for a user.
        STRICT PRINCIPLE: Social signals (likes, views, saves, followers)
        HAVE ZERO IMPACT on technical capability.
        Only verified work, expert reviews, technical decisions, and evidence count.
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return {}

        # 1. Fetch all submissions by this user
        submissions = db.query(Submission).filter(Submission.user_id == user_id).all()
        verified_submissions = [s for s in submissions if s.status == "VERIFIED"]

        # Track verified counts
        user.verified_projects_count = len(verified_submissions)

        # 2. Count reviews across user's submissions
        all_reviews: List[Review] = []
        for sub in submissions:
            all_reviews.extend(sub.reviews)
        user.expert_reviews_count = len(all_reviews)

        # 3. Count deployments and evidence
        total_evidence = db.query(Evidence).join(Submission).filter(
            Submission.user_id == user_id,
            Evidence.verification_status == "VERIFIED"
        ).all()
        deployments = [e for e in total_evidence if e.type == "DEPLOYMENT"]
        user.deployments_count = len(deployments)

        # 4. Map skills to scores
        skill_scores: Dict[str, List[float]] = {skill: [] for skill in CORE_SKILLS}
        skill_evidence_counts: Dict[str, int] = {skill: 0 for skill in CORE_SKILLS}

        for sub in verified_submissions:
            # Parse capability impact defined on project
            impact = {}
            if sub.capability_impact:
                try:
                    impact = json.loads(sub.capability_impact)
                except Exception:
                    impact = {}

            # Verification quality multiplier
            conf_multiplier = 1.0
            if sub.verification:
                if sub.verification.confidence == "HIGH":
                    conf_multiplier = 1.15
                elif sub.verification.confidence == "LOW":
                    conf_multiplier = 0.75

            # Decisions & defense multiplier
            decisions_count = len(sub.decisions)
            answered_defense = len([q for q in sub.defense_questions if q.answer and len(q.answer.strip()) > 10])
            bonus = min(8.0, (decisions_count * 1.5) + (answered_defense * 1.0))

            # Review quality for this submission
            sub_reviews = sub.reviews
            if sub_reviews:
                avg_review = sum(r.overall_score for r in sub_reviews) / len(sub_reviews)
                # Base score from reviews (scaled 0-100)
                sub_score = (avg_review * 10.0) * conf_multiplier + bonus
            else:
                # Baseline for verified submission without expert review yet
                sub_score = (75.0) * conf_multiplier + bonus

            sub_score = min(99.0, max(40.0, sub_score))

            # Apply to impacted skills or tags
            tags_list = [t.strip() for t in sub.tags.split(",") if t.strip()]
            for skill in CORE_SKILLS:
                if skill in impact or skill in tags_list or (skill == "Backend" and "System Design" in tags_list):
                    skill_scores[skill].append(sub_score)
                    skill_evidence_counts[skill] += 1

        # 5. Update user capabilities
        all_final_scores = []
        for skill in CORE_SKILLS:
            existing_cap = db.query(Capability).filter(
                Capability.user_id == user_id,
                Capability.skill == skill
            ).first()

            if skill_scores[skill]:
                avg_skill_score = int(round(sum(skill_scores[skill]) / len(skill_scores[skill])))
                ev_count = skill_evidence_counts[skill]
                conf = "HIGH" if ev_count >= 3 else ("MEDIUM" if ev_count >= 1 else "LOW")
            else:
                # Initial default base
                if existing_cap:
                    avg_skill_score = existing_cap.score
                    conf = existing_cap.confidence
                    ev_count = existing_cap.evidence_count
                else:
                    avg_skill_score = 50
                    conf = "LOW"
                    ev_count = 0

            all_final_scores.append(avg_skill_score)

            # Update or create
            if not existing_cap:
                history = [{"date": "2026-09-01", "score": max(40, avg_skill_score - 15)}]
                existing_cap = Capability(
                    user_id=user_id,
                    skill=skill,
                    score=avg_skill_score,
                    confidence=conf,
                    evidence_count=ev_count,
                    history_data=json.dumps(history)
                )
                db.add(existing_cap)
            else:
                existing_cap.score = avg_skill_score
                existing_cap.confidence = conf
                existing_cap.evidence_count = ev_count

        # Overall capability is weighted average of top skills
        sorted_scores = sorted(all_final_scores, reverse=True)
        top_scores = sorted_scores[:4]
        overall = int(round(sum(top_scores) / len(top_scores))) if top_scores else 50
        user.overall_capability = overall

        # Global evidence confidence
        high_caps = sum(1 for s in all_final_scores if s >= 75)
        if len(verified_submissions) >= 3 and high_caps >= 2:
            user.evidence_confidence = "HIGH"
        elif len(verified_submissions) >= 1:
            user.evidence_confidence = "MEDIUM"
        else:
            user.evidence_confidence = "LOW"

        db.commit()
        db.refresh(user)

        return {
            "overall_capability": user.overall_capability,
            "evidence_confidence": user.evidence_confidence,
            "verified_projects_count": user.verified_projects_count,
            "expert_reviews_count": user.expert_reviews_count,
            "deployments_count": user.deployments_count
        }

capability_engine = CapabilityEngine()
