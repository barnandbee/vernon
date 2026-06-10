'use client';

import { useState } from 'react';
import { Lightbulb, Plus, ChevronRight, Sparkles, CheckCircle2, Clock, Lock } from 'lucide-react';

type Prompt = {
  id: number;
  category: string;
  question: string;
  context?: string;
  locked?: boolean;
};

const CATEGORIES = ['All', 'Purpose', 'Values', 'Strengths', 'Goals', 'Coaching Follow-up'];

const PROMPTS: Prompt[] = [
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
];

const PAST_REFLECTIONS = [
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
];

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  'Purpose':           { bg: '#fdf4ff', color: '#7e22ce' },
  'Values':            { bg: '#fff7ed', color: '#c2410c' },
  'Strengths':         { bg: '#f0fdf4', color: '#15803d' },
  'Goals':             { bg: '#eff6ff', color: '#1d4ed8' },
  'Coaching Follow-up':{ bg: '#e8f4f8', color: 'var(--primary)' },
};

export default function ReflectionsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [response, setResponse] = useState('');
  const [saved, setSaved] = useState(false);

  const filtered = PROMPTS.filter(
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
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Career Reflections</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Deepen your self-awareness through guided prompts
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: '12', label: 'Total reflections', icon: Lightbulb, color: '#7e22ce', bg: '#fdf4ff' },
          { value: '3', label: 'This month', icon: CheckCircle2, color: '#15803d', bg: '#f0fdf4' },
          { value: '7', label: 'Day streak', icon: Sparkles, color: '#c2410c', bg: '#fff7ed' },
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
      {PAST_REFLECTIONS.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
            Recent Reflections
          </h2>
          <div className="space-y-3">
            {PAST_REFLECTIONS.map((r, i) => {
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
