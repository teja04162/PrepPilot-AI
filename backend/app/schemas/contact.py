from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class ContactBase(BaseModel):
    name: str = Field(..., description="Full name of the contact")
    company: str = Field(..., description="Company name")
    role: str = Field(..., description="Job title / role")
    email: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    relationship_status: Optional[str] = "Active Prospect"


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    relationship_status: Optional[str] = None


class ContactResponse(ContactBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    hindsight_bank_id: str
    created_at: datetime
    updated_at: datetime
    meetings_count: Optional[int] = 0
    open_commitments_count: Optional[int] = 0
    memory_count: Optional[int] = 0
    last_meeting_date: Optional[datetime] = None
