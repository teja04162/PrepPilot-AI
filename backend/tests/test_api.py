from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "PrepPilot AI API"
    assert data["status"] == "online"


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_demo_seed_and_stats():
    response = client.post("/api/demo/seed")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["contacts_created"] == 5

    # Check stats
    stats_res = client.get("/api/demo/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_contacts"] >= 5
    assert stats["total_meetings"] >= 5


def test_contacts_api():
    # List contacts
    response = client.get("/api/contacts")
    assert response.status_code == 200
    contacts = response.json()
    assert len(contacts) >= 5

    # Find Sarah Johnson
    sarah = next((c for c in contacts if "Sarah" in c["name"]), None)
    assert sarah is not None
    assert sarah["company"] == "Acme Corporation"

    # Get Sarah's memory
    mem_res = client.get(f"/api/contacts/{sarah['id']}/memory")
    assert mem_res.status_code == 200
    mem_data = mem_res.json()
    assert mem_data["contact_name"] == "Sarah Johnson"
    assert len(mem_data["timeline"]) > 0

    # Prepare briefing for Sarah
    prep_res = client.post(f"/api/contacts/{sarah['id']}/prepare", json={"custom_goal": "Security signoff"})
    assert prep_res.status_code == 200
    brief = prep_res.json()
    assert brief["contact_name"] == "Sarah Johnson"
    assert "meeting_objective" in brief
    assert len(brief["suggested_questions"]) > 0
