import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Lightbulb, 
  Flag,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Layers
} from 'lucide-react';

export default function MemoryTimeline({ timeline = [], contactName }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Layers size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
        <p style={{ fontSize: '0.875rem' }}>No memory events recorded yet.</p>
      </div>
    );
  }

  const getCategoryConfig = (category, title) => {
    const cat = category.toLowerCase();
    const t = title.toLowerCase();

    if (cat === 'resolution' || t.includes('resolved') || t.includes('no longer')) {
      return {
        badgeClass: 'badge-emerald',
        icon: ShieldCheck,
        border: '#10b981',
        bg: 'rgba(16, 185, 129, 0.12)',
        label: 'Resolved Issue',
      };
    }
    if (cat === 'concern' || t.includes('concern') || t.includes('blocker')) {
      return {
        badgeClass: 'badge-amber',
        icon: AlertCircle,
        border: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.12)',
        label: 'Concern Raised',
      };
    }
    if (cat === 'preference' || t.includes('prefer')) {
      return {
        badgeClass: 'badge-violet',
        icon: Sliders,
        border: '#8b5cf6',
        bg: 'rgba(139, 92, 246, 0.12)',
        label: 'Durable Preference',
      };
    }
    if (cat === 'milestone' || t.includes('meeting') || t.includes('discovery') || t.includes('review')) {
      return {
        badgeClass: 'badge-primary',
        icon: Calendar,
        border: '#6366f1',
        bg: 'rgba(99, 102, 241, 0.12)',
        label: 'Meeting Milestone',
      };
    }
    return {
      badgeClass: 'badge-neutral',
      icon: Lightbulb,
      border: '#64748b',
      bg: 'rgba(255, 255, 255, 0.05)',
      label: 'Learned Fact',
    };
  };

  return (
    <div style={{ position: 'relative', padding: '16px 0 16px 20px' }}>
      {/* Central Timeline Line */}
      <div
        style={{
          position: 'absolute',
          left: '32px',
          top: '24px',
          bottom: '24px',
          width: '2px',
          background: 'linear-gradient(to bottom, #6366f1 0%, #8b5cf6 50%, #10b981 100%)',
          opacity: 0.4,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {timeline.map((event, index) => {
          const config = getCategoryConfig(event.category, event.title);
          const Icon = config.icon;

          return (
            <div
              key={event.id || index}
              className="animate-fade-in"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                position: 'relative',
              }}
            >
              {/* Timeline Icon Node */}
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--bg-elevated)',
                  border: `2px solid ${config.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  marginTop: '10px',
                  boxShadow: `0 0 12px ${config.border}40`,
                }}
              >
                <Icon size={13} color={config.border} />
              </div>

              {/* Event Content Card */}
              <div
                className="glass-card"
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  background: 'rgba(18, 26, 44, 0.85)',
                  borderLeft: `3px solid ${config.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${config.badgeClass}`}>{config.label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                      {event.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {event.date}
                  </span>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
