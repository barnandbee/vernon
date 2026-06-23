'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { hasCapability, ADMIN_LEVELS, type AdminLevel } from '@/lib/permissions';
import {
  getPlatformUsers, createPlatformUser, updatePlatformUser, deletePlatformUser,
  type PlatformUser, type PlatformAccountType,
} from '@/lib/platformUsers';
import { getOrganisations, type Organisation } from '@/lib/organisations';
import { Plus, Pencil, Trash2, X, Check, ShieldAlert } from 'lucide-react';

const ACCOUNT_TYPE_LABELS: Record<PlatformAccountType, string> = {
  member: 'Member',
  org_staff: 'Organisation Staff',
  coach: 'Coach',
  platform_admin: 'Platform Admin',
};

const STATUS_STYLES: Record<PlatformUser['status'], { bg: string; color: string; label: string }> = {
  active: { bg: '#f0fdf4', color: '#15803d', label: 'Active' },
  invited: { bg: '#fffbeb', color: '#a16207', label: 'Invited' },
  suspended: { bg: '#fef2f2', color: '#b91c1c', label: 'Suspended' },
};

type FormState = {
  name: string;
  email: string;
  role: string;
  accountType: PlatformAccountType;
  orgName: string;
  adminLevel: AdminLevel;
  status: PlatformUser['status'];
};

const EMPTY_FORM: FormState = {
  name: '', email: '', role: '', accountType: 'member', orgName: '', adminLevel: 'viewer', status: 'invited',
};

const inputStyle = { background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' };

export default function AdminUsersPage() {
  const { user } = useAuth();
  const canManage = hasCapability(user?.adminLevel, 'manage_users');

  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setUsers(getPlatformUsers());
    setOrgs(getOrganisations());
  }, []);

  const openAddForm = () => {
    if (!canManage) return;
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (u: PlatformUser) => {
    if (!canManage) return;
    setForm({
      name: u.name, email: u.email, role: u.role, accountType: u.accountType,
      orgName: u.orgName ?? '', adminLevel: u.adminLevel ?? 'viewer', status: u.status,
    });
    setEditingId(u.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = () => {
    if (!canManage) return;
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) return;

    const input = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      accountType: form.accountType,
      orgName: form.orgName || undefined,
      adminLevel: form.accountType === 'platform_admin' ? form.adminLevel : undefined,
      status: form.status,
    };

    if (editingId) {
      setUsers(updatePlatformUser(editingId, input));
    } else {
      const created = createPlatformUser(input);
      setUsers((prev) => [created, ...prev]);
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (!canManage) return;
    setUsers(deletePlatformUser(id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>Users</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage every account on the platform — members, organisation staff, coaches, and admins.
          </p>
        </div>
        {canManage && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white flex-shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            <Plus size={16} /> Add User
          </button>
        )}
      </div>

      {!canManage && (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: '#fffbeb' }}>
          <ShieldAlert size={18} style={{ color: '#a16207' }} className="flex-shrink-0" />
          <p className="text-sm" style={{ color: '#a16207' }}>
            Your permission level is read-only here — you can view users, but adding, editing, or removing them requires a higher admin level.
          </p>
        </div>
      )}

      {/* User list */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="space-y-2">
          {users.map((u) => {
            const status = STATUS_STYLES[u.status];
            const adminLevelLabel = u.adminLevel ? ADMIN_LEVELS.find((l) => l.value === u.adminLevel)?.label : null;
            return (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl flex-wrap" style={{ background: 'var(--surface-muted)' }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--primary)' }}
                >
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{u.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{u.email} · {u.role}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
                  {ACCOUNT_TYPE_LABELS[u.accountType]}
                </span>
                {adminLevelLabel && (
                  <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#fdf2f8', color: '#be185d' }}>
                    {adminLevelLabel}
                  </span>
                )}
                <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: status.bg, color: status.color }}>
                  {status.label}
                </span>
                {canManage && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {confirmDeleteId === u.id ? (
                      <>
                        <button onClick={() => handleDelete(u.id)} aria-label="Confirm delete" style={{ color: '#b91c1c' }}>
                          <Check size={16} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)} aria-label="Cancel delete" style={{ color: 'var(--text-muted)' }}>
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openEditForm(u)} aria-label="Edit user" style={{ color: 'var(--text-muted)' }}>
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(u.id)} aria-label="Delete user" style={{ color: 'var(--text-muted)' }}>
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
              {editingId ? 'Edit User' : 'Add User'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Role / Title</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Member, Career Coach, Programme Lead"
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Account Type</label>
                <select
                  value={form.accountType}
                  onChange={(e) => setForm({ ...form, accountType: e.target.value as PlatformAccountType })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                >
                  {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              {(form.accountType === 'member' || form.accountType === 'org_staff') && (
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Organisation</label>
                  <select
                    value={form.orgName}
                    onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={inputStyle}
                  >
                    <option value="">None</option>
                    {orgs.map((o) => (
                      <option key={o.id} value={o.name}>{o.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {form.accountType === 'platform_admin' && (
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Admin Level</label>
                  <select
                    value={form.adminLevel}
                    onChange={(e) => setForm({ ...form, adminLevel: e.target.value as AdminLevel })}
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={inputStyle}
                  >
                    {ADMIN_LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as PlatformUser['status'] })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="active">Active</option>
                  <option value="invited">Invited</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!form.name.trim() || !form.email.trim() || !form.role.trim()}
              className="w-full mt-5 flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl text-white disabled:opacity-40"
              style={{ background: 'var(--primary)' }}
            >
              {editingId ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
