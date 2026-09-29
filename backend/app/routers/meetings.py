from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.contact import Contact
from app.models.meeting import Meeting
from app.models.commitment import Commitment
from app.schemas.meeting import MeetingCreate, MeetingUpdate, MeetingResponse, MeetingLearnResponse
from app.services.preparation_service import preparation_service
from app.utils.logger import logger

router = APIRouter(prefix="/api/meetings", tags=["Meetings"])


@router.get("", response_model=List[MeetingResponse])
def get_all_meetings(db: Session = Depends(get_db)):
    """Retrieve all recorded meetings."""
    return db.query(Meeting).order_by(Meeting.date.desc()).all()


@router.post("", response_model=MeetingResponse)
def create_meeting(meeting_in: MeetingCreate, db: Session = Depends(get_db)):
    """Create a new meeting record for a contact."""
    contact = db.query(Contact).filter(Contact.id == meeting_in.contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    meeting = Meeting(
        contact_id=meeting_in.contact_id,
        title=meeting_in.title,
        date=meeting_in.date or datetime.utcnow(),
        location=meeting_in.location or "Google Meet / Virtual",
        notes=meeting_in.notes,
        is_processed=False
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.delete("/{meeting_id}")
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    db.delete(meeting)
    db.commit()
    return {"status": "success", "message": f"Meeting {meeting_id} deleted."}


@router.post("/{meeting_id}/learn", response_model=MeetingLearnResponse)
def learn_from_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """
    POST-MEETING LEARNING PIPELINE:
    1. Extracts structured facts, preferences, concerns, commitments, and resolutions.
    2. Retains durable knowledge items directly into the contact's Hindsight memory bank.
    3. Saves structured commitments and updates meeting status in PostgreSQL.
    """
    return preparation_service.learn_from_meeting(meeting_id=meeting_id, db=db)
