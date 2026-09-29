from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class MemoryItem(BaseModel):
    id: Optional[str] = None
    text: str
    type: Optional[str] = "observation"  # fact, preference, concern, commitment, outcome
    context: Optional[str] = None
    tags: List[str] = []
    timestamp: Optional[str] = None
    scores: Optional[Dict[str, float]] = None


class TimelineEvent(BaseModel):
    id: Optional[str] = None
    date: str
    title: str
    description: str
    category: str  # "fact", "concern", "resolution", "commitment", "preference", "milestone"
    icon: Optional[str] = None
    meeting_id: Optional[int] = None


class ContactMemoryOverview(BaseModel):
    contact_id: int
    contact_name: str
    company: str
    hindsight_bank_id: str
    total_memories: int
    facts: List[str] = []
    preferences: List[str] = []
    active_concerns: List[str] = []
    resolved_concerns: List[str] = []
    commitments: List[Dict[str, Any]] = []
    outcomes: List[str] = []
    timeline: List[TimelineEvent] = []
    raw_memories: List[MemoryItem] = []
