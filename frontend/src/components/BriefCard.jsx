import React, { useState } from 'react';
import { 
  Target, 
  History, 
  CheckSquare, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  Compass, 
  Copy, 
  Check, 
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function BriefCard({ brief }) {
  const [copied, setCopied] = useState(false);
  const [showMemoryInspector, setShowMemoryInspector] = useState(false);

  if (!brief) return null;

  const handleCopy = () => {
    const briefText = `
PREPPILOT AI — EXECUTIVE MEETING BRIEF
Contact: ${brief.contact_name} (${brief.role} at ${brief.company})
Date: ${new Date(brief.generated_at).toLocaleDateString()}

OBJECTIVE:
${brief.meeting_objective}

WHAT YOU SHOULD REMEMBER:
${brief.important_history?.map(h => `• ${h}`).join('\n')}

OPEN COMMITMENTS:
${brief.open_commitments?.map(c => `• [${c.owner?.toUpperCase()}] ${c.title}`).join('\n')}

ACTIVE CONCERNS:
${brief.previous_concerns?.map(pc => `• ${pc}`).join('\n')}

RESOLVED ISSUES:
${brief.resolved_issues?.map(ri => `• ${ri}`).join('\n')}

RECOMMENDED APPROACH:
${brief.recommended_approach?.map(ra => `• ${ra}`).join('\n')}

SUGGESTED QUESTIONS:
${brief.suggested_questions?.map(sq => `• ${sq}`).join('\n')}

POTENTIAL RISKS:
${brief.potential_risks?.map(pr => `• ${pr}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ overflow: 'hidden' }}>
      {/* Header Banner */}
      <div style={{ padding: '24px 28px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-primary">
              <Sparkles size={12} />
              {brief.memory_powered_badge}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Bank: <code style={{ color: '#a5b4fc' }}>{brief.hindsight_bank_id}</code>
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Meeting Brief: {brief.contact_name}
          </h2>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {brief.role} • <strong style={{ color: '#ffffff' }}>{brief.company}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleCopy}
            className="btn btn-secondary btn-sm"
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copied Brief!' : 'Copy Brief'}
          </button>
        </div>
      </div>

      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Section 1: Meeting Objective */}
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontWeight: 700, fontSize: '0.875rem', marginBottom: '8px' }}>
            <Target size={18} color="#818cf8" />
            STRATEGIC MEETING OBJECTIVE
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.5 }}>
            {brief.meeting_objective}
          </p>
        </div>

        {/* Section 2: Two-column grid (What to Remember & Open Commitments) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Important History */}
          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7', fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px' }}>
              <History size={16} color="#10b981" />
              WHAT YOU SHOULD REMEMBER
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {brief.important_history?.map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-main)', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#10b981' }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Open Commitments */}
          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fcd34d', fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px' }}>
              <CheckSquare size={16} color="#f59e0b" />
              OPEN COMMITMENTS &amp; PROMISES
            </div>
            {brief.open_commitments && brief.open_commitments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {brief.open_commitments.map((comm, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 10px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <span className={`badge ${comm.owner === 'user' ? 'badge-primary' : 'badge-amber'}`} style={{ fontSize: '0.6875rem' }}>
                      {comm.owner === 'user' ? 'You Promised' : `${brief.contact_name} Promised`}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: '#ffffff', fontWeight: 500 }}>
                      {comm.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No open commitments pending.</p>
            )}
          </div>
        </div>

        {/* Section 3: Concerns vs. Resolutions (Critical Hackathon Feature) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Active Concerns */}
          <div className="glass-card" style={{ padding: '18px', borderLeft: '3px solid #f43f5e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fda4af', fontWeight: 700, fontSize: '0.875rem', marginBottom: '10px' }}>
              <AlertTriangle size={16} color="#f43f5e" />
              ACTIVE CONCERNS &amp; DOUBTS
            </div>
            {brief.previous_concerns && brief.previous_concerns.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {brief.previous_concerns.map((c, idx) => (
                  <li key={idx} style={{ fontSize: '0.8125rem', color: '#f8fafc', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#f43f5e' }}>⚠</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No active objections recorded.</p>
            )}
          </div>

          {/* Resolved Issues */}
          <div className="glass-card" style={{ padding: '18px', borderLeft: '3px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7', fontWeight: 700, fontSize: '0.875rem', marginBottom: '10px' }}>
              <ShieldCheck size={16} color="#10b981" />
              RESOLVED ISSUES (No Longer Blockers)
            </div>
            {brief.resolved_issues && brief.resolved_issues.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {brief.resolved_issues.map((r, idx) => (
                  <li key={idx} style={{ fontSize: '0.8125rem', color: '#f8fafc', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>None recorded.</p>
            )}
          </div>
        </div>

        {/* Section 4: Recommended Approach (Demonstrating Learned Behavior) */}
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px' }}>
            <Compass size={18} color="#8b5cf6" />
            RECOMMENDED APPROACH (Tailored to Learned Preferences)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {brief.recommended_approach?.map((approach, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.875rem', color: '#ffffff', lineHeight: 1.5 }}>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>{idx + 1}.</span>
                <span>{approach}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Suggested Questions */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px' }}>
            <HelpCircle size={18} color="#6366f1" />
            SUGGESTED QUESTIONS FOR THIS MEETING
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {brief.suggested_questions?.map((q, idx) => (
              <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '3px solid #6366f1', fontSize: '0.8125rem', color: '#f8fafc', fontStyle: 'italic' }}>
                "{q}"
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Potential Risks */}
        {brief.potential_risks && brief.potential_risks.length > 0 && (
          <div style={{ padding: '14px 18px', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fda4af', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '8px' }}>
              <AlertTriangle size={15} color="#f43f5e" />
              POTENTIAL RISKS &amp; BLIND SPOTS
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {brief.potential_risks.map((risk, idx) => (
                <li key={idx} style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>
                  • {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 7: Hindsight Provenance Inspector Accordion */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button
            onClick={() => setShowMemoryInspector(!showMemoryInspector)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px 0', fontSize: '0.8125rem', fontWeight: 600 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BrainCircuit size={16} color="#818cf8" />
              View Recalled Hindsight Memory Units ({brief.recalled_memories_count || brief.recalled_memory_excerpts?.length || 0} units used)
            </span>
            {showMemoryInspector ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showMemoryInspector && (
            <div className="animate-fade-in" style={{ marginTop: '12px', padding: '14px', background: 'rgba(9, 13, 22, 0.85)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                The following durable memories were retrieved from Hindsight's biomimetic memory bank to power this briefing:
              </div>
              {brief.recalled_memory_excerpts && brief.recalled_memory_excerpts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {brief.recalled_memory_excerpts.map((excerpt, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#a5b4fc', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      {excerpt}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Memories retrieved via Hindsight TEMPR multi-strategy search.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
