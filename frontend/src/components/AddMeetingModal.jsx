import React, { useState } from 'react';
import { CalendarPlus, X, Sparkles, BrainCircuit, FileText } from 'lucide-react';

export default function AddMeetingModal({ 
  isOpen, 
  onClose, 
  contacts = [], 
  selectedContactId, 
  onSaveMeeting,
  isSubmitting 
}) {
  const [contactId, setContactId] = useState(selectedContactId || (contacts[0]?.id || ''));
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Google Meet / Virtual');
  const [notes, setNotes] = useState('');
  const [learnImmediately, setLearnImmediately] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactId || !title.trim() || !notes.trim()) return;

    onSaveMeeting({
      contact_id: Number(contactId),
      title: title.trim(),
      location: location.trim(),
      notes: notes.trim(),
      learnImmediately,
    });
  };

  const handleInsertSarahTemplate = () => {
    const sarah = contacts.find(c => c.name.includes('Sarah'));
    if (sarah) setContactId(sarah.id);
    setTitle('Technical Architecture & Preference Sync');
    setNotes('Sarah prefers receiving technical documentation before discussing commercial details. Her security architect Mark will join the next call.');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarPlus size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              Log Meeting &amp; Extract Memory
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Contact Select */}
          <div>
            <label className="form-label">Contact</label>
            <select
              className="form-select"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              required
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#0e1526' }}>
                  {c.name} — {c.company} ({c.role})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="form-label">Meeting Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Security & Compliance Deep Dive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Location / Channel */}
          <div>
            <label className="form-label">Location / Platform</label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Meeting Notes / Raw Transcript</label>
              <button
                type="button"
                onClick={handleInsertSarahTemplate}
                style={{ fontSize: '0.75rem', color: '#a5b4fc', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                + Insert Sarah Preference Note
              </button>
            </div>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Enter meeting summary, customer remarks, concerns, or commitments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
          </div>

          {/* Learn Immediately Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <input
              type="checkbox"
              id="learnImmediately"
              checked={learnImmediately}
              onChange={(e) => setLearnImmediately(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <label htmlFor="learnImmediately" style={{ fontSize: '0.8125rem', color: '#e0e7ff', cursor: 'pointer' }}>
              <strong>Retain into Hindsight Memory Bank:</strong> Automatically extract durable facts, concerns, and preferences to update the long-term agent memory.
            </label>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-emerald btn-sm"
            >
              <BrainCircuit size={16} />
              {isSubmitting ? 'Processing & Retaining...' : 'Save & Learn with Hindsight'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
