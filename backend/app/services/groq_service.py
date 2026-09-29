import json
import re
from typing import Dict, Any, List, Optional
from groq import Groq
from app.config import settings
from app.utils.logger import logger
from app.schemas.meeting import ExtractedKnowledge


class GroqService:
    """
    Service for LLM interactions using Groq.
    Handles knowledge extraction and meeting preparation brief generation.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key if api_key is not None else settings.GROQ_API_KEY
        self.model = model or settings.GROQ_MODEL
        self.fallback_model = settings.GROQ_FALLBACK_MODEL
        self._client: Optional[Groq] = None
        self._initialize_client()

    def _initialize_client(self):
        if self.api_key:
            try:
                self._client = Groq(api_key=self.api_key)
                logger.info("Groq client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {str(e)}")
                self._client = None
        else:
            logger.warning("Groq API key not set in environment")
            self._client = None

    @property
    def client(self) -> Optional[Groq]:
        if self._client is None and self.api_key:
            self._initialize_client()
        return self._client

    def _clean_json_text(self, text: str) -> str:
        """Extract and clean JSON content from model output."""
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        start_idx = text.find("{")
        end_idx = text.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            text = text[start_idx : end_idx + 1]

        text = re.sub(r",\s*([}\]])", r"\1", text)
        return text

    def extract_meeting_knowledge(
        self,
        contact_name: str,
        company: str,
        role: str,
        meeting_notes: str,
        meeting_date: str = "Today"
    ) -> ExtractedKnowledge:
        """
        Extract structured knowledge items from raw meeting notes.
        """
        system_prompt = (
            "You are an expert AI meeting analyst for PrepPilot AI. Your job is to extract high-value, "
            "durable knowledge from meeting notes with a business contact.\n"
            "You must return ONLY a valid JSON object with the following schema:\n"
            "{\n"
            '  "facts": ["list of concrete facts learned about contact, company, team, or stack"],\n'
            '  "preferences": ["list of explicit or implicit preferences, communication styles, or workflow habits"],\n'
            '  "concerns": ["list of active concerns, objections, doubts, or friction points expressed"],\n'
            '  "commitments": [{"title": "description of commitment", "owner": "user" or "contact"}],\n'
            '  "outcomes": ["list of decisions, milestones, or agreements reached in this meeting"],\n'
            '  "resolved_concerns": ["list of concerns previously active that are now explicitly resolved or no longer an issue"],\n'
            '  "durable_memories": ["concise, high-density declarative sentences ready to store into long-term agent memory"]\n'
            "}\n"
            "CRITICAL RULES:\n"
            "1. Be precise and avoid vague fluff.\n"
            "2. Distinguish between brand new concerns vs concerns that got resolved.\n"
            "3. Commitments must specify whether the 'user' promised it or the 'contact' promised it.\n"
            "4. Return strictly valid JSON."
        )

        user_content = (
            f"Contact: {contact_name}\n"
            f"Company: {company}\n"
            f"Role: {role}\n"
            f"Meeting Date: {meeting_date}\n\n"
            f"Meeting Notes:\n{meeting_notes}"
        )

        if not self.client:
            logger.warning("Groq client not available, returning heuristic extraction")
            return self._heuristic_extraction(contact_name, meeting_notes)

        try:
            response = self._call_groq(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.1
            )
            clean_json = self._clean_json_text(response)
            parsed = json.loads(clean_json)
            
            commitments = []
            for item in parsed.get("commitments", []):
                if isinstance(item, dict):
                    commitments.append({
                        "title": str(item.get("title", "")),
                        "owner": str(item.get("owner", "user")).lower()
                    })
                elif isinstance(item, str):
                    owner = "user" if "i promised" in item.lower() or "user" in item.lower() else "contact"
                    commitments.append({"title": item, "owner": owner})

            return ExtractedKnowledge(
                facts=[str(f) for f in parsed.get("facts", []) if f],
                preferences=[str(p) for p in parsed.get("preferences", []) if p],
                concerns=[str(c) for c in parsed.get("concerns", []) if c],
                commitments=commitments,
                outcomes=[str(o) for o in parsed.get("outcomes", []) if o],
                resolved_concerns=[str(r) for r in parsed.get("resolved_concerns", []) if r],
                durable_memories=[str(m) for m in parsed.get("durable_memories", []) if m]
            )
        except Exception as e:
            logger.error(f"Error extracting knowledge with Groq: {str(e)}")
            return self._heuristic_extraction(contact_name, meeting_notes)

    def generate_preparation_brief(
        self,
        contact_name: str,
        company: str,
        role: str,
        custom_goal: Optional[str],
        meeting_type: str,
        recalled_memories: List[Dict[str, Any]],
        structured_meetings: List[Dict[str, Any]],
        open_commitments: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Synthesize an executive meeting preparation brief by combining recalled Hindsight memories
        with structured application context.
        """
        system_prompt = (
            "You are PrepPilot AI, the premier memory-powered meeting preparation agent.\n"
            "You will be given historical long-term memories recalled from Hindsight and previous meeting records.\n"
            "Your objective is to produce a high-impact, highly personalized pre-meeting briefing that demonstrates deep memory of past interactions.\n\n"
            "Return ONLY a valid JSON object matching this schema:\n"
            "{\n"
            '  "meeting_objective": "A clear, strategic 1-2 sentence goal for this specific meeting",\n'
            '  "important_history": ["3-5 bullet points summarizing key relationship milestones & context"],\n'
            '  "open_commitments": [{"title": "commitment description", "owner": "user" or "contact"}],\n'
            '  "previous_concerns": ["list of previous or active concerns to keep in mind"],\n'
            '  "resolved_issues": ["list of past concerns that were successfully resolved"],\n'
            '  "suggested_questions": ["3-4 sharp, tailored questions acknowledging past discussions"],\n'
            '  "recommended_approach": ["3-4 tactical recommendations on tone, pacing, or handling based on their preferences"],\n'
            '  "potential_risks": ["2-3 specific pitfalls or sensitive topics to avoid"],\n'
            '  "relationship_status_assessment": "1 sentence summarizing where the relationship currently stands"\n'
            "}\n"
            "CRITICAL RULES:\n"
            "1. ADAPT TO REMEMBERED PREFERENCES: If memory indicates the contact prefers technical info before commercials, explicitly reflect that in the recommended approach.\n"
            "2. HIGHLIGHT RESOLVED VS ACTIVE CONCERNS: Clearly separate issues that are done from remaining blockers.\n"
            "3. BE ACTIONABLE: No generic advice. Reference specifics like pricing, SOC 2, analytics, etc.\n"
            "4. Return strictly valid JSON."
        )

        memories_text = "\n".join([
            f"- [{m.get('type', 'memory')}] {m.get('text')} (Context: {m.get('context', 'N/A')})"
            for m in recalled_memories
        ]) if recalled_memories else "No previous memories found in Hindsight bank."

        commitments_text = "\n".join([
            f"- [{c.get('owner', 'user').upper()}] {c.get('title')} (Status: {c.get('status', 'open')})"
            for c in open_commitments
        ]) if open_commitments else "No open commitments recorded."

        user_content = (
            f"TARGET CONTACT:\n"
            f"Name: {contact_name}\n"
            f"Company: {company}\n"
            f"Role: {role}\n"
            f"Meeting Type: {meeting_type}\n"
            f"User's Goal: {custom_goal or 'General preparation and next-steps progression'}\n\n"
            f"LONG-TERM MEMORIES (Recalled from Hindsight):\n{memories_text}\n\n"
            f"RECORDED OPEN COMMITMENTS:\n{commitments_text}\n\n"
            f"RECENT MEETINGS COUNT: {len(structured_meetings)}"
        )

        if not self.client:
            logger.warning("Groq client not available, returning heuristic preparation brief")
            return self._heuristic_preparation(contact_name, company, role, custom_goal, recalled_memories, open_commitments)

        try:
            response = self._call_groq(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.2
            )
            clean_json = self._clean_json_text(response)
            parsed = json.loads(clean_json)
            return parsed
        except Exception as e:
            logger.error(f"Error generating brief with Groq: {str(e)}")
            return self._heuristic_preparation(contact_name, company, role, custom_goal, recalled_memories, open_commitments)

    def _call_groq(self, messages: List[Dict[str, str]], temperature: float = 0.1) -> str:
        """Helper to invoke Groq with model fallback and error handling."""
        models_to_try = [self.model, self.fallback_model, "llama-3.1-8b-instant"]
        last_error = None

        for model in models_to_try:
            try:
                logger.info(f"Invoking Groq with model: {model}")
                completion = self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=2048,
                    response_format={"type": "json_object"}
                )
                return completion.choices[0].message.content
            except Exception as e:
                logger.warning(f"Groq invocation failed with model '{model}': {str(e)}")
                last_error = e

        raise last_error or RuntimeError("All Groq models failed")

    def _heuristic_extraction(self, contact_name: str, notes: str) -> ExtractedKnowledge:
        """Graceful fallback heuristic extraction if LLM is unreachable."""
        facts = []
        preferences = []
        concerns = []
        commitments = []
        outcomes = []
        resolved_concerns = []
        durable_memories = []

        # Split on sentence boundaries and lines
        raw_clauses = re.split(r"[.\n]+", notes)
        clauses = [c.strip() for c in raw_clauses if c.strip()]

        for clause in clauses:
            clause_lower = clause.lower()
            if "prefer" in clause_lower:
                preferences.append(clause)
                durable_memories.append(f"{contact_name}'s preference: {clause}")
            
            if "promise" in clause_lower or "will send" in clause_lower or "agreed to send" in clause_lower or "action" in clause_lower:
                owner = "user" if any(w in clause_lower for w in ["i promised", "i will", "user", "we will"]) else "contact"
                commitments.append({"title": clause, "owner": owner})
                durable_memories.append(f"Commitment: {clause}")

            if "concern" in clause_lower or "worried" in clause_lower or "pricing" in clause_lower or "security" in clause_lower or "soc 2" in clause_lower or "blocker" in clause_lower:
                if "no longer" in clause_lower or "resolved" in clause_lower:
                    resolved_concerns.append(clause)
                    durable_memories.append(f"Resolved issue: {clause}")
                else:
                    concerns.append(clause)
                    durable_memories.append(f"Active concern: {clause}")

            if "interest" in clause_lower or "evaluated" in clause_lower or "agreed" in clause_lower or "decision" in clause_lower:
                facts.append(clause)
                durable_memories.append(f"Fact: {clause}")

        if not durable_memories and clauses:
            durable_memories.append(f"Meeting note with {contact_name}: {clauses[0]}")

        return ExtractedKnowledge(
            facts=facts[:5],
            preferences=preferences,
            concerns=concerns,
            commitments=commitments,
            outcomes=outcomes,
            resolved_concerns=resolved_concerns,
            durable_memories=durable_memories[:6]
        )

    def _heuristic_preparation(
        self,
        contact_name: str,
        company: str,
        role: str,
        custom_goal: Optional[str],
        recalled_memories: List[Dict[str, Any]],
        open_commitments: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Graceful fallback heuristic preparation if LLM is unreachable."""
        has_pricing_res = any("pricing" in str(m.get("text", "")).lower() and ("resolved" in str(m.get("text", "")).lower() or "no longer" in str(m.get("text", "")).lower()) for m in recalled_memories)
        has_security = any("security" in str(m.get("text", "")).lower() or "soc 2" in str(m.get("text", "")).lower() for m in recalled_memories)
        has_tech_pref = any("technical" in str(m.get("text", "")).lower() and "prefer" in str(m.get("text", "")).lower() for m in recalled_memories)

        approach = [
            f"Tailor discussion directly to {contact_name}'s known requirements at {company}."
        ]
        if has_tech_pref:
            approach.append("Lead with technical architecture and security documentation prior to commercial discussions.")
        else:
            approach.append("Maintain a balanced conversation covering technical capabilities and business value.")

        return {
            "meeting_objective": custom_goal or f"Advance the partnership with {contact_name} ({company}) by confirming technical fit and addressing open items.",
            "important_history": [
                f"Engaged in discussions with {contact_name} ({role}) regarding solution capabilities.",
                f"Prior interactions established key operational priorities and security requirements."
            ],
            "open_commitments": open_commitments,
            "previous_concerns": ["Security review & SOC 2 compliance verification"] if has_security else ["Enterprise alignment"],
            "resolved_issues": ["Enterprise pricing concern resolved after discount review"] if has_pricing_res else [],
            "suggested_questions": [
                "How has the security team's review of our SOC 2 report progressed?",
                "Are there additional technical stakeholders we should include in this evaluation?",
                "What is the projected timeline for your internal sign-off process?"
            ],
            "recommended_approach": approach,
            "potential_risks": [
                "Do not jump directly to commercial discussions without first confirming technical verification.",
                "Ensure all promised compliance documentation is readily available."
            ],
            "relationship_status_assessment": f"Active evaluation stage with {company}."
        }


groq_service = GroqService()
