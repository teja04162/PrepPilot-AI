import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Database, 
  Lightbulb, 
  Sliders, 
  AlertTriangle, 
  ShieldCheck, 
  CheckSquare, 
  Layers, 
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';
import MemoryTimeline from '../components/MemoryTimeline';

export default function Memory({ contacts = [], selectedContactId, onPrepareContact }) {
  const [contactId, setContactId] = useState(selectedContactId || (contacts[0]?.id || ''));
  const [memoryData, setMemoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('categories'); // 'categories' | 'timeline' | 'raw'

  const selectedContact = contacts.find(c => c.id === Number(contactId)) || contacts[0];

  const loadMemory = async (cId) => {
    if (!cId) return;
    setIsLoading(true);
    try {
      const data = await api.getContactMemory(cId);
      setMemoryData(data);
    } catch (err) {
      console.error('Failed to load memory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedContactId) {
      setContactId(selectedContactId);
      loadMemory(selectedContactId);
    } else if (contacts.length > 0 && !contactId) {
      setContactId(contacts[0].id);
      loadMemory(contacts[0].id);
    }
  }, [selectedContactId, contacts]);

  useEffect(() => {
    if (contactId) {
      loadMemory(contactId);
    }
  }, [contactId]);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-violet">
              <BrainCircuit size={12} />
              Long-Term Biomimetic Memory
            </span>
            <span className="badge badge-neutral">
              Hindsight Banks
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            What PrepPilot Remembers
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Transparently inspect what the AI agent has learned and retained across meetings for each contact.
          </p>
        </div>

        {/* Contact Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="form-select"
            style={{ width: '260px' }}
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
          >
            {contacts.map((c) => (
              <option key={c.id} value={c.id} style={{ background: '#0e1526' }}>
                {c.name} — {c.company}
              </option>
            ))}
          </select>

          {selectedContact && (
            <button
              onClick={() => onPrepareContact(selectedContact.id)}
              className="btn btn-primary btn-sm"
            >
              <Sparkles size={14} />
              Prepare Brief
            </button>
          )}
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveView('categories')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeView === 'categories' ? 'var(--primary-light)' : 'transparent',
            color: activeView === 'categories' ? '#a5b4fc' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Layers size={16} />
          Categorized Memories
        </button>
        <button
          onClick={() => setActiveView('timeline')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeView === 'timeline' ? 'var(--primary-light)' : 'transparent',
            color: activeView === 'timeline' ? '#a5b4fc' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <BrainCircuit size={16} />
          Evolution Timeline
        </button>
        <button
          onClick={() => setActiveView('raw')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeView === 'raw' ? 'var(--primary-light)' : 'transparent',
            color: activeView === 'raw' ? '#a5b4fc' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Database size={16} />
          Raw Hindsight Units ({memoryData?.raw_memories?.length || 0})
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 16px auto', color: '#6366f1' }} />
          <p>Querying Hindsight memory bank...</p>
        </div>
      )}

      {/* View 1: Categorized Memory Buckets */}
      {!isLoading && memoryData && activeView === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {/* Preferences */}
          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '14px' }}>
              <Sliders size={18} color="#8b5cf6" />
              DURABLE PREFERENCES &amp; WORKFLOWS
            </div>
            {memoryData.preferences && memoryData.preferences.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {memoryData.preferences.map((p, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '8px', fontSize: '0.8125rem', color: '#ffffff', lineHeight: 1.4 }}>
                    ✦ {p}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No communication preferences recorded yet.</p>
            )}
          </div>

          {/* Resolved Issues */}
          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '14px' }}>
              <ShieldCheck size={18} color="#10b981" />
              RESOLVED OBJECTIONS &amp; CONCERNS
            </div>
            {memoryData.resolved_concerns && memoryData.resolved_concerns.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {memoryData.resolved_concerns.map((r, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', fontSize: '0.8125rem', color: '#ffffff', lineHeight: 1.4 }}>
                    ✓ {r}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No resolved issues recorded.</p>
            )}
          </div>

          {/* Active Concerns */}
          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #f43f5e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fda4af', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '14px' }}>
              <AlertTriangle size={18} color="#f43f5e" />
              ACTIVE CONCERNS &amp; DOUBTS
            </div>
            {memoryData.active_concerns && memoryData.active_concerns.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {memoryData.active_concerns.map((c, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', background: 'rgba(244, 63, 94, 0.08)', borderRadius: '8px', fontSize: '0.8125rem', color: '#ffffff', lineHeight: 1.4 }}>
                    ⚠ {c}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No active objections recorded.</p>
            )}
          </div>

          {/* Discovered Facts */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '14px' }}>
              <Lightbulb size={18} color="#6366f1" />
              STAKEHOLDER &amp; BUSINESS FACTS
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {memoryData.facts?.map((f, idx) => (
                <li key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#6366f1' }}>•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* View 2: Evolution Timeline */}
      {!isLoading && memoryData && activeView === 'timeline' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <MemoryTimeline timeline={memoryData.timeline || []} contactName={selectedContact?.name} />
        </div>
      )}

      {/* View 3: Raw Memory Units */}
      {!isLoading && memoryData && activeView === 'raw' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Exact memory items retrieved from Hindsight API for bank <code>{memoryData.hindsight_bank_id}</code>:
          </div>
          {memoryData.raw_memories && memoryData.raw_memories.length > 0 ? (
            memoryData.raw_memories.map((unit, idx) => (
              <div key={idx} style={{ padding: '14px 18px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="badge badge-primary">{unit.type || 'observation'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {unit.timestamp || 'N/A'}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#f8fafc', marginBottom: '6px' }}>
                  {unit.text}
                </div>
                {unit.context && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Context: {unit.context}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No raw units found in memory bank.</p>
          )}
        </div>
      )}
    </div>
  );
}
