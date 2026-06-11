'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Search, BookOpen, Video, Headphones, Layers, Clock, Tag, ChevronRight, Bookmark, TrendingUp } from 'lucide-react';

type ResourceFormat = 'article' | 'video' | 'podcast';

type Resource = {
  id: number;
  format: ResourceFormat;
  title: string;
  excerpt: string;
  tag: string;
  mins: number;
  featured?: boolean;
  author: string;
  date: string;
};

const CATEGORIES = ['All', 'Career Change', 'Leadership', 'Networking', 'Work-Life Balance', 'Salary & Negotiation', 'Skills', 'Resilience'];

const TYPE_TABS: { key: 'all' | ResourceFormat; label: string; icon: LucideIcon }[] = [
  { key: 'all', label: 'All', icon: Layers },
  { key: 'article', label: 'Articles', icon: BookOpen },
  { key: 'video', label: 'Videos', icon: Video },
  { key: 'podcast', label: 'Podcasts', icon: Headphones },
];

const FORMAT_META: Record<ResourceFormat, { label: string; icon: LucideIcon; verb: string }> = {
  article: { label: 'Article', icon: BookOpen, verb: 'read' },
  video: { label: 'Video', icon: Video, verb: 'watch' },
  podcast: { label: 'Podcast', icon: Headphones, verb: 'listen' },
};

const RESOURCES: Resource[] = [
  {
    id: 1, format: 'article', title: 'Navigating Career Transitions in Your 30s',
    excerpt: 'Practical strategies for making a meaningful career pivot while managing risk and maintaining momentum.',
    tag: 'Career Change', mins: 5, featured: true,
    author: 'Dr. Sarah Mitchell', date: 'Jun 5, 2026',
  },
  {
    id: 2, format: 'article', title: 'Building a Personal Brand That Opens Doors',
    excerpt: 'How to craft an authentic professional identity that attracts the right opportunities.',
    tag: 'Networking', mins: 7,
    author: 'James Park', date: 'Jun 2, 2026',
  },
  {
    id: 3, format: 'article', title: 'How to Ask for the Promotion You Deserve',
    excerpt: 'A step-by-step guide to preparing your case, timing the conversation, and handling objections.',
    tag: 'Salary & Negotiation', mins: 4,
    author: 'Lisa Chen', date: 'May 28, 2026',
  },
  {
    id: 4, format: 'article', title: 'The Introvert\'s Guide to Powerful Networking',
    excerpt: 'Reframe networking as relationship-building and discover strategies that suit your natural style.',
    tag: 'Networking', mins: 6,
    author: 'Mark Davies', date: 'May 24, 2026',
  },
  {
    id: 5, format: 'article', title: 'Leading Without Authority: Influence at Every Level',
    excerpt: 'How to drive change and inspire teams even when you don\'t hold a formal leadership title.',
    tag: 'Leadership', mins: 8,
    author: 'Dr. Aisha Patel', date: 'May 20, 2026',
  },
  {
    id: 6, format: 'article', title: 'Setting Boundaries Without Burning Bridges',
    excerpt: 'Communicate your limits at work in ways that build respect rather than resentment.',
    tag: 'Work-Life Balance', mins: 5,
    author: 'Tom Hargreaves', date: 'May 15, 2026',
  },
  {
    id: 7, format: 'video', title: 'Reframing Setbacks as Data, Not Verdicts',
    excerpt: 'A short watch on treating setbacks as information rather than a verdict on your ability — with simple reframes you can use straight away.',
    tag: 'Resilience', mins: 12,
    author: 'Dr. Aisha Patel', date: 'Jun 8, 2026',
  },
  {
    id: 8, format: 'video', title: 'Inside a Real Salary Negotiation (Roleplay)',
    excerpt: 'Watch a coach and client roleplay a negotiation conversation from opening to close, including the awkward pauses.',
    tag: 'Salary & Negotiation', mins: 18,
    author: 'Lisa Chen', date: 'Jun 1, 2026',
  },
  {
    id: 9, format: 'video', title: 'Five Body Language Tips for Interviews',
    excerpt: 'Quick, practical adjustments that help you come across as calm and confident on camera or in person.',
    tag: 'Skills', mins: 8,
    author: 'Mark Davies', date: 'May 22, 2026',
  },
  {
    id: 10, format: 'podcast', title: 'The Portfolio Career: Myth or Model?',
    excerpt: "Two coaches debate whether 'portfolio careers' are a realistic option or just a rebrand of job insecurity.",
    tag: 'Career Change', mins: 34,
    author: 'Vernon Conversations', date: 'Jun 6, 2026',
  },
  {
    id: 11, format: 'podcast', title: 'Negotiating Without Losing the Relationship',
    excerpt: 'How to ask for more without damaging trust with your manager — practical scripts included.',
    tag: 'Salary & Negotiation', mins: 28,
    author: 'Vernon Conversations', date: 'May 30, 2026',
  },
  {
    id: 12, format: 'podcast', title: 'Finding Your People: Networking for Introverts',
    excerpt: "Why networking doesn't have to mean small talk, and what to do instead.",
    tag: 'Networking', mins: 25,
    author: 'Vernon Conversations', date: 'May 18, 2026',
  },
];

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  'Career Change':       { bg: '#eff6ff', color: '#1d4ed8' },
  'Networking':          { bg: '#f0fdf4', color: '#15803d' },
  'Leadership':          { bg: '#fdf4ff', color: '#7e22ce' },
  'Work-Life Balance':   { bg: '#fff7ed', color: '#c2410c' },
  'Salary & Negotiation':{ bg: '#fefce8', color: '#a16207' },
  'Skills':              { bg: '#f0f9ff', color: '#0369a1' },
  'Resilience':          { bg: '#fef2f2', color: '#b91c1c' },
};

export default function ArticlesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState<'all' | ResourceFormat>('all');

  const filtered = RESOURCES.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || r.tag === activeCategory;
    const matchesType = activeType === 'all' || r.format === activeType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const featured = filtered.find((r) => r.featured);
  const showFeatured = !search && activeCategory === 'All' && activeType === 'all' && !!featured;
  const gridItems = showFeatured ? filtered.filter((r) => !r.featured) : filtered;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Resources</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Articles, videos, and podcasts curated to fuel your career growth
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TYPE_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveType(t.key)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={activeType === t.key
              ? { background: 'var(--primary)', color: '#fff' }
              : { background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
            }
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={activeCategory === cat
              ? { background: 'var(--primary)', color: '#fff' }
              : { background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured resource */}
      {showFeatured && featured && (
        <div
          className="rounded-2xl overflow-hidden cursor-pointer group"
          style={{ background: 'var(--primary)' }}
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-white/70" />
              <span className="text-white/70 text-xs font-medium uppercase tracking-wide">Featured</span>
            </div>
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-3 leading-snug">
              {featured.title}
            </h2>
            <p className="text-white/70 text-sm mb-5 leading-relaxed max-w-2xl">{featured.excerpt}</p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                >
                  {featured.tag}
                </span>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <Clock size={12} />
                  <span>{featured.mins} min {FORMAT_META[featured.format].verb}</span>
                </div>
              </div>
              <button
                className="flex items-center gap-1 text-sm font-semibold text-white/90 group-hover:text-white"
              >
                Read article <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gridItems.map((resource) => {
          const tagStyle = TAG_COLORS[resource.tag] || { bg: '#f3f4f6', color: '#374151' };
          const FormatIcon = FORMAT_META[resource.format].icon;
          return (
            <div
              key={resource.id}
              className="rounded-2xl p-5 cursor-pointer group flex flex-col"
              style={{ background: 'var(--surface)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: tagStyle.bg }}
                >
                  <FormatIcon size={18} style={{ color: tagStyle.color }} />
                </div>
                <button style={{ color: 'var(--text-muted)' }} className="p-1 hover:text-current">
                  <Bookmark size={15} />
                </button>
              </div>

              <h3 className="font-semibold text-sm leading-snug mb-2 flex-1" style={{ color: 'var(--foreground)' }}>
                {resource.title}
              </h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                {resource.excerpt}
              </p>

              <div className="flex items-center justify-between gap-2 mt-auto flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="text-xs px-2 py-0.5 rounded-md font-medium"
                    style={{ background: tagStyle.bg, color: tagStyle.color }}
                  >
                    {resource.tag}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1"
                    style={{ background: 'var(--surface-muted)', color: 'var(--text-muted)' }}
                  >
                    <FormatIcon size={11} />
                    {FORMAT_META[resource.format].label}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={11} />
                  {resource.mins}m
                </div>
              </div>

              <div
                className="flex items-center justify-between mt-3 pt-3 border-t text-xs"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                <span>{resource.author}</span>
                <span>{resource.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Tag size={40} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
          <p className="font-medium" style={{ color: 'var(--foreground)' }}>No resources found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different search, format, or category</p>
        </div>
      )}
    </div>
  );
}
