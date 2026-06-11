'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ChevronDown, ArrowUp, ArrowDown, Copy, Check, Sparkles, RefreshCw,
} from 'lucide-react';

type TagColor = { bg: string; color: string };

export function ActivityCard({
  icon: Icon, title, description, tag, tagColor, children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
  tagColor: TagColor;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)' }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-4 p-5 text-left">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tagColor.bg }}>
          <Icon size={20} style={{ color: tagColor.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{title}</p>
            <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: tagColor.bg, color: tagColor.color }}>
              {tag}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{description}</p>
        </div>
        <ChevronDown
          size={18}
          style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        />
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

// --- Job Ad Reviewer -------------------------------------------------------

type JobAd = { id: string; company: string; tone: string; excerpt: string };

const JOB_ADS: JobAd[] = [
  {
    id: 'a',
    company: 'Brightline & Co.',
    tone: 'Corporate & formal',
    excerpt: 'We are seeking a results-driven professional to join our dynamic team. The successful candidate will demonstrate exceptional stakeholder management and a proven track record of delivering KPIs within a matrixed organisation.',
  },
  {
    id: 'b',
    company: 'Loop Studio',
    tone: 'Startup & casual',
    excerpt: "Hey \u{1F44B} we're a small team building tools people actually like. We need someone curious, a bit scrappy, and happy to wear a few hats. No jargon, no 10-page job specs, just good people doing good work.",
  },
  {
    id: 'c',
    company: 'Hartley & Pierce',
    tone: 'Traditional & understated',
    excerpt: 'Hartley & Pierce wishes to appoint a capable individual to join a long-established department. Duties will be assigned according to experience. References required. Discretion assured.',
  },
];

const RANK_LABELS = ['1st choice', '2nd choice', '3rd choice'];

export function JobAdActivity() {
  const [order, setOrder] = useState<string[]>(['a', 'b', 'c']);
  const [reflection, setReflection] = useState('');

  const move = (index: number, dir: -1 | 1) => {
    setOrder((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <div className="space-y-4 pt-1">
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        These are three job ad excerpts written in very different styles. Use the arrows to put them in the order you
        find most appealing — purely on how they read and feel, not the role itself.
      </p>
      <div className="space-y-2">
        {order.map((id, index) => {
          const ad = JOB_ADS.find((a) => a.id === id)!;
          return (
            <div key={id} className="rounded-xl p-4 flex gap-3" style={{ background: 'var(--surface-muted)' }}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                <button onClick={() => move(index, -1)} disabled={index === 0} className="disabled:opacity-30" style={{ color: 'var(--text-muted)' }} aria-label="Move up">
                  <ArrowUp size={16} />
                </button>
                <span className="text-xs font-bold w-6 text-center" style={{ color: 'var(--primary)' }}>{index + 1}</span>
                <button onClick={() => move(index, 1)} disabled={index === order.length - 1} className="disabled:opacity-30" style={{ color: 'var(--text-muted)' }} aria-label="Move down">
                  <ArrowDown size={16} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{ad.company}</p>
                  <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
                    {ad.tone}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{ad.excerpt}</p>
                <p className="text-xs font-medium mt-2" style={{ color: 'var(--primary)' }}>{RANK_LABELS[index]}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>
          What drew you to your top pick — and what put you off your last one?
        </label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={3}
          placeholder="There's no right answer — just notice your own reactions..."
          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
          style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
      </div>
    </div>
  );
}

// --- Book-jacket bio writer -------------------------------------------------

const BIO_PROMPT = 'Imagine your career story is being summarised on the back of a book. In 3–4 sentences, what would the blurb say?';

export function BioWriterActivity() {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-3 pt-1">
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{BIO_PROMPT}</p>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        rows={5}
        placeholder="e.g. After a decade solving everyone else's problems, they finally turn their attention to..."
        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none leading-relaxed"
        style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
      />
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{text.length} characters</span>
        <button
          onClick={() => setSaved(true)}
          disabled={!text.trim() || saved}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold disabled:opacity-50"
          style={{ background: saved ? '#16a34a' : 'var(--primary)' }}
        >
          {saved ? <><Check size={14} /> Saved to your drafts</> : 'Save draft'}
        </button>
      </div>
    </div>
  );
}

// --- Career profile builder -------------------------------------------------

const PROFILE_QUESTIONS: { key: 'knownFor' | 'proudMoment' | 'impact'; label: string; placeholder: string }[] = [
  { key: 'knownFor', label: 'What are you known for at work?', placeholder: 'e.g. Bringing people together to get things done' },
  { key: 'proudMoment', label: 'Describe a recent moment you felt proud of your work', placeholder: 'e.g. Led a project that launched two weeks early' },
  { key: 'impact', label: 'What kind of impact do you want to have next?', placeholder: 'e.g. Helping a growing team build good habits early' },
];

const SKILL_OPTIONS = [
  'Communication', 'Leadership', 'Problem solving', 'Project management',
  'Strategic thinking', 'Negotiation', 'Coaching others', 'Data analysis',
  'Creativity', 'Adaptability', 'Stakeholder management', 'Public speaking',
];

const MAX_SKILLS = 5;

export function ProfileBuilderActivity() {
  const [answers, setAnswers] = useState<Record<string, string>>({ knownFor: '', proudMoment: '', impact: '' });
  const [skills, setSkills] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateAnswer = (key: string, value: string) => {
    setGenerated(false);
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill: string) => {
    setGenerated(false);
    setSkills((prev) => {
      if (prev.includes(skill)) return prev.filter((s) => s !== skill);
      if (prev.length >= MAX_SKILLS) return prev;
      return [...prev, skill];
    });
  };

  const canGenerate = Object.values(answers).every((v) => v.trim()) && skills.length > 0;

  const profileText = [
    `Known for: ${answers.knownFor}`,
    `Recent highlight: ${answers.proudMoment}`,
    `Looking ahead: ${answers.impact}`,
    `Core strengths: ${skills.join(', ')}`,
  ].join('\n');

  const handleCopy = () => {
    navigator.clipboard?.writeText(profileText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pt-1">
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Answer three quick questions and pick up to {MAX_SKILLS} skills to generate a short profile you could adapt
        for your CV, LinkedIn headline, or an introduction.
      </p>

      {PROFILE_QUESTIONS.map((q) => (
        <div key={q.key}>
          <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>{q.label}</label>
          <input
            value={answers[q.key]}
            onChange={(e) => updateAnswer(q.key, e.target.value)}
            placeholder={q.placeholder}
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
      ))}

      <div>
        <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>
          Pick up to {MAX_SKILLS} key skills ({skills.length}/{MAX_SKILLS})
        </label>
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map((skill) => {
            const active = skills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                style={active
                  ? { background: 'var(--primary)', color: '#fff' }
                  : { background: 'var(--surface-muted)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                }
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setGenerated(true)}
        disabled={!canGenerate}
        className="px-4 py-2 rounded-xl text-white text-xs font-semibold disabled:opacity-50"
        style={{ background: 'var(--primary)' }}
      >
        Generate my profile
      </button>

      {generated && (
        <div className="rounded-xl p-4 space-y-2" style={{ background: '#f5f3ff' }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold" style={{ color: '#7c3aed' }}>Your draft profile</p>
            <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#7c3aed' }}>
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <pre className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#5b21b6', fontFamily: 'inherit' }}>{profileText}</pre>
        </div>
      )}
    </div>
  );
}

// --- Quick skill snapshot ----------------------------------------------------

const SNAPSHOT_QUESTIONS: { key: string; label: string }[] = [
  { key: 'negotiating', label: 'Negotiating for what I need (pay, scope, flexibility)' },
  { key: 'networking', label: 'Building and maintaining a professional network' },
  { key: 'publicSpeaking', label: 'Speaking up and presenting in front of others' },
  { key: 'strategicPlanning', label: 'Planning several steps ahead for my career' },
  { key: 'handlingChange', label: 'Handling change and uncertainty at work' },
];

const GROWTH_TIPS: Record<string, string> = {
  negotiating: 'The "Practice your two-minute pitch" item in your action plan is a low-stakes way to build this.',
  networking: 'The "Building Your Professional Network" toolkit in Career Application is a good next step.',
  publicSpeaking: 'Practising your pitch out loud, even just to yourself, builds this faster than you might think.',
  strategicPlanning: 'The "Mapping What Matters to You" module can help sharpen your direction.',
  handlingChange: 'Head over to the Practice section to work on your comfort with uncertainty.',
};

const initialScores = () => Object.fromEntries(SNAPSHOT_QUESTIONS.map((q) => [q.key, 3]));

export function SkillSnapshotActivity() {
  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [submitted, setSubmitted] = useState(false);

  const lowest = Math.min(...Object.values(scores));
  const growthAreas = SNAPSHOT_QUESTIONS.filter((q) => scores[q.key] === lowest).slice(0, 2);

  return (
    <div className="space-y-4 pt-1">
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Rate how true each statement feels right now. There&apos;s no pass or fail — it&apos;s just a snapshot to help
        you spot where to focus next.
      </p>

      <div className="space-y-4">
        {SNAPSHOT_QUESTIONS.map((q) => (
          <div key={q.key}>
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <label className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{q.label}</label>
              <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--primary)' }}>{scores[q.key]}/5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={scores[q.key]}
              onChange={(e) => {
                const value = Number(e.target.value);
                setSubmitted(false);
                setScores((prev) => ({ ...prev, [q.key]: value }));
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
          className="px-4 py-2 rounded-xl text-white text-xs font-semibold"
          style={{ background: 'var(--primary)' }}
        >
          See my snapshot
        </button>
      ) : (
        <div className="rounded-xl p-4 space-y-3" style={{ background: '#f5f3ff' }}>
          <div className="space-y-2">
            {SNAPSHOT_QUESTIONS.map((q) => (
              <div key={q.key}>
                <span className="text-xs" style={{ color: '#5b21b6' }}>{q.label}</span>
                <div className="h-1.5 rounded-full overflow-hidden mt-1" style={{ background: 'rgba(124,58,237,0.15)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(scores[q.key] / 5) * 100}%`, background: '#7c3aed' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
            <p className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: '#7c3aed' }}>
              <Sparkles size={12} /> Where to focus next
            </p>
            {growthAreas.map((q) => (
              <p key={q.key} className="text-xs leading-relaxed mb-1" style={{ color: '#5b21b6' }}>{GROWTH_TIPS[q.key]}</p>
            ))}
          </div>
          <button
            onClick={() => { setSubmitted(false); setScores(initialScores()); }}
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: '#7c3aed' }}
          >
            <RefreshCw size={12} /> Try again
          </button>
        </div>
      )}
    </div>
  );
}
