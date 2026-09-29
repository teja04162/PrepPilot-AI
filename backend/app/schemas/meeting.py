from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.schemas.commitment import CommitmentResponse


class MeetingBase(BaseModel):
    contact_id: int
    title: str
    date: Optional[datetime] = None
    location: Optional[str] = "Google Meet / Virtual"
    notes: str = Field(..., description="Raw meeting notes, transcript, or bullet points")


class MeetingCreate(MeetingBase):
    pass


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    summary: Optional[str] = None


class ExtractedKnowledge(BaseModel):
    facts: List[str] = []
    preferences: List[str] = []
    concerns: List[str] = []
    commitments: List[Dict[str, str]] = []
    outcomes: List[str] = []
    resolved_concerns: List[str] = []
    durable_memories: List[str] = []


class MeetingResponse(MeetingBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    summary: Optional[str] = None
    is_processed: bool = False
    created_at: datetime
    commitments: List[CommitmentResponse] = []


class MeetingLearnResponse(BaseModel):
    meeting_id: int
    contact_id: int
    contact_name: str
    extracted_knowledge: ExtractedKnowledge
    memories_retained: int
    retained_items: List[str]
    message: str
