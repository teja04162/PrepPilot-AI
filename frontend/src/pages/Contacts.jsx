import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Sparkles, 
  BrainCircuit, 
  CalendarPlus, 
  Calendar, 
  CheckSquare, 
  ExternalLink,
  UserPlus,
  Trash2,
  Building2
} from 'lucide-react';

export default function Contacts({ 
  contacts = [], 
  onSelectContact, 
  onPrepareContact, 
  onOpenAddContact, 
  onOpenAddMeeting,
  onDeleteContact 
}) {
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Enterprise Contacts &amp; Memory Dossiers
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Each contact maintains an isolated long-term Hindsight memory bank that accumulates relationship intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search contacts or company..."
              className="form-input"
              style={{ paddingLeft: '36px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={onOpenAddContact} className="btn btn-primary btn-sm">
            <UserPlus size={14} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Contacts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className="glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div>
              {/* Header: Avatar, Name, Company, Status */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={contact.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`}
                    alt={contact.name}
                    style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover', border: '1px solid var(--border-medium)' }}
                  />
                  <div>
                    <h3
                      onClick={() => onSelectContact(contact.id)}
                      style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer', transition: 'color 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                    >
                      {contact.name}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {contact.role}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Building2 size={12} />
                      {contact.company}
                    </div>
                  </div>
                </div>

                <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                  {contact.relationship_status}
                </span>
              </div>

              {/* Stats badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="badge badge-violet" style={{ fontSize: '0.75rem' }}>
                  <BrainCircuit size={12} />
                  {contact.memory_count || 0} Hindsight memories
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  <Calendar size={12} />
                  {contact.meetings_count || 0} meetings
                </span>
                {contact.open_commitments_count > 0 && (
                  <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                    <CheckSquare size={12} />
                    {contact.open_commitments_count} open promises
                  </span>
                )}
              </div>

              {/* Bank ID & last meeting */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Bank ID: <code style={{ color: '#cbd5e1' }}>{contact.hindsight_bank_id}</code></div>
                <div>Last Meeting: {contact.last_meeting_date ? new Date(contact.last_meeting_date).toLocaleDateString() : 'None recorded'}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => onSelectContact(contact.id)}
                  className="btn btn-secondary btn-sm"
                  title="View Memory Bank & Timeline"
                >
                  Dossier &amp; Memory
                </button>
                <button
                  onClick={() => onOpenAddMeeting(contact.id)}
                  className="btn btn-secondary btn-sm"
                  title="Log Meeting with this contact"
                >
                  <CalendarPlus size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => onPrepareContact(contact.id)}
                  className="btn btn-primary btn-sm"
                >
                  <Sparkles size={14} />
                  Prepare Me
                </button>
                {onDeleteContact && (
                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                    title="Delete contact"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
