'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Send, Clock, Users, UserPlus, CheckCircle2 } from 'lucide-react';
import { CLIENTS } from '../coachData';
import { RESOURCE_LIBRARY, searchResources, TYPE_META, getResourceLibrary, type LibraryResource } from '@/lib/resourceLibrary';
import { assignResource } from '@/lib/library';
import ResourceModal from '@/components/ResourceModal';

const STARTER_PROMPTS = [
  'A client who has lost confidence ahead of interviews',
  'Someone exploring a career pivot but feeling stuck',
  'A client preparing to negotiate a promotion',
  'A returner rebuilding confidence after a career break',
];

function ResourceCard({ resource, onOpen, onAssign, assignLabel, justAssigned }: {
  resource: LibraryResource;
  onOpen: () => void;
  onAssign: () => void;
  assignLabel: string;
  justAssigned: boolean;
}) {
  const meta = TYPE_META[resource.type];
  const Icon = meta.icon;
  return (
    <div className="rounded-2xl p-4 flex flex-col" style={{ background: 'var(--surface)' }}>
      <button onClick={onOpen} className="text-left flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
            <Icon size={18} style={{ color: meta.color }} />
          </div>
          <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: meta.bg, color: meta.color }}>
            {resource.type}
          </span>
        </div>
        <p className="text-sm font-semibold leading-snug mb-1" style={{ color: 'var(--foreground)' }}>{resource.title}</p>
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>{resource.summary}</p>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Clock size={11} />
          {resource.mins} min {meta.verb}
        </div>
      </button>
      <button
        onClick={onAssign}
        className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl"
        style={justAssigned ? { background: '#f0fdf4', color: '#15803d' } : { background: 'var(--surface-muted)', color: 'var(--primary)' }}
      >
        {justAssigned ? <><CheckCircle2 size={13} /> Assigned to {assignLabel}</> : <><UserPlus size={13} /> Assign to {assignLabel}</>}
      </button>
    </div>
  );
}

export default function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [results, setResults] = useState<LibraryResource[] | null>(null);
  const [selectedClientId, setSelectedClientId] = useState(CLIENTS[0].id);
  const [activeResource, setActiveResource] = useState<LibraryResource | null>(null);
  const [justAssigned, setJustAssigned] = useState<string | null>(null);
  const [library, setLibrary] = useState<LibraryResource[]>(RESOURCE_LIBRARY);

  useEffect(() => {
    setLibrary(getResourceLibrary());
  }, []);

  const selectedClient = CLIENTS.find((c) => c.id === selectedClientId) ?? CLIENTS[0];
  const assignLabel = selectedClient.name.split(' ')[0];

  const runSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setActiveQuery(trimmed);
    setResults(searchResources(trimmed));
    setQuery('');
  };

  const handleAssign = (resource: LibraryResource) => {
    assignResource(selectedClientId, resource.id);
    const key = `${selectedClientId}-${resource.id}`;
    setJustAssigned(key);
    setTimeout(() => setJustAssigned((cur) => (cur === key ? null : cur)), 2000);
  };

  const renderCard = (r: LibraryResource) => (
    <ResourceCard
      key={r.id}
      resource={r}
      onOpen={() => setActiveResource(r)}
      onAssign={() => handleAssign(r)}
      assignLabel={assignLabel}
      justAssigned={justAssigned === `${selectedClientId}-${r.id}`}
    />
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>Resource Finder</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Describe a client situation and let AI suggest resources to share
        </p>
      </div>

      {/* Coachee selector */}
      <div className="rounded-2xl p-4 flex items-center gap-3 flex-wrap" style={{ background: 'var(--surface)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#e8f4f8' }}>
          <Users size={16} style={{ color: 'var(--primary)' }} />
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Assigning resources for</span>
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="px-3 py-1.5 rounded-xl border text-sm font-semibold outline-none"
          style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        >
          {CLIENTS.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Search card */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary)' }}>
            <Sparkles size={18} className="text-white" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(query); }}
            placeholder="e.g. A client preparing for a tough negotiation..."
            className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
          <button
            onClick={() => runSearch(query)}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white flex-shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            <Send size={14} />
            Search
          </button>
        </div>

        {!results && (
          <div className="flex flex-wrap gap-2 mt-4">
            {STARTER_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => runSearch(p)}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'var(--surface-muted)', color: 'var(--text-muted)' }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
              Suggested for &ldquo;{activeQuery}&rdquo;
            </h2>
            <button
              onClick={() => { setResults(null); setActiveQuery(''); }}
              className="text-xs font-medium"
              style={{ color: 'var(--primary)' }}
            >
              Clear
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map(renderCard)}
          </div>
        </div>
      )}

      {/* Full library */}
      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Full Resource Library
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {library.map(renderCard)}
        </div>
      </div>

      {activeResource && (
        <ResourceModal
          resource={activeResource}
          onClose={() => setActiveResource(null)}
          footer={
            <button
              onClick={() => handleAssign(activeResource)}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl"
              style={justAssigned === `${selectedClientId}-${activeResource.id}`
                ? { background: '#f0fdf4', color: '#15803d' }
                : { background: 'var(--primary)', color: '#fff' }
              }
            >
              {justAssigned === `${selectedClientId}-${activeResource.id}`
                ? <><CheckCircle2 size={15} /> Assigned to {assignLabel}</>
                : <><UserPlus size={15} /> Assign to {assignLabel}</>
              }
            </button>
          }
        />
      )}
    </div>
  );
}
