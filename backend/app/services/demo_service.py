from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.contact import Contact
from app.models.meeting import Meeting
from app.models.commitment import Commitment
from app.services.hindsight_service import hindsight_service
from app.utils.logger import logger


def seed_demo_data(db: Session) -> dict:
    """
    Seed realistic demonstration data, including Sarah Johnson (Acme Corporation)
    and 4 other enterprise contacts, retaining durable memories into Hindsight.
    """
    logger.info("Starting demo database and Hindsight memory seeding...")

    # Clear existing data
    db.query(Commitment).delete()
    db.query(Meeting).delete()
    db.query(Contact).delete()
    db.commit()

    now = datetime.now(timezone.utc)

    # -------------------------------------------------------------
    # 1. Primary Demo Contact: Sarah Johnson (Acme Corporation)
    # -------------------------------------------------------------
    sarah = Contact(
        name="Sarah Johnson",
        company="Acme Corporation",
        role="VP of Technology",
        email="sarah.johnson@acmecorp.com",
        phone="+1 (555) 234-8901",
        avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        relationship_status="Security Review Phase",
        hindsight_bank_id="contact_sarah_johnson"
    )
    db.add(sarah)
    db.flush()

    # Create Hindsight bank
    hindsight_service.ensure_bank(
        sarah.hindsight_bank_id,
        name="Sarah Johnson (Acme Corp)",
        mission="Track enterprise sales cycle, technical requirements, pricing resolutions, and SOC 2 security compliance."
    )

    # Meeting 1: Discovery & Pricing Concern
    m1_date = now - timedelta(days=14)
    m1 = Meeting(
        contact_id=sarah.id,
        title="Initial Discovery & Analytics Platform Overview",
        date=m1_date,
        location="Zoom Video Conference",
        notes="Sarah is interested in our analytics platform but is concerned about enterprise pricing. I promised to send the enterprise pricing document.",
        summary="• Sarah showed strong interest in the analytics platform.\n• Raised concern regarding enterprise tier pricing.\n• Action Item: Send enterprise pricing breakdown.",
        is_processed=True
    )
    db.add(m1)

    c1 = Commitment(
        contact_id=sarah.id,
        meeting_id=m1.id,
        title="Send enterprise pricing document with volume discount tiers",
        owner="user",
        status="completed",
        due_date=m1_date + timedelta(days=2),
        completed_at=m1_date + timedelta(days=1)
    )
    db.add(c1)

    # Retain Meeting 1 memories in Hindsight
    try:
        hindsight_service.retain_memory(
            bank_id=sarah.hindsight_bank_id,
            content="Sarah Johnson is VP of Technology at Acme Corporation, evaluating our analytics platform.",
            context=f"Meeting on {m1_date.strftime('%Y-%m-%d')}: Initial Discovery",
            tags=["fact", "stakeholder"]
        )
        hindsight_service.retain_memory(
            bank_id=sarah.hindsight_bank_id,
            content="Sarah expressed concerns regarding enterprise pricing tiers.",
            context=f"Meeting on {m1_date.strftime('%Y-%m-%d')}: Initial Discovery",
            tags=["concern", "pricing"]
        )
        hindsight_service.retain_memory(
            bank_id=sarah.hindsight_bank_id,
            content="User promised to send detailed enterprise pricing document to Sarah.",
            context=f"Meeting on {m1_date.strftime('%Y-%m-%d')}: Initial Discovery",
            tags=["commitment", "pricing"]
        )
    except Exception as e:
        logger.warning(f"Error retaining Sarah M1 memories in Hindsight: {str(e)}")

    # Meeting 2: Pricing Resolved, SOC 2 Security Review
    m2_date = now - timedelta(days=7)
    m2 = Meeting(
        contact_id=sarah.id,
        title="Follow-up Review & Security Compliance Discussion",
        date=m2_date,
        location="Google Meet",
        notes="Sarah reviewed the pricing document. Pricing is no longer the main concern. Her security team now needs SOC 2 documentation. I promised to send it.",
        summary="• Pricing concern resolved after review of discount tiers.\n• Security review is now the primary blocker.\n• Sarah's team requires SOC 2 Type II report.",
        is_processed=True
    )
    db.add(m2)

    c2 = Commitment(
        contact_id=sarah.id,
        meeting_id=m2.id,
        title="Send SOC 2 Type II compliance package and security whitepaper",
        owner="user",
        status="open",
        due_date=now + timedelta(days=1)
    )
    db.add(c2)

    # Retain Meeting 2 memories in Hindsight
    try:
        hindsight_service.retain_memory(
            bank_id=sarah.hindsight_bank_id,
            content="Pricing is no longer an issue for Sarah Johnson; pricing concern was successfully resolved.",
            context=f"Meeting on {m2_date.strftime('%Y-%m-%d')}: Follow-up Review",
            tags=["resolution", "pricing"]
        )
        hindsight_service.retain_memory(
            bank_id=sarah.hindsight_bank_id,
            content="Acme Corporation security team participates in the vendor review and requires SOC 2 documentation.",
            context=f"Meeting on {m2_date.strftime('%Y-%m-%d')}: Follow-up Review",
            tags=["concern", "security", "compliance"]
        )
        hindsight_service.retain_memory(
            bank_id=sarah.hindsight_bank_id,
            content="User promised to deliver SOC 2 documentation for Acme's internal security team review.",
            context=f"Meeting on {m2_date.strftime('%Y-%m-%d')}: Follow-up Review",
            tags=["commitment", "security"]
        )
    except Exception as e:
        logger.warning(f"Error retaining Sarah M2 memories in Hindsight: {str(e)}")

    # -------------------------------------------------------------
    # 2. Contact: David Chen (FinTech Horizon)
    # -------------------------------------------------------------
    david = Contact(
        name="David Chen",
        company="FinTech Horizon",
        role="Chief Risk Officer",
        email="david.chen@fintechhorizon.io",
        phone="+1 (555) 345-6789",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        relationship_status="Compliance Review",
        hindsight_bank_id="contact_david_chen"
    )
    db.add(david)
    db.flush()

    hindsight_service.ensure_bank(david.hindsight_bank_id, name="David Chen (FinTech Horizon)")
    
    m_david = Meeting(
        contact_id=david.id,
        title="Risk & Regulatory Compliance Assessment",
        date=now - timedelta(days=10),
        notes="David emphasized strict adherence to SEC and FINRA audit trail rules. Prefers async written documentation rather than sales slide presentations.",
        summary="• FINRA/SEC auditability is non-negotiable.\n• Preference: written executive briefs over slides.",
        is_processed=True
    )
    db.add(m_david)
    try:
        hindsight_service.retain_memory(
            bank_id=david.hindsight_bank_id,
            content="David Chen prefers concise written executive memos and technical documentation over slide decks.",
            context="Meeting on Regulatory Assessment",
            tags=["preference", "communication"]
        )
        hindsight_service.retain_memory(
            bank_id=david.hindsight_bank_id,
            content="FinTech Horizon requires immutable audit trail logging for SEC compliance.",
            context="Meeting on Regulatory Assessment",
            tags=["concern", "compliance"]
        )
    except Exception as e:
        logger.warning(f"Error retaining David Chen memories: {str(e)}")

    # -------------------------------------------------------------
    # 3. Contact: Elena Rodriguez (CloudScale Systems)
    # -------------------------------------------------------------
    elena = Contact(
        name="Elena Rodriguez",
        company="CloudScale Systems",
        role="VP of Engineering",
        email="elena.r@cloudscale.net",
        phone="+1 (555) 456-7890",
        avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        relationship_status="POC in Progress",
        hindsight_bank_id="contact_elena_rodriguez"
    )
    db.add(elena)
    db.flush()

    hindsight_service.ensure_bank(elena.hindsight_bank_id, name="Elena Rodriguez (CloudScale)")
    
    m_elena = Meeting(
        contact_id=elena.id,
        title="Kubernetes Integration Architecture Deep Dive",
        date=now - timedelta(days=5),
        notes="Elena confirmed interest in multi-cluster Kubernetes deployment. Wants benchmark latency numbers under 15ms. I committed to sending our Terraform scripts.",
        summary="• Multi-cluster Kubernetes architecture validated.\n• Hard SLA: <15ms latency.\n• Action: Send Terraform deployment repo.",
        is_processed=True
    )
    db.add(m_elena)
    db.add(Commitment(
        contact_id=elena.id,
        meeting_id=m_elena.id,
        title="Share GitHub Terraform repository for automated Helm deployment",
        owner="user",
        status="open"
    ))
    try:
        hindsight_service.retain_memory(
            bank_id=elena.hindsight_bank_id,
            content="Elena requires multi-cluster Kubernetes Helm chart deployment scripts.",
            context="Architecture Deep Dive",
            tags=["fact", "infrastructure"]
        )
        hindsight_service.retain_memory(
            bank_id=elena.hindsight_bank_id,
            content="CloudScale Systems enforces strict latency requirements under 15ms for production workloads.",
            context="Architecture Deep Dive",
            tags=["concern", "performance"]
        )
    except Exception as e:
        logger.warning(f"Error retaining Elena memories: {str(e)}")

    # -------------------------------------------------------------
    # 4. Contact: Marcus Vance (Apex Health Tech)
    # -------------------------------------------------------------
    marcus = Contact(
        name="Marcus Vance",
        company="Apex Health Tech",
        role="Director of Information Security",
        email="marcus.vance@apexhealth.com",
        phone="+1 (555) 567-8901",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        relationship_status="BAA Contract Review",
        hindsight_bank_id="contact_marcus_vance"
    )
    db.add(marcus)
    db.flush()

    hindsight_service.ensure_bank(marcus.hindsight_bank_id, name="Marcus Vance (Apex Health)")
    
    m_marcus = Meeting(
        contact_id=marcus.id,
        title="HIPAA & BAA Legal Terms Alignment",
        date=now - timedelta(days=8),
        notes="Marcus reviewed our standard Business Associate Agreement (BAA). Requested custom indemnification clause for PHI encryption at rest. Marcus promised to return redlines by Friday.",
        summary="• BAA review underway.\n• Custom PHI indemnification clause requested.\n• Marcus will send redlines.",
        is_processed=True
    )
    db.add(m_marcus)
    db.add(Commitment(
        contact_id=marcus.id,
        meeting_id=m_marcus.id,
        title="Send BAA contract redlines with PHI encryption clauses",
        owner="contact",
        status="open"
    ))
    try:
        hindsight_service.retain_memory(
            bank_id=marcus.hindsight_bank_id,
            content="Apex Health Tech requires signed HIPAA BAA with PHI data encryption at rest.",
            context="HIPAA Alignment Meeting",
            tags=["concern", "compliance", "hipaa"]
        )
    except Exception as e:
        logger.warning(f"Error retaining Marcus memories: {str(e)}")

    # -------------------------------------------------------------
    # 5. Contact: Aisha Patel (NextGen Retail)
    # -------------------------------------------------------------
    aisha = Contact(
        name="Aisha Patel",
        company="NextGen Retail",
        role="Head of Product",
        email="aisha.patel@nextgenretail.co",
        phone="+1 (555) 678-9012",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        relationship_status="Pilot Scheduled",
        hindsight_bank_id="contact_aisha_patel"
    )
    db.add(aisha)
    db.flush()

    hindsight_service.ensure_bank(aisha.hindsight_bank_id, name="Aisha Patel (NextGen Retail)")
    
    m_aisha = Meeting(
        contact_id=aisha.id,
        title="Q4 E-Commerce Analytics Pilot Kickoff",
        date=now - timedelta(days=3),
        notes="Aisha confirmed pilot schedule for Black Friday preparation. Prioritizes real-time cart abandonment triggers. Prefers bi-weekly status syncs.",
        summary="• Black Friday pilot timeline finalized.\n• Focus: Real-time cart abandonment API.\n• Cadence preference: Bi-weekly sync.",
        is_processed=True
    )
    db.add(m_aisha)
    try:
        hindsight_service.retain_memory(
            bank_id=aisha.hindsight_bank_id,
            content="Aisha Patel's primary Q4 objective is high-throughput real-time cart abandonment analytics for Black Friday.",
            context="Pilot Kickoff Meeting",
            tags=["fact", "priority"]
        )
        hindsight_service.retain_memory(
            bank_id=aisha.hindsight_bank_id,
            content="Aisha prefers a bi-weekly 20-minute operational sync instead of weekly calls.",
            context="Pilot Kickoff Meeting",
            tags=["preference", "cadence"]
        )
    except Exception as e:
        logger.warning(f"Error retaining Aisha memories: {str(e)}")

    db.commit()

    return {
        "status": "success",
        "contacts_created": 5,
        "primary_demo_contact": "Sarah Johnson (Acme Corporation)",
        "message": "Demo data populated and durable memories retained into Hindsight memory banks."
    }
