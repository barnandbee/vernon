import type { LucideIcon } from 'lucide-react';
import {
  Users, Activity, Lightbulb, CalendarDays, CheckSquare, Brain, GraduationCap,
  Target, MessageCircle, Compass, BookOpen,
} from 'lucide-react';

export const ACTIVE_MEMBERS = 86;

export type StatItem = { label: string; value: string; sub: string; icon: LucideIcon; color: string; bg: string };
export type BarItem = { label: string; value: number; icon?: LucideIcon; color: string };
export type BandItem = { label: string; range?: string; count: number; color: string };
export type MemberRow = {
  name: string;
  initials: string;
  color: string;
  progress: number;
  streak: number;
  sessions: number;
  lastActive: string;
};

type ReportFieldBase = { id: string; group: string; title: string; description: string; enabled?: boolean };

export type ReportField =
  | (ReportFieldBase & { kind: 'stats'; items: StatItem[] })
  | (ReportFieldBase & { kind: 'trend'; items: BarItem[] })
  | (ReportFieldBase & { kind: 'bars'; items: BarItem[]; unit?: string; max?: number })
  | (ReportFieldBase & { kind: 'bands'; items: BandItem[] })
  | (ReportFieldBase & { kind: 'table'; members: MemberRow[] });

export const KEY_METRICS: StatItem[] = [
  { label: 'Active members', value: '86', sub: 'of 120 invited', icon: Users, color: '#1d4ed8', bg: '#eff6ff' },
  { label: 'Weekly engagement', value: '71%', sub: '+4 pts vs last month', icon: Activity, color: '#15803d', bg: '#f0fdf4' },
  { label: 'Reflections this month', value: '312', sub: 'org-wide total', icon: Lightbulb, color: '#c2410c', bg: '#fff7ed' },
  { label: 'Coaching sessions', value: '54', sub: 'completed this month', icon: CalendarDays, color: '#7e22ce', bg: '#fdf4ff' },
  { label: 'Coaching uptake', value: '86%', sub: 'members with ≥1 session booked', icon: CheckSquare, color: '#0369a1', bg: '#f0f9ff' },
  { label: 'Vernon Insights completed', value: '91%', sub: 'of active members', icon: Brain, color: '#be185d', bg: '#fdf2f8' },
];

export const ENGAGEMENT_TREND: BarItem[] = [
  { label: 'Wk 1', value: 58, color: 'var(--primary)' },
  { label: 'Wk 2', value: 61, color: 'var(--primary)' },
  { label: 'Wk 3', value: 65, color: 'var(--primary)' },
  { label: 'Wk 4', value: 63, color: 'var(--primary)' },
  { label: 'Wk 5', value: 68, color: 'var(--primary)' },
  { label: 'Wk 6', value: 71, color: 'var(--primary)' },
];

export const JOURNEY_BANDS: BandItem[] = [
  { label: 'Just getting started', range: '0–25%', count: 18, color: 'var(--text-muted)' },
  { label: 'Building momentum', range: '26–50%', count: 34, color: '#1d4ed8' },
  { label: 'Making strong progress', range: '51–75%', count: 24, color: '#c2410c' },
  { label: 'Nearing their goals', range: '76–100%', count: 10, color: '#15803d' },
];

export const FEATURE_USAGE: BarItem[] = [
  { label: 'My Journey (action plan)', icon: Compass, value: 88, color: '#0d9488' },
  { label: 'Career Reflections', icon: Lightbulb, value: 82, color: '#c2410c' },
  { label: 'Career Chat (Vernon AI)', icon: MessageCircle, value: 74, color: '#7c3aed' },
  { label: 'Resource Library', icon: BookOpen, value: 69, color: '#0369a1' },
  { label: 'Learning & Tools', icon: GraduationCap, value: 64, color: '#1d4ed8' },
  { label: 'Coaching Calendar', icon: CalendarDays, value: 58, color: 'var(--primary)' },
  { label: 'Real-World Practice', icon: Target, value: 47, color: '#be185d' },
  { label: 'Community', icon: Users, value: 39, color: '#7e22ce' },
];

export const COACHING_FREQUENCY: BandItem[] = [
  { label: 'No sessions yet', count: 12, color: 'var(--text-muted)' },
  { label: '1–2 sessions', count: 28, color: '#1d4ed8' },
  { label: '3–5 sessions', count: 31, color: '#c2410c' },
  { label: '6+ sessions', count: 15, color: '#15803d' },
];

export const COACHING_SESSION_STATUS: BarItem[] = [
  { label: 'Completed', value: 54, color: '#15803d' },
  { label: 'Confirmed (upcoming)', value: 31, color: '#1d4ed8' },
  { label: 'Pending request', value: 15, color: '#c2410c' },
];

export const VI_VALUES: BarItem[] = [
  { label: 'Growth & learning', value: 64, color: '#1d4ed8' },
  { label: 'Making an impact', value: 58, color: '#15803d' },
  { label: 'Collaboration & belonging', value: 51, color: '#7e22ce' },
  { label: 'Autonomy & independence', value: 47, color: '#c2410c' },
  { label: 'Financial reward', value: 41, color: '#be185d' },
  { label: 'Stability & security', value: 39, color: '#0369a1' },
  { label: 'Recognition & visibility', value: 33, color: '#7c3aed' },
  { label: 'Creativity & expression', value: 28, color: '#b45309' },
];

export const VI_SECTORS: BarItem[] = [
  { label: 'Technology', value: 46, color: '#1d4ed8' },
  { label: 'Healthcare', value: 24, color: '#15803d' },
  { label: 'Sustainability & Climate', value: 21, color: '#0d9488' },
  { label: 'Education', value: 19, color: '#7e22ce' },
  { label: 'Finance & Professional Services', value: 18, color: '#c2410c' },
  { label: 'Creative & Media', value: 16, color: '#be185d' },
  { label: 'Nonprofit & Public Sector', value: 14, color: '#0369a1' },
  { label: 'Retail & Consumer', value: 9, color: '#b45309' },
];

export const VI_READINESS: BandItem[] = [
  { label: 'Just exploring', count: 22, color: 'var(--text-muted)' },
  { label: 'Actively planning', count: 34, color: '#1d4ed8' },
  { label: 'Ready to act', count: 18, color: '#15803d' },
  { label: 'Not sure yet', count: 12, color: '#c2410c' },
];

export const VI_FOCUS: BarItem[] = [
  { label: 'Advancing current career', value: 29, color: '#1d4ed8' },
  { label: 'Exploring a career change', value: 24, color: '#c2410c' },
  { label: 'Growing as a leader', value: 17, color: '#7e22ce' },
  { label: 'Negotiating pay or promotion', value: 12, color: '#be185d' },
  { label: 'Personal development & confidence', value: 11, color: '#15803d' },
  { label: 'Returning to work', value: 7, color: '#0369a1' },
];

export const LEARNING_TRACKS: BarItem[] = [
  { label: 'Career Exploration', value: 71, color: '#1d4ed8' },
  { label: 'Career Application', value: 52, color: '#7e22ce' },
  { label: 'Career Movement', value: 33, color: '#15803d' },
];

export const LEARNING_ACTIVITIES: BarItem[] = [
  { label: 'Career Profile Builder', value: 68, color: '#1d4ed8' },
  { label: 'Quick Skill Snapshot', value: 55, color: '#15803d' },
  { label: 'Job Ad Reviewer', value: 41, color: '#c2410c' },
  { label: 'Book-Jacket Bio Writer', value: 29, color: '#7e22ce' },
];

export const RESOURCE_CATEGORIES: BarItem[] = [
  { label: 'Career Change', value: 62, color: '#1d4ed8' },
  { label: 'Skills', value: 57, color: '#15803d' },
  { label: 'Salary & Negotiation', value: 49, color: '#c2410c' },
  { label: 'Leadership', value: 44, color: '#7e22ce' },
  { label: 'Resilience', value: 41, color: '#be185d' },
  { label: 'Work-Life Balance', value: 38, color: '#0369a1' },
  { label: 'Networking', value: 33, color: '#b45309' },
];

export const RESOURCE_SENTIMENT: BarItem[] = [
  { label: 'Marked helpful', value: 81, color: '#15803d' },
  { label: 'Marked not for me', value: 19, color: '#c2410c' },
];

export const REFLECTION_THEMES: BarItem[] = [
  { label: 'Values', value: 71, color: '#1d4ed8' },
  { label: 'Goals', value: 66, color: '#15803d' },
  { label: 'Purpose', value: 58, color: '#7e22ce' },
  { label: 'Strengths', value: 49, color: '#c2410c' },
  { label: 'Coaching Follow-up', value: 38, color: '#be185d' },
];

export const REFLECTION_STREAKS: BandItem[] = [
  { label: 'No active streak', count: 21, color: 'var(--text-muted)' },
  { label: '1–3 days', count: 26, color: '#1d4ed8' },
  { label: '4–7 days', count: 24, color: '#c2410c' },
  { label: '8+ days', count: 15, color: '#15803d' },
];

export const COMMUNITY_PARTICIPATION: BarItem[] = [
  { label: 'Active in a peer circle', value: 61, color: '#1d4ed8' },
  { label: 'Responded to weekly group prompt', value: 44, color: '#7e22ce' },
  { label: 'Shared a milestone to the activity feed', value: 27, color: '#15803d' },
];

export const PRACTICE_DIMENSIONS: BarItem[] = [
  { label: 'Comfort with uncertainty', value: 3.4, color: '#1d4ed8' },
  { label: 'Openness to challenging feedback', value: 3.8, color: '#15803d' },
  { label: 'Testing your assumptions', value: 3.1, color: '#c2410c' },
  { label: 'Persistence through obstacles', value: 3.6, color: '#7e22ce' },
  { label: 'Curiosity in practice', value: 4.0, color: '#be185d' },
];

export const MEMBERS: MemberRow[] = [
  { name: 'Maya O.',  initials: 'MO', color: '#1d4ed8', progress: 68, streak: 12, sessions: 4, lastActive: 'Today' },
  { name: 'Priya S.', initials: 'PS', color: '#c2410c', progress: 81, streak: 7,  sessions: 5, lastActive: 'Yesterday' },
  { name: 'Jamie R.', initials: 'JR', color: '#be185d', progress: 42, streak: 7,  sessions: 3, lastActive: 'Today' },
  { name: 'Aiko T.',  initials: 'AT', color: '#0369a1', progress: 54, streak: 9,  sessions: 3, lastActive: 'Today' },
  { name: 'Tom B.',   initials: 'TB', color: '#15803d', progress: 35, streak: 4,  sessions: 2, lastActive: '2 days ago' },
  { name: 'Ben C.',   initials: 'BC', color: '#7e22ce', progress: 12, streak: 1,  sessions: 1, lastActive: '5 days ago' },
];

export const REPORT_GROUPS = [
  'Engagement',
  'Coaching',
  'Vernon Insights',
  'Learning',
  'Resources & Reading',
  'Reflections',
  'Community',
  'Practice',
  'Member Activity',
] as const;

export const REPORT_FIELDS: ReportField[] = [
  {
    id: 'key-metrics', group: 'Engagement', kind: 'stats',
    title: 'Key engagement metrics',
    description: 'Headline participation and coaching-uptake numbers across the organisation.',
    items: KEY_METRICS,
  },
  {
    id: 'engagement-trend', group: 'Engagement', kind: 'trend',
    title: 'Weekly engagement trend',
    description: 'Share of active members who used Vernon each week.',
    items: ENGAGEMENT_TREND,
  },
  {
    id: 'journey-bands', group: 'Engagement', kind: 'bands',
    title: 'Where members are in their journey',
    description: 'Grouped by overall career journey progress.',
    items: JOURNEY_BANDS,
  },
  {
    id: 'feature-usage', group: 'Engagement', kind: 'bars',
    title: 'Where members spend their time',
    description: 'Share of active members who used each area in the last 30 days.',
    items: FEATURE_USAGE,
  },
  {
    id: 'coaching-frequency', group: 'Coaching', kind: 'bands',
    title: 'Sessions per member',
    description: 'How many coaching sessions members have had to date.',
    items: COACHING_FREQUENCY,
  },
  {
    id: 'coaching-session-status', group: 'Coaching', kind: 'bars',
    title: 'Session status mix',
    description: 'Booked coaching sessions by current status.',
    items: COACHING_SESSION_STATUS,
  },
  {
    id: 'vi-values', group: 'Vernon Insights', kind: 'bars',
    title: 'Top work values',
    description: 'How often each value is ranked in members’ top 3 on the Vernon Insights diagnostic.',
    items: VI_VALUES,
  },
  {
    id: 'vi-sectors', group: 'Vernon Insights', kind: 'bars',
    title: 'Sector interest',
    description: 'Sectors members say they’re interested in, from Vernon Insights.',
    items: VI_SECTORS,
  },
  {
    id: 'vi-readiness', group: 'Vernon Insights', kind: 'bands',
    title: 'Readiness to make a move',
    description: 'Self-reported readiness to make a career move.',
    items: VI_READINESS,
  },
  {
    id: 'vi-focus', group: 'Vernon Insights', kind: 'bars',
    title: 'Coaching focus areas',
    description: 'What members say they want to get out of coaching.',
    items: VI_FOCUS,
  },
  {
    id: 'learning-tracks', group: 'Learning', kind: 'bars',
    title: 'Learning track progress',
    description: 'Share of members who have started each learning track.',
    items: LEARNING_TRACKS,
  },
  {
    id: 'learning-activities', group: 'Learning', kind: 'bars',
    title: 'Hands-on activity usage',
    description: 'Share of members who have tried each guided activity.',
    items: LEARNING_ACTIVITIES,
  },
  {
    id: 'resource-categories', group: 'Resources & Reading', kind: 'bars',
    title: 'Resource category engagement',
    description: 'Share of members who have opened a resource in each category.',
    items: RESOURCE_CATEGORIES,
  },
  {
    id: 'resource-sentiment', group: 'Resources & Reading', kind: 'bars',
    title: 'Resource feedback sentiment',
    description: 'Thumbs up / thumbs down feedback left on resources.',
    items: RESOURCE_SENTIMENT,
  },
  {
    id: 'reflection-themes', group: 'Reflections', kind: 'bars',
    title: 'Reflection prompt themes',
    description: 'Engagement with each category in the reflection prompt library.',
    items: REFLECTION_THEMES,
  },
  {
    id: 'reflection-streaks', group: 'Reflections', kind: 'bands',
    title: 'Reflection streak distribution',
    description: 'Current daily-reflection streak length across members.',
    items: REFLECTION_STREAKS,
  },
  {
    id: 'community-participation', group: 'Community', kind: 'bars',
    title: 'Community participation',
    description: 'How members engage with peer circles and group prompts.',
    items: COMMUNITY_PARTICIPATION,
  },
  {
    id: 'practice-dimensions', group: 'Practice', kind: 'bars',
    title: 'Real-World Practice self-assessment',
    description: 'Average self-assessment score by dimension (out of 5).',
    items: PRACTICE_DIMENSIONS,
    unit: '/5', max: 5,
  },
  {
    id: 'member-activity', group: 'Member Activity', kind: 'table',
    title: 'Member activity sample',
    description: 'A sample of recent activity — shown as first name and initial only.',
    members: MEMBERS,
  },
];

export type ReportFieldConfig = { title?: string; description?: string; group?: string; enabled?: boolean };

const CONFIG_STORAGE_KEY = 'vernon_report_field_config';

function readConfig(): Record<string, ReportFieldConfig> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Record<string, ReportFieldConfig>) : {};
  } catch {
    return {};
  }
}

function writeConfig(config: Record<string, ReportFieldConfig>) {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
}

function applyConfig(field: ReportField, config: Record<string, ReportFieldConfig>): ReportField {
  const override = config[field.id];
  if (!override) return field;
  return {
    ...field,
    title: override.title ?? field.title,
    description: override.description ?? field.description,
    group: override.group ?? field.group,
    enabled: override.enabled ?? field.enabled,
  };
}

// Admin-editable overrides (title/description/group/enabled) layered on top
// of the static report fields — the underlying chart/numeric data is never
// editable, only how each field is presented to org_staff.
export function getReportFieldConfig(): Record<string, ReportFieldConfig> {
  return readConfig();
}

export function setReportFieldConfig(id: string, updates: ReportFieldConfig): Record<string, ReportFieldConfig> {
  const config = readConfig();
  config[id] = { ...config[id], ...updates };
  writeConfig(config);
  return config;
}

// Every report field, including disabled ones — for the admin reports tool.
export function getConfiguredReportFields(): ReportField[] {
  const config = readConfig();
  return REPORT_FIELDS.map((f) => applyConfig(f, config));
}

// Only the fields enabled for org_staff to see.
export function getVisibleReportFields(): ReportField[] {
  return getConfiguredReportFields().filter((f) => f.enabled !== false);
}

export function getReportField(id: string): ReportField | undefined {
  return getVisibleReportFields().find((f) => f.id === id);
}

export function fieldsByGroup(): { group: string; fields: ReportField[] }[] {
  const fields = getVisibleReportFields();
  return REPORT_GROUPS.map((group) => ({ group, fields: fields.filter((f) => f.group === group) }));
}
