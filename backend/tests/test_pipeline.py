import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.contact import Contact
from app.models.meeting import Meeting
from app.models.commitment import Commitment
from app.services.preparation_service import preparation_service
from app.services.groq_service import groq_service
from app.schemas.preparation import PrepareRequest


@pytest.fixture
def db_session():
    # Use in-memory SQLite for testing
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_sarah_johnson_learning_pipeline(db_session):
    # 1. Create Contact: Sarah Johnson
    contact = Contact(
        name="Sarah Johnson",
        company="Acme Corporation",
        role="VP of Technology",
        hindsight_bank_id="contact_sarah_johnson_test"
    )
    db_session.add(contact)
    db_session.commit()
    db_session.refresh(contact)

    # 2. Add Meeting 1: Pricing Concern
    m1 = Meeting(
        contact_id=contact.id,
        title="Initial Discovery & Analytics Platform Overview",
        notes="Sarah is interested in our analytics platform but is concerned about enterprise pricing. I promised to send the enterprise pricing document."
    )
    db_session.add(m1)
    db_session.commit()
    db_session.refresh(m1)

    # Learn from Meeting 1
    learn1 = preparation_service.learn_from_meeting(meeting_id=m1.id, db=db_session)
    assert learn1.contact_name == "Sarah Johnson"
    assert len(learn1.retained_items) > 0

    # Verify commitment was recorded
    comms = db_session.query(Commitment).filter(Commitment.contact_id == contact.id).all()
    assert len(comms) >= 1

    # 3. Add Meeting 2: Pricing Resolved, SOC 2 Security Requested
    m2 = Meeting(
        contact_id=contact.id,
        title="Follow-up Review & Security Discussion",
        notes="Sarah reviewed the pricing document. Pricing is no longer the main concern. Her security team now needs SOC 2 documentation. I promised to send it."
    )
    db_session.add(m2)
    db_session.commit()
    db_session.refresh(m2)

    # Learn from Meeting 2
    learn2 = preparation_service.learn_from_meeting(meeting_id=m2.id, db=db_session)
    assert learn2.contact_id == contact.id
    assert len(learn2.retained_items) > 0

    # 4. Prepare Meeting 3
    brief = preparation_service.prepare_meeting(
        contact_id=contact.id,
        req=PrepareRequest(custom_goal="Close technical and security alignment"),
        db=db_session
    )

    assert brief.contact_name == "Sarah Johnson"
    assert brief.company == "Acme Corporation"
    assert brief.meeting_objective is not None
    assert len(brief.suggested_questions) > 0
    assert len(brief.recommended_approach) > 0
    assert brief.memory_powered_badge == "Powered by Hindsight Long-Term Memory"
