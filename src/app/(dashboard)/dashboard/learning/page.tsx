'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import OrgPrivacyNote from '@/components/OrgPrivacyNote';
import { useAuth } from '@/lib/auth';
import {
  GraduationCap, Users, Wrench, Clock, Compass, Briefcase, TrendingUp,
  ListOrdered, PenSquare, IdCard, BarChart3,
} from 'lucide-react';
import {
  ActivityCard, JobAdActivity, BioWriterActivity, ProfileBuilderActivity, SkillSnapshotActivity,
} from './activities';

type Module = {
  title: string;
  format: 'Course' | 'Workshop' | 'Toolkit';
  description: string;
  duration: string;
};

const FORMAT_STYLE: Record<Module['format'], { bg: string; color: string; icon: LucideIcon }> = {
  Course: { bg: '#eff6ff', color: '#1d4ed8', icon: GraduationCap },
  Workshop: { bg: '#f0fdf4', color: '#15803d', icon: Users },
  Toolkit: { bg: '#fff7ed', color: '#c2410c', icon: Wrench },
};

type CategoryKey = 'exploration' | 'application' | 'movement';

const CATEGORIES: { key: CategoryKey; label: string; icon: LucideIcon; description: string }[] = [
  { key: 'exploration', label: 'Career Exploration', icon: Compass, description: 'Get clear on what matters to you and where your strengths lie.' },
  { key: 'application', label: 'Career Application', icon: Briefcase, description: 'Turn that clarity into applications, profiles, and conversations that land.' },
  { key: 'movement', label: 'Career Movement', icon: TrendingUp, description: 'Make the move — negotiate, pivot, and build resilience along the way.' },
];

const MODULES: Record<CategoryKey, Module[]> = {
  exploration: [
    { title: 'Mapping What Matters to You', format: 'Course', description: 'Values, motivators, and what "good work" looks like for you.', duration: '25 min' },
    { title: 'Strengths in Action', format: 'Workshop', description: 'Spot transferable strengths hiding in your own stories.', duration: '35 min' },
    { title: "Career Paths You Haven't Considered", format: 'Toolkit', description: 'A structured way to widen your search beyond the obvious.', duration: '20 min' },
  ],
  application: [
    { title: 'Writing Applications That Get Read', format: 'Course', description: 'CVs and cover letters that are tailored, not generic.', duration: '30 min' },
    { title: 'Interview Storytelling: the STAR Method', format: 'Workshop', description: 'Structure stories that land in interviews.', duration: '25 min' },
    { title: 'Building Your Professional Network', format: 'Toolkit', description: 'Low-pressure ways to grow useful connections.', duration: '20 min' },
  ],
  movement: [
    { title: 'Negotiating Your Next Role', format: 'Course', description: 'Pay, scope, flexibility, and getting the timing right.', duration: '30 min' },
    { title: 'Navigating a Career Pivot', format: 'Workshop', description: 'Making a meaningful change without starting from zero.', duration: '40 min' },
    { title: 'Building Resilience Through Change', format: 'Toolkit', description: 'Tools for staying grounded in the middle of a transition.', duration: '20 min' },
  ],
};

// Per-user completion %, keyed by module title — Marcus (final-year, actively applying) is
// most engaged overall, Jamie moderate, Zara (just starting to explore) least.
const PROGRESS_BY_USER: Record<string, Record<string, number>> = {
  'demo-user': {
    'Mapping What Matters to You': 100,
    'Strengths in Action': 60,
    "Career Paths You Haven't Considered": 0,
    'Writing Applications That Get Read': 40,
    'Interview Storytelling: the STAR Method': 0,
    'Building Your Professional Network': 0,
    'Negotiating Your Next Role': 0,
    'Navigating a Career Pivot': 0,
    'Building Resilience Through Change': 20,
  },
  'zara-ahmed': {
    'Mapping What Matters to You': 100,
    'Strengths in Action': 40,
    "Career Paths You Haven't Considered": 20,
    'Writing Applications That Get Read': 0,
    'Interview Storytelling: the STAR Method': 0,
    'Building Your Professional Network': 0,
    'Negotiating Your Next Role': 0,
    'Navigating a Career Pivot': 0,
    'Building Resilience Through Change': 0,
  },
  'marcus-reid': {
    'Mapping What Matters to You': 100,
    'Strengths in Action': 100,
    "Career Paths You Haven't Considered": 40,
    'Writing Applications That Get Read': 100,
    'Interview Storytelling: the STAR Method': 80,
    'Building Your Professional Network': 60,
    'Negotiating Your Next Role': 20,
    'Navigating a Career Pivot': 0,
    'Building Resilience Through Change': 40,
  },
};

function getProgressMap(userId?: string | null): Record<string, number> {
  return PROGRESS_BY_USER[userId ?? ''] ?? PROGRESS_BY_USER['demo-user'];
}

const ACTIVITY_TAG = { bg: '#fff7ed', color: '#c2410c' };

export default function LearningPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('exploration');
  const category = CATEGORIES.find((c) => c.key === activeCategory)!;
  const progressMap = getProgressMap(user?.id);
  const modules = MODULES[activeCategory].map((m) => ({ ...m, progress: progressMap[m.title] ?? 0 }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>Learning &amp; Tools</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Build the skills and self-knowledge to back up your plan.
        </p>
      </div>

      <OrgPrivacyNote shared="which modules and activities you've completed" />

      {/* Category tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((c) => {
          const active = c.key === activeCategory;
          return (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className="text-left rounded-2xl p-4 transition-all"
              style={active
                ? { background: 'var(--primary)', color: '#fff' }
                : { background: 'var(--surface)', color: 'var(--foreground)' }
              }
            >
              <div className="flex items-center gap-2 mb-1.5">
                <c.icon size={18} style={{ color: active ? '#fff' : 'var(--primary)' }} />
                <span className="font-semibold text-sm">{c.label}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: active ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                {c.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Modules */}
      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {category.label} modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {modules.map((m) => {
            const fmt = FORMAT_STYLE[m.format];
            return (
              <div key={m.title} className="rounded-2xl p-5 flex flex-col" style={{ background: 'var(--surface)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: fmt.bg }}>
                    <fmt.icon size={18} style={{ color: fmt.color }} />
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: fmt.bg, color: fmt.color }}>
                    {m.format}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1.5" style={{ color: 'var(--foreground)' }}>{m.title}</h3>
                <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>{m.description}</p>
                <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1"><Clock size={11} />{m.duration}</span>
                  <span>{m.progress > 0 ? `${m.progress}% complete` : 'Not started'}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
                  <div className="h-full rounded-full" style={{ width: `${m.progress}%`, background: m.progress === 100 ? '#16a34a' : 'var(--primary)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive activities */}
      <div>
        <h2 className="text-sm font-semibold mb-1 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Tools for {category.label.toLowerCase()}
        </h2>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          Hands-on activities, not tests — useful ways to notice things about yourself as you go.
        </p>
        <div className="space-y-3">
          {activeCategory === 'exploration' && (
            <ActivityCard
              icon={ListOrdered}
              title="Job Ad Reviewer"
              description="Rank a few job ads by appeal and reflect on why."
              tag="Interactive · 5 min"
              tagColor={ACTIVITY_TAG}
            >
              <JobAdActivity />
            </ActivityCard>
          )}
          {activeCategory === 'application' && (
            <>
              <ActivityCard
                icon={PenSquare}
                title="Write Your Book-Jacket Bio"
                description="Sum up your career story like the back of a book."
                tag="Interactive · 5 min"
                tagColor={ACTIVITY_TAG}
              >
                <BioWriterActivity />
              </ActivityCard>
              <ActivityCard
                icon={IdCard}
                title="Build Your Career Profile"
                description="Turn three quick answers into a CV or LinkedIn-ready profile."
                tag="Interactive · 10 min"
                tagColor={ACTIVITY_TAG}
              >
                <ProfileBuilderActivity />
              </ActivityCard>
            </>
          )}
          {activeCategory === 'movement' && (
            <ActivityCard
              icon={BarChart3}
              title="Quick Skill Snapshot"
              description="See where you're feeling confident and where to focus next."
              tag="Check-in · 3 min"
              tagColor={ACTIVITY_TAG}
            >
              <SkillSnapshotActivity />
            </ActivityCard>
          )}
        </div>
      </div>
    </div>
  );
}
