'use client';

import { useRouter } from 'next/navigation';
import { useAuth, DEMO_CREDENTIALS } from '@/lib/auth';
import VernonLogo from '@/components/VernonLogo';
import {
  BookOpen, CalendarDays, Lightbulb, MessageCircle, ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    color: '#3b82f6',
    bg: '#eff6ff',
    title: 'Articles & Insights',
    desc: 'Curated reading on career growth, leadership, and navigating change — picked for where you are right now.',
  },
  {
    icon: CalendarDays,
    color: '#10b981',
    bg: '#ecfdf5',
    title: 'Coaching Calendar',
    desc: 'Book and manage one-to-one sessions with a real human coach, all in one place.',
  },
  {
    icon: Lightbulb,
    color: '#f59e0b',
    bg: '#fffbeb',
    title: 'Career Reflections',
    desc: 'Guided prompts help you process coaching outcomes and connect them to your own thinking.',
  },
  {
    icon: MessageCircle,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    title: 'Vernon AI',
    desc: 'A personified AI thinking partner, ready whenever you are to help shape your career plan.',
  },
];

const VERNON_POINTS = [
  'Connects coaching session outcomes to your own reflections',
  'Helps you build a clear, personalised career exploration plan',
  'Available any time you need to think something through',
];

export default function LandingPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  const handleDemo = async () => {
    const ok = await login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    if (ok) router.push('/dashboard');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <VernonLogo size={34} />
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--primary)' }}>Vernon</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'var(--primary)' }}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/login')}
                className="text-sm font-medium"
                style={{ color: 'var(--foreground)' }}
              >
                Sign in
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'var(--primary)' }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 sm:px-10 pt-10 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: 'var(--surface)', color: 'var(--primary)' }}
        >
          <Sparkles size={12} />
          Personalised career coaching, reimagined
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5" style={{ color: 'var(--foreground)' }}>
          Your career journey,<br className="hidden sm:block" /> guided by{' '}
          <span style={{ color: 'var(--primary)' }}>Vernon</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-muted)' }}>
          Explore curated articles, book time with a real coach, reflect on what matters,
          and chat with Vernon — your AI thinking partner — to shape what comes next.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.push('/login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: 'var(--primary)' }}
          >
            Sign in <ArrowRight size={16} />
          </button>
          <button
            onClick={handleDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold border flex items-center justify-center gap-2"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--surface)' }}
          >
            <Sparkles size={16} style={{ color: 'var(--accent)' }} />
            Explore the demo
          </button>
        </div>
      </section>

      {/* Feature overview */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 pb-16">
        <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide text-center" style={{ color: 'var(--text-muted)' }}>
          What&apos;s inside
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <p className="font-semibold text-sm mb-1.5" style={{ color: 'var(--foreground)' }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Vernon */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 pb-16">
        <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" style={{ background: 'var(--primary)' }}>
          <div className="order-2 lg:order-1">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4">Meet Vernon</h2>
            <p className="text-white/75 leading-relaxed mb-5 text-sm sm:text-base">
              Vernon is the supportive presence behind your reflective practice — part thinking
              partner, part accountability check-in, always in your corner between coaching sessions.
            </p>
            <ul className="space-y-2.5">
              {VERNON_POINTS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-white/90 text-sm">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <VernonLogo size={88} light />
            </div>
          </div>
        </div>
      </section>

      {/* Demo callout */}
      <section className="max-w-3xl mx-auto px-6 sm:px-10 pb-20">
        <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: 'var(--surface)' }}>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Want to look around first?</h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            Use the demo account to explore the platform with sample data — no sign-up required.
          </p>
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-6 text-sm px-4 py-3 rounded-xl"
            style={{ background: 'var(--surface-muted)', color: 'var(--text-muted)' }}
          >
            <span>
              Email:{' '}
              <code className="font-mono font-semibold px-1.5 py-0.5 rounded" style={{ background: 'var(--surface)', color: 'var(--foreground)' }}>
                {DEMO_CREDENTIALS.email}
              </code>
            </span>
            <span className="hidden sm:inline">·</span>
            <span>
              Password:{' '}
              <code className="font-mono font-semibold px-1.5 py-0.5 rounded" style={{ background: 'var(--surface)', color: 'var(--foreground)' }}>
                {DEMO_CREDENTIALS.password}
              </code>
            </span>
          </div>
          <div>
            <button
              onClick={handleDemo}
              className="px-6 py-3 rounded-xl font-semibold text-white inline-flex items-center gap-2"
              style={{ background: 'var(--accent)' }}
            >
              <Sparkles size={16} />
              Continue with demo account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            <VernonLogo size={20} />
            <span>Vernon</span>
          </div>
          <p>© 2026 Vernon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
