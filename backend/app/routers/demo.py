from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.contact import Contact
from app.models.meeting import Meeting
from app.models.commitment import Commitment
from app.services.demo_service import seed_demo_data
from app.services.hindsight_service import hindsight_service
from app.config import settings

router = APIRouter(prefix="/api/demo", tags=["Demo & System Stats"])


@router.post("/seed")
def seed_demo(db: Session = Depends(get_db)):
    """
    HACKATHON DEMO RESET / SEED
    Populates Sarah Johnson (Acme Corporation) multi-meeting storyline
    and 4 other enterprise contacts, retaining durable memories into Hindsight.
    """
    return seed_demo_data(db)


@router.get("/stats")
def get_system_stats(db: Session = Depends(get_db)):
    """Retrieve global stats across PostgreSQL and Hindsight for the dashboard."""
    contacts_count = db.query(Contact).count()
    meetings_count = db.query(Meeting).count()
    open_commitments_count = db.query(Commitment).filter(Commitment.status == "open").count()
    completed_commitments_count = db.query(Commitment).filter(Commitment.status == "completed").count()

    # Calculate memory count across contacts
    contacts = db.query(Contact).all()
    total_memories = 0
    for c in contacts:
        memories = hindsight_service.list_memories(bank_id=c.hindsight_bank_id, limit=50)
        total_memories += len(memories)

    return {
        "status": "healthy",
        "hindsight_base_url": settings.HINDSIGHT_BASE_URL,
        "groq_model": settings.GROQ_MODEL,
        "total_contacts": contacts_count,
        "total_meetings": meetings_count,
        "open_commitments": open_commitments_count,
        "completed_commitments": completed_commitments_count,
        "total_memories_learned": total_memories,
        "recent_activity_badge": f"{total_memories} durable memories actively retained in Hindsight"
    }
