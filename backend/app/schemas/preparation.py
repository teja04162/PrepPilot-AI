from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime


class PrepareRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    custom_goal: Optional[str] = Field(None, description="Optional specific focus or objective for this upcoming meeting")
    meeting_type: Optional[str] = Field("Follow-up / Technical & Commercial", description="Type of meeting")


class PreparationBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    contact_id: int
    contact_name: str
    company: str
    role: str
    generated_at: datetime
    hindsight_bank_id: str
    
    # Core Briefing Sections
    meeting_objective: str
    important_history: List[str]
    open_commitments: List[Dict[str, Any]]
    previous_concerns: List[str]
    resolved_issues: List[str]
    suggested_questions: List[str]
    recommended_approach: List[str]
    potential_risks: List[str]
    relationship_status_assessment: str
    
    # Transparency & Hindsight Provenance
    recalled_memories_count: int
    recalled_memory_excerpts: List[str]
    memory_powered_badge: str = "Powered by Hindsight Long-Term Memory"
