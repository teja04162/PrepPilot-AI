import React, { useState } from 'react';
import { 
  Calendar, 
  CalendarPlus, 
  BrainCircuit, 
  ShieldCheck, 
  Building2, 
  User, 
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Meetings({ 
  meetings = [], 
  contacts = [], 
  onOpenAddMeeting, 
  onTriggerLearn, 
  onPrepareContact 
}) {
  const [search, setSearch] = useState('');
  const [selectedContactFilter, setSelectedContactFilter] = useState('all');

  const filtered = meetings.filter((m) => {
    const contact = contacts.find((c) => c.id === m.contact_id);
    const matchesSearch = 
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.notes.toLowerCase().includes(search.toLowerCase()) ||
      contact?.name.toLowerCase().includes(search.toLowerCase()) ||
      contact?.company.toLowerCase().includes(search.toLowerCase());

    const matchesContact = selectedContactFilter === 'all' || m.contact_id === Number(selectedContactFilter);
    return matchesSearch && matchesContact;
  });

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Meeting Transcripts &amp; Knowledge Ingestion
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Log raw meeting notes and trigger the Hindsight memory learning pipeline.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="form-select"
            style={{ width: '200px' }}
            value={selectedContactFilter}
            onChange={(e) => setSelectedContactFilter(e.target.value)}
          >
            <option value="all">All Contacts</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.company})
              </option>
            ))}
          </select>

          <button onClick={() => onOpenAddMeeting()} className="btn btn-emerald btn-sm">
            <CalendarPlus size={14} />
            Log Meeting
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((m) => {
          const contact = contacts.find((c) => c.id === m.contact_id);
          return (
            <div key={m.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                      {m.title}
                    </h3>
                    {m.is_processed ? (
                      <span className="badge badge-emerald">
                        <ShieldCheck size={12} />
                        Learned &amp; Synced to Hindsight
                      </span>
                    ) : (
                      <span className="badge badge-amber">
                        Pending Memory Sync
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={13} /> {contact?.name || 'Contact'} ({contact?.role})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building2 size={13} /> {contact?.company}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> {new Date(m.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => onTriggerLearn(m.id)}
                    className="btn btn-secondary btn-sm"
                    title="Extract structured knowledge and store durable memories into Hindsight"
                  >
                    <BrainCircuit size={14} color="#10b981" />
                    {m.is_processed ? 'Re-Learn Knowledge' : 'Learn with Hindsight'}
                  </button>
                  {contact && (
                    <button
                      onClick={() => onPrepareContact(contact.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <Sparkles size={14} />
                      Prepare Me
                    </button>
                  )}
                </div>
              </div>

              {/* Raw Notes */}
              <div style={{ padding: '14px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Raw Notes / Transcript:
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {m.notes}
                </p>
              </div>

              {/* Extracted Summary */}
              {m.summary && (
                <div style={{ padding: '14px 16px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Extracted Knowledge &amp; Durable Memories:
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#ffffff', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {m.summary}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
