import React from 'react';
import { 
  Users, 
  Calendar, 
  CheckSquare, 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Check, 
  ShieldCheck, 
  Clock, 
  Building2,
  CalendarPlus
} from 'lucide-react';
import StatsCard from '../components/StatsCard';

export default function Dashboard({ 
  stats, 
  contacts = [], 
  meetings = [], 
  onNavigate, 
  onPrepareContact, 
  onQuickSarahDemo,
  onOpenAddMeeting,
  onToggleCommitment 
}) {
  const sarah = contacts.find(c => c.name.includes('Sarah')) || contacts[0];
  const upcomingContacts = contacts.slice(0, 4);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner / Hero */}
      <div className="glass-panel" style={{ padding: '28px 32px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.12) 50%, rgba(14, 21, 38, 0.9) 100%)', border: '1px solid rgba(99, 102, 241, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-primary">
              <BrainCircuit size={12} />
              Biomimetic Agent Memory
            </span>
            <span className="badge badge-emerald">
              Hindsight Core Active
            </span>
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Never walk into a meeting unprepared.
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            PrepPilot AI uses <strong style={{ color: '#ffffff' }}>Hindsight long-term memory</strong> to track evolving customer concerns, resolve objections over time, and adapt future preparation to communication preferences.
          </p>
        </div>

        {/* Demo Quick Launch Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={onQuickSarahDemo}
            className="btn btn-primary btn-lg"
            style={{ boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)' }}
          >
            <Sparkles size={18} />
            Test Sarah Johnson Demo Flow
            <ArrowRight size={18} />
          </button>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            3-Stage Learning Loop • Real Hindsight Banks
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <StatsCard
          title="Active Contacts"
          value={stats?.total_contacts || contacts.length || 0}
          subtitle="Managed relationships"
          icon={Users}
          color="primary"
          badge="Enterprise"
        />
        <StatsCard
          title="Recorded Meetings"
          value={stats?.total_meetings || meetings.length || 0}
          subtitle="Processed transcripts"
          icon={Calendar}
          color="emerald"
          badge="Knowledge Extracted"
        />
        <StatsCard
          title="Open Commitments"
          value={stats?.open_commitments || 0}
          subtitle="Action items & promises"
          icon={CheckSquare}
          color="amber"
          badge="Pending Follow-up"
        />
        <StatsCard
          title="Hindsight Memories"
          value={stats?.total_memories_learned || 0}
          subtitle="Durable retained facts"
          icon={BrainCircuit}
          color="violet"
          badge="TEMPR Search"
        />
      </div>

      {/* Main 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '28px' }}>
        {/* Left Column: Upcoming Meetings & One-Click Prep */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                  Upcoming Meetings &amp; Priority Accounts
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Click "Prepare Me" to synthesize a memory-powered executive brief.
                </p>
              </div>
              <button onClick={() => onNavigate('contacts')} className="btn btn-secondary btn-sm">
                View All Contacts
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="glass-card"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={contact.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`}
                      alt={contact.name}
                      style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-medium)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff' }}>
                          {contact.name}
                        </span>
                        <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                          {contact.relationship_status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {contact.role} • <strong style={{ color: '#ffffff' }}>{contact.company}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-violet" title="Memories stored in Hindsight">
                      <BrainCircuit size={12} />
                      {contact.memory_count || 0} memories
                    </span>
                    <button
                      onClick={() => onPrepareContact(contact.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <Sparkles size={14} />
                      Prepare Me
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Meeting Transcripts */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                  Recent Meeting Knowledge Feeds
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Extracted and synced to Hindsight long-term memory.
                </p>
              </div>
              <button onClick={onOpenAddMeeting} className="btn btn-emerald btn-sm">
                <CalendarPlus size={14} />
                + Log Meeting
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {meetings.slice(0, 3).map((m) => {
                const contact = contacts.find(c => c.id === m.contact_id);
                return (
                  <div key={m.id} className="glass-card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                        {m.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(m.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '8px' }}>
                      With {contact?.name || 'Contact'} ({contact?.company || 'Company'})
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                      {m.summary || m.notes.slice(0, 140) + '...'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Open Commitments & Sarah Demo Spotlight */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Sarah Johnson Spotlight Card */}
          {sarah && (
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(14, 21, 38, 0.95) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span className="badge badge-violet">Primary Demo Story</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hindsight Bank: <code>{sarah.hindsight_bank_id}</code></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <img
                  src={sarah.avatar_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"}
                  alt={sarah.name}
                  style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#ffffff' }}>
                    {sarah.name}
                  </h4>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {sarah.role} • <strong style={{ color: '#ffffff' }}>{sarah.company}</strong>
                  </div>
                </div>
              </div>

              {/* Status progression badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '0.75rem' }}>
                <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  ✓ <strong>Pricing Concern:</strong> Resolved in Meeting 2
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  ⚠ <strong>Current Blocker:</strong> Security Review &amp; SOC 2
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '6px', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  ✦ <strong>Learned Preference:</strong> Technical details before commercial discussions
                </div>
              </div>

              <button
                onClick={() => onPrepareContact(sarah.id)}
                className="btn btn-violet"
                style={{ width: '100%' }}
              >
                <Sparkles size={16} />
                Prepare Brief for Sarah
              </button>
            </div>
          )}

          {/* Open Commitments Tracker */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#ffffff' }}>
                  Commitment Tracker
                </h3>
              </div>
              <span className="badge badge-amber">Action Items</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <input
                  type="checkbox"
                  defaultChecked={false}
                  style={{ marginTop: '3px', accentColor: '#6366f1', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: '0.8125rem', color: '#ffffff', fontWeight: 600 }}>
                    Send SOC 2 Type II compliance package
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    For Sarah Johnson (Acme Corp) • Due Tomorrow
                  </div>
                </div>
              </div>

              <div style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <input
                  type="checkbox"
                  defaultChecked={false}
                  style={{ marginTop: '3px', accentColor: '#6366f1', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: '0.8125rem', color: '#ffffff', fontWeight: 600 }}>
                    Share GitHub Terraform Helm repository
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    For Elena Rodriguez (CloudScale) • Open
                  </div>
                </div>
              </div>

              <div style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  disabled
                  style={{ marginTop: '3px', accentColor: '#10b981' }}
                />
                <div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    Send enterprise pricing breakdown
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#10b981' }}>
                    Completed &amp; pricing concern resolved!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
