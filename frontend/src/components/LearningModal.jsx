import React from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Database,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function LearningModal({ isOpen, onClose, learnResult, onGoToPrepare }) {
  if (!isOpen || !learnResult) return null;

  const { contact_name, extracted_knowledge, retained_items, memories_retained, message } = learnResult;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.2)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}>
              <BrainCircuit size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-emerald">Hindsight Memory Updated</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Memories Learned for {contact_name}
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '4px' }}>
              ✓ KNOWLEDGE EXTRACTION &amp; MEMORY RETENTION COMPLETE
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#e2e8f0', lineHeight: 1.4 }}>
              {message}
            </p>
          </div>

          {/* Checklist of Durable Memories Learned */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Retained in Hindsight Long-Term Memory ({memories_retained} items)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {retained_items && retained_items.length > 0 ? (
                retained_items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8125rem', color: '#f8fafc', lineHeight: 1.4 }}>
                      {item}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Knowledge extracted and synced to memory bank.
                </div>
              )}
            </div>
          </div>

          {/* Commitments Added */}
          {extracted_knowledge?.commitments && extracted_knowledge.commitments.length > 0 && (
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Commitments Tracked in Database
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {extracted_knowledge.commitments.map((comm, idx) => (
                  <div key={idx} style={{ padding: '8px 12px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '0.75rem', color: '#f8fafc' }}>
                    <strong>[{comm.owner?.toUpperCase()}]:</strong> {comm.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              if (onGoToPrepare) onGoToPrepare();
            }}
            className="btn btn-primary btn-sm"
          >
            <Sparkles size={14} />
            Test Future Preparation Now
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
