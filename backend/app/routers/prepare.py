from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.preparation import PrepareRequest, PreparationBrief
from app.services.preparation_service import preparation_service

router = APIRouter(prefix="/api", tags=["Preparation"])


@router.post("/contacts/{contact_id}/prepare", response_model=PreparationBrief)
def prepare_contact_meeting(
    contact_id: int,
    req: PrepareRequest = PrepareRequest(),
    db: Session = Depends(get_db)
):
    """
    HERO FEATURE: 'PREPARE ME'
    Recalls long-term memories from Hindsight for this contact, combines with
    PostgreSQL meeting & commitment state, and generates an executive meeting brief.
    """
    return preparation_service.prepare_meeting(contact_id=contact_id, req=req, db=db)
