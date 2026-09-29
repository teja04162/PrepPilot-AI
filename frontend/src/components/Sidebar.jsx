import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Sparkles, 
  Database, 
  Settings, 
  BrainCircuit,
  Zap,
  CheckSquare
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onQuickDemo }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'meetings', label: 'Meetings', icon: CalendarDays },
    { id: 'prepare', label: 'Prepare Me', icon: Sparkles, badge: 'Hero' },
    { id: 'memory', label: 'Memory Bank', icon: Database },
    { id: 'settings', label: 'Diagnostics', icon: Settings },
  ];

  return (
    <aside style={{ width: '260px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
          <BrainCircuit size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PrepPilot<span style={{ color: '#818cf8', WebkitTextFillColor: '#818cf8' }}>.AI</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Hindsight Memory Agent
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 10px 12px' }}>
          Navigation
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.18) 0%, rgba(99, 102, 241, 0.05) 100%)' : 'transparent',
                  color: isActive ? '#a5b4fc' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                  position: 'relative',
                }}
              >
                <Icon size={18} color={isActive ? '#818cf8' : 'currentColor'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ fontSize: '0.6875rem', padding: '2px 6px', borderRadius: '6px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 700 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Demo Card */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={16} color="#818cf8" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#e0e7ff' }}>Sarah Johnson Demo</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
            Experience 3-stage memory evolution &amp; learning brief.
          </p>
          <button
            onClick={onQuickDemo}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', fontSize: '0.75rem' }}
          >
            Launch Sarah Demo
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          Hindsight Cloud
        </span>
        <span>v1.0.0</span>
      </div>
    </aside>
  );
}
