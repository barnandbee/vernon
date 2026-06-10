'use client';

import { useState } from 'react';
import { Search, BookOpen, Clock, Tag, ChevronRight, Bookmark, TrendingUp } from 'lucide-react';

const CATEGORIES = ['All', 'Career Change', 'Leadership', 'Networking', 'Work-Life Balance', 'Salary & Negotiation', 'Skills'];

const ARTICLES = [
  {
    id: 1, title: 'Navigating Career Transitions in Your 30s',
    excerpt: 'Practical strategies for making a meaningful career pivot while managing risk and maintaining momentum.',
    tag: 'Career Change', mins: 5, featured: true,
    author: 'Dr. Sarah Mitchell', date: 'Jun 5, 2026',
  },
  {
    id: 2, title: 'Building a Personal Brand That Opens Doors',
    excerpt: 'How to craft an authentic professional identity that attracts the right opportunities.',
    tag: 'Networking', mins: 7, featured: false,
    author: 'James Park', date: 'Jun 2, 2026',
  },
  {
    id: 3, title: 'How to Ask for the Promotion You Deserve',
    excerpt: 'A step-by-step guide to preparing your case, timing the conversation, and handling objections.',
    tag: 'Salary & Negotiation', mins: 4, featured: false,
    author: 'Lisa Chen', date: 'May 28, 2026',
  },
  {
    id: 4, title: 'The Introvert\'s Guide to Powerful Networking',
    excerpt: 'Reframe networking as relationship-building and discover strategies that suit your natural style.',
    tag: 'Networking', mins: 6, featured: false,
    author: 'Mark Davies', date: 'May 24, 2026',
  },
  {
    id: 5, title: 'Leading Without Authority: Influence at Every Level',
    excerpt: 'How to drive change and inspire teams even when you don\'t hold a formal leadership title.',
    tag: 'Leadership', mins: 8, featured: false,
    author: 'Dr. Aisha Patel', date: 'May 20, 2026',
  },
  {
    id: 6, title: 'Setting Boundaries Without Burning Bridges',
    excerpt: 'Communicate your limits at work in ways that build respect rather than resentment.',
    tag: 'Work-Life Balance', mins: 5, featured: false,
    author: 'Tom Hargreaves', date: 'May 15, 2026',
  },
];

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  'Career Change':       { bg: '#eff6ff', color: '#1d4ed8' },
  'Networking':          { bg: '#f0fdf4', color: '#15803d' },
  'Leadership':          { bg: '#fdf4ff', color: '#7e22ce' },
  'Work-Life Balance':   { bg: '#fff7ed', color: '#c2410c' },
  'Salary & Negotiation':{ bg: '#fefce8', color: '#a16207' },
  'Skills':              { bg: '#f0f9ff', color: '#0369a1' },
};

export default function ArticlesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = ARTICLES.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || a.tag === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered.find((a) => a.featured);
  const rest = filtered.filter((a) => !a.featured || activeCategory !== 'All' || search);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Articles & Insights</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Curated content to fuel your career growth
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
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

      {/* Featured article */}
      {featured && !search && activeCategory === 'All' && (
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                >
                  {featured.tag}
                </span>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <Clock size={12} />
                  <span>{featured.mins} min read</span>
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

      {/* Article grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(search || activeCategory !== 'All' ? filtered : rest).map((article) => {
          const tagStyle = TAG_COLORS[article.tag] || { bg: '#f3f4f6', color: '#374151' };
          return (
            <div
              key={article.id}
              className="rounded-2xl p-5 cursor-pointer group flex flex-col"
              style={{ background: 'var(--surface)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: tagStyle.bg }}
                >
                  <BookOpen size={18} style={{ color: tagStyle.color }} />
                </div>
                <button style={{ color: 'var(--text-muted)' }} className="p-1 hover:text-current">
                  <Bookmark size={15} />
                </button>
              </div>

              <h3 className="font-semibold text-sm leading-snug mb-2 flex-1" style={{ color: 'var(--foreground)' }}>
                {article.title}
              </h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-md font-medium"
                    style={{ background: tagStyle.bg, color: tagStyle.color }}
                  >
                    {article.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={11} />
                  {article.mins}m
                </div>
              </div>

              <div
                className="flex items-center justify-between mt-3 pt-3 border-t text-xs"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                <span>{article.author}</span>
                <span>{article.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Tag size={40} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
          <p className="font-medium" style={{ color: 'var(--foreground)' }}>No articles found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
