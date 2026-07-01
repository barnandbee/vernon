'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { hasCapability } from '@/lib/permissions';
import {
  getResourceLibrary, createLibraryResource, updateLibraryResource, deleteLibraryResource,
  TYPE_META, type AudienceType, type LibraryResource, type ResourceType,
} from '@/lib/resourceLibrary';
import { Plus, Pencil, Trash2, X, Check, ShieldAlert, Star } from 'lucide-react';

const AUDIENCE_OPTIONS: { key: AudienceType; label: string; bg: string; color: string }[] = [
  { key: 'school',     label: 'School',            bg: '#fdf4ff', color: '#7e22ce' },
  { key: 'university', label: 'University',         bg: '#eff6ff', color: '#1d4ed8' },
  { key: 'general',    label: 'General (working age)', bg: '#f0fdf4', color: '#15803d' },
];

type FormState = {
  type: ResourceType;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string;
  mins: string;
  author: string;
  date: string;
  featured: boolean;
  audiences: AudienceType[];
};

const EMPTY_FORM: FormState = {
  type: 'Article', title: '', summary: '', content: '', category: '', tags: '', mins: '5', author: '', date: '', featured: false, audiences: [],
};

const inputStyle = { background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' };

export default function AdminResourcesPage() {
  const { user } = useAuth();
  const canManage = hasCapability(user?.adminLevel, 'manage_resources');

  const [library, setLibrary] = useState<LibraryResource[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setLibrary(getResourceLibrary());
  }, []);

  const openAddForm = () => {
    if (!canManage) return;
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (r: LibraryResource) => {
    if (!canManage) return;
    setForm({
      type: r.type, title: r.title, summary: r.summary, content: r.content ?? '',
      category: r.category, tags: r.tags.join(', '), mins: String(r.mins),
      author: r.author, date: r.date, featured: !!r.featured, audiences: r.audiences ?? [],
    });
    setEditingId(r.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = () => {
    if (!canManage) return;
    if (!form.title.trim() || !form.summary.trim() || !form.category.trim() || !form.author.trim() || !form.date.trim()) return;

    const input = {
      type: form.type,
      title: form.title.trim(),
      summary: form.summary.trim(),
      content: form.content.trim() || undefined,
      category: form.category.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      mins: Math.max(1, parseInt(form.mins, 10) || 1),
      author: form.author.trim(),
      date: form.date.trim(),
      featured: form.featured,
      audiences: form.audiences,
    };

    if (editingId) {
      setLibrary(updateLibraryResource(editingId, input));
    } else {
      const created = createLibraryResource(input);
      setLibrary((prev) => [created, ...prev]);
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (!canManage) return;
    setLibrary(deleteLibraryResource(id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>Resources</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Edit the shared library — changes appear immediately on member Resources and the coach Resource Finder.
          </p>
        </div>
        {canManage && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white flex-shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            <Plus size={16} /> Add Resource
          </button>
        )}
      </div>

      {!canManage && (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: '#fffbeb' }}>
          <ShieldAlert size={18} style={{ color: '#a16207' }} className="flex-shrink-0" />
          <p className="text-sm" style={{ color: '#a16207' }}>
            Your permission level is read-only here — you can view the library, but adding, editing, or removing resources requires a higher admin level.
          </p>
        </div>
      )}

      {/* Resource list */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="space-y-2">
          {library.map((r) => {
            const meta = TYPE_META[r.type];
            const Icon = meta.icon;
            return (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl flex-wrap" style={{ background: 'var(--surface-muted)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                  <Icon size={16} style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{r.title}</p>
                    {r.featured && <Star size={12} className="fill-current flex-shrink-0" style={{ color: '#f59e0b' }} />}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{r.category} · {r.author} · {r.mins} min</p>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: 'var(--surface)', color: meta.color }}>
                    {meta.label}
                  </span>
                  {(r.audiences ?? []).map((aud) => {
                    const a = AUDIENCE_OPTIONS.find((o) => o.key === aud);
                    return a ? (
                      <span key={aud} className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: a.bg, color: a.color }}>
                        {a.key === 'general' ? 'General' : a.key === 'school' ? 'School' : 'University'}
                      </span>
                    ) : null;
                  })}
                </div>
                {canManage && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {confirmDeleteId === r.id ? (
                      <>
                        <button onClick={() => handleDelete(r.id)} aria-label="Confirm delete" style={{ color: '#b91c1c' }}>
                          <Check size={16} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)} aria-label="Cancel delete" style={{ color: 'var(--text-muted)' }}>
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openEditForm(r)} aria-label="Edit resource" style={{ color: 'var(--text-muted)' }}>
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(r.id)} aria-label="Delete resource" style={{ color: 'var(--text-muted)' }}>
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
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: 'var(--surface)' }}>
            <button onClick={closeForm} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: 'var(--text-muted)' }} aria-label="Close">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              {editingId ? 'Edit Resource' : 'Add Resource'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as ResourceType })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                >
                  {Object.entries(TYPE_META).map(([value, meta]) => (
                    <option key={value} value={value}>{meta.label}</option>
                  ))}
                </select>
              </div>
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
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Summary</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Content (optional, full article text)</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                  style={inputStyle}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Minutes</label>
                  <input
                    type="number"
                    min={1}
                    value={form.mins}
                    onChange={(e) => setForm({ ...form, mins: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Tags (comma-separated)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g. confidence, negotiation, pay"
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Author</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Date</label>
                  <input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="e.g. Jun 12, 2026"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--foreground)' }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Feature this resource
              </label>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>
                  Audience — who can see this resource (leave all unchecked to show to everyone)
                </label>
                <div className="flex gap-4 flex-wrap">
                  {AUDIENCE_OPTIONS.map((opt) => (
                    <label key={opt.key} className="flex items-center gap-1.5 text-sm cursor-pointer" style={{ color: 'var(--foreground)' }}>
                      <input
                        type="checkbox"
                        checked={form.audiences.includes(opt.key)}
                        onChange={(e) => setForm({
                          ...form,
                          audiences: e.target.checked
                            ? [...form.audiences, opt.key]
                            : form.audiences.filter((a) => a !== opt.key),
                        })}
                      />
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: opt.bg, color: opt.color }}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!form.title.trim() || !form.summary.trim() || !form.category.trim() || !form.author.trim() || !form.date.trim()}
              className="w-full mt-5 flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl text-white disabled:opacity-40"
              style={{ background: 'var(--primary)' }}
            >
              {editingId ? 'Save Changes' : 'Add Resource'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
