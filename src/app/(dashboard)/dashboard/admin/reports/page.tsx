'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { hasCapability } from '@/lib/permissions';
import { getConfiguredReportFields, setReportFieldConfig, REPORT_GROUPS, type ReportField } from '@/lib/orgData';
import { Pencil, X, ShieldAlert, CheckSquare, Square } from 'lucide-react';

const KIND_LABELS: Record<ReportField['kind'], string> = {
  stats: 'Stats',
  trend: 'Trend',
  bars: 'Bars',
  bands: 'Bands',
  table: 'Table',
};

type FormState = { title: string; description: string; group: string };

const inputStyle = { background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' };

export default function AdminReportsPage() {
  const { user } = useAuth();
  const canManage = hasCapability(user?.adminLevel, 'manage_reports');

  const [fields, setFields] = useState<ReportField[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ title: '', description: '', group: REPORT_GROUPS[0] });

  useEffect(() => {
    setFields(getConfiguredReportFields());
  }, []);

  const refresh = () => setFields(getConfiguredReportFields());

  const toggleEnabled = (field: ReportField) => {
    if (!canManage) return;
    setReportFieldConfig(field.id, { enabled: field.enabled === false });
    refresh();
  };

  const openEditForm = (field: ReportField) => {
    if (!canManage) return;
    setForm({ title: field.title, description: field.description, group: field.group });
    setEditingId(field.id);
  };

  const closeForm = () => setEditingId(null);

  const handleSubmit = () => {
    if (!canManage || !editingId) return;
    if (!form.title.trim() || !form.description.trim()) return;
    setReportFieldConfig(editingId, { title: form.title.trim(), description: form.description.trim(), group: form.group });
    refresh();
    closeForm();
  };

  const grouped = REPORT_GROUPS
    .map((group) => ({ group, fields: fields.filter((f) => f.group === group) }))
    .filter((g) => g.fields.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>Report Fields</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Edit what organisation staff can see on their Dashboard and Reports pages. The underlying data never changes — only titles, descriptions, grouping, and visibility.
        </p>
      </div>

      {!canManage && (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: '#fffbeb' }}>
          <ShieldAlert size={18} style={{ color: '#a16207' }} className="flex-shrink-0" />
          <p className="text-sm" style={{ color: '#a16207' }}>
            Your permission level is read-only here — you can view report fields, but editing or toggling them requires a higher admin level.
          </p>
        </div>
      )}

      {/* Field groups */}
      <div className="space-y-6">
        {grouped.map(({ group, fields: groupFields }) => (
          <div key={group}>
            <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{group}</h2>
            <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
              <div className="space-y-2">
                {groupFields.map((f) => {
                  const enabled = f.enabled !== false;
                  return (
                    <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl flex-wrap" style={{ background: 'var(--surface-muted)' }}>
                      <button onClick={() => toggleEnabled(f)} disabled={!canManage} aria-label={enabled ? 'Disable field' : 'Enable field'} className="flex-shrink-0">
                        {enabled
                          ? <CheckSquare size={18} style={{ color: 'var(--primary)' }} />
                          : <Square size={18} style={{ color: 'var(--text-muted)' }} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: enabled ? 'var(--foreground)' : 'var(--text-muted)' }}>{f.title}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{f.description}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
                        {KIND_LABELS[f.kind]}
                      </span>
                      {!enabled && (
                        <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#fef2f2', color: '#b91c1c' }}>
                          Disabled
                        </span>
                      )}
                      {canManage && (
                        <button onClick={() => openEditForm(f)} aria-label="Edit field" style={{ color: 'var(--text-muted)' }} className="flex-shrink-0">
                          <Pencil size={15} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeForm} />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: 'var(--surface)' }}>
            <button onClick={closeForm} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: 'var(--text-muted)' }} aria-label="Close">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Edit Field</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Group</label>
                <select
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                >
                  {REPORT_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!form.title.trim() || !form.description.trim()}
              className="w-full mt-5 flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl text-white disabled:opacity-40"
              style={{ background: 'var(--primary)' }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
