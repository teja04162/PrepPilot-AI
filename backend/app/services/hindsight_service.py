import asyncio
import concurrent.futures
from typing import List, Dict, Any, Optional
from datetime import datetime
import hindsight_client
from hindsight_client import Hindsight
from app.config import settings
from app.utils.logger import logger


def _run_coroutine_in_thread(coro_fn, *args, **kwargs):
    """
    Execute an async coroutine safely inside a fresh dedicated event loop thread.
    Prevents event loop conflicts in FastAPI and Pytest execution contexts.
    """
    def _worker():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(coro_fn(*args, **kwargs))
        finally:
            try:
                loop.run_until_complete(loop.shutdown_asyncgens())
            except Exception:
                pass
            loop.close()

    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(_worker)
        return future.result(timeout=25)


class HindsightService:
    """
    Dedicated Hindsight Service wrapping the official Vectorize Hindsight SDK.
    Manages long-term biomimetic memory banks for contacts.
    """

    def __init__(self, base_url: Optional[str] = None, api_key: Optional[str] = None):
        self.base_url = (base_url or settings.HINDSIGHT_BASE_URL).rstrip("/")
        self.api_key = api_key if api_key is not None else settings.HINDSIGHT_API_KEY
        self._client: Optional[Hindsight] = None
        self._initialize_client()

    def _initialize_client(self):
        """Instantiate the official Hindsight SDK client."""
        try:
            self._client = Hindsight(
                base_url=self.base_url,
                api_key=self.api_key if self.api_key else None,
                timeout=15.0
            )
            logger.info(f"Hindsight client initialized with base_url={self.base_url}")
        except Exception as e:
            logger.error(f"Failed to initialize Hindsight client: {str(e)}")
            self._client = None

    @property
    def client(self) -> Hindsight:
        if self._client is None:
            self._initialize_client()
        return self._client

    def ensure_bank(self, bank_id: str, name: Optional[str] = None, mission: Optional[str] = None) -> bool:
        """Ensure a memory bank exists for a contact."""
        try:
            bank_name = name or f"Memory Bank for {bank_id}"
            bank_mission = mission or "Remember professional interactions, relationship context, concerns, and commitments."
            
            _run_coroutine_in_thread(
                self.client.acreate_bank,
                bank_id=bank_id,
                name=bank_name,
                mission=bank_mission
            )
            logger.info(f"Created/verified Hindsight bank: {bank_id}")
            return True
        except Exception as e:
            logger.debug(f"Bank note for {bank_id}: {str(e)}")
            return True

    def retain_memory(
        self,
        bank_id: str,
        content: str,
        context: Optional[str] = None,
        tags: Optional[List[str]] = None,
        document_id: Optional[str] = None,
        metadata: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Retain new durable knowledge into a contact's Hindsight memory bank.
        """
        if not content or not content.strip():
            logger.warning(f"Empty content passed to retain_memory for bank {bank_id}")
            return {"status": "skipped", "reason": "empty content"}

        try:
            logger.info(f"Retaining memory in Hindsight bank='{bank_id}', tags={tags}")
            item = {
                "content": content.strip(),
                "context": context,
                "tags": tags or [],
                "document_id": document_id,
                "metadata": metadata or {}
            }
            
            res = _run_coroutine_in_thread(
                self.client.aretain_batch,
                bank_id=bank_id,
                items=[item],
                document_id=document_id
            )
            
            resp_dict = res.to_dict() if hasattr(res, "to_dict") else res.dict() if hasattr(res, "dict") else {}
            logger.info(f"Successfully retained memory in Hindsight bank='{bank_id}'")
            return {
                "status": "success",
                "bank_id": bank_id,
                "data": resp_dict
            }
        except Exception as e:
            logger.error(f"Error retaining memory in Hindsight bank {bank_id}: {str(e)}")
            return {
                "status": "error",
                "bank_id": bank_id,
                "error": str(e),
                "content": content
            }

    def recall_memory(
        self,
        bank_id: str,
        query: str,
        max_tokens: int = 4096,
        budget: str = "mid",
        types: Optional[List[str]] = None,
        tags: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Recall relevant historical memories from Hindsight using multi-strategy search
        (TEMPR: vector, keyword, graph, temporal).
        """
        try:
            logger.info(f"Recalling memories from Hindsight bank='{bank_id}', query='{query}'")
            res = _run_coroutine_in_thread(
                self.client.arecall,
                bank_id=bank_id,
                query=query,
                max_tokens=max_tokens,
                budget=budget,
                types=types,
                tags=tags
            )
            
            results = []
            if hasattr(res, "results") and res.results:
                for item in res.results:
                    item_dict = {
                        "id": getattr(item, "id", None),
                        "text": getattr(item, "text", ""),
                        "type": getattr(item, "type", "observation"),
                        "context": getattr(item, "context", None),
                        "tags": getattr(item, "tags", []) or [],
                        "timestamp": str(getattr(item, "occurred_start", None) or getattr(item, "mentioned_at", "")),
                        "scores": getattr(item, "scores", {}) or {}
                    }
                    results.append(item_dict)
            
            logger.info(f"Recalled {len(results)} memory units from Hindsight bank='{bank_id}'")
            return results
        except Exception as e:
            logger.warning(f"Error recalling memories from Hindsight bank {bank_id}: {str(e)}")
            return []

    def list_memories(
        self,
        bank_id: str,
        limit: int = 100,
        mem_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        List stored memory units in the Hindsight memory bank for timeline / inspection.
        """
        try:
            res = _run_coroutine_in_thread(
                self.client.alist_memories,
                bank_id=bank_id,
                limit=limit,
                type=mem_type
            )
            
            memories = []
            if hasattr(res, "items") and res.items:
                for item in res.items:
                    mem_dict = {
                        "id": getattr(item, "id", None),
                        "text": getattr(item, "text", ""),
                        "type": getattr(item, "type", "observation"),
                        "context": getattr(item, "context", None),
                        "tags": getattr(item, "tags", []) or [],
                        "timestamp": str(getattr(item, "occurred_start", None) or getattr(item, "created_at", "")),
                        "metadata": getattr(item, "metadata", {}) or {}
                    }
                    memories.append(mem_dict)
            return memories
        except Exception as e:
            logger.debug(f"Error listing memories from Hindsight bank {bank_id}: {str(e)}")
            return []

    def reflect(self, bank_id: str, query: str, budget: str = "low") -> Optional[str]:
        """
        Perform reflective reasoning over stored memories in Hindsight.
        """
        try:
            res = _run_coroutine_in_thread(
                self.client.areflect,
                bank_id=bank_id,
                query=query,
                budget=budget
            )
            if hasattr(res, "response") and res.response:
                return res.response
            elif hasattr(res, "text") and res.text:
                return res.text
            return str(res)
        except Exception as e:
            logger.warning(f"Error in Hindsight reflect for bank {bank_id}: {str(e)}")
            return None

    def delete_bank(self, bank_id: str) -> bool:
        """Delete a Hindsight memory bank (for demo reset or cleanup)."""
        try:
            _run_coroutine_in_thread(self.client.adelete_bank, bank_id=bank_id)
            logger.info(f"Deleted Hindsight bank: {bank_id}")
            return True
        except Exception as e:
            logger.debug(f"Error deleting Hindsight bank {bank_id}: {str(e)}")
            return False


hindsight_service = HindsightService()
