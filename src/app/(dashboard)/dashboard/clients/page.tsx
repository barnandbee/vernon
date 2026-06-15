'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CLIENTS, type Client } from '../coachData';
import { getSharedNotes, type SharedNote } from '@/lib/sharedNotes';
import {
  CheckCircle2, Circle, Plus, Sparkles, Clock, Target, MessageSquare, NotebookPen, Bot,
} from 'lucide-react';

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [selectedId, setSelectedId] = useState<string>(CLIENTS[0].id);
  const [newItemText, setNewItemText] = useState('');
  const [sharedNotes, setSharedNotes] = useState<SharedNote[]>([]);

  useEffect(() => {
    setSharedNotes(getSharedNotes());
  }, []);

  const selected = clients.find((c) => c.id === selectedId) ?? clients[0];
  const doneCount = selected.actionPlan.filter((i) => i.done).length;
  const clientNotes = sharedNotes.filter((n) => n.clientId === selected.id);

  const toggleItem = (itemId: string) => {
    setClients((prev) => prev.map((c) => c.id !== selected.id ? c : {
      ...c,
      actionPlan: c.actionPlan.map((i) => i.id === itemId ? { ...i, done: !i.done } : i),
    }));
  };

  const addItem = () => {
    const text = newItemText.trim();
    if (!text) return;
    setClients((prev) => prev.map((c) => c.id !== selected.id ? c : {
      ...c,
      actionPlan: [...c.actionPlan, { id: `${c.id}-extra-${c.actionPlan.length}`, text, done: false }],
    }));
    setNewItemText('');
  };

  const addInsightToActionPlan = (insight: Client['transcriptInsights'][number]) => {
    const itemId = `${selected.id}-ai-${insight.id}`;
    setClients((prev) => prev.map((c) => c.id !== selected.id ? c : {
      ...c,
      actionPlan: [...c.actionPlan, { id: itemId, text: insight.text, done: false }],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>My Clients</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Review progress and keep action plans up to date
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client list */}
        <div className="space-y-3">
          {clients.map((c) => {
            const done = c.actionPlan.filter((i) => i.done).length;
            const active = c.id === selected.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className="w-full text-left rounded-2xl p-4 transition-all"
                style={active
                  ? { background: 'var(--primary)', color: '#fff' }
                  : { background: 'var(--surface)', color: 'var(--foreground)' }
                }
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: active ? 'rgba(255,255,255,0.2)' : c.color }}
                  >
                    {c.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    <p className="text-xs truncate" style={{ color: active ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{c.focus}</p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: active ? 'rgba(255,255,255,0.2)' : 'var(--surface-muted)' }}>
                  <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: active ? '#fff' : 'var(--primary)' }} />
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: active ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
                  <span>{c.progress}% progress</span>
                  <span>{done}/{c.actionPlan.length} actions done</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Profile + action plan */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile card */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
            <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: selected.color }}
                >
                  {selected.initials}
                </div>
                <div>
                  <p className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>{selected.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{selected.focus}</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/resources')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
                style={{ background: '#f5f3ff', color: '#7c3aed' }}
              >
                <Sparkles size={13} />
                Find resources
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-4">
              {selected.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
                  {t}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={12} />
                  <span className="text-xs font-medium">Last session</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{selected.lastSession}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-muted)' }}>
                  <Target size={12} />
                  <span className="text-xs font-medium">Next session</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{selected.nextSession}</p>
              </div>
            </div>
          </div>

          {/* Coach notes */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} style={{ color: 'var(--primary)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Coach Notes</h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{selected.note}</p>
          </div>

          {/* Notes shared by the client from My Journey */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center gap-2 mb-2">
              <NotebookPen size={16} style={{ color: 'var(--primary)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Notes from {selected.name.split(' ')[0]}</h2>
            </div>
            {clientNotes.length > 0 ? (
              <div className="space-y-2">
                {clientNotes.map((note) => (
                  <div key={note.id} className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>{note.text}</p>
                    <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>Shared {note.createdAt}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Nothing shared yet — notes {selected.name.split(' ')[0]} sends from My Journey will appear here before your next session.
              </p>
            )}
          </div>

          {/* AI notes from transcript */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Bot size={16} style={{ color: '#7c3aed' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>AI Notes from Transcript</h2>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              Generated from the recording of {selected.lastSession.split(' · ')[0]}. Add anything useful straight to {selected.name.split(' ')[0]}&rsquo;s action plan.
            </p>
            <div className="space-y-2">
              {selected.transcriptInsights.map((insight) => {
                const added = selected.actionPlan.some((i) => i.id === `${selected.id}-ai-${insight.id}`);
                return (
                  <div key={insight.id} className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                    <p className="text-xs italic mb-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>&ldquo;{insight.quote}&rdquo;</p>
                    <p className="text-sm mb-3" style={{ color: 'var(--foreground)' }}>{insight.text}</p>
                    <button
                      onClick={() => addInsightToActionPlan(insight)}
                      disabled={added}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={added ? { background: '#f0fdf4', color: '#15803d' } : { background: '#f5f3ff', color: '#7c3aed' }}
                    >
                      {added ? <><CheckCircle2 size={13} /> Added to action plan</> : <><Plus size={13} /> Add to action plan</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action plan */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Action Plan</h2>
              <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>{doneCount}/{selected.actionPlan.length}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: 'var(--surface-muted)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${selected.actionPlan.length > 0 ? (doneCount / selected.actionPlan.length) * 100 : 0}%`, background: 'var(--primary)' }}
              />
            </div>
            <div className="space-y-2 mb-4">
              {selected.actionPlan.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl text-left"
                  style={{ background: 'var(--surface-muted)' }}
                >
                  {item.done
                    ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#15803d' }} />
                    : <Circle size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                  }
                  <span
                    className="text-sm"
                    style={{ color: item.done ? 'var(--text-muted)' : 'var(--foreground)', textDecoration: item.done ? 'line-through' : 'none' }}
                  >
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addItem(); }}
                placeholder="Add a new action item..."
                className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl text-white flex-shrink-0"
                style={{ background: 'var(--primary)' }}
              >
                <Plus size={15} />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
