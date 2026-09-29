from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class CommitmentBase(BaseModel):
    title: str
    owner: str = "user"  # "user" or "contact"
    status: str = "open"  # "open", "completed", "cancelled"
    due_date: Optional[datetime] = None


class CommitmentCreate(CommitmentBase):
    contact_id: int
    meeting_id: Optional[int] = None


class CommitmentUpdate(BaseModel):
    title: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class CommitmentResponse(CommitmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    contact_id: int
    meeting_id: Optional[int] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
