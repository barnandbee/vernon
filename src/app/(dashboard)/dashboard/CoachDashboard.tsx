'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { CLIENTS, APPOINTMENTS } from './coachData';
import {
  Users, CalendarDays, Sparkles, ArrowRight, Clock, Video, MapPin, AlertCircle, TrendingUp, ClipboardCheck, GraduationCap,
} from 'lucide-react';

export default function CoachDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const upcoming = [...APPOINTMENTS]
    .filter((a) => a.status !== 'completed')
    .sort((a, b) => a.day - b.day);

  const totalActionItems = CLIENTS.reduce((sum, c) => sum + c.actionPlan.length, 0);
  const doneActionItems = CLIENTS.reduce((sum, c) => sum + c.actionPlan.filter((i) => i.done).length, 0);
  const avgProgress = Math.round(CLIENTS.reduce((sum, c) => sum + c.progress, 0) / CLIENTS.length);

  const needsAttention = CLIENTS.filter((c) => c.nextSession === 'Not yet booked' || c.tags.some((t) => /nudge/i.test(t)));

  const STATS = [
    { label: 'Active clients', value: String(CLIENTS.length), icon: Users, color: '#1d4ed8', bg: '#eff6ff' },
    { label: 'Sessions this month', value: String(APPOINTMENTS.length), icon: CalendarDays, color: '#15803d', bg: '#f0fdf4' },
    { label: 'Action items completed', value: `${doneActionItems}/${totalActionItems}`, icon: ClipboardCheck, color: '#c2410c', bg: '#fff7ed' },
    { label: 'Avg. client progress', value: `${avgProgress}%`, icon: TrendingUp, color: '#7e22ce', bg: '#fdf4ff' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Here&apos;s what&apos;s ahead with your clients.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Upcoming Appointments</h2>
            <button
              onClick={() => router.push('/dashboard/schedule')}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--primary)' }}
            >
              View schedule <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {upcoming.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'var(--surface-muted)' }}>
                <div
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--primary)', color: '#fff' }}
                >
                  <span className="text-xs font-medium opacity-80">Jun</span>
                  <span className="text-lg font-bold leading-none">{a.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{a.title}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>with {a.clientName}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><Clock size={11} />{a.time}</span>
                    {a.type === 'online'
                      ? <span className="flex items-center gap-1"><Video size={11} />Online</span>
                      : <span className="flex items-center gap-1"><MapPin size={11} />In-person</span>
                    }
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0"
                  style={a.status === 'confirmed' ? { background: '#f0fdf4', color: '#15803d' } : { background: '#fffbeb', color: '#a16207' }}
                >
                  {a.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clients needing attention */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Clients Needing Attention</h2>
            <button
              onClick={() => router.push('/dashboard/clients')}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--primary)' }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          {needsAttention.length > 0 ? (
            <div className="space-y-3">
              {needsAttention.map((c) => (
                <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-muted)' }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: c.color }}
                  >
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{c.note}</p>
                  </div>
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#c2410c' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl p-4 text-center" style={{ background: 'var(--surface-muted)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>All clients are on track 🎉</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/dashboard/clients')}
            className="text-left rounded-2xl p-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--surface)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#eff6ff' }}>
              <Users size={20} style={{ color: '#1d4ed8' }} />
            </div>
            <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>My Clients</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Review progress and update action plans</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/schedule')}
            className="text-left rounded-2xl p-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--surface)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#f0fdf4' }}>
              <CalendarDays size={20} style={{ color: '#15803d' }} />
            </div>
            <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>Schedule</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>See every upcoming session this month</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/resources')}
            className="text-left rounded-2xl p-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--surface)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#f5f3ff' }}>
              <Sparkles size={20} style={{ color: '#8b5cf6' }} />
            </div>
            <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>Resource Finder</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Let AI suggest resources for a client</p>
          </button>
          <button
            onClick={() => router.push('/dashboard/development')}
            className="text-left rounded-2xl p-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--surface)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#fff7ed' }}>
              <GraduationCap size={20} style={{ color: '#c2410c' }} />
            </div>
            <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>CPD & Training</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Programme resources and your CPD log</p>
          </button>
        </div>
      </div>
    </div>
  );
}
