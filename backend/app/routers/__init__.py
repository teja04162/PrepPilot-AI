from app.routers.contacts import router as contacts_router
from app.routers.meetings import router as meetings_router
from app.routers.prepare import router as prepare_router
from app.routers.memory import router as memory_router
from app.routers.demo import router as demo_router

__all__ = ["contacts_router", "meetings_router", "prepare_router", "memory_router", "demo_router"]
