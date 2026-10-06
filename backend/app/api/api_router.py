from fastapi import APIRouter
from backend.app.api.routes_auth import router as auth_router
from backend.app.api.routes_users import router as users_router
from backend.app.api.routes_challenges import router as challenges_router
from backend.app.api.routes_attempts import router as attempts_router
from backend.app.api.routes_submissions import router as submissions_router
from backend.app.api.routes_projects import router as projects_router
from backend.app.api.routes_verification import router as verification_router
from backend.app.api.routes_reviews import router as reviews_router
from backend.app.api.routes_capabilities import router as capabilities_router
from backend.app.api.routes_reels import router as reels_router
from backend.app.api.routes_talent import router as talent_router
from backend.app.api.routes_opportunities import router as opportunities_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(challenges_router)
api_router.include_router(attempts_router)
api_router.include_router(submissions_router)
api_router.include_router(projects_router)
api_router.include_router(verification_router)
api_router.include_router(reviews_router)
api_router.include_router(capabilities_router)
api_router.include_router(reels_router)
api_router.include_router(talent_router)
api_router.include_router(opportunities_router)
