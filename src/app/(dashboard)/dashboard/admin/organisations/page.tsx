'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { hasCapability } from '@/lib/permissions';
import {
  getOrganisations, createOrganisation, updateOrganisation, deleteOrganisation, type Organisation,
} from '@/lib/organisations';
import { Plus, Pencil, Trash2, X, Check, ShieldAlert, Building2 } from 'lucide-react';

const PLAN_LABELS: Record<Organisation['plan'], string> = {
  starter: 'Starter',
  growth: 'Growth',
  enterprise: 'Enterprise',
};

const STATUS_STYLES: Record<Organisation['status'], { bg: string; color: string; label: string }> = {
  active: { bg: '#f0fdf4', color: '#15803d', label: 'Active' },
  suspended: { bg: '#fef2f2', color: '#b91c1c', label: 'Suspended' },
};

type FormState = {
  name: string;
  contactName: string;
  contactEmail: string;
  memberCount: string;
  plan: Organisation['plan'];
  status: Organisation['status'];
};

const EMPTY_FORM: FormState = {
  name: '', contactName: '', contactEmail: '', memberCount: '0', plan: 'starter', status: 'active',
};

const inputStyle = { background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' };

export default function AdminOrganisationsPage() {
  const { user } = useAuth();
  const canManage = hasCapability(user?.adminLevel, 'manage_organisations');

  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setOrgs(getOrganisations());
  }, []);

  const openAddForm = () => {
    if (!canManage) return;
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (o: Organisation) => {
    if (!canManage) return;
    setForm({
      name: o.name, contactName: o.contactName, contactEmail: o.contactEmail,
      memberCount: String(o.memberCount), plan: o.plan, status: o.status,
    });
    setEditingId(o.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = () => {
    if (!canManage) return;
    if (!form.name.trim() || !form.contactName.trim() || !form.contactEmail.trim()) return;

    const input = {
      name: form.name.trim(),
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      memberCount: Math.max(0, parseInt(form.memberCount, 10) || 0),
      plan: form.plan,
      status: form.status,
    };

    if (editingId) {
      setOrgs(updateOrganisation(editingId, input));
    } else {
      const created = createOrganisation(input);
      setOrgs((prev) => [created, ...prev]);
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (!canManage) return;
    setOrgs(deleteOrganisation(id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>Organisations</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage the organisations using Vernon, their plan, and their primary contact.
          </p>
        </div>
        {canManage && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white flex-shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            <Plus size={16} /> Add Organisation
          </button>
        )}
      </div>

      {!canManage && (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: '#fffbeb' }}>
          <ShieldAlert size={18} style={{ color: '#a16207' }} className="flex-shrink-0" />
          <p className="text-sm" style={{ color: '#a16207' }}>
            Your permission level is read-only here — you can view organisations, but adding, editing, or removing them requires a higher admin level.
          </p>
        </div>
      )}

      {/* Organisation list */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="space-y-2">
          {orgs.map((o) => {
            const status = STATUS_STYLES[o.status];
            return (
              <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl flex-wrap" style={{ background: 'var(--surface-muted)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f0fdf4' }}>
                  <Building2 size={18} style={{ color: '#15803d' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{o.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{o.contactName} · {o.contactEmail}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
                  {o.memberCount} members
                </span>
                <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                  {PLAN_LABELS[o.plan]}
                </span>
                <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: status.bg, color: status.color }}>
                  {status.label}
                </span>
                {canManage && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {confirmDeleteId === o.id ? (
                      <>
                        <button onClick={() => handleDelete(o.id)} aria-label="Confirm delete" style={{ color: '#b91c1c' }}>
                          <Check size={16} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)} aria-label="Cancel delete" style={{ color: 'var(--text-muted)' }}>
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openEditForm(o)} aria-label="Edit organisation" style={{ color: 'var(--text-muted)' }}>
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(o.id)} aria-label="Delete organisation" style={{ color: 'var(--text-muted)' }}>
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeForm} />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: 'var(--surface)' }}>
            <button onClick={closeForm} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: 'var(--text-muted)' }} aria-label="Close">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              {editingId ? 'Edit Organisation' : 'Add Organisation'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Organisation Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Primary Contact Name</label>
                <input
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Primary Contact Email</label>
                <input
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Member Count</label>
                <input
                  type="number"
                  min={0}
                  value={form.memberCount}
                  onChange={(e) => setForm({ ...form, memberCount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Plan</label>
                <select
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value as Organisation['plan'] })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                >
                  {Object.entries(PLAN_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Organisation['status'] })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!form.name.trim() || !form.contactName.trim() || !form.contactEmail.trim()}
              className="w-full mt-5 flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl text-white disabled:opacity-40"
              style={{ background: 'var(--primary)' }}
            >
              {editingId ? 'Save Changes' : 'Add Organisation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
