'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import SourceBadge from '@/components/SourceBadge';
import OrgPrivacyNote from '@/components/OrgPrivacyNote';
import { addSharedNote } from '@/lib/sharedNotes';
import {
  Compass, CheckCircle2, Circle, Clock3, Clock, ChevronRight, Sparkles,
  Lightbulb, ArrowRight, Video, Users, ListChecks, Shuffle, UserRound,
  NotebookPen, Zap, Flag, BookOpen, GraduationCap, Target, MessageCircle,
  SendHorizontal,
} from 'lucide-react';
import {
  ACTION_ITEMS, SESSION_NOTES, FREE_EXPLORATION, QUICK_WINS, DEVELOPMENT_GOALS,
  type Status,
} from '../journeyData';

const STATUS_ORDER: Status[] = ['todo', 'in-progress', 'done'];

const TABS = [
  { key: 'reflect', label: 'Reflect', icon: Lightbulb },
  { key: 'session', label: 'Coaching Session', icon: Users },
  { key: 'plan', label: 'Action Plan', icon: ListChecks },
  { key: 'explore', label: 'Free Exploration', icon: Shuffle },
] as const;

type TabKey = typeof TABS[number]['key'];

const REFLECT_ITEMS = [
  {
    icon: Lightbulb,
    type: 'Reflection',
    title: "What's one win since your last session?",
    href: '/dashboard/reflections',
  },
  {
    icon: Video,
    type: 'Video · 12 min',
    title: 'Reframing setbacks as data, not verdicts',
    href: '/dashboard/articles',
  },
];

const EXPLORATION_ICONS: Record<string, LucideIcon> = {
  Learning: GraduationCap,
  Practice: Target,
  Community: Users,
  'Career Chat': MessageCircle,
  Resources: BookOpen,
};

export default function JourneyPage() {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<number, Status>>(() =>
    Object.fromEntries(ACTION_ITEMS.map((a) => [a.id, a.status]))
  );
  const [openCheckIn, setOpenCheckIn] = useState<number | null>(null);
  const [checkInText, setCheckInText] = useState('');
  const [respondedIds, setRespondedIds] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<TabKey>('plan');
  const [completedWins, setCompletedWins] = useState<Set<string>>(new Set());
  const [shareText, setShareText] = useState('');
  const [sharedHistory, setSharedHistory] = useState<string[]>([]);
  const [shareSaved, setShareSaved] = useState(false);

  const cycleStatus = (id: number) => {
    setStatuses((prev) => {
      const next = STATUS_ORDER[(STATUS_ORDER.indexOf(prev[id]) + 1) % STATUS_ORDER.length];
      return { ...prev, [id]: next };
    });
  };

  const handleSaveCheckIn = (id: number) => {
    setRespondedIds((prev) => new Set(prev).add(id));
    setOpenCheckIn(null);
    setCheckInText('');
  };

  const toggleQuickWin = (id: string) => {
    setCompletedWins((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleShareNote = () => {
    const text = shareText.trim();
    if (!text) return;
    addSharedNote('jamie-rivera', 'Jamie Rivera', text);
    setSharedHistory((prev) => [text, ...prev]);
    setShareText('');
    setShareSaved(true);
    setTimeout(() => setShareSaved(false), 2000);
  };

  const completedCount = Object.values(statuses).filter((s) => s === 'done').length;
  const openCoachItems = ACTION_ITEMS.filter((a) => a.source === 'coach' && statuses[a.id] !== 'done').length;

  const SUMMARY = [
    { label: 'Open items from your coach', value: String(openCoachItems), icon: UserRound, color: 'var(--primary)', bg: '#e8f4f8' },
    { label: 'Session notes to review', value: String(SESSION_NOTES.length), icon: NotebookPen, color: '#15803d', bg: '#f0fdf4' },
    { label: 'Quick wins ready', value: String(QUICK_WINS.length), icon: Zap, color: '#c2410c', bg: '#fff7ed' },
    { label: 'Development goals', value: String(DEVELOPMENT_GOALS.length), icon: Flag, color: '#7e22ce', bg: '#fdf4ff' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5 font-playwrite" style={{ color: 'var(--foreground)' }}>
          <Compass size={22} style={{ color: 'var(--primary)' }} />
          Your Development Journey
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          The work that happens between sessions is where the change really sticks.
        </p>
      </div>

      <OrgPrivacyNote shared="your overall progress through the coaching cycle and completed actions" />

      {/* Mini-dashboard: numerical summary of what's been assigned */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUMMARY.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs: Reflect / Coaching Session / Action Plan / Free Exploration */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
                style={active
                  ? { background: 'var(--primary)', color: '#fff' }
                  : { background: 'var(--surface-muted)', color: 'var(--text-muted)' }
                }
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Reflect */}
        {activeTab === 'reflect' && (
          <div className="space-y-3">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              A couple of things to think about before your next session — plus an open prompt if you&apos;d rather just write.
            </p>
            {REFLECT_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                style={{ background: 'var(--surface-muted)' }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface)' }}>
                  <item.icon size={16} style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{item.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.type}</p>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
              </button>
            ))}
            <button
              onClick={() => router.push('/dashboard/reflections')}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
              style={{ background: '#ecfeff' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface)' }}>
                <Sparkles size={16} style={{ color: '#0e7490' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Try today&apos;s Reflection Prompt of the Day</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>An open, unbounded prompt — write about whatever&apos;s on your mind</p>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        )}

        {/* Coaching Session */}
        {activeTab === 'session' && (
          <div className="space-y-3">
            {SESSION_NOTES.map((note) => (
              <div key={note.id} className="rounded-xl p-4" style={{ background: 'var(--surface-muted)' }}>
                <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{note.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{note.date} · with {note.coach}</p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0"
                    style={note.status === 'completed' ? { background: '#f0fdf4', color: '#15803d' } : { background: '#e8f4f8', color: 'var(--primary)' }}
                  >
                    {note.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mt-2 mb-3" style={{ color: 'var(--text-muted)' }}>{note.summary}</p>
                <ul className="space-y-1.5">
                  {note.notes.map((n, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--foreground)' }}>
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--text-muted)' }} />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Action Plan */}
        {activeTab === 'plan' && (
          <div id="action-plan" className="space-y-4 scroll-mt-6">
            <div>
              <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Actions agreed in your sessions, plus check-ins from Vernon AI to help them stick. Tap the circle to update progress.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <SourceBadge source="coach" label="Set with your coach" />
                  <SourceBadge source="ai" label="Vernon AI digital prompt" />
                </div>
                <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {completedCount} / {ACTION_ITEMS.length} done
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {ACTION_ITEMS.map((item) => {
                const status = statuses[item.id];
                return (
                  <div key={item.id} className="rounded-xl p-4" style={{ background: 'var(--surface-muted)' }}>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => cycleStatus(item.id)}
                        className="mt-0.5 flex-shrink-0"
                        aria-label="Update status"
                      >
                        {status === 'done' && <CheckCircle2 size={20} style={{ color: '#16a34a' }} />}
                        {status === 'in-progress' && <Clock3 size={20} style={{ color: '#c2410c' }} />}
                        {status === 'todo' && <Circle size={20} style={{ color: 'var(--text-muted)' }} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                          <p
                            className="font-semibold text-sm"
                            style={{
                              color: 'var(--foreground)',
                              textDecoration: status === 'done' ? 'line-through' : 'none',
                              opacity: status === 'done' ? 0.6 : 1,
                            }}
                          >
                            {item.title}
                          </p>
                          <SourceBadge
                            source={item.source}
                            label={item.source === 'coach' ? `From ${item.sourceLabel}` : item.sourceLabel}
                          />
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.description}</p>

                        {item.pulseCheck && (
                          <div className="mt-3 rounded-xl p-3" style={{ background: '#f5f3ff' }}>
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles size={13} style={{ color: '#7c3aed' }} />
                              <span className="text-xs font-semibold" style={{ color: '#7c3aed' }}>
                                AI pulse check · {item.pulseCheck.timing}
                              </span>
                            </div>
                            <p className="text-xs mb-2 leading-relaxed" style={{ color: '#5b21b6' }}>{item.pulseCheck.prompt}</p>

                            {respondedIds.has(item.id) ? (
                              <p className="text-xs font-medium flex items-center gap-1" style={{ color: '#16a34a' }}>
                                <CheckCircle2 size={12} /> Logged — thanks for checking in
                              </p>
                            ) : openCheckIn === item.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={checkInText}
                                  onChange={(e) => setCheckInText(e.target.value)}
                                  rows={2}
                                  autoFocus
                                  placeholder="A sentence or two is plenty..."
                                  className="w-full px-3 py-2 rounded-lg border text-xs outline-none resize-none"
                                  style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                />
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleSaveCheckIn(item.id)}
                                    disabled={!checkInText.trim()}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white disabled:opacity-50"
                                    style={{ background: '#7c3aed' }}
                                  >
                                    Save check-in
                                  </button>
                                  <button
                                    onClick={() => { setOpenCheckIn(null); setCheckInText(''); }}
                                    className="text-xs font-medium px-3 py-1.5 rounded-lg"
                                    style={{ color: 'var(--text-muted)' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setOpenCheckIn(item.id); setCheckInText(''); }}
                                className="text-xs font-semibold"
                                style={{ color: '#7c3aed' }}
                              >
                                Respond
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Free Exploration */}
        {activeTab === 'explore' && (
          <div className="space-y-3">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Career growth isn&apos;t always a straight line. If the plan above doesn&apos;t feel right today, here are some other corners of Vernon worth a look.
            </p>
            {FREE_EXPLORATION.map((item) => {
              const Icon = EXPLORATION_ICONS[item.tag] ?? Compass;
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                  style={{ background: 'var(--surface-muted)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface)' }}>
                    <Icon size={16} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{item.title}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                  </div>
                  <ChevronRight size={16} className="flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Things you could do right now */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
          <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Zap size={16} style={{ color: '#c2410c' }} />
            Things you could do right now
          </h2>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {completedWins.size} / {QUICK_WINS.length} done
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          Small, low-effort steps you can knock out in a few spare minutes.
        </p>
        <div className="space-y-2">
          {QUICK_WINS.map((win) => {
            const done = completedWins.has(win.id);
            return (
              <button
                key={win.id}
                onClick={() => toggleQuickWin(win.id)}
                className="w-full flex items-start gap-3 p-3 rounded-xl text-left"
                style={{ background: 'var(--surface-muted)' }}
              >
                {done
                  ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                  : <Circle size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'var(--foreground)', textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 }}
                    >
                      {win.title}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-md font-medium flex items-center gap-1 flex-shrink-0" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
                      <Clock size={10} /> {win.minutes} min
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-muted)' }}>{win.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Longer-term development goals */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <h2 className="font-semibold text-sm flex items-center gap-2 mb-1" style={{ color: 'var(--foreground)' }}>
          <Flag size={16} style={{ color: '#7e22ce' }} />
          Longer-term development goals
        </h2>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          The bigger picture behind your day-to-day actions.
        </p>
        <div className="space-y-3">
          {DEVELOPMENT_GOALS.map((goal) => (
            <div key={goal.id} className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{goal.title}</p>
                <span className="text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
                  {goal.timeframe}
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>{goal.description}</p>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                <div className="h-full rounded-full" style={{ width: `${goal.progress}%`, background: '#7e22ce' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share to coach */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <h2 className="font-semibold text-sm flex items-center gap-2 mb-1" style={{ color: 'var(--foreground)' }}>
          <NotebookPen size={16} style={{ color: 'var(--primary)' }} />
          Share a note with your coach
        </h2>
        <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Anything you&apos;d like Sarah to know before your next session — a question, a worry, something that&apos;s changed. She&apos;ll see this before your Jun 12 session, or use it for reference.
        </p>
        <textarea
          value={shareText}
          onChange={(e) => setShareText(e.target.value)}
          rows={3}
          placeholder="Write a note for Sarah..."
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none leading-relaxed"
          style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
        <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Only visible to you and your coach.</p>
          <button
            onClick={handleShareNote}
            disabled={!shareText.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-all flex-shrink-0"
            style={{ background: shareSaved ? '#16a34a' : 'var(--primary)' }}
          >
            {shareSaved ? <><CheckCircle2 size={15} /> Shared</> : <><SendHorizontal size={15} /> Share with Sarah</>}
          </button>
        </div>
        {sharedHistory.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Shared this session</p>
            {sharedHistory.map((text, i) => (
              <div key={i} className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: 'var(--surface-muted)', color: 'var(--foreground)' }}>
                {text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reflections teaser */}
      <div className="rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap" style={{ background: 'var(--primary)' }}>
        <div>
          <h3 className="text-white font-bold text-base mb-1">Make sense of it in your reflections</h3>
          <p className="text-white/70 text-sm max-w-md">
            Prompts written by Vernon&apos;s qualified coaching team, matched to what&apos;s happening in your plan — plus a daily open prompt.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/reflections')}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Open reflections <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
