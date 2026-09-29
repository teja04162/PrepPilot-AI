import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  RefreshCw, 
  Target, 
  CheckCircle2, 
  Layers, 
  Building2,
  Calendar,
  Compass
} from 'lucide-react';
import { api } from '../api/client';
import BriefCard from '../components/BriefCard';

export default function Prepare({ 
  contacts = [], 
  selectedContactId, 
  onSelectContact 
}) {
  const [contactId, setContactId] = useState(selectedContactId || (contacts[0]?.id || ''));
  const [customGoal, setCustomGoal] = useState('');
  const [meetingType, setMeetingType] = useState('Follow-up / Technical & Commercial');
  const [brief, setBrief] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const selectedContact = contacts.find(c => c.id === Number(contactId)) || contacts[0];

  useEffect(() => {
    if (selectedContactId) {
      setContactId(selectedContactId);
    }
  }, [selectedContactId]);

  const handleGenerateBrief = async (e) => {
    if (e) e.preventDefault();
    if (!contactId) return;

    setIsLoading(true);
    setLoadingStep(1);

    // Multi-phase loading experience as specified in Section 17
    const timer1 = setTimeout(() => setLoadingStep(2), 700);
    const timer2 = setTimeout(() => setLoadingStep(3), 1400);

    try {
      const result = await api.prepareContactMeeting(contactId, {
        custom_goal: customGoal.trim() || undefined,
        meeting_type: meetingType,
      });
      // Short delay to ensure step 3 is visible
      setTimeout(() => {
        setBrief(result);
        setIsLoading(false);
        setLoadingStep(0);
      }, 1900);
    } catch (err) {
      console.error('Failed to generate briefing:', err);
      setIsLoading(false);
      setLoadingStep(0);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const loadingMessages = [
    '',
    `Recalling your history with ${selectedContact?.name || 'contact'} from Hindsight memory bank...`,
    `Connecting previous conversations, objections, and resolved issues...`,
    `Synthesizing personalized meeting preparation brief...`,
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-primary">
            <Sparkles size={12} />
            Hero Feature
          </span>
          <span className="badge badge-emerald">
            Hindsight TEMPR Retrieval
          </span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
          Prepare Me — AI Pre-Meeting Briefing
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          PrepPilot recalls stored memories across all past interactions to build an executive briefing tailored to your contact.
        </p>
      </div>

      {/* Configuration Bar */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <form onSubmit={handleGenerateBrief} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          {/* Contact Selector */}
          <div>
            <label className="form-label">Select Contact</label>
            <select
              className="form-select"
              value={contactId}
              onChange={(e) => {
                setContactId(e.target.value);
                setBrief(null);
              }}
              required
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#0e1526' }}>
                  {c.name} — {c.company} ({c.role})
                </option>
              ))}
            </select>
          </div>

          {/* Meeting Type */}
          <div>
            <label className="form-label">Meeting Type / Stage</label>
            <select
              className="form-select"
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
            >
              <option value="Follow-up / Technical & Commercial">Follow-up / Technical &amp; Commercial</option>
              <option value="Security & Compliance Review">Security &amp; Compliance Review</option>
              <option value="Architecture Deep Dive">Architecture Deep Dive</option>
              <option value="Executive Sponsor Alignment">Executive Sponsor Alignment</option>
              <option value="Contract Negotiation">Contract Negotiation</option>
            </select>
          </div>

          {/* Custom Objective / Focus */}
          <div>
            <label className="form-label">Specific Meeting Goal (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Close technical & security signoff"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !contactId}
              className="btn btn-primary"
              style={{ width: '100%', height: '42px' }}
            >
              <Sparkles size={16} />
              {isLoading ? 'Generating Brief...' : 'Generate Meeting Brief'}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Sequence Experience (Section 17 requirement) */}
      {isLoading && (
        <div className="glass-panel animate-fade-in" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', border: '1px solid rgba(99, 102, 241, 0.4)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(14, 21, 38, 0.95) 100%)' }}>
          <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', animation: 'spinSlow 1.5s linear infinite' }} />
            <BrainCircuit size={32} color="#818cf8" className="animate-pulse" />
          </div>

          <div style={{ maxWidth: '500px' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              {loadingMessages[loadingStep]}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '14px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: loadingStep >= 1 ? '#6366f1' : 'rgba(255,255,255,0.1)' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: loadingStep >= 2 ? '#8b5cf6' : 'rgba(255,255,255,0.1)' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: loadingStep >= 3 ? '#10b981' : 'rgba(255,255,255,0.1)' }} />
            </div>
          </div>
        </div>
      )}

      {/* Brief Display */}
      {!isLoading && brief && (
        <BriefCard brief={brief} />
      )}

      {/* Empty State before brief is generated */}
      {!isLoading && !brief && selectedContact && (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <Sparkles size={28} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
            Ready to prepare for {selectedContact.name} ({selectedContact.company})
          </h3>
          <p style={{ fontSize: '0.875rem', maxWidth: '540px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            Click "Generate Meeting Brief" above to recall memory units from Hindsight bank <code style={{ color: '#a5b4fc' }}>{selectedContact.hindsight_bank_id}</code> and synthesize your meeting game plan.
          </p>
          <button
            onClick={handleGenerateBrief}
            className="btn btn-primary btn-sm"
          >
            <Sparkles size={14} />
            Generate Brief Now
          </button>
        </div>
      )}
    </div>
  );
}
