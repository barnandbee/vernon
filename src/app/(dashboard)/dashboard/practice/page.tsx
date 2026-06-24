'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Target, Compass, Ear, FlaskConical, Mountain, Sparkle, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import OrgPrivacyNote from '@/components/OrgPrivacyNote';

type DimensionKey = 'uncertainty' | 'feedback' | 'assumptions' | 'persistence' | 'curiosity';

const DIMENSIONS: { key: DimensionKey; label: string; statement: string; icon: LucideIcon }[] = [
  {
    key: 'uncertainty',
    label: 'Comfort with uncertainty',
    statement: "I'm comfortable taking action without knowing exactly how it'll turn out.",
    icon: Compass,
  },
  {
    key: 'feedback',
    label: 'Openness to challenging feedback',
    statement: 'I actively seek out feedback, even when it might be hard to hear.',
    icon: Ear,
  },
  {
    key: 'assumptions',
    label: 'Testing your assumptions',
    statement: 'I test my assumptions about roles and careers rather than guessing.',
    icon: FlaskConical,
  },
  {
    key: 'persistence',
    label: 'Persistence through obstacles',
    statement: "I keep going when something doesn't work the first time.",
    icon: Mountain,
  },
  {
    key: 'curiosity',
    label: 'Curiosity in practice',
    statement: 'I follow my curiosity — new conversations, ideas, or experiences.',
    icon: Sparkle,
  },
];

// Jamie Rivera — working professional.
const JAMIE_SUGGESTIONS: Record<DimensionKey, string[]> = {
  uncertainty: [
    'Say yes to one thing this week before you feel fully ready.',
    "Apply for something even if you don't tick every box.",
    'Try a new approach to a familiar task and notice what happens.',
  ],
  feedback: [
    'Ask a trusted colleague for one honest piece of feedback this week.',
    'After your next meeting, ask: "What\'s one thing I could do differently?"',
    "Re-read old feedback and note what you've already acted on.",
  ],
  assumptions: [
    'Have an informal chat with someone in a role you think you want.',
    'Message someone a step ahead of you and ask about their path.',
    'Write down one belief about your career, then one way to test it.',
  ],
  persistence: [
    'Revisit something you gave up on and try one more approach.',
    'Break a stalled goal into a smaller next step you can do today.',
    'Write down what a recent setback taught you.',
  ],
  curiosity: [
    'Strike up a conversation with someone outside your usual circle.',
    'Spend 20 minutes exploring a topic with no work goal in mind.',
    "Ask 'why' one extra time in your next conversation.",
  ],
};

// Zara Ahmed — Year 12 student.
const ZARA_SUGGESTIONS: Record<DimensionKey, string[]> = {
  uncertainty: [
    'Say yes to one thing this week before you feel fully ready — a taster day, a new society, a conversation.',
    "Apply for that work experience placement even if you don't feel 'ready' yet.",
    'Try a different approach to a piece of homework or a project and notice what happens.',
  ],
  feedback: [
    'Ask a teacher or mentor for one honest piece of feedback on something you’re working on.',
    'After your next presentation or class discussion, ask: "What\'s one thing I could do differently?"',
    "Re-read old feedback from a teacher and note what you've already acted on.",
  ],
  assumptions: [
    'Have an informal chat with someone already doing a job you think you want.',
    'Message someone a few years ahead of you — an older student, a family friend — and ask about their path.',
    'Write down one belief about your future, then one way to test it.',
  ],
  persistence: [
    'Revisit a subject or activity you gave up on and try one more approach.',
    'Break a stalled goal — like finishing a personal statement — into a smaller next step you can do today.',
    'Write down what a recent setback, like a tough mark, taught you.',
  ],
  curiosity: [
    'Strike up a conversation with someone outside your usual friend group.',
    'Spend 20 minutes exploring a topic with no exam or deadline in mind.',
    "Ask 'why' one extra time in your next conversation.",
  ],
};

// Marcus Reid — final-year university student.
const MARCUS_SUGGESTIONS: Record<DimensionKey, string[]> = {
  uncertainty: [
    'Say yes to one thing this week before you feel fully ready — a networking event, a stretch task, an application.',
    "Apply for a graduate scheme even if you don't tick every box.",
    'Try a new approach to a familiar assignment or task and notice what happens.',
  ],
  feedback: [
    'Ask a placement manager or course tutor for one honest piece of feedback this week.',
    'After your next interview or mock interview, ask: "What\'s one thing I could do differently?"',
    "Re-read old feedback from your placement and note what you've already acted on.",
  ],
  assumptions: [
    'Have an informal chat with someone already on the grad scheme you’re considering.',
    'Message a graduate one or two years ahead of you and ask about their path.',
    'Write down one belief about your career, then one way to test it.',
  ],
  persistence: [
    'Revisit an application you gave up on and try one more approach.',
    'Break a stalled goal into a smaller next step you can do today.',
    'Write down what a recent setback, like a rejection or a tough assessment centre, taught you.',
  ],
  curiosity: [
    'Strike up a conversation with someone outside your usual course or friend group.',
    'Spend 20 minutes exploring a topic with no application or deadline in mind.',
    "Ask 'why' one extra time in your next conversation.",
  ],
};

const SUGGESTIONS_BY_USER: Record<string, Record<DimensionKey, string[]>> = {
  'demo-user': JAMIE_SUGGESTIONS,
  'zara-ahmed': ZARA_SUGGESTIONS,
  'marcus-reid': MARCUS_SUGGESTIONS,
};

function getSuggestions(userId?: string | null): Record<DimensionKey, string[]> {
  return SUGGESTIONS_BY_USER[userId ?? ''] ?? JAMIE_SUGGESTIONS;
}

const initialScores = (): Record<DimensionKey, number> => ({
  uncertainty: 3, feedback: 3, assumptions: 3, persistence: 3, curiosity: 3,
});

export default function PracticePage() {
  const { user } = useAuth();
  const suggestions = getSuggestions(user?.id);
  const [scores, setScores] = useState<Record<DimensionKey, number>>(initialScores);
  const [submitted, setSubmitted] = useState(false);

  const lowest = Math.min(...Object.values(scores));
  const focusAreas = DIMENSIONS.filter((d) => scores[d.key] === lowest).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5 font-playwrite" style={{ color: 'var(--foreground)' }}>
          <Target size={22} style={{ color: 'var(--primary)' }} />
          Practice in the Real World
        </h1>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Real growth happens outside this app — in conversations, applications, and small experiments. This is about
          getting comfortable testing what you&apos;re learning, even when it&apos;s uncertain.
        </p>
      </div>

      <OrgPrivacyNote shared="how often you engage with practice activities — not your individual ratings or notes" />

      {/* Intro card */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <h2 className="font-semibold text-sm mb-2" style={{ color: 'var(--foreground)' }}>Why this matters</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Reflection and learning only become real when you try them out — sitting with uncertainty, asking for
          feedback that might sting, checking your assumptions against reality, staying with something that&apos;s
          hard, and following your curiosity even when there&apos;s no obvious payoff.
        </p>
      </div>

      {/* Self check-in */}
      <div className="rounded-2xl p-5 space-y-5" style={{ background: 'var(--surface)' }}>
        <div>
          <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>How true does this feel right now?</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>1 = not at all true, 5 = very true. Be honest — this is just for you.</p>
        </div>

        <div className="space-y-5">
          {DIMENSIONS.map((d) => (
            <div key={d.key}>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <d.icon size={15} style={{ color: 'var(--primary)' }} />
                  {d.label}
                </label>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--primary)' }}>{scores[d.key]}/5</span>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{d.statement}</p>
              <input
                type="range"
                min={1}
                max={5}
                value={scores[d.key]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setSubmitted(false);
                  setScores((prev) => ({ ...prev, [d.key]: value }));
                }}
                className="w-full"
                style={{ accentColor: 'var(--primary)' }}
              />
            </div>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'var(--primary)' }}
          >
            See my results
          </button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {DIMENSIONS.map((d) => (
                <div key={d.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{d.label}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{scores[d.key]}/5</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(scores[d.key] / 5) * 100}%`, background: 'var(--primary)' }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4" style={{ background: '#f5f3ff' }}>
              <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#7c3aed' }}>
                <Sparkles size={12} /> Suggested next steps
              </p>
              <div className="space-y-3">
                {focusAreas.map((d) => (
                  <div key={d.key}>
                    <p className="text-xs font-medium mb-1" style={{ color: '#5b21b6' }}>{d.label}</p>
                    <ul className="space-y-1">
                      {suggestions[d.key].map((s, i) => (
                        <li key={i} className="text-xs leading-relaxed pl-3 relative" style={{ color: '#5b21b6' }}>
                          <span className="absolute left-0">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3 pt-3 border-t leading-relaxed" style={{ borderColor: 'rgba(124,58,237,0.15)', color: '#7c3aed' }}>
                Soon, suggestions here will also draw on recommendations from your coach.
              </p>
            </div>

            <button
              onClick={() => { setSubmitted(false); setScores(initialScores()); }}
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              <RefreshCw size={12} /> Reset and try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
