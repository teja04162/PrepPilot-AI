import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'primary', badge }) {
  const colorMap = {
    primary: {
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.3)',
      iconBg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      text: '#a5b4fc',
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
      iconBg: 'linear-gradient(135deg, #10b981, #059669)',
      text: '#6ee7b7',
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
      text: '#fcd34d',
    },
    violet: {
      bg: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.3)',
      iconBg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      text: '#c4b5fd',
    },
  };

  const scheme = colorMap[color] || colorMap.primary;

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {value}
          </div>
        </div>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: scheme.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {Icon && <Icon size={22} color="#ffffff" />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>
        {badge && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '9999px',
              background: scheme.bg,
              color: scheme.text,
              border: `1px solid ${scheme.border}`,
              fontWeight: 600,
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
