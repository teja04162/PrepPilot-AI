import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Database, 
  Cpu, 
  Server, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  BrainCircuit,
  ExternalLink
} from 'lucide-react';
import { api } from '../api/client';

export default function Settings({ onSeedDemo, isSeeding }) {
  const [stats, setStats] = useState(null);
  const [healthStatus, setHealthStatus] = useState('checking');

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const loadDiagnostics = async () => {
    try {
      const data = await api.getSystemStats();
      setStats(data);
      setHealthStatus('healthy');
    } catch (err) {
      console.error('Diagnostics check failed:', err);
      setHealthStatus('error');
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
          System Diagnostics &amp; Architecture
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Monitor Hindsight long-term memory banks, Groq LLM inference, and relational database health.
        </p>
      </div>

      {/* Services Health Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Hindsight Memory Card */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BrainCircuit size={22} color="#818cf8" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>Hindsight by Vectorize</h3>
            </div>
            <span className="badge badge-emerald">
              <CheckCircle2 size={12} /> Active
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Role:</strong> Long-Term Biomimetic Memory Layer</div>
            <div><strong>Base URL:</strong> <code>{stats?.hindsight_base_url || 'https://api.hindsight.vectorize.io'}</code></div>
            <div><strong>Retrieval Engine:</strong> TEMPR (Dense + Sparse BM25 + Graph + Temporal)</div>
            <div><strong>Memories Learned:</strong> <strong style={{ color: '#a5b4fc' }}>{stats?.total_memories_learned || 0} units</strong></div>
          </div>
        </div>

        {/* Groq LLM Card */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={22} color="#10b981" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>Groq LLM Acceleration</h3>
            </div>
            <span className="badge badge-emerald">
              <CheckCircle2 size={12} /> Online
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Role:</strong> Knowledge Extraction &amp; Briefing Synthesis</div>
            <div><strong>Primary Model:</strong> <code>{stats?.groq_model || 'openai/gpt-oss-120b'}</code></div>
            <div><strong>Fallback Strategy:</strong> llama-3.3 / llama-3.1 instant</div>
            <div><strong>Format:</strong> Structured JSON validation + heuristic fallback</div>
          </div>
        </div>

        {/* Relational Database Card */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={22} color="#f59e0b" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>Relational Database</h3>
            </div>
            <span className="badge badge-amber">
              <CheckCircle2 size={12} /> Synced
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Role:</strong> Relational State (Contacts, Meetings, Tasks)</div>
            <div><strong>Total Contacts:</strong> {stats?.total_contacts || 0}</div>
            <div><strong>Total Meetings:</strong> {stats?.total_meetings || 0}</div>
            <div><strong>Open Commitments:</strong> {stats?.open_commitments || 0}</div>
          </div>
        </div>
      </div>

      {/* Separation of Concerns Architecture Box */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
          Separation of Concerns: Why Hindsight is Not Replaced by PostgreSQL
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          In PrepPilot AI, <strong>PostgreSQL</strong> answers <em>"What application records exist?"</em> (contacts, meeting dates, user metadata), while <strong>Hindsight</strong> answers <em>"What does the agent remember about this relationship over time?"</em> (active concerns, resolved objections, communication preferences, and evolving stakeholder dynamics).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '6px' }}>1. Temporal Evolution</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Hindsight distinguishes past resolved concerns (e.g. pricing) from current active blockers (e.g. SOC 2 security).
            </p>
          </div>

          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '6px' }}>2. Multi-Strategy TEMPR Recall</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Retrieval combines dense vector similarity, keyword sparse BM25, entity graphs, and temporal chains into fixed token budgets.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#c4b5fd', marginBottom: '6px' }}>3. Behavior Adaptation</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Learned contact preferences (e.g. technical documentation first) directly reshape future briefing recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#ffffff' }}>
            Demo Data &amp; Storyline Reset
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Reset database and seed Sarah Johnson (Acme Corporation) and 4 enterprise contacts with authentic Hindsight memory banks.
          </p>
        </div>

        <button
          onClick={onSeedDemo}
          disabled={isSeeding}
          className="btn btn-primary btn-sm"
        >
          <RotateCcw size={14} className={isSeeding ? 'animate-spin' : ''} />
          {isSeeding ? 'Seeding Data...' : 'Reset & Seed Demo Data'}
        </button>
      </div>
    </div>
  );
}
