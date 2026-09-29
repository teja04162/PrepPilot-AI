from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.routers import contacts_router, meetings_router, prepare_router, memory_router, demo_router
from app.utils.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up PrepPilot AI backend...")
    init_db()
    logger.info("Database initialized successfully.")
    yield
    logger.info("Shutting down PrepPilot AI backend...")


app = FastAPI(
    title="PrepPilot AI — Memory-Powered Meeting Preparation Agent",
    description="Production-grade AI meeting prep agent with persistent long-term memory powered by Hindsight (Vectorize) and Groq.",
    version=settings.VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(contacts_router)
app.include_router(meetings_router)
app.include_router(prepare_router)
app.include_router(memory_router)
app.include_router(demo_router)


@app.get("/")
def root():
    return {
        "name": "PrepPilot AI API",
        "status": "online",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "hindsight_layer": "active"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "hindsight_base_url": settings.HINDSIGHT_BASE_URL,
        "groq_model": settings.GROQ_MODEL
    }
