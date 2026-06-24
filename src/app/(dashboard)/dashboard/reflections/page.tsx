'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import OrgPrivacyNote from '@/components/OrgPrivacyNote';
import { Lightbulb, Plus, ChevronRight, Sparkles, CheckCircle2, Clock, Lock, UserRound, Sun } from 'lucide-react';

type Prompt = {
  id: number;
  category: string;
  question: string;
  context?: string;
  locked?: boolean;
};

type PastReflection = {
  date: string;
  question: string;
  snippet: string;
  category: string;
};

type ReflectionStats = {
  total: number;
  thisMonth: number;
  streak: number;
};

type ReflectionsContent = {
  prompts: Prompt[];
  dailyPrompt: Prompt;
  pastReflections: PastReflection[];
  stats: ReflectionStats;
};

const CATEGORIES = ['All', 'Purpose', 'Values', 'Strengths', 'Goals', 'Coaching Follow-up'];

// Jamie Rivera — working professional building a case for a people-leadership move.
const JAMIE_REFLECTIONS: ReflectionsContent = {
  prompts: [
    {
      id: 1,
      category: 'Purpose',
      question: 'What aspects of your work give you the most energy and meaning right now?',
      context: 'Think about the last time you left work feeling genuinely fulfilled. What were you doing?',
    },
    {
      id: 2,
      category: 'Values',
      question: 'Which of your core values feels most compromised in your current role?',
      context: 'Reflecting on your coaching session from June 12 — you mentioned feeling undervalued.',
    },
    {
      id: 3,
      category: 'Coaching Follow-up',
      question: 'What one action from your strategy session with Sarah have you taken this week?',
      context: 'Based on your session on June 12 with Sarah Mitchell.',
    },
    {
      id: 4,
      category: 'Strengths',
      question: 'Describe a recent moment where you surprised yourself with what you could do.',
    },
    {
      id: 5,
      category: 'Goals',
      question: 'If your career was exactly where you wanted it in 3 years, what would your day look like?',
    },
    {
      id: 6,
      category: 'Coaching Follow-up',
      question: 'What barriers are stopping you from applying for that senior role you discussed with James?',
      context: 'Based on your session on May 28 with James Park.',
      locked: true,
    },
    {
      id: 7,
      category: 'Purpose',
      question: 'What legacy do you want to leave in your professional field?',
      locked: true,
    },
  ],
  dailyPrompt: {
    id: 0,
    category: 'Daily',
    question: "What's on your mind about your career today — no filter needed?",
    context: 'This one is intentionally open. A worry, an idea, a memory, a question — write whatever comes up, in whatever shape it takes.',
  },
  pastReflections: [
    {
      date: 'Jun 5, 2026',
      question: 'What does success look like to you beyond the job title?',
      snippet: "I've been thinking about this a lot lately. Success for me is waking up on Monday without dread...",
      category: 'Purpose',
    },
    {
      date: 'May 28, 2026',
      question: 'Which skills do you most want to develop in the next 12 months?',
      snippet: "Strategic communication and stakeholder management. I know the technical side well, but...",
      category: 'Strengths',
    },
  ],
  stats: { total: 12, thisMonth: 3, streak: 7 },
};

// Zara Ahmed — Year 12 student exploring subjects, work experience and
// apprenticeships vs. university before narrowing anything down.
const ZARA_REFLECTIONS: ReflectionsContent = {
  prompts: [
    {
      id: 1,
      category: 'Purpose',
      question: 'What subjects or activities give you the most energy and focus right now?',
      context: 'Think about the last lesson, project or hobby that left you completely absorbed. What were you doing?',
    },
    {
      id: 2,
      category: 'Values',
      question: 'Which of your values feels most at odds with what everyone expects you to do next?',
      context: 'Reflecting on your Getting to Know You session — you mentioned feeling pressure to decide everything now.',
    },
    {
      id: 3,
      category: 'Coaching Follow-up',
      question: 'What’s one thing about your taster day you want to make sure you tell Sarah?',
      context: 'Ahead of your check-in on June 13 with Sarah Mitchell.',
    },
    {
      id: 4,
      category: 'Strengths',
      question: 'Describe a recent moment, in or out of school, where you surprised yourself with what you could do.',
    },
    {
      id: 5,
      category: 'Goals',
      question: 'If you could try five different jobs for a day each, which would you pick — and why those five?',
    },
    {
      id: 6,
      category: 'Coaching Follow-up',
      question: 'What’s stopping you from asking your school’s careers office about that apprenticeship?',
      context: 'Based on your check-in on June 13 with Sarah Mitchell.',
      locked: true,
    },
    {
      id: 7,
      category: 'Purpose',
      question: 'What do you want your friends to remember about you after sixth form?',
      locked: true,
    },
  ],
  dailyPrompt: {
    id: 0,
    category: 'Daily',
    question: "What's on your mind about your future today — no filter needed?",
    context: 'This one is intentionally open. A worry, an idea, a memory, a question — write whatever comes up, in whatever shape it takes.',
  },
  pastReflections: [
    {
      date: 'Jun 9, 2026',
      question: 'Describe a recent moment, in or out of school, where you surprised yourself with what you could do.',
      snippet: "Probably when I ended up leading our debate team prep even though I wasn't team captain. I just started organising...",
      category: 'Strengths',
    },
    {
      date: 'Jun 6, 2026',
      question: 'What subjects or activities give you the most energy and focus right now?',
      snippet: "Definitely anything where I'm making something rather than just writing about it. In art and...",
      category: 'Purpose',
    },
  ],
  stats: { total: 6, thisMonth: 2, streak: 4 },
};

// Marcus Reid — final-year university student weighing a graduate scheme
// offer against a Master's, drawing on his placement-year experience.
const MARCUS_REFLECTIONS: ReflectionsContent = {
  prompts: [
    {
      id: 1,
      category: 'Purpose',
      question: 'What parts of your placement year gave you the most energy and meaning?',
      context: 'Think about the moment during your placement when you felt most genuinely engaged. What were you doing?',
    },
    {
      id: 2,
      category: 'Values',
      question: 'Which of your values feels most at odds with the path your coursemates are taking?',
      context: 'Reflecting on your Onboarding Review — you mentioned comparing yourself to coursemates with very different goals.',
    },
    {
      id: 3,
      category: 'Coaching Follow-up',
      question: 'What’s one thing from tailoring your CV that made your placement year sound stronger than you expected?',
      context: 'Ahead of your strategy session on June 11 with Sarah Mitchell.',
    },
    {
      id: 4,
      category: 'Strengths',
      question: 'Describe a moment during your placement where you surprised yourself with what you could do.',
    },
    {
      id: 5,
      category: 'Goals',
      question: 'If you got both a grad scheme offer and a Master’s place in the same week, what would you actually choose — and why?',
    },
    {
      id: 6,
      category: 'Coaching Follow-up',
      question: 'What’s holding you back from messaging that placement contact you mentioned?',
      context: 'Based on your strategy session on June 11 with Sarah Mitchell.',
      locked: true,
    },
    {
      id: 7,
      category: 'Purpose',
      question: 'What do you want to be known for by the end of your first year in a graduate role?',
      locked: true,
    },
  ],
  dailyPrompt: {
    id: 0,
    category: 'Daily',
    question: "What's on your mind about your next step today — no filter needed?",
    context: 'This one is intentionally open. A worry, an idea, a memory, a question — write whatever comes up, in whatever shape it takes.',
  },
  pastReflections: [
    {
      date: 'Jun 7, 2026',
      question: 'Describe a moment during your placement where you surprised yourself with what you could do.',
      snippet: "Presenting the process change to senior leadership. I was terrified beforehand but it went...",
      category: 'Strengths',
    },
    {
      date: 'Jun 4, 2026',
      question: 'What parts of your placement year gave you the most energy and meaning?',
      snippet: "Honestly the client-facing days, not the reporting. Whenever I got to actually sit in on a pitch...",
      category: 'Purpose',
    },
  ],
  stats: { total: 15, thisMonth: 5, streak: 9 },
};

const REFLECTIONS_BY_USER: Record<string, ReflectionsContent> = {
  'demo-user': JAMIE_REFLECTIONS,
  'zara-ahmed': ZARA_REFLECTIONS,
  'marcus-reid': MARCUS_REFLECTIONS,
};

function getReflectionsContent(userId?: string | null): ReflectionsContent {
  return REFLECTIONS_BY_USER[userId ?? ''] ?? JAMIE_REFLECTIONS;
}

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  'Purpose':           { bg: '#fdf4ff', color: '#7e22ce' },
  'Values':            { bg: '#fff7ed', color: '#c2410c' },
  'Strengths':         { bg: '#f0fdf4', color: '#15803d' },
  'Goals':             { bg: '#eff6ff', color: '#1d4ed8' },
  'Coaching Follow-up':{ bg: '#e8f4f8', color: 'var(--primary)' },
  'Daily':             { bg: '#ecfeff', color: '#0e7490' },
};

export default function ReflectionsPage() {
  const { user } = useAuth();
  const { prompts, dailyPrompt, pastReflections, stats } = getReflectionsContent(user?.id);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [response, setResponse] = useState('');
  const [saved, setSaved] = useState(false);

  const filtered = prompts.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setActivePrompt(null);
      setResponse('');
    }, 1500);
  };

  if (activePrompt) {
    const catStyle = CAT_COLORS[activePrompt.category] || { bg: '#f3f4f6', color: '#374151' };
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <button
          onClick={() => { setActivePrompt(null); setResponse(''); setSaved(false); }}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--primary)' }}
        >
          <ChevronRight size={14} className="rotate-180" />
          Back to prompts
        </button>

        <div className="rounded-2xl p-6" style={{ background: 'var(--surface)' }}>
          <span
            className="inline-block text-xs px-2.5 py-1 rounded-lg font-medium mb-4"
            style={{ background: catStyle.bg, color: catStyle.color }}
          >
            {activePrompt.category}
          </span>
          <h2 className="text-xl font-bold leading-snug mb-3" style={{ color: 'var(--foreground)' }}>
            {activePrompt.question}
          </h2>
          {activePrompt.context && (
            <div
              className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm"
              style={{ background: catStyle.bg }}
            >
              <Sparkles size={14} className="mt-0.5 flex-shrink-0" style={{ color: catStyle.color }} />
              <p style={{ color: catStyle.color }}>{activePrompt.context}</p>
            </div>
          )}
        </div>

        <div>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Take your time — there are no right or wrong answers here. Just write honestly..."
            rows={10}
            className="w-full px-5 py-4 rounded-2xl border text-sm outline-none resize-none leading-relaxed"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          />
          <p className="text-xs mt-2 text-right" style={{ color: 'var(--text-muted)' }}>
            {response.length} characters
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Your reflections are private and only visible to you and your coach.
          </p>
          <button
            onClick={handleSave}
            disabled={!response.trim() || saved}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-all"
            style={{ background: saved ? '#16a34a' : 'var(--primary)' }}
          >
            {saved ? <><CheckCircle2 size={15} /> Saved!</> : 'Save Reflection'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>Career Reflections</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Deepen your self-awareness through guided prompts
        </p>
      </div>

      {/* Reflection Prompt of the Day */}
      <button
        onClick={() => setActivePrompt(dailyPrompt)}
        className="w-full text-left rounded-2xl p-5 flex items-center gap-4 flex-wrap transition-all hover:scale-[1.01]"
        style={{ background: CAT_COLORS['Daily'].bg }}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface)' }}>
          <Sun size={20} style={{ color: CAT_COLORS['Daily'].color }} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: CAT_COLORS['Daily'].color }}>
            Reflection Prompt of the Day
          </span>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--foreground)' }}>{dailyPrompt.question}</p>
        </div>
        <ChevronRight size={18} className="flex-shrink-0" style={{ color: CAT_COLORS['Daily'].color }} />
      </button>

      {/* Coach-curated note */}
      <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: '#e8f4f8' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface)' }}>
          <UserRound size={16} style={{ color: 'var(--primary)' }} />
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--primary)' }}>
          <span className="font-semibold">Written by qualified coaches. </span>
          Every prompt in this library is designed by Vernon&apos;s coaching team to deepen self-awareness between sessions — some are matched to what comes up in your own coaching conversations.
        </p>
      </div>

      <OrgPrivacyNote shared="that you completed a reflection, and your reflection streak" />

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: String(stats.total), label: 'Total reflections', icon: Lightbulb, color: '#7e22ce', bg: '#fdf4ff' },
          { value: String(stats.thisMonth), label: 'This month', icon: CheckCircle2, color: '#15803d', bg: '#f0fdf4' },
          { value: String(stats.streak), label: 'Day streak', icon: Sparkles, color: '#c2410c', bg: '#fff7ed' },
        ].map(({ value, label, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'var(--surface)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
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

      {/* Prompts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((prompt) => {
          const catStyle = CAT_COLORS[prompt.category] || { bg: '#f3f4f6', color: '#374151' };
          return (
            <button
              key={prompt.id}
              onClick={() => !prompt.locked && setActivePrompt(prompt)}
              className={`text-left rounded-2xl p-5 transition-all ${prompt.locked ? 'opacity-60' : 'hover:scale-[1.01]'}`}
              style={{ background: 'var(--surface)' }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span
                  className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{ background: catStyle.bg, color: catStyle.color }}
                >
                  {prompt.category}
                </span>
                {prompt.locked
                  ? <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                  : <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                }
              </div>
              <p className="font-medium text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                {prompt.question}
              </p>
              {prompt.context && (
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {prompt.context}
                </p>
              )}
              {prompt.locked && (
                <p className="text-xs mt-3 font-medium" style={{ color: 'var(--text-muted)' }}>
                  Complete previous reflections to unlock
                </p>
              )}
            </button>
          );
        })}

        {/* Add custom prompt */}
        <button
          className="text-left rounded-2xl p-5 border-2 border-dashed flex items-center justify-center gap-2"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Write your own reflection</span>
        </button>
      </div>

      {/* Past reflections */}
      {pastReflections.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
            Recent Reflections
          </h2>
          <div className="space-y-3">
            {pastReflections.map((r, i) => {
              const catStyle = CAT_COLORS[r.category] || { bg: '#f3f4f6', color: '#374151' };
              return (
                <div key={i} className="rounded-2xl p-5 cursor-pointer" style={{ background: 'var(--surface)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-md font-medium"
                      style={{ background: catStyle.bg, color: catStyle.color }}
                    >
                      {r.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock size={11} />
                      {r.date}
                    </div>
                  </div>
                  <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>{r.question}</p>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>{r.snippet}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
