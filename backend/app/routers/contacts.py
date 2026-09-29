from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import re

from app.database import get_db
from app.models.contact import Contact
from app.models.meeting import Meeting
from app.models.commitment import Commitment
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from app.schemas.commitment import CommitmentResponse, CommitmentCreate, CommitmentUpdate
from app.services.hindsight_service import hindsight_service
from app.utils.logger import logger

router = APIRouter(prefix="/api/contacts", tags=["Contacts"])


def _slugify(text: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "_", text.lower()).strip("_")


@router.get("", response_model=List[ContactResponse])
def get_contacts(db: Session = Depends(get_db)):
    """Retrieve all contacts with counts for meetings, open commitments, and memories."""
    contacts = db.query(Contact).order_by(Contact.name.asc()).all()
    result = []
    
    for c in contacts:
        meetings = db.query(Meeting).filter(Meeting.contact_id == c.id).order_by(Meeting.date.desc()).all()
        open_comm = db.query(Commitment).filter(Commitment.contact_id == c.id, Commitment.status == "open").count()
        last_date = meetings[0].date if meetings else None
        
        # Count memories from Hindsight
        memories = hindsight_service.list_memories(bank_id=c.hindsight_bank_id, limit=50)
        mem_count = len(memories)

        resp = ContactResponse(
            id=c.id,
            name=c.name,
            company=c.company,
            role=c.role,
            email=c.email,
            phone=c.phone,
            avatar_url=c.avatar_url,
            relationship_status=c.relationship_status,
            hindsight_bank_id=c.hindsight_bank_id,
            created_at=c.created_at,
            updated_at=c.updated_at,
            meetings_count=len(meetings),
            open_commitments_count=open_comm,
            memory_count=mem_count,
            last_meeting_date=last_date
        )
        result.append(resp)
    return result


@router.post("", response_model=ContactResponse)
def create_contact(contact_in: ContactCreate, db: Session = Depends(get_db)):
    """Create a new contact and provision their Hindsight memory bank."""
    bank_id = f"contact_{_slugify(contact_in.name)}_{_slugify(contact_in.company)}"
    
    # Check if bank_id exists
    existing = db.query(Contact).filter(Contact.hindsight_bank_id == bank_id).first()
    if existing:
        bank_id = f"{bank_id}_{int(db.query(Contact).count()) + 1}"

    contact = Contact(
        name=contact_in.name,
        company=contact_in.company,
        role=contact_in.role,
        email=contact_in.email,
        phone=contact_in.phone,
        avatar_url=contact_in.avatar_url or f"https://api.dicebear.com/7.x/initials/svg?seed={contact_in.name}",
        relationship_status=contact_in.relationship_status or "Active Prospect",
        hindsight_bank_id=bank_id
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)

    # Initialize Hindsight bank
    hindsight_service.ensure_bank(
        bank_id=bank_id,
        name=f"{contact.name} ({contact.company})",
        mission=f"Remember all meeting details, commitments, objections, and preferences for {contact.name} at {contact.company}."
    )

    return ContactResponse(
        id=contact.id,
        name=contact.name,
        company=contact.company,
        role=contact.role,
        email=contact.email,
        phone=contact.phone,
        avatar_url=contact.avatar_url,
        relationship_status=contact.relationship_status,
        hindsight_bank_id=contact.hindsight_bank_id,
        created_at=contact.created_at,
        updated_at=contact.updated_at,
        meetings_count=0,
        open_commitments_count=0,
        memory_count=0,
        last_meeting_date=None
    )


@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    meetings = db.query(Meeting).filter(Meeting.contact_id == contact.id).order_by(Meeting.date.desc()).all()
    open_comm = db.query(Commitment).filter(Commitment.contact_id == contact.id, Commitment.status == "open").count()
    memories = hindsight_service.list_memories(bank_id=contact.hindsight_bank_id, limit=50)

    return ContactResponse(
        id=contact.id,
        name=contact.name,
        company=contact.company,
        role=contact.role,
        email=contact.email,
        phone=contact.phone,
        avatar_url=contact.avatar_url,
        relationship_status=contact.relationship_status,
        hindsight_bank_id=contact.hindsight_bank_id,
        created_at=contact.created_at,
        updated_at=contact.updated_at,
        meetings_count=len(meetings),
        open_commitments_count=open_comm,
        memory_count=len(memories),
        last_meeting_date=meetings[0].date if meetings else None
    )


@router.delete("/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    bank_id = contact.hindsight_bank_id
    db.delete(contact)
    db.commit()

    # Clean up Hindsight bank
    hindsight_service.delete_bank(bank_id)
    return {"status": "success", "message": f"Contact {contact_id} and Hindsight memory bank deleted."}


@router.get("/{contact_id}/commitments", response_model=List[CommitmentResponse])
def get_contact_commitments(contact_id: int, db: Session = Depends(get_db)):
    return db.query(Commitment).filter(Commitment.contact_id == contact_id).order_by(Commitment.created_at.desc()).all()


@router.post("/{contact_id}/commitments", response_model=CommitmentResponse)
def add_commitment(contact_id: int, comm_in: CommitmentBase, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    comm = Commitment(
        contact_id=contact_id,
        title=comm_in.title,
        owner=comm_in.owner,
        status=comm_in.status or "open",
        due_date=comm_in.due_date
    )
    db.add(comm)
    db.commit()
    db.refresh(comm)
    return comm


@router.patch("/commitments/{commitment_id}", response_model=CommitmentResponse)
def update_commitment(commitment_id: int, update_in: CommitmentUpdate, db: Session = Depends(get_db)):
    comm = db.query(Commitment).filter(Commitment.id == commitment_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Commitment not found")
    
    if update_in.status is not None:
        comm.status = update_in.status
        if update_in.status == "completed":
            comm.completed_at = update_in.completed_at or datetime.utcnow()
    if update_in.title is not None:
        comm.title = update_in.title
    if update_in.owner is not None:
        comm.owner = update_in.owner
    if update_in.due_date is not None:
        comm.due_date = update_in.due_date

    db.commit()
    db.refresh(comm)
    return comm
