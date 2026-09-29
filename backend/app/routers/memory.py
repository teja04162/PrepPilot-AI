from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.memory import ContactMemoryOverview, TimelineEvent
from app.services.preparation_service import preparation_service

router = APIRouter(prefix="/api/contacts", tags=["Memory & Timeline"])


@router.get("/{contact_id}/memory", response_model=ContactMemoryOverview)
def get_contact_memory(contact_id: int, db: Session = Depends(get_db)):
    """
    HACKATHON DEMO SCREEN: 'What PrepPilot Remembers'
    Retrieves full categorized memory units (facts, preferences, concerns, resolutions, commitments)
    and visual timeline directly backed by Hindsight memory banks.
    """
    return preparation_service.get_contact_memory_overview(contact_id=contact_id, db=db)


@router.get("/{contact_id}/timeline", response_model=List[TimelineEvent])
def get_contact_timeline(contact_id: int, db: Session = Depends(get_db)):
    """Retrieve chronological event and memory learning timeline for a contact."""
    overview = preparation_service.get_contact_memory_overview(contact_id=contact_id, db=db)
    return overview.timeline
