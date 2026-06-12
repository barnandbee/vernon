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

const STARTER_PROMPTS = [
  "Help me create a 6-month career development plan",
  "I feel stuck in my current role — what should I consider?",
  "How do I position myself for a leadership role?",
  "Help me prepare for a difficult salary conversation",
];

const DEMO_RESPONSES: Record<string, string> = {
  default: "That's a great question to explore. Let me help you think through this clearly.\n\nTo give you the most relevant guidance, could you tell me a bit more about your current situation? For example:\n\n• What industry or field are you in?\n• How long have you been in your current role?\n• What does your ideal next step look like?\n\nOnce I understand your context better, I can help you build a practical, personalised plan.",
  plan: "Excellent — let's build a meaningful 6-month plan together.\n\n**Here's a framework to get started:**\n\n**Month 1–2: Clarify & Assess**\n• Complete a skills audit (what do you do brilliantly vs. want to grow?)\n• Define your 'north star' — what does career success mean *to you*?\n• Book a reflection session with your coach\n\n**Month 3–4: Build & Strengthen**\n• Identify 2–3 specific skills to develop\n• Start a visibility project in your organisation\n• Expand your network intentionally\n\n**Month 5–6: Position & Act**\n• Update your CV and LinkedIn\n• Apply for roles or propose a promotion conversation\n• Review progress against your goals\n\nWould you like to go deeper on any of these phases?",
  stuck: "Feeling stuck is one of the most common — and most important — signals in a career. It often means growth is ready to happen, if you know where to look.\n\nLet's explore what's underneath this feeling:\n\n**Is it boredom?** You may have outgrown the role — your skills exceed your current challenges.\n\n**Is it misalignment?** Your values or interests may have shifted, and the role hasn't kept pace.\n\n**Is it fear?** Sometimes 'stuck' is actually 'scared of the next step' in disguise.\n\n**Is it environment?** The problem might not be the work itself but the culture or people around it.\n\nWhich of these resonates most with you right now?",
  leadership: "Moving into leadership is as much about identity as it is about skills. Many people try to 'act like a leader' before they've done the inner work.\n\n**Here's what tends to work:**\n\n1. **Start leading now** — you don't need a title. Volunteer to run projects, mentor others, and speak up in rooms where decisions are made.\n\n2. **Build your reputation** — leadership is partly perception. Be known for reliability, clarity, and developing others.\n\n3. **Have the conversation** — if you want a leadership role, tell your manager explicitly. Ambiguity is the enemy of promotion.\n\n4. **Invest in your presence** — how you communicate in meetings, in writing, and under pressure matters enormously.\n\nWhere would you say you are on this journey right now?",
};

function getResponse(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes('plan') || lower.includes('6-month')) return DEMO_RESPONSES.plan;
  if (lower.includes('stuck')) return DEMO_RESPONSES.stuck;
  if (lower.includes('leadership') || lower.includes('leader')) return DEMO_RESPONSES.leadership;
  return DEMO_RESPONSES.default;
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
        content: getResponse(content),
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
              {STARTER_PROMPTS.map((p) => (
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
