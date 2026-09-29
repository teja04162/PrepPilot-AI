from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    date = Column(DateTime, nullable=False, default=utc_now)
    location = Column(String(255), default="Google Meet / Virtual")
    notes = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    is_processed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    contact = relationship("Contact", back_populates="meetings")
    commitments = relationship("Commitment", back_populates="meeting", cascade="all, delete-orphan")
