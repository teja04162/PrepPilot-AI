from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False, index=True)
    role = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(100), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    relationship_status = Column(String(100), default="Active Prospect")
    hindsight_bank_id = Column(String(255), unique=True, index=True, nullable=False)
    
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    meetings = relationship("Meeting", back_populates="contact", cascade="all, delete-orphan", order_by="desc(Meeting.date)")
    commitments = relationship("Commitment", back_populates="contact", cascade="all, delete-orphan")
