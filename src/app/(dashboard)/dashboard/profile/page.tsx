'use client';

import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  UserCog, Save, CheckCircle2, Settings, Mic, Sparkles, Mail, ToggleLeft, ToggleRight,
  Flame, ScrollText, Compass, Star, CalendarCheck, BadgeCheck, Lock, Trophy, Bot, RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getPreferences, setPreference, DEFAULT_PREFERENCES, type Preferences } from '@/lib/preferences';
import { getActivityHistory, getBookmarks, type ActivityEntry } from '@/lib/library';
import { getDiagnosticAnswers, saveDiagnosticAnswers, getDiagnosticInsights, type DiagnosticAnswers } from '@/lib/diagnostic';
import DiagnosticModal from '@/components/DiagnosticModal';
import { APPOINTMENTS } from '../coachData';
import { ACTION_ITEMS } from '../journeyData';

const MEMBER_PREFERENCE_ROWS: { key: keyof Preferences; icon: LucideIcon; title: string; description: string }[] = [
  {
    key: 'aiTranscriptRecording',
    icon: Mic,
    title: 'AI session transcript recording',
    description: 'Allow Vernon to record and transcribe your coaching sessions to generate AI notes for your coach.',
  },
  {
    key: 'aiSuggestions',
    icon: Sparkles,
    title: 'AI suggestions',
    description: 'Show AI-generated suggestions and insights across My Journey, Resources, and Career Chat.',
  },
  {
    key: 'weeklyNewsletter',
    icon: Mail,
    title: 'Weekly newsletter',
    description: 'Get a weekly email summarising your progress, new resources, and upcoming sessions.',
  },
];

const COACH_PREFERENCE_ROWS: { key: keyof Preferences; icon: LucideIcon; title: string; description: string }[] = [
  {
    key: 'hideAiSuggestionsForClients',
    icon: Bot,
    title: 'Hide AI suggestions for clients',
    description: 'Stop Vernon from showing AI-generated suggestions and resources to the clients you coach.',
  },
  {
    key: 'weeklyNewsletter',
    icon: Mail,
    title: 'Weekly newsletter',
    description: 'Get a weekly email summarising client progress and your upcoming sessions.',
  },
];

const ORG_PREFERENCE_ROWS: { key: keyof Preferences; icon: LucideIcon; title: string; description: string }[] = [
  {
    key: 'orgAiRecommendationsDisabled',
    icon: Bot,
    title: 'Turn off AI recommendations for my organisation',
    description: 'Hide AI-generated suggestions and insights across My Journey, Resources, and Career Chat for every member of your organisation, regardless of their individual settings.',
  },
  {
    key: 'weeklyNewsletter',
    icon: Mail,
    title: 'Weekly newsletter',
    description: 'Get a weekly email summarising engagement and progress across your organisation.',
  },
];

function PreferenceToggle({ icon: Icon, title, description, checked, onToggle, first, locked, lockedNote }: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  first: boolean;
  locked?: boolean;
  lockedNote?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3" style={first ? undefined : { borderTop: '1px solid var(--border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface-muted)' }}>
        <Icon size={16} style={{ color: 'var(--primary)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{title}</p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
        {locked && lockedNote && (
          <p className="text-xs mt-1.5 flex items-center gap-1 font-medium" style={{ color: 'var(--text-muted)' }}>
            <Lock size={11} /> {lockedNote}
          </p>
        )}
      </div>
      <button
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        className="flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={`Toggle ${title}`}
      >
        {checked
          ? <ToggleRight size={30} style={{ color: 'var(--primary)' }} />
          : <ToggleLeft size={30} style={{ color: 'var(--text-muted)' }} />}
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [activityHistory, setActivityHistory] = useState<ActivityEntry[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswers | null>(null);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    setPreferences(getPreferences());
    setActivityHistory(getActivityHistory());
    setBookmarks(getBookmarks());
    setDiagnosticAnswers(getDiagnosticAnswers());
  }, []);

  const handleSave = () => {
    if (!user) return;
    updateUser({ name: name.trim() || user.name, email: email.trim() || user.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggle = (key: keyof Preferences) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setPreference(key, updated[key]);
      return updated;
    });
  };

  const preferenceRows = user?.accountType === 'coach'
    ? COACH_PREFERENCE_ROWS
    : user?.accountType === 'org_staff'
    ? ORG_PREFERENCE_ROWS
    : MEMBER_PREFERENCE_ROWS;

  const viewedCount = activityHistory.filter((a) => a.action === 'viewed').length;
  const savedCount = bookmarks.length;
  const completedSessions = APPOINTMENTS.filter((a) => a.clientId === 'jamie-rivera' && a.status === 'completed').length;
  const completedGoals = ACTION_ITEMS.filter((a) => a.status === 'done').length;
  const insights = diagnosticAnswers ? getDiagnosticInsights(diagnosticAnswers) : null;

  const stats: { label: string; value: string; icon: LucideIcon; color: string; bg: string }[] = [
    { label: 'Day streak', value: '7', icon: Flame, color: '#ea580c', bg: '#fff7ed' },
    { label: 'Reflections logged', value: '12', icon: ScrollText, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Resources viewed', value: String(viewedCount), icon: Compass, color: 'var(--primary)', bg: '#e8f4f8' },
    { label: 'Resources saved', value: String(savedCount), icon: Star, color: '#ca8a04', bg: '#fefce8' },
    { label: 'Sessions completed', value: String(completedSessions), icon: CalendarCheck, color: '#15803d', bg: '#f0fdf4' },
  ];

  const badges: { id: string; label: string; description: string; icon: LucideIcon; color: string; bg: string; unlocked: boolean }[] = [
    { id: 'streak-7', label: '7-Day Streak', description: 'Engaged with Vernon for 7 days running.', icon: Flame, color: '#ea580c', bg: '#fff7ed', unlocked: true },
    { id: 'reflective', label: 'Reflective Practitioner', description: 'Logged 10+ reflections in your journal.', icon: ScrollText, color: '#7c3aed', bg: '#f5f3ff', unlocked: true },
    { id: 'explorer', label: 'Resource Explorer', description: 'Viewed 3+ resources from the library.', icon: Compass, color: 'var(--primary)', bg: '#e8f4f8', unlocked: viewedCount >= 3 },
    { id: 'curator', label: 'Resource Curator', description: 'Saved a resource to read later.', icon: Star, color: '#ca8a04', bg: '#fefce8', unlocked: savedCount >= 1 },
    { id: 'session-starter', label: 'Session Starter', description: 'Completed your first coaching session.', icon: CalendarCheck, color: '#15803d', bg: '#f0fdf4', unlocked: completedSessions >= 1 },
    { id: 'goal-getter', label: 'Goal Getter', description: 'Completed an item on your action plan.', icon: BadgeCheck, color: '#be185d', bg: '#fdf2f8', unlocked: completedGoals >= 1 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>Profile</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {user?.accountType === 'member'
            ? 'Manage your account, preferences, and achievements'
            : 'Manage your account details and preferences'}
        </p>
      </div>

      {/* Account */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center gap-2 mb-4">
          <UserCog size={16} style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Account</h2>
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            {(user?.name ?? '?').charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>{user?.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.role}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="mt-4 flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white"
          style={{ background: saved ? '#15803d' : 'var(--primary)' }}
        >
          {saved ? <><CheckCircle2 size={15} /> Saved</> : <><Save size={15} /> Save changes</>}
        </button>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Settings size={16} style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Preferences</h2>
        </div>
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
          {user?.accountType === 'coach'
            ? 'Control what your clients see and how Vernon keeps in touch with you.'
            : user?.accountType === 'org_staff'
            ? 'Control AI access for your organisation and how Vernon keeps in touch with you.'
            : 'Control how Vernon uses AI and keeps in touch with you.'}
        </p>
        <div>
          {preferenceRows.map((row, i) => {
            const orgLocked = row.key === 'aiSuggestions'
              && user?.accountType === 'member'
              && preferences.orgAiRecommendationsDisabled;
            return (
              <PreferenceToggle
                key={row.key}
                icon={row.icon}
                title={row.title}
                description={row.description}
                checked={orgLocked ? false : preferences[row.key]}
                onToggle={() => handleToggle(row.key)}
                first={i === 0}
                locked={orgLocked}
                lockedNote={orgLocked ? 'Turned off by your organisation' : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Vernon Insights (members only) */}
      {user?.accountType === 'member' && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: '#7c3aed' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Vernon Insights</h2>
            </div>
            {insights && (
              <button
                onClick={() => setShowDiagnosticModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
                style={{ background: '#f5f3ff', color: '#7c3aed' }}
              >
                <RefreshCw size={13} />
                Retake
              </button>
            )}
          </div>
          {insights ? (
            <>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Your diagnostic profile report — this shapes the resources Vernon recommends and gives your coach a top-level view of where you&rsquo;re starting from.
              </p>
              <div className="rounded-xl p-4 mb-4" style={{ background: '#f5f3ff' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#5b21b6' }}>{insights.summary}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Top values</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{insights.topValues.join(', ')}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Sector interest</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{insights.sectorLabels.join(', ')}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Readiness</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{insights.readinessLabel}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Coaching focus</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{insights.focusLabel}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Complete a short diagnostic so Vernon can tailor your resource recommendations and give your coach a top-level view of where you&rsquo;re starting from.
              </p>
              <button
                onClick={() => setShowDiagnosticModal(true)}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white"
                style={{ background: 'var(--primary)' }}
              >
                <Sparkles size={15} />
                Start my Vernon Insights diagnostic
              </button>
            </>
          )}
        </div>
      )}

      {/* Awards (members only) */}
      {user?.accountType === 'member' && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Awards &amp; Activity</h2>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            A snapshot of how you&rsquo;ve been using Vernon.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: s.bg }}>
                    <Icon size={14} style={{ color: s.color }} />
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{s.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.id}
                  className="rounded-xl p-3 flex flex-col items-center text-center gap-1.5"
                  style={{ background: 'var(--surface-muted)', opacity: b.unlocked ? 1 : 0.45 }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: b.unlocked ? b.bg : 'var(--surface)' }}>
                    {b.unlocked ? <Icon size={18} style={{ color: b.color }} /> : <Lock size={16} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{b.label}</p>
                  <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showDiagnosticModal && (
        <DiagnosticModal
          initialAnswers={diagnosticAnswers}
          onDismiss={() => setShowDiagnosticModal(false)}
          onComplete={(answers) => {
            saveDiagnosticAnswers(answers);
            setDiagnosticAnswers(answers);
            setShowDiagnosticModal(false);
          }}
        />
      )}
    </div>
  );
}
