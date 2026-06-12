'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SourceBadge from '@/components/SourceBadge';
import OrgPrivacyNote from '@/components/OrgPrivacyNote';
import {
  Compass, CheckCircle2, Circle, Clock3, ChevronRight, Sparkles,
  Lightbulb, ArrowRight, Video, Users, ListChecks, Target,
} from 'lucide-react';

type Status = 'todo' | 'in-progress' | 'done';

type ActionItem = {
  id: number;
  title: string;
  description: string;
  source: 'coach' | 'ai';
  sourceLabel: string;
  status: Status;
  pulseCheck?: { timing: string; prompt: string };
};

const CYCLE_STEPS = [
  { key: 'reflect', label: 'Reflect', icon: Lightbulb },
  { key: 'session', label: 'Coaching session', icon: Users },
  { key: 'plan', label: 'Action plan', icon: ListChecks },
  { key: 'practice', label: 'Practice for real', icon: Target },
];

const PRE_WORK = [
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
  {
    icon: ListChecks,
    type: 'Action plan',
    title: "Check off anything you've made progress on below",
    href: '#action-plan',
  },
];

const ACTION_ITEMS: ActionItem[] = [
  {
    id: 1,
    title: 'Update your CV with quantified achievements',
    description: 'Add measurable outcomes to your last three roles — numbers, scope, impact.',
    source: 'coach',
    sourceLabel: 'Sarah Mitchell',
    status: 'in-progress',
    pulseCheck: {
      timing: '3 days after your session',
      prompt: 'How did it feel revisiting your achievements? Did anything surprise you?',
    },
  },
  {
    id: 2,
    title: 'Research three companies in your target sector',
    description: 'For each one, note one thing that genuinely excites you about how they work.',
    source: 'coach',
    sourceLabel: 'James Park',
    status: 'todo',
  },
  {
    id: 3,
    title: 'Practice your two-minute career pitch out loud',
    description: "Say it to a mirror, a friend, or record yourself — notice what feels natural and what doesn't.",
    source: 'ai',
    sourceLabel: 'Vernon AI',
    status: 'todo',
    pulseCheck: {
      timing: 'The day after you practice',
      prompt: 'Quick pulse check — how confident did saying it out loud feel, from 1–5?',
    },
  },
  {
    id: 4,
    title: 'Re-read your "why I want to move on" notes',
    description: 'Check they still feel true now that a little time has passed.',
    source: 'ai',
    sourceLabel: 'Vernon AI',
    status: 'done',
  },
  {
    id: 5,
    title: 'Book your next strategy session with Sarah',
    description: 'Aim for 2–3 weeks out so you have time to work through this plan.',
    source: 'coach',
    sourceLabel: 'Sarah Mitchell',
    status: 'todo',
  },
];

const STATUS_ORDER: Status[] = ['todo', 'in-progress', 'done'];

export default function JourneyPage() {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<number, Status>>(() =>
    Object.fromEntries(ACTION_ITEMS.map((a) => [a.id, a.status]))
  );
  const [openCheckIn, setOpenCheckIn] = useState<number | null>(null);
  const [checkInText, setCheckInText] = useState('');
  const [respondedIds, setRespondedIds] = useState<Set<number>>(new Set());

  const cycleStatus = (id: number) => {
    setStatuses((prev) => {
      const next = STATUS_ORDER[(STATUS_ORDER.indexOf(prev[id]) + 1) % STATUS_ORDER.length];
      return { ...prev, [id]: next };
    });
  };

  const handlePreWorkClick = (href: string) => {
    if (href.startsWith('#')) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push(href);
    }
  };

  const handleSaveCheckIn = (id: number) => {
    setRespondedIds((prev) => new Set(prev).add(id));
    setOpenCheckIn(null);
    setCheckInText('');
  };

  const completedCount = Object.values(statuses).filter((s) => s === 'done').length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
          <Compass size={22} style={{ color: 'var(--primary)' }} />
          Your Development Journey
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          The work that happens between sessions is where the change really sticks.
        </p>
      </div>

      <OrgPrivacyNote shared="your overall progress through the coaching cycle and completed actions" />

      {/* Cycle stepper */}
      <div className="rounded-2xl p-5 overflow-x-auto" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center gap-2 min-w-max">
          {CYCLE_STEPS.map((step, i) => (
            <div key={step.key} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1.5 w-24">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={i === 2
                    ? { background: 'var(--primary)', color: '#fff' }
                    : { background: 'var(--surface-muted)', color: 'var(--text-muted)' }
                  }
                >
                  <step.icon size={16} />
                </div>
                <span
                  className="text-xs font-medium text-center leading-tight"
                  style={{ color: i === 2 ? 'var(--foreground)' : 'var(--text-muted)' }}
                >
                  {step.label}
                </span>
              </div>
              {i < CYCLE_STEPS.length - 1 && (
                <ChevronRight size={14} className="flex-shrink-0 mb-5" style={{ color: 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pre-work */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
          <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Before your next session</h2>
          <span className="text-xs px-2 py-0.5 rounded-lg font-medium" style={{ background: '#e8f4f8', color: 'var(--primary)' }}>
            Jun 12 with Sarah Mitchell
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          A few small things to think about before you sit down together.
        </p>
        <div className="space-y-2">
          {PRE_WORK.map((item, i) => (
            <button
              key={i}
              onClick={() => handlePreWorkClick(item.href)}
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
        </div>
      </div>

      {/* Action plan */}
      <div id="action-plan" className="rounded-2xl p-5 space-y-4 scroll-mt-6" style={{ background: 'var(--surface)' }}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Your action plan</h2>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {completedCount} / {ACTION_ITEMS.length} done
            </span>
          </div>
          <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Actions agreed in your sessions, plus check-ins from Vernon AI to help them stick. Tap the circle to update progress.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <SourceBadge source="coach" label="Set with your coach" />
            <SourceBadge source="ai" label="Vernon AI digital prompt" />
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

      {/* Reflections teaser */}
      <div className="rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap" style={{ background: 'var(--primary)' }}>
        <div>
          <h3 className="text-white font-bold text-base mb-1">Make sense of it in your reflections</h3>
          <p className="text-white/70 text-sm max-w-md">
            Prompts written by Vernon&apos;s qualified coaching team, matched to what&apos;s happening in your plan.
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
