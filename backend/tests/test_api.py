from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "HEALTHY"

def test_login_demo_user():
    response = client.post("/api/auth/login", json={
        "email": "jeevan@proof.dev",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "jeevan"
    assert data["user"]["overall_capability"] == 86

def test_list_challenges():
    response = client.get("/api/challenges")
    assert response.status_code == 200
    challenges = response.json()
    assert len(challenges) >= 8
    rate_limiter = next((c for c in challenges if c["slug"] == "design-a-distributed-rate-limiter"), None)
    assert rate_limiter is not None
    assert rate_limiter["difficulty"] == "Advanced"

def test_list_projects():
    response = client.get("/api/projects")
    assert response.status_code == 200
    projects = response.json()
    assert len(projects) >= 10

def test_list_reels():
    response = client.get("/api/reels")
    assert response.status_code == 200
    reels = response.json()
    assert len(reels) >= 15

def test_talent_feed():
    response = client.get("/api/talent")
    assert response.status_code == 200
    talent = response.json()
    assert len(talent) >= 5
    jeevan = next((t for t in talent if t["username"] == "jeevan"), None)
    assert jeevan is not None
    assert len(jeevan["why_matched"]) > 0

def test_capability_breakdown():
    response = client.get("/api/capabilities/jeevan")
    assert response.status_code == 200
    data = response.json()
    assert data["overall_capability"] == 86
    assert data["evidence_confidence"] == "HIGH"
    assert len(data["capabilities"]) >= 6

def test_social_does_not_affect_capability():
    """
    CRITICAL PROOF INVARIANT:
    Views, saves, comments on reels must NEVER alter technical capability scores.
    """
    # 1. Get initial capability
    res_before = client.get("/api/capabilities/jeevan")
    cap_before = res_before.json()["overall_capability"]

    # 2. Add save and comment to reel
    res_reels = client.get("/api/reels")
    first_reel_id = res_reels.json()[0]["id"]
    client.post(f"/api/reels/{first_reel_id}/save")
    client.post(f"/api/reels/{first_reel_id}/comments", json={
        "text": "Brilliant engineering architecture!",
        "is_technical_question": False
    })

    # 3. Check capability after social activity
    res_after = client.get("/api/capabilities/jeevan")
    cap_after = res_after.json()["overall_capability"]

    assert cap_before == cap_after, "Violation: Social activity altered technical capability score!"
