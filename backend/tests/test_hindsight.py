import pytest
from app.services.hindsight_service import HindsightService


def test_hindsight_service_init():
    service = HindsightService(base_url="https://api.hindsight.vectorize.io", api_key="test_key")
    assert service.base_url == "https://api.hindsight.vectorize.io"
    assert service.api_key == "test_key"
    assert service.client is not None


def test_hindsight_empty_content_handling():
    service = HindsightService(base_url="https://api.hindsight.vectorize.io", api_key="test_key")
    result = service.retain_memory(bank_id="test_bank", content="   ")
    assert result["status"] == "skipped"
    assert result["reason"] == "empty content"
