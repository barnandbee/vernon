'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Sparkles, Send, BookOpen, Video, Wrench, Headphones, Clock } from 'lucide-react';
import { RESOURCE_LIBRARY, searchResources, type Resource, type ResourceType } from '../coachData';

const STARTER_PROMPTS = [
  'A client who has lost confidence ahead of interviews',
  'Someone exploring a career pivot but feeling stuck',
  'A client preparing to negotiate a promotion',
  'A returner rebuilding confidence after a career break',
];

const TYPE_ICON: Record<ResourceType, LucideIcon> = {
  Article: BookOpen,
  Video: Video,
  Toolkit: Wrench,
  Podcast: Headphones,
};

const TYPE_STYLE: Record<ResourceType, { bg: string; color: string }> = {
  Article: { bg: '#eff6ff', color: '#1d4ed8' },
  Video: { bg: '#fdf2f8', color: '#be185d' },
  Toolkit: { bg: '#fff7ed', color: '#c2410c' },
  Podcast: { bg: '#f5f3ff', color: '#7c3aed' },
};

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = TYPE_ICON[resource.type];
  const style = TYPE_STYLE[resource.type];
  return (
    <div className="rounded-2xl p-4 flex flex-col" style={{ background: 'var(--surface)' }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: style.bg }}>
          <Icon size={18} style={{ color: style.color }} />
        </div>
        <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: style.bg, color: style.color }}>
          {resource.type}
        </span>
      </div>
      <p className="text-sm font-semibold leading-snug mb-1" style={{ color: 'var(--foreground)' }}>{resource.title}</p>
      <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>{resource.summary}</p>
      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        <Clock size={11} />
        {resource.duration}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [results, setResults] = useState<Resource[] | null>(null);

  const runSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setActiveQuery(trimmed);
    setResults(searchResources(trimmed));
    setQuery('');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Resource Finder</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Describe a client situation and let AI suggest resources to share
        </p>
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
            {results.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </div>
      )}

      {/* Full library */}
      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Full Resource Library
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RESOURCE_LIBRARY.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
