from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.contact import Contact
from app.models.meeting import Meeting
from app.models.commitment import Commitment
from app.schemas.preparation import PreparationBrief, PrepareRequest
from app.schemas.meeting import ExtractedKnowledge, MeetingLearnResponse
from app.schemas.memory import ContactMemoryOverview, TimelineEvent, MemoryItem
from app.services.hindsight_service import hindsight_service
from app.services.groq_service import groq_service
from app.utils.logger import logger


class PreparationService:
    """
    Core business logic coordinating PostgreSQL structured records,
    Hindsight long-term biomimetic memory banks, and Groq LLM reasoning.
    """

    def prepare_meeting(
        self,
        contact_id: int,
        req: PrepareRequest,
        db: Session
    ) -> PreparationBrief:
        """
        Synthesize a personalized pre-meeting preparation brief powered by Hindsight long-term memory.
        """
        contact = db.query(Contact).filter(Contact.id == contact_id).first()
        if not contact:
            raise HTTPException(status_code=404, detail=f"Contact {contact_id} not found")

        # 1. Recall historical memories from Hindsight
        bank_id = contact.hindsight_bank_id
        recall_query = (
            f"What are the historical facts, previous concerns, resolved objections, "
            f"commitments made, communication preferences, and discussions with {contact.name} at {contact.company}?"
        )
        
        recalled_memories = []
        try:
            recalled_memories = hindsight_service.recall_memory(
                bank_id=bank_id,
                query=recall_query,
                max_tokens=4096,
                budget="high"
            )
        except Exception as e:
            logger.warning(f"Hindsight recall fallback for contact {contact_id}: {str(e)}")

        # 2. Retrieve structured application data from PostgreSQL
        recent_meetings = (
            db.query(Meeting)
            .filter(Meeting.contact_id == contact_id)
            .order_by(Meeting.date.desc())
            .limit(10)
            .all()
        )
        meetings_data = [
            {"id": m.id, "title": m.title, "date": m.date.isoformat(), "summary": m.summary}
            for m in recent_meetings
        ]

        open_commitments = (
            db.query(Commitment)
            .filter(Commitment.contact_id == contact_id, Commitment.status == "open")
            .all()
        )
        commitments_data = [
            {"id": c.id, "title": c.title, "owner": c.owner, "status": c.status}
            for c in open_commitments
        ]

        # 3. Synthesize briefing via Groq
        brief_data = groq_service.generate_preparation_brief(
            contact_name=contact.name,
            company=contact.company,
            role=contact.role,
            custom_goal=req.custom_goal,
            meeting_type=req.meeting_type or "General Review",
            recalled_memories=recalled_memories,
            structured_meetings=meetings_data,
            open_commitments=commitments_data
        )

        # 4. Extract memory excerpts for transparency
        memory_excerpts = [
            m.get("text", "") for m in recalled_memories if m.get("text")
        ][:6]

        return PreparationBrief(
            contact_id=contact.id,
            contact_name=contact.name,
            company=contact.company,
            role=contact.role,
            generated_at=datetime.now(timezone.utc),
            hindsight_bank_id=bank_id,
            meeting_objective=brief_data.get("meeting_objective", f"Advance strategic alignment with {contact.name}"),
            important_history=brief_data.get("important_history", []),
            open_commitments=brief_data.get("open_commitments", commitments_data),
            previous_concerns=brief_data.get("previous_concerns", []),
            resolved_issues=brief_data.get("resolved_issues", []),
            suggested_questions=brief_data.get("suggested_questions", []),
            recommended_approach=brief_data.get("recommended_approach", []),
            potential_risks=brief_data.get("potential_risks", []),
            relationship_status_assessment=brief_data.get("relationship_status_assessment", f"Active stage with {contact.company}"),
            recalled_memories_count=len(recalled_memories),
            recalled_memory_excerpts=memory_excerpts,
            memory_powered_badge="Powered by Hindsight Long-Term Memory"
        )

    def learn_from_meeting(
        self,
        meeting_id: int,
        db: Session
    ) -> MeetingLearnResponse:
        """
        Extract knowledge from meeting notes and retain durable memories into Hindsight.
        """
        meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
        if not meeting:
            raise HTTPException(status_code=404, detail=f"Meeting {meeting_id} not found")

        contact = db.query(Contact).filter(Contact.id == meeting.contact_id).first()
        if not contact:
            raise HTTPException(status_code=404, detail=f"Contact {meeting.contact_id} not found")

        # 1. Extract knowledge using Groq
        meeting_date_str = meeting.date.strftime("%Y-%m-%d") if meeting.date else "Recent"
        extracted: ExtractedKnowledge = groq_service.extract_meeting_knowledge(
            contact_name=contact.name,
            company=contact.company,
            role=contact.role,
            meeting_notes=meeting.notes,
            meeting_date=meeting_date_str
        )

        bank_id = contact.hindsight_bank_id
        hindsight_service.ensure_bank(bank_id, name=f"{contact.name} ({contact.company})")

        retained_items: List[str] = []

        # 2. Retain durable memories in Hindsight
        context_str = f"Meeting on {meeting_date_str}: '{meeting.title}' with {contact.name} ({contact.role} at {contact.company})"

        # Collect all durable items to retain
        candidate_items = list(extracted.durable_memories)
        for pref in extracted.preferences:
            pref_content = f"{contact.name}'s communication/workflow preference: {pref}"
            if pref_content not in candidate_items:
                candidate_items.append(pref_content)

        for res_concern in extracted.resolved_concerns:
            res_content = f"Resolved issue with {contact.name}: {res_concern}"
            if res_content not in candidate_items:
                candidate_items.append(res_content)

        if not candidate_items and (extracted.facts or extracted.concerns):
            candidate_items.extend(extracted.facts)
            candidate_items.extend(extracted.concerns)

        for mem in candidate_items:
            hindsight_service.retain_memory(
                bank_id=bank_id,
                content=mem,
                context=context_str,
                tags=["durable_memory", "meeting_note"]
            )
            retained_items.append(mem)

        # 3. Store structured commitments in PostgreSQL
        for comm in extracted.commitments:
            comm_title = comm.get("title") if isinstance(comm, dict) else str(comm)
            comm_owner = comm.get("owner", "user") if isinstance(comm, dict) else "user"
            
            existing = (
                db.query(Commitment)
                .filter(
                    Commitment.contact_id == contact.id,
                    Commitment.title == comm_title,
                    Commitment.status == "open"
                )
                .first()
            )
            if not existing and comm_title:
                db_comm = Commitment(
                    contact_id=contact.id,
                    meeting_id=meeting.id,
                    title=comm_title,
                    owner=comm_owner,
                    status="open"
                )
                db.add(db_comm)

        # 4. If any resolved concerns were noted, mark corresponding open commitments as completed if matching
        if extracted.resolved_concerns:
            for rc in extracted.resolved_concerns:
                rc_lower = rc.lower()
                open_comms = db.query(Commitment).filter(Commitment.contact_id == contact.id, Commitment.status == "open").all()
                for oc in open_comms:
                    if ("pricing" in rc_lower and "pricing" in oc.title.lower()) or ("document" in rc_lower and "document" in oc.title.lower()):
                        oc.status = "completed"
                        oc.completed_at = datetime.now(timezone.utc)

        # Update meeting metadata in DB
        meeting.is_processed = True
        summary_bullets = extracted.durable_memories or extracted.facts or ["Meeting processed and memories learned."]
        meeting.summary = "\n".join([f"• {b}" for b in summary_bullets[:5]])
        db.commit()

        return MeetingLearnResponse(
            meeting_id=meeting.id,
            contact_id=contact.id,
            contact_name=contact.name,
            extracted_knowledge=extracted,
            memories_retained=len(retained_items),
            retained_items=retained_items,
            message=f"Successfully extracted knowledge and retained {len(retained_items)} durable memories in Hindsight bank '{bank_id}'."
        )

    def get_contact_memory_overview(
        self,
        contact_id: int,
        db: Session
    ) -> ContactMemoryOverview:
        """
        Build a comprehensive memory dashboard & timeline for a contact using Hindsight memories
        and PostgreSQL records.
        """
        contact = db.query(Contact).filter(Contact.id == contact_id).first()
        if not contact:
            raise HTTPException(status_code=404, detail=f"Contact {contact_id} not found")

        bank_id = contact.hindsight_bank_id

        # 1. Fetch raw memory units from Hindsight
        raw_memories_data = hindsight_service.list_memories(bank_id=bank_id, limit=100)
        
        facts: List[str] = []
        preferences: List[str] = []
        active_concerns: List[str] = []
        resolved_concerns: List[str] = []
        outcomes: List[str] = []
        raw_items: List[MemoryItem] = []
        timeline: List[TimelineEvent] = []

        for m in raw_memories_data:
            text = m.get("text", "").strip()
            tags = m.get("tags", [])
            item_type = m.get("type", "observation")
            
            raw_items.append(MemoryItem(
                id=m.get("id"),
                text=text,
                type=item_type,
                context=m.get("context"),
                tags=tags,
                timestamp=m.get("timestamp")
            ))

            text_lower = text.lower()
            if "preference" in tags or "prefer" in text_lower:
                if text not in preferences:
                    preferences.append(text)
            elif "resolution" in tags or "resolved" in text_lower or "no longer" in text_lower:
                if text not in resolved_concerns:
                    resolved_concerns.append(text)
            elif "concern" in tags or "pricing concern" in text_lower or "security" in text_lower or "blocker" in text_lower:
                if text not in active_concerns and not any(r.lower() in text_lower for r in resolved_concerns):
                    active_concerns.append(text)
            elif "outcome" in tags or "decision" in text_lower:
                if text not in outcomes:
                    outcomes.append(text)
            else:
                if text not in facts:
                    facts.append(text)

        # 2. Fetch commitments from PostgreSQL
        commitments_db = db.query(Commitment).filter(Commitment.contact_id == contact_id).all()
        commitments_data = [
            {
                "id": c.id,
                "title": c.title,
                "owner": c.owner,
                "status": c.status,
                "created_at": c.created_at.isoformat() if c.created_at else None
            }
            for c in commitments_db
        ]

        # 3. Build chronological timeline
        meetings = (
            db.query(Meeting)
            .filter(Meeting.contact_id == contact_id)
            .order_by(Meeting.date.asc())
            .all()
        )
        for m in meetings:
            timeline.append(TimelineEvent(
                id=f"meeting-{m.id}",
                date=m.date.strftime("%b %d, %Y") if m.date else "Recent",
                title=m.title,
                description=m.summary or (m.notes[:120] + "..." if len(m.notes) > 120 else m.notes),
                category="milestone",
                meeting_id=m.id
            ))

        # Add memory milestones to timeline
        for idx, item in enumerate(raw_items[:8]):
            cat = "fact"
            if "preference" in item.tags or "prefer" in item.text.lower():
                cat = "preference"
            elif "resolution" in item.tags or "resolved" in item.text.lower():
                cat = "resolution"
            elif "concern" in item.tags or "security" in item.text.lower():
                cat = "concern"

            timeline.append(TimelineEvent(
                id=f"mem-{item.id or idx}",
                date=item.timestamp[:10] if item.timestamp and len(item.timestamp) >= 10 else "Recorded",
                title=f"Learned: {cat.capitalize()}",
                description=item.text,
                category=cat
            ))

        return ContactMemoryOverview(
            contact_id=contact.id,
            contact_name=contact.name,
            company=contact.company,
            hindsight_bank_id=bank_id,
            total_memories=len(raw_items),
            facts=facts,
            preferences=preferences,
            active_concerns=active_concerns,
            resolved_concerns=resolved_concerns,
            commitments=commitments_data,
            outcomes=outcomes,
            timeline=timeline,
            raw_memories=raw_items
        )


preparation_service = PreparationService()
