'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RotateCcw, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import OrgPrivacyNote from '@/components/OrgPrivacyNote';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

// Jamie Rivera — working professional.
const JAMIE_STARTER_PROMPTS = [
  "Help me create a 6-month career development plan",
  "I feel stuck in my current role — what should I consider?",
  "How do I position myself for a leadership role?",
  "Help me prepare for a difficult salary conversation",
];

const JAMIE_RESPONSES: Record<string, string> = {
  default: "That's a great question to explore. Let me help you think through this clearly.\n\nTo give you the most relevant guidance, could you tell me a bit more about your current situation? For example:\n\n• What industry or field are you in?\n• How long have you been in your current role?\n• What does your ideal next step look like?\n\nOnce I understand your context better, I can help you build a practical, personalised plan.",
  plan: "Excellent — let's build a meaningful 6-month plan together.\n\n**Here's a framework to get started:**\n\n**Month 1–2: Clarify & Assess**\n• Complete a skills audit (what do you do brilliantly vs. want to grow?)\n• Define your 'north star' — what does career success mean *to you*?\n• Book a reflection session with your coach\n\n**Month 3–4: Build & Strengthen**\n• Identify 2–3 specific skills to develop\n• Start a visibility project in your organisation\n• Expand your network intentionally\n\n**Month 5–6: Position & Act**\n• Update your CV and LinkedIn\n• Apply for roles or propose a promotion conversation\n• Review progress against your goals\n\nWould you like to go deeper on any of these phases?",
  stuck: "Feeling stuck is one of the most common — and most important — signals in a career. It often means growth is ready to happen, if you know where to look.\n\nLet's explore what's underneath this feeling:\n\n**Is it boredom?** You may have outgrown the role — your skills exceed your current challenges.\n\n**Is it misalignment?** Your values or interests may have shifted, and the role hasn't kept pace.\n\n**Is it fear?** Sometimes 'stuck' is actually 'scared of the next step' in disguise.\n\n**Is it environment?** The problem might not be the work itself but the culture or people around it.\n\nWhich of these resonates most with you right now?",
  leadership: "Moving into leadership is as much about identity as it is about skills. Many people try to 'act like a leader' before they've done the inner work.\n\n**Here's what tends to work:**\n\n1. **Start leading now** — you don't need a title. Volunteer to run projects, mentor others, and speak up in rooms where decisions are made.\n\n2. **Build your reputation** — leadership is partly perception. Be known for reliability, clarity, and developing others.\n\n3. **Have the conversation** — if you want a leadership role, tell your manager explicitly. Ambiguity is the enemy of promotion.\n\n4. **Invest in your presence** — how you communicate in meetings, in writing, and under pressure matters enormously.\n\nWhere would you say you are on this journey right now?",
};

function getJamieResponse(lower: string): string {
  if (lower.includes('plan') || lower.includes('6-month')) return JAMIE_RESPONSES.plan;
  if (lower.includes('stuck')) return JAMIE_RESPONSES.stuck;
  if (lower.includes('leadership') || lower.includes('leader')) return JAMIE_RESPONSES.leadership;
  return JAMIE_RESPONSES.default;
}

// Zara Ahmed — Year 12 student.
const ZARA_STARTER_PROMPTS = [
  "Help me make a plan for choosing my next steps after sixth form",
  "I don't know what I want to do — where do I even start?",
  "How do I make the most of a work experience taster day?",
  "Help me prepare to talk about myself at an interview or open day",
];

const ZARA_RESPONSES: Record<string, string> = {
  default: "That's a great question to explore. Let me help you think through this clearly.\n\nTo give you the most relevant guidance, could you tell me a bit more about where you are? For example:\n\n• What subjects or activities do you enjoy most right now?\n• Have you thought about university, apprenticeships, or something else?\n• What does a good next step look like to you?\n\nOnce I understand your situation better, I can help you build a practical, personalised plan.",
  plan: "Excellent — let's build a meaningful plan for the next few months together.\n\n**Here's a framework to get started:**\n\n**Weeks 1–2: Explore & Reflect**\n• Note down what you actually enjoy in and out of school, not just what you're good at\n• Look at both university courses and apprenticeships for one subject area you're curious about\n• Book a check-in with your coach\n\n**Weeks 3–6: Try & Test**\n• Book or follow up on a work experience taster day\n• Have an informal chat with someone doing something you're curious about\n• Start narrowing down which subjects you actually want to keep\n\n**Weeks 7–10: Decide & Prepare**\n• Pick your top one or two routes to focus on\n• Practice talking about your interests and strengths out loud\n• Review progress with your coach\n\nWould you like to go deeper on any of these phases?",
  stuck: "Not knowing yet is completely normal — most people your age haven't decided either, even if it doesn't feel that way. It often just means you haven't found the right information or experience yet.\n\nLet's explore what's underneath this feeling:\n\n**Is it too many options?** Sometimes it's not that you don't know anything — it's that you know too many things and haven't compared them properly.\n\n**Is it pressure?** Feeling like you have to decide everything right now can make it harder to think clearly.\n\n**Is it missing information?** You might just not have tried enough things yet to know what you actually enjoy day-to-day.\n\n**Is it other people's expectations?** Sometimes 'I don't know' is actually 'I know what I want, but I'm not sure it's allowed.'\n\nWhich of these feels closest to where you are right now?",
  experience: "Work experience and taster days are one of the fastest ways to find out if something is actually for you — not just what it sounds like from the outside.\n\n**Here's what tends to work:**\n\n1. **Go in with questions** — not just 'is this for me' but specific ones like 'what does a normal Tuesday look like here?'\n\n2. **Notice your energy, not just the task** — were you bored, curious, switched off, completely absorbed?\n\n3. **Talk to more than one person** — different people in the same field can have very different days.\n\n4. **Write it down straight after** — what you remember a week later is never the full picture.\n\nWhat's the taster day or placement you're thinking about, or have just done?",
  confidence: "Talking about yourself confidently is a skill, not a personality trait — and it gets easier with practice, not bravery.\n\n**Here's what tends to work:**\n\n1. **Start with a simple structure** — what you're interested in, one example that shows it, and what you're curious about next.\n\n2. **Practice out loud, not just in your head** — it always sounds different once it leaves your mouth.\n\n3. **Use real examples** — a project, a club, a part-time job, even something outside school works better than vague claims.\n\n4. **It's okay to not have all the answers** — 'I'm still figuring that out, but here's what I do know' is a completely legitimate thing to say.\n\nWhat's coming up that you want to prepare for — an interview, an open day, something else?",
};

function getZaraResponse(lower: string): string {
  if (lower.includes('plan')) return ZARA_RESPONSES.plan;
  if (lower.includes("don't know") || lower.includes('stuck') || lower.includes('start')) return ZARA_RESPONSES.stuck;
  if (lower.includes('taster') || lower.includes('work experience') || lower.includes('placement')) return ZARA_RESPONSES.experience;
  if (lower.includes('interview') || lower.includes('talk about') || lower.includes('open day')) return ZARA_RESPONSES.confidence;
  return ZARA_RESPONSES.default;
}

// Marcus Reid — final-year university student.
const MARCUS_STARTER_PROMPTS = [
  "Help me create a plan for landing a graduate scheme offer",
  "I can't decide between a graduate scheme and a Master's — what should I consider?",
  "How do I turn my placement year into a strong interview pitch?",
  "Help me prepare for a graduate assessment centre",
];

const MARCUS_RESPONSES: Record<string, string> = {
  default: "That's a great question to explore. Let me help you think through this clearly.\n\nTo give you the most relevant guidance, could you tell me a bit more about your situation? For example:\n\n• What sector or type of graduate scheme are you targeting?\n• What did you do during your placement year?\n• What does a good outcome look like by the end of this application cycle?\n\nOnce I understand your context better, I can help you build a practical, personalised plan.",
  plan: "Excellent — let's build a focused plan for this application cycle together.\n\n**Here's a framework to get started:**\n\n**Weeks 1–2: Clarify & Tailor**\n• Pull out the strongest, most quantifiable results from your placement year\n• Shortlist the graduate schemes that genuinely excite you, not just the well-known names\n• Book a strategy session with your coach\n\n**Weeks 3–6: Apply & Prepare**\n• Tailor your CV and applications to each scheme's actual requirements\n• Practice your 'why this scheme' pitch out loud\n• Research what each scheme's day-to-day work is really like\n\n**Weeks 7–10: Interview & Decide**\n• Prepare for assessment centres and interviews using real placement examples\n• Keep the Master's option live as a genuine fallback, not a default\n• Review offers against what actually fits you, not just prestige\n\nWould you like to go deeper on any of these phases?",
  decide: "This is a genuinely hard call, and it's worth resisting the pressure to decide before you have to.\n\nLet's explore what's underneath the decision:\n\n**Is it the work itself?** A scheme gets you earning and learning on the job sooner; a Master's deepens expertise before you start.\n\n**Is it timing?** Some schemes let you defer — it's worth checking before treating this as all-or-nothing.\n\n**Is it status anxiety?** Coursemates' choices can make either option feel like 'falling behind' — that's rarely actually true.\n\n**Is it cost and circumstance?** Money, location, and what's realistic for you matter as much as what sounds impressive.\n\nWhich of these feels closest to your real hesitation?",
  placement: "Your placement year is probably your strongest asset on paper — the trick is making it sound like evidence, not just a summary of what you did.\n\n**Here's what tends to work:**\n\n1. **Lead with outcomes, not duties** — what changed because you were there, with a number if you can.\n\n2. **Pick stories, not job descriptions** — one moment where you solved a problem says more than a full task list.\n\n3. **Connect it to the scheme, explicitly** — 'this is why that placement experience matters for this specific role.'\n\n4. **Practice it out loud** — a pitch that reads well on paper can still come out clunky the first few times you say it.\n\nWhat's the strongest moment from your placement year you could build a story around?",
  assessment: "Assessment centres can feel like a black box, but they're testing a small, knowable set of things.\n\n**Here's what tends to work:**\n\n1. **Know what's being assessed** — usually teamwork, problem-solving, communication, and resilience under pressure, not just 'being impressive.'\n\n2. **Practice group exercises out loud** — with a friend or coursemate, not just in your head.\n\n3. **Bring placement examples, not theory** — real moments from your placement year carry more weight than textbook answers.\n\n4. **Treat it as two-way** — you're also finding out if the scheme actually fits you.\n\nWhich part of the assessment centre feels most daunting right now — the group tasks, the interview, or something else?",
};

function getMarcusResponse(lower: string): string {
  if (lower.includes('plan')) return MARCUS_RESPONSES.plan;
  if (lower.includes('decide') || lower.includes('master')) return MARCUS_RESPONSES.decide;
  if (lower.includes('placement') || lower.includes('pitch')) return MARCUS_RESPONSES.placement;
  if (lower.includes('assessment')) return MARCUS_RESPONSES.assessment;
  return MARCUS_RESPONSES.default;
}

const STARTER_PROMPTS_BY_USER: Record<string, string[]> = {
  'demo-user': JAMIE_STARTER_PROMPTS,
  'zara-ahmed': ZARA_STARTER_PROMPTS,
  'marcus-reid': MARCUS_STARTER_PROMPTS,
};

function getStarterPrompts(userId?: string | null): string[] {
  return STARTER_PROMPTS_BY_USER[userId ?? ''] ?? JAMIE_STARTER_PROMPTS;
}

function getResponse(content: string, userId?: string | null): string {
  const lower = content.toLowerCase();
  if (userId === 'zara-ahmed') return getZaraResponse(lower);
  if (userId === 'marcus-reid') return getMarcusResponse(lower);
  return getJamieResponse(lower);
}

function formatMessage(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-semibold mt-3 first:mt-0">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith('• ')) {
      return <li key={i} className="ml-4 list-disc text-sm">{line.slice(2)}</li>;
    }
    if (/^\d+\./.test(line)) {
      return <li key={i} className="ml-4 list-decimal text-sm">{line.slice(line.indexOf(' ') + 1)}</li>;
    }
    if (line === '') return <div key={i} className="h-1" />;
    return <p key={i} className="text-sm leading-relaxed">{line}</p>;
  });
}

export default function ChatPage() {
  const { user } = useAuth();
  const starterPrompts = getStarterPrompts(user?.id);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello ${user?.name?.split(' ')[0] || 'there'} — I'm Vernon, your AI career coach.\n\nI'm here to help you explore your career goals, reflect on where you are, and make a clear plan for where you want to go.\n\nWhat would you like to work on today?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getResponse(content, user?.id),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 1200 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: `Hello ${user?.name?.split(' ')[0] || 'there'} — I'm Vernon. What would you like to explore today?`,
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex flex-col h-full" style={{ maxHeight: 'calc(100vh - 0px)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--primary)' }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Vernon AI</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Career Coach · Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
          style={{ color: 'var(--text-muted)', background: 'var(--surface-muted)' }}
        >
          <RotateCcw size={12} />
          New conversation
        </button>
      </div>

      {/* Org privacy note */}
      <div className="px-4 pt-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <OrgPrivacyNote shared="that you've used Career Chat — never your messages" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ background: 'var(--primary)' }}
                >
                  <Sparkles size={13} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'rounded-tr-sm'
                    : 'rounded-tl-sm'
                }`}
                style={msg.role === 'user'
                  ? { background: 'var(--primary)', color: '#fff' }
                  : { background: 'var(--surface)', color: 'var(--foreground)' }
                }
              >
                <div className="space-y-0.5">
                  {formatMessage(msg.content)}
                </div>
                <p
                  className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/60 text-right' : ''}`}
                  style={msg.role === 'assistant' ? { color: 'var(--text-muted)' } : {}}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--primary)' }}
              >
                <Sparkles size={13} className="text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: 'var(--surface)' }}>
                <div className="flex items-center gap-1.5 py-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        background: 'var(--primary)',
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '0.8s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Starter prompts (show only at the start) */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Suggested topics:</p>
            <div className="flex flex-wrap gap-2">
              {starterPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-xs px-3 py-2 rounded-xl border font-medium transition-all"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 pb-4 pt-3 border-t flex-shrink-0"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Vernon anything about your career..."
              rows={1}
              style={{
                background: 'var(--surface-muted)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                resize: 'none',
                maxHeight: '120px',
                overflowY: 'auto',
              }}
              className="w-full px-4 py-3 rounded-2xl border text-sm outline-none leading-relaxed"
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
          Vernon AI provides guidance and reflection support — not professional advice.
        </p>
      </div>
    </div>
  );
}
