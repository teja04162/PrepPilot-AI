import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Mail, 
  Phone, 
  BrainCircuit, 
  Sparkles, 
  CalendarPlus, 
  Calendar, 
  CheckSquare, 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  Lightbulb, 
  ArrowLeft,
  RefreshCw,
  Plus
} from 'lucide-react';
import { api } from '../api/client';
import MemoryTimeline from '../components/MemoryTimeline';

export default function ContactDetail({ 
  contactId, 
  onBack, 
  onPrepareContact, 
  onOpenAddMeeting,
  onTriggerLearn 
}) {
  const [contact, setContact] = useState(null);
  const [memoryOverview, setMemoryOverview] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [activeTab, setActiveTab] = useState('memory');
  const [isLoading, setIsLoading] = useState(true);
  const [newCommitmentText, setNewCommitmentText] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [contactData, memData, meetData, commData] = await Promise.all([
        api.getContact(contactId),
        api.getContactMemory(contactId),
        api.getMeetings(),
        api.getContactCommitments(contactId),
      ]);
      setContact(contactData);
      setMemoryOverview(memData);
      setMeetings(meetData.filter(m => m.contact_id === Number(contactId)));
      setCommitments(commData);
    } catch (err) {
      console.error('Failed to load contact dossier:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contactId) {
      loadData();
    }
  }, [contactId]);

  const handleToggleCommitment = async (comm) => {
    try {
      const newStatus = comm.status === 'completed' ? 'open' : 'completed';
      await api.updateCommitment(comm.id, { status: newStatus });
      loadData();
    } catch (err) {
      console.error('Failed to update commitment:', err);
    }
  };

  const handleAddCommitment = async (e) => {
    e.preventDefault();
    if (!newCommitmentText.trim()) return;
    try {
      await api.addCommitment(contactId, {
        title: newCommitmentText.trim(),
        owner: 'user',
        status: 'open',
      });
      setNewCommitmentText('');
      loadData();
    } catch (err) {
      console.error('Failed to add commitment:', err);
    }
  };

  if (isLoading || !contact) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 16px auto', color: '#6366f1' }} />
        <p>Loading contact memory bank...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Back button & top navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          Back to Contacts
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => onOpenAddMeeting(contact.id)} className="btn btn-emerald btn-sm">
            <CalendarPlus size={14} />
            Log Meeting
          </button>
          <button onClick={() => onPrepareContact(contact.id)} className="btn btn-primary btn-sm">
            <Sparkles size={14} />
            Prepare Me
          </button>
        </div>
      </div>

      {/* Profile Header Dossier */}
      <div className="glass-panel" style={{ padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={contact.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`}
            alt={contact.name}
            style={{ width: '72px', height: '72px', borderRadius: '18px', objectFit: 'cover', border: '2px solid var(--border-medium)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                {contact.name}
              </h2>
              <span className="badge badge-primary">{contact.relationship_status}</span>
            </div>
            <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {contact.role} at <strong style={{ color: '#ffffff' }}>{contact.company}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {contact.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {contact.email}</span>}
              {contact.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {contact.phone}</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a5b4fc' }}>
                <BrainCircuit size={12} /> Bank: <code>{contact.hindsight_bank_id}</code>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Counts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '12px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c4b5fd' }}>{memoryOverview?.total_memories || 0}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Memories</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6ee7b7' }}>{meetings.length}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Meetings</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fcd34d' }}>{commitments.filter(c => c.status === 'open').length}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Open Promises</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveTab('memory')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'memory' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'memory' ? '#a5b4fc' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <BrainCircuit size={16} />
          What PrepPilot Remembers (Hindsight)
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'meetings' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'meetings' ? '#a5b4fc' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Calendar size={16} />
          Meeting Logs ({meetings.length})
        </button>
        <button
          onClick={() => setActiveTab('commitments')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'commitments' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'commitments' ? '#a5b4fc' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckSquare size={16} />
          Commitments &amp; Follow-ups ({commitments.length})
        </button>
      </div>

      {/* Tab 1: Memory & Timeline */}
      {activeTab === 'memory' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '28px' }}>
          {/* Left: Categorized Memory Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Preferences */}
            <div className="glass-card" style={{ padding: '20px', borderLeft: '3px solid #8b5cf6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px' }}>
                <Sliders size={16} color="#8b5cf6" />
                DURABLE PREFERENCES &amp; WORKFLOWS
              </div>
              {memoryOverview?.preferences && memoryOverview.preferences.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {memoryOverview.preferences.map((p, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '6px', fontSize: '0.8125rem', color: '#ffffff' }}>
                      ✦ {p}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No explicit preferences recorded.</p>
              )}
            </div>

            {/* Resolved Concerns */}
            <div className="glass-card" style={{ padding: '20px', borderLeft: '3px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7', fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px' }}>
                <ShieldCheck size={16} color="#10b981" />
                RESOLVED CONCERNS (Historical Objections Fixed)
              </div>
              {memoryOverview?.resolved_concerns && memoryOverview.resolved_concerns.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {memoryOverview.resolved_concerns.map((r, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', fontSize: '0.8125rem', color: '#ffffff' }}>
                      ✓ {r}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>None recorded.</p>
              )}
            </div>

            {/* Active Concerns */}
            <div className="glass-card" style={{ padding: '20px', borderLeft: '3px solid #f43f5e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fda4af', fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px' }}>
                <AlertTriangle size={16} color="#f43f5e" />
                ACTIVE CONCERNS &amp; BLOCKERS
              </div>
              {memoryOverview?.active_concerns && memoryOverview.active_concerns.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {memoryOverview.active_concerns.map((c, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', background: 'rgba(244, 63, 94, 0.08)', borderRadius: '6px', fontSize: '0.8125rem', color: '#ffffff' }}>
                      ⚠ {c}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No active blockers recorded.</p>
              )}
            </div>

            {/* Facts */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px' }}>
                <Lightbulb size={16} color="#6366f1" />
                DISCOVERED FACTS &amp; CONTEXT
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {memoryOverview?.facts?.map((f, idx) => (
                  <li key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#6366f1' }}>•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Chronological Learning Timeline */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                Memory Evolution Timeline
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Shows chronological memory progression from discovery to current state.
              </p>
            </div>

            <MemoryTimeline timeline={memoryOverview?.timeline || []} contactName={contact.name} />
          </div>
        </div>
      )}

      {/* Tab 2: Meeting Logs */}
      {activeTab === 'meetings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {meetings.map((m) => (
            <div key={m.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>{m.title}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(m.date).toLocaleDateString()} • {m.location}
                  </div>
                </div>
                <div>
                  {m.is_processed ? (
                    <span className="badge badge-emerald">
                      <ShieldCheck size={12} />
                      Synced to Hindsight
                    </span>
                  ) : (
                    <button
                      onClick={() => onTriggerLearn(m.id)}
                      className="btn btn-emerald btn-sm"
                    >
                      <BrainCircuit size={14} />
                      Learn from Meeting
                    </button>
                  )}
                </div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>RAW NOTES / TRANSCRIPT:</div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {m.notes}
                </p>
              </div>

              {m.summary && (
                <div style={{ padding: '14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '4px' }}>EXTRACTED KNOWLEDGE SUMMARY:</div>
                  <p style={{ fontSize: '0.8125rem', color: '#ffffff', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                    {m.summary}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Commitments */}
      {activeTab === 'commitments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Add commitment input */}
          <form onSubmit={handleAddCommitment} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Add new action item or promise for this contact..."
              value={newCommitmentText}
              onChange={(e) => setNewCommitmentText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Plus size={16} />
              Add Promise
            </button>
          </form>

          {/* List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {commitments.map((comm) => (
                <div
                  key={comm.id}
                  className="glass-card"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={comm.status === 'completed'}
                      onChange={() => handleToggleCommitment(comm)}
                      style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: comm.status === 'completed' ? 'var(--text-muted)' : '#ffffff', textDecoration: comm.status === 'completed' ? 'line-through' : 'none' }}>
                        {comm.title}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        Owner: <strong>{comm.owner?.toUpperCase()}</strong> • Created {new Date(comm.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${comm.status === 'completed' ? 'badge-emerald' : 'badge-amber'}`}>
                    {comm.status === 'completed' ? 'Resolved / Completed' : 'Pending Follow-up'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
