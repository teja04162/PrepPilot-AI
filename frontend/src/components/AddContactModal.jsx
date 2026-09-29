import React, { useState } from 'react';
import { UserPlus, X, Database } from 'lucide-react';

export default function AddContactModal({ isOpen, onClose, onSaveContact, isSubmitting }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('Active Prospect');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !role.trim()) return;

    onSaveContact({
      name: name.trim(),
      company: company.trim(),
      role: role.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      relationship_status: relationshipStatus,
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={20} color="#6366f1" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              Add Enterprise Contact
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Sarah Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Company</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Acme Corporation"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Role / Job Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., VP of Technology"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                className="form-input"
                placeholder="sarah@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Relationship Stage</label>
              <select
                className="form-select"
                value={relationshipStatus}
                onChange={(e) => setRelationshipStatus(e.target.value)}
              >
                <option value="Active Prospect">Active Prospect</option>
                <option value="Security Review">Security Review</option>
                <option value="POC in Progress">POC in Progress</option>
                <option value="Commercial Alignment">Commercial Alignment</option>
                <option value="Closed Won">Closed Won</option>
              </select>
            </div>
          </div>

          {/* Provisioning Notice */}
          <div style={{ padding: '10px 14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#a5b4fc' }}>
            <Database size={14} />
            <span>A dedicated Hindsight memory bank container will be created automatically.</span>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-sm"
            >
              {isSubmitting ? 'Provisioning...' : 'Create Contact & Memory Bank'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
