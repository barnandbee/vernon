'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import OrgPrivacyNote from '@/components/OrgPrivacyNote';
import OrganisationDashboard from './OrganisationDashboard';
import CoachDashboard from './CoachDashboard';
import AdminDashboard from './AdminDashboard';
import { getJourneyContent } from './journeyData';
import {
  BookOpen, CalendarDays, Lightbulb, MessageCircle,
  TrendingUp, Star, Clock, ArrowRight, Sparkles, GraduationCap, Target, Heart, Bell
} from 'lucide-react';

const QUICK_ACTIONS = [
  {
    href: '/dashboard/articles',
    icon: BookOpen,
    color: '#3b82f6',
    bg: '#eff6ff',
    title: 'Explore Resources',
    desc: 'Articles, videos & podcasts',
  },
  {
    href: '/dashboard/calendar',
    icon: CalendarDays,
    color: '#10b981',
    bg: '#ecfdf5',
    title: 'Coaching Calendar',
    desc: 'Book your next session',
  },
  {
    href: '/dashboard/learning',
    icon: GraduationCap,
    color: '#c2410c',
    bg: '#fff7ed',
    title: 'Learning & Tools',
    desc: 'Courses, workshops & toolkits',
  },
  {
    href: '/dashboard/practice',
    icon: Target,
    color: '#be185d',
    bg: '#fdf2f8',
    title: 'Real-World Practice',
    desc: 'Try it, then reflect on it',
  },
  {
    href: '/dashboard/reflections',
    icon: Lightbulb,
    color: '#f59e0b',
    bg: '#fffbeb',
    title: 'Career Reflections',
    desc: 'Explore your insights',
  },
  {
    href: '/dashboard/chat',
    icon: MessageCircle,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    title: 'Career Chat',
    desc: 'Talk with Vernon AI',
  },
];

type UpcomingSession = { day: string; date: string; title: string; coach: string; time: string; type: string };
type RecentArticle = { title: string; tag: string; mins: number };
type HomeContent = { upcoming: UpcomingSession[]; articles: RecentArticle[]; progress: number; streak: number; reflections: number };

const HOME_CONTENT_BY_USER: Record<string, HomeContent> = {
  'demo-user': {
    upcoming: [
      { day: 'Mon', date: '12', title: 'Strategy Session', coach: 'Sarah Mitchell', time: '10:00 AM', type: 'Coaching' },
      { day: 'Wed', date: '14', title: 'Career Goals Review', coach: 'James Park', time: '2:00 PM', type: 'Review' },
    ],
    articles: [
      { title: 'Navigating Career Transitions in Your 30s', tag: 'Growth', mins: 5 },
      { title: 'Building a Personal Brand That Opens Doors', tag: 'Branding', mins: 7 },
      { title: 'How to Ask for the Promotion You Deserve', tag: 'Advancement', mins: 4 },
    ],
    progress: 42,
    streak: 7,
    reflections: 3,
  },
  'zara-ahmed': {
    upcoming: [
      { day: 'Sat', date: '13', title: 'Check-in: Options & Next Steps', coach: 'Sarah Mitchell', time: '4:00 PM', type: 'Coaching' },
      { day: 'Mon', date: '15', title: 'Subject Choices Review', coach: 'James Park', time: '1:00 PM', type: 'Review' },
    ],
    articles: [
      { title: 'Choosing Subjects Without Boxing Yourself In', tag: 'Choices', mins: 5 },
      { title: 'What Work Experience Actually Teaches You', tag: 'Experience', mins: 6 },
      { title: 'Five Body Language Tips for Interviews', tag: 'Confidence', mins: 8 },
    ],
    progress: 35,
    streak: 4,
    reflections: 2,
  },
  'marcus-reid': {
    upcoming: [
      { day: 'Thu', date: '11', title: 'Career Strategy Session', coach: 'Sarah Mitchell', time: '2:00 PM', type: 'Coaching' },
      { day: 'Sat', date: '13', title: 'Application Strategy Review', coach: 'James Park', time: '11:00 AM', type: 'Review' },
    ],
    articles: [
      { title: 'Turning Your Placement Year Into Interview Gold', tag: 'Placements', mins: 5 },
      { title: "Graduate Scheme or Master's? How to Decide", tag: 'Decisions', mins: 6 },
      { title: 'The STAR Method for Interview Storytelling', tag: 'Interviews', mins: 20 },
    ],
    progress: 48,
    streak: 9,
    reflections: 5,
  },
};

function getHomeContent(userId?: string | null): HomeContent {
  return HOME_CONTENT_BY_USER[userId ?? ''] ?? HOME_CONTENT_BY_USER['demo-user'];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (user?.accountType === 'org_staff') {
    return <OrganisationDashboard orgName={user.orgName ?? 'your organisation'} />;
  }

  if (user?.accountType === 'coach') {
    return <CoachDashboard />;
  }

  if (user?.accountType === 'platform_admin') {
    return <AdminDashboard />;
  }

  const { actionItems, sessionNotes, quickWins } = getJourneyContent(user?.id);
  const { upcoming, articles, progress, streak, reflections } = getHomeContent(user?.id);
  const openCoachItems = actionItems.filter((a) => a.source === 'coach' && a.status !== 'done').length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Welcome header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Here&apos;s where you are on your journey today
          </p>
        </div>
        <div
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: '#f0fdf4', color: '#15803d' }}
        >
          <Star size={14} className="fill-current" />
          <span>{streak}-day streak</span>
        </div>
      </div>

      {/* Coach update notification */}
      <div className="rounded-2xl p-5 flex items-center gap-4 flex-wrap" style={{ background: '#e8f4f8' }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface)' }}>
          <Bell size={20} style={{ color: 'var(--primary)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Sarah has updated your journey</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {openCoachItems} action item{openCoachItems === 1 ? '' : 's'} from your coach, {sessionNotes.length} session notes, and {quickWins.length} quick wins are waiting for you.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/journey')}
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
          style={{ background: 'var(--primary)' }}
        >
          View My Journey <ArrowRight size={12} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Career Journey Progress</span>
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'var(--primary)' }}
          />
        </div>
        <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} style={{ color: 'var(--accent)' }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              You&apos;re making great progress — {reflections} reflection{reflections === 1 ? '' : 's'} completed this month
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/journey')}
            className="flex items-center gap-1 text-xs font-semibold flex-shrink-0"
            style={{ color: 'var(--primary)' }}
          >
            View your journey <ArrowRight size={12} />
          </button>
        </div>
      </div>

      <OrgPrivacyNote shared="your overall progress percentage and engagement streak" />

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ href, icon: Icon, color, bg, title, desc }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="text-left p-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'var(--surface)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: bg }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>{title}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming sessions */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Upcoming Sessions</h2>
            <button
              onClick={() => router.push('/dashboard/calendar')}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--primary)' }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {upcoming.map((s) => (
              <div
                key={s.date}
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: 'var(--surface-muted)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--primary)', color: '#fff' }}
                >
                  <span className="text-xs font-medium opacity-80">{s.day}</span>
                  <span className="text-lg font-bold leading-none">{s.date}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{s.title}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>with {s.coach}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.time}</span>
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-lg font-medium"
                  style={{ background: '#e8f4f8', color: 'var(--primary)' }}
                >
                  {s.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent articles */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Recommended Reading</h2>
            <button
              onClick={() => router.push('/dashboard/articles')}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--primary)' }}
            >
              See more <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {articles.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl cursor-pointer"
                style={{ background: 'var(--surface-muted)' }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#eff6ff' }}
                >
                  <BookOpen size={16} style={{ color: '#3b82f6' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" style={{ color: 'var(--foreground)' }}>{a.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{a.tag}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.mins} min read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community teaser */}
      <div className="rounded-2xl p-5 flex items-center gap-4 flex-wrap" style={{ background: 'var(--surface)' }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fdf2f8' }}>
          <Heart size={20} style={{ color: '#be185d' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Maya just hit a 12-day streak</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Send some encouragement, or share your own progress with your circle.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/community')}
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: '#fdf2f8', color: '#be185d' }}
        >
          Open Community <ArrowRight size={12} />
        </button>
      </div>

      {/* Vernon AI banner */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between gap-4"
        style={{ background: 'var(--primary)' }}
      >
        <div>
          <h3 className="text-white font-bold text-lg mb-1">Ready to explore your next move?</h3>
          <p className="text-white/70 text-sm">
            Vernon&apos;s AI career coach is ready to help you plan, reflect, and grow.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/chat')}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          <MessageCircle size={16} />
          Chat with Vernon
        </button>
      </div>
    </div>
  );
}
