'use client';

import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Search, Clock, Tag, ChevronRight, Bookmark, BookmarkCheck, TrendingUp, Layers, History, UserRound,
  Sparkles, ThumbsUp, ThumbsDown, Shuffle,
} from 'lucide-react';
import { RESOURCE_LIBRARY, TYPE_META, type LibraryResource, type ResourceType } from '@/lib/resourceLibrary';
import {
  getBookmarks, toggleBookmark, getAssignedResources, getActivityHistory, logActivity,
  type ActivityEntry, type AssignedResource, type ActivityAction,
} from '@/lib/library';
import { getProfileReport, type ProfileReport } from '@/lib/profile';
import { getResourceInsight, getExplorationResources } from '@/lib/resourceInsights';
import { getResourceFeedback, setResourceFeedback, type FeedbackValue } from '@/lib/resourceFeedback';
import { getDiagnosticAnswers, type DiagnosticAnswers } from '@/lib/diagnostic';
import ResourceModal from '@/components/ResourceModal';

// The demo member account is Jamie Rivera, matching CLIENTS[0] in coachData.
const MEMBER_CLIENT_ID = 'jamie-rivera';

const CATEGORIES = ['All', 'Career Change', 'Leadership', 'Networking', 'Work-Life Balance', 'Salary & Negotiation', 'Skills', 'Resilience'];

const TYPE_TABS: { key: 'all' | ResourceType; label: string; icon: LucideIcon }[] = [
  { key: 'all', label: 'All', icon: Layers },
  { key: 'Article', label: 'Articles', icon: TYPE_META.Article.icon },
  { key: 'Video', label: 'Videos', icon: TYPE_META.Video.icon },
  { key: 'Podcast', label: 'Podcasts', icon: TYPE_META.Podcast.icon },
  { key: 'Toolkit', label: 'Activities', icon: TYPE_META.Toolkit.icon },
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

const ACTION_LABEL: Record<ActivityAction, string> = {
  viewed: 'Viewed',
  bookmarked: 'Bookmarked',
  unbookmarked: 'Bookmark removed',
};

export default function ArticlesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState<'all' | ResourceType>('all');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [assigned, setAssigned] = useState<AssignedResource[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [activeResource, setActiveResource] = useState<LibraryResource | null>(null);
  const [profile, setProfile] = useState<ProfileReport>(getProfileReport());
  const [feedback, setFeedback] = useState<Record<string, FeedbackValue>>({});
  const [diagnostic, setDiagnostic] = useState<DiagnosticAnswers | null>(null);

  useEffect(() => {
    setBookmarks(getBookmarks());
    setAssigned(getAssignedResources());
    setActivity(getActivityHistory());
    setProfile(getProfileReport());
    setFeedback(getResourceFeedback());
    setDiagnostic(getDiagnosticAnswers());
  }, []);

  const filtered = RESOURCE_LIBRARY.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    const matchesType = activeType === 'all' || r.type === activeType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const featured = filtered.find((r) => r.featured);
  const showFeatured = !search && activeCategory === 'All' && activeType === 'all' && !!featured;
  const gridItems = showFeatured ? filtered.filter((r) => !r.featured) : filtered;

  const assignedResources = assigned
    .filter((a) => a.clientId === MEMBER_CLIENT_ID)
    .map((a) => ({ assignment: a, resource: RESOURCE_LIBRARY.find((r) => r.id === a.resourceId) }))
    .filter((x): x is { assignment: AssignedResource; resource: LibraryResource } => !!x.resource);

  const bookmarkedResources = bookmarks
    .map((id) => RESOURCE_LIBRARY.find((r) => r.id === id))
    .filter((r): r is LibraryResource => !!r);

  const explorationResources = getExplorationResources(
    profile,
    [...bookmarks, ...assignedResources.map((a) => a.resource.id)],
    3,
    diagnostic,
  );

  const openResource = (resource: LibraryResource) => {
    setActiveResource(resource);
    setActivity(logActivity(resource.id, resource.title, resource.type, 'viewed'));
  };

  const handleToggleBookmark = (resource: LibraryResource) => {
    const updated = toggleBookmark(resource.id);
    setBookmarks(updated);
    setActivity(logActivity(resource.id, resource.title, resource.type, updated.includes(resource.id) ? 'bookmarked' : 'unbookmarked'));
  };

  const handleFeedback = (resourceId: string, value: FeedbackValue) => {
    setFeedback(setResourceFeedback(resourceId, value));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>Resources</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Articles, videos, podcasts and activities curated to fuel your career growth
        </p>
      </div>

      {/* Assigned by your coach */}
      {assignedResources.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: '#e8f4f8' }}>
          <div className="flex items-center gap-2 mb-3">
            <UserRound size={16} style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>Assigned by your coach</h2>
          </div>
          <div className="space-y-2">
            {assignedResources.map(({ assignment, resource }) => {
              const meta = TYPE_META[resource.type];
              const Icon = meta.icon;
              return (
                <button
                  key={assignment.id}
                  onClick={() => openResource(resource)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                  style={{ background: 'var(--surface)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                    <Icon size={16} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{resource.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Assigned {assignment.assignedAt} · to {meta.verb}</p>
                  </div>
                  <ChevronRight size={16} className="flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Saved for later */}
      {bookmarkedResources.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center gap-2 mb-3">
            <BookmarkCheck size={16} style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Saved for Later</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {bookmarkedResources.map((resource) => {
              const meta = TYPE_META[resource.type];
              const Icon = meta.icon;
              return (
                <button
                  key={resource.id}
                  onClick={() => openResource(resource)}
                  className="flex-shrink-0 w-48 text-left rounded-xl p-3"
                  style={{ background: 'var(--surface-muted)' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: meta.bg }}>
                    <Icon size={14} style={{ color: meta.color }} />
                  </div>
                  <p className="text-xs font-medium leading-snug line-clamp-2" style={{ color: 'var(--foreground)' }}>{resource.title}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
        <button
          onClick={() => openResource(featured)}
          className="w-full text-left rounded-2xl overflow-hidden cursor-pointer group"
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
            <p className="text-white/70 text-sm mb-5 leading-relaxed max-w-2xl">{featured.summary}</p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                >
                  {featured.category}
                </span>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <Clock size={12} />
                  <span>{featured.mins} min {TYPE_META[featured.type].verb}</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-white/90 group-hover:text-white">
                Read article <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </button>
      )}

      {/* Resource grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gridItems.map((resource) => {
          const tagStyle = TAG_COLORS[resource.category] || { bg: '#f3f4f6', color: '#374151' };
          const meta = TYPE_META[resource.type];
          const FormatIcon = meta.icon;
          const isBookmarked = bookmarks.includes(resource.id);
          return (
            <div
              key={resource.id}
              onClick={() => openResource(resource)}
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
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleBookmark(resource); }}
                  style={{ color: isBookmarked ? 'var(--primary)' : 'var(--text-muted)' }}
                  className="p-1 hover:text-current"
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark for later'}
                >
                  {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                </button>
              </div>

              <h3 className="font-semibold text-sm leading-snug mb-2 flex-1" style={{ color: 'var(--foreground)' }}>
                {resource.title}
              </h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                {resource.summary}
              </p>

              <div className="flex items-center justify-between gap-2 mt-auto flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="text-xs px-2 py-0.5 rounded-md font-medium"
                    style={{ background: tagStyle.bg, color: tagStyle.color }}
                  >
                    {resource.category}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1"
                    style={{ background: 'var(--surface-muted)', color: 'var(--text-muted)' }}
                  >
                    <FormatIcon size={11} />
                    {meta.label}
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

      {/* Something a bit different — AI picks outside the user's usual profile */}
      {explorationResources.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Shuffle size={16} style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Something a bit different</h2>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Picked to sit outside your usual focus areas — for genuine exploration, not more of the same.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {explorationResources.map((resource) => {
              const meta = TYPE_META[resource.type];
              const Icon = meta.icon;
              return (
                <button
                  key={resource.id}
                  onClick={() => openResource(resource)}
                  className="text-left rounded-xl p-3.5"
                  style={{ background: 'var(--surface-muted)' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: meta.bg }}>
                    <Icon size={14} style={{ color: meta.color }} />
                  </div>
                  <p className="text-xs font-medium leading-snug line-clamp-2 mb-1" style={{ color: 'var(--foreground)' }}>{resource.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{resource.category}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity history */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center gap-2 mb-3">
          <History size={16} style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Activity History</h2>
        </div>
        {activity.length > 0 ? (
          <div className="space-y-2">
            {activity.slice(0, 8).map((entry) => {
              const meta = TYPE_META[entry.type];
              const Icon = meta.icon;
              return (
                <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-muted)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                    <Icon size={14} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: 'var(--foreground)' }}>{entry.title}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{ACTION_LABEL[entry.action]}</span>
                    <span>{entry.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Resources you view or bookmark will show up here.
          </p>
        )}
      </div>

      {/* Resource detail modal */}
      {activeResource && (
        <ResourceModal
          resource={activeResource}
          onClose={() => setActiveResource(null)}
          insightBox={
            <div className="rounded-xl p-3.5" style={{ background: '#f5f3ff' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={13} style={{ color: '#7c3aed' }} />
                <span className="text-xs font-semibold" style={{ color: '#7c3aed' }}>Personalised for you</span>
              </div>
              <p className="text-xs leading-relaxed mb-2.5" style={{ color: '#5b21b6' }}>
                {getResourceInsight(activeResource, profile, diagnostic)}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: '#7c3aed' }}>Was this useful?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback(activeResource.id, 'up')}
                    aria-label="Thumbs up"
                    style={{ color: feedback[activeResource.id] === 'up' ? '#15803d' : '#7c3aed' }}
                  >
                    <ThumbsUp size={14} fill={feedback[activeResource.id] === 'up' ? '#15803d' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleFeedback(activeResource.id, 'down')}
                    aria-label="Thumbs down"
                    style={{ color: feedback[activeResource.id] === 'down' ? '#b91c1c' : '#7c3aed' }}
                  >
                    <ThumbsDown size={14} fill={feedback[activeResource.id] === 'down' ? '#b91c1c' : 'none'} />
                  </button>
                </div>
              </div>
            </div>
          }
          footer={
            <button
              onClick={() => handleToggleBookmark(activeResource)}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl"
              style={bookmarks.includes(activeResource.id)
                ? { background: 'var(--primary)', color: '#fff' }
                : { background: 'var(--surface-muted)', color: 'var(--foreground)' }
              }
            >
              {bookmarks.includes(activeResource.id)
                ? <><BookmarkCheck size={16} /> Saved for later</>
                : <><Bookmark size={16} /> Save for later</>
              }
            </button>
          }
        />
      )}
    </div>
  );
}
