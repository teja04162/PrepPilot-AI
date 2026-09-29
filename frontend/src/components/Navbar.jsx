import React from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Database,
  Brain,
  CheckCircle2,
  CalendarPlus,
  UserPlus
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  onSeedDemo, 
  onOpenAddMeeting, 
  onOpenAddContact,
  isSeeding 
}) {
  const titles = {
    dashboard: 'Executive Dashboard',
    contacts: 'Contact Intelligence & Dossiers',
    meetings: 'Meeting History & Knowledge Extraction',
    prepare: 'Prepare Me — AI Pre-Meeting Briefing',
    memory: 'What PrepPilot Remembers (Hindsight Memory Banks)',
    settings: 'System Diagnostics & Model Settings',
  };

  return (
    <header style={{ height: '72px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(14, 21, 38, 0.7)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 30 }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
          {titles[activeTab] || 'PrepPilot AI'}
        </h1>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <span>Persistent biomimetic long-term memory</span>
          <span>•</span>
          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            Hindsight Synced
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Seed Demo Button */}
        <button
          onClick={onSeedDemo}
          disabled={isSeeding}
          className="btn btn-secondary btn-sm"
          title="Reset database and seed Sarah Johnson Acme Corporation storyline"
        >
          <RotateCcw size={14} className={isSeeding ? 'animate-spin' : ''} />
          {isSeeding ? 'Seeding Demo...' : 'Reset Demo Data'}
        </button>

        {/* Add Contact */}
        <button
          onClick={onOpenAddContact}
          className="btn btn-secondary btn-sm"
        >
          <UserPlus size={14} />
          Add Contact
        </button>

        {/* Log Meeting */}
        <button
          onClick={onOpenAddMeeting}
          className="btn btn-emerald btn-sm"
        >
          <CalendarPlus size={14} />
          Log Meeting
        </button>
      </div>
    </header>
  );
}
