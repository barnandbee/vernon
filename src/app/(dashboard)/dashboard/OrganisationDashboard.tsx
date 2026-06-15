'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Building2, ShieldCheck, Users, Activity, Lightbulb, CalendarDays, GraduationCap, Target, MessageCircle, Flame, ArrowUpRight, Download,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const ORG_STATS = [
  { label: 'Active members', value: '86', sub: 'of 120 invited', icon: Users, color: '#1d4ed8', bg: '#eff6ff' },
  { label: 'Weekly engagement', value: '71%', sub: '+4 pts vs last month', icon: Activity, color: '#15803d', bg: '#f0fdf4' },
  { label: 'Reflections this month', value: '312', sub: 'org-wide total', icon: Lightbulb, color: '#c2410c', bg: '#fff7ed' },
  { label: 'Coaching sessions', value: '54', sub: 'completed this month', icon: CalendarDays, color: '#7e22ce', bg: '#fdf4ff' },
];

const ENGAGEMENT_TREND = [
  { label: 'Wk 1', value: 58 },
  { label: 'Wk 2', value: 61 },
  { label: 'Wk 3', value: 65 },
  { label: 'Wk 4', value: 63 },
  { label: 'Wk 5', value: 68 },
  { label: 'Wk 6', value: 71 },
];

const JOURNEY_BANDS = [
  { label: 'Just getting started', range: '0–25%', count: 18, color: 'var(--text-muted)' },
  { label: 'Building momentum', range: '26–50%', count: 34, color: '#1d4ed8' },
  { label: 'Making strong progress', range: '51–75%', count: 24, color: '#c2410c' },
  { label: 'Nearing their goals', range: '76–100%', count: 10, color: '#15803d' },
];

type FeatureUsage = { label: string; icon: LucideIcon; value: number; color: string };

const FEATURE_USAGE: FeatureUsage[] = [
  { label: 'Career Reflections', icon: Lightbulb, value: 82, color: '#c2410c' },
  { label: 'Career Chat (Vernon AI)', icon: MessageCircle, value: 74, color: '#7c3aed' },
  { label: 'Learning & Tools', icon: GraduationCap, value: 64, color: '#1d4ed8' },
  { label: 'Coaching Calendar', icon: CalendarDays, value: 58, color: 'var(--primary)' },
  { label: 'Real-World Practice', icon: Target, value: 47, color: '#be185d' },
  { label: 'Community', icon: Users, value: 39, color: '#7e22ce' },
];

type MemberRow = {
  name: string;
  initials: string;
  color: string;
  progress: number;
  streak: number;
  sessions: number;
  lastActive: string;
};

const MEMBERS: MemberRow[] = [
  { name: 'Maya O.',  initials: 'MO', color: '#1d4ed8', progress: 68, streak: 12, sessions: 4, lastActive: 'Today' },
  { name: 'Priya S.', initials: 'PS', color: '#c2410c', progress: 81, streak: 7,  sessions: 5, lastActive: 'Yesterday' },
  { name: 'Jamie R.', initials: 'JR', color: '#be185d', progress: 42, streak: 7,  sessions: 3, lastActive: 'Today' },
  { name: 'Aiko T.',  initials: 'AT', color: '#0369a1', progress: 54, streak: 9,  sessions: 3, lastActive: 'Today' },
  { name: 'Tom B.',   initials: 'TB', color: '#15803d', progress: 35, streak: 4,  sessions: 2, lastActive: '2 days ago' },
  { name: 'Ben C.',   initials: 'BC', color: '#7e22ce', progress: 12, streak: 1,  sessions: 1, lastActive: '5 days ago' },
];

export default function OrganisationDashboard({ orgName }: { orgName: string }) {
  const maxTrend = Math.max(...ENGAGEMENT_TREND.map((t) => t.value));
  const totalInJourney = JOURNEY_BANDS.reduce((sum, b) => sum + b.count, 0);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const marginX = 14;
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 18;

    const ensureSpace = () => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 18;
      }
    };

    const section = (title: string) => {
      ensureSpace();
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(title, marginX, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
    };

    const line = (text: string) => {
      ensureSpace();
      doc.text(text, marginX, y);
      y += 6;
    };

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Vernon - Organisation Insights', marginX, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text(`${orgName} | Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, marginX, y);
    doc.setTextColor(0);
    y += 12;

    section('Key metrics');
    ORG_STATS.forEach((s) => line(`${s.label}: ${s.value} (${s.sub})`));
    y += 4;

    section('Weekly engagement');
    ENGAGEMENT_TREND.forEach((t) => line(`${t.label}: ${t.value}% of active members`));
    y += 4;

    section('Where members are in their journey');
    JOURNEY_BANDS.forEach((b) => line(`${b.label} (${b.range}): ${b.count} members`));
    y += 4;

    section('Where members spend their time');
    FEATURE_USAGE.forEach((f) => line(`${f.label}: ${f.value}%`));
    y += 4;

    section('Member activity');
    MEMBERS.forEach((m) => line(`${m.name} - ${m.progress}% of journey, ${m.streak}-day streak, ${m.sessions} sessions, last active ${m.lastActive}`));

    doc.save(`vernon-${orgName.toLowerCase().replace(/\s+/g, '-')}-insights-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 font-playwrite" style={{ color: 'var(--foreground)' }}>
            <Building2 size={22} style={{ color: 'var(--primary)' }} />
            Organisation Insights
          </h1>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            A top-level view of how {orgName}&apos;s members are engaging with Vernon and where they are on their journeys.
          </p>
        </div>
        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-white flex-shrink-0"
          style={{ background: 'var(--primary)' }}
        >
          <Download size={14} /> Download PDF report
        </button>
      </div>

      {/* Privacy / methodology note */}
      <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'var(--surface-muted)' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface)' }}>
          <ShieldCheck size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Aggregated and anonymised. </span>
          You can see participation, progress, and engagement trends across your members. Reflection content, Career
          Chat conversations, group prompt responses, and coaching notes are never visible to your organisation —
          only that the activity happened.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ORG_STATS.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-xs mt-1.5 font-medium" style={{ color }}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement trend */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center justify-between mb-1 gap-2">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Weekly engagement</h2>
            <span className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: '#15803d' }}>
              <ArrowUpRight size={12} /> Trending up
            </span>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Share of active members who used Vernon each week
          </p>
          <div className="flex items-end gap-3 h-32">
            {ENGAGEMENT_TREND.map((t) => (
              <div key={t.label} className="flex-1 h-full flex flex-col items-center justify-end gap-2">
                <div
                  className="w-full rounded-lg"
                  style={{ height: `${(t.value / maxTrend) * 100}%`, background: 'var(--primary)', minHeight: 4 }}
                />
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Journey progress bands */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Where members are in their journey</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Grouped by overall career journey progress
          </p>
          <div className="space-y-3">
            {JOURNEY_BANDS.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{b.label}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{b.count} members · {b.range}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(b.count / totalInJourney) * 100}%`, background: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature usage */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Where members spend their time</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          Share of active members who used each area in the last 30 days
        </p>
        <div className="space-y-3">
          {FEATURE_USAGE.map((f) => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--foreground)' }}>
                  <f.icon size={13} style={{ color: f.color }} /> {f.label}
                </span>
                <span className="text-xs font-semibold flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{f.value}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
                <div className="h-full rounded-full" style={{ width: `${f.value}%`, background: f.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member activity */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Member activity</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          A sample of recent activity — shown as first name and initial only
        </p>
        <div className="space-y-2">
          {MEMBERS.map((m) => (
            <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl flex-wrap sm:flex-nowrap" style={{ background: 'var(--surface-muted)' }}>
              <div
                className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                style={{ width: 32, height: 32, background: m.color, fontSize: 12 }}
              >
                {m.initials}
              </div>
              <div className="min-w-0 flex-1 order-1 sm:order-none basis-full sm:basis-auto">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{m.name}</p>
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{m.progress}% of journey</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                  <div className="h-full rounded-full" style={{ width: `${m.progress}%`, background: 'var(--primary)' }} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: '#c2410c' }}>
                <Flame size={12} /> {m.streak}
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs flex-shrink-0 w-24" style={{ color: 'var(--text-muted)' }}>
                <CalendarDays size={12} /> {m.sessions} sessions
              </div>
              <div className="text-xs flex-shrink-0 w-20 text-right" style={{ color: 'var(--text-muted)' }}>
                {m.lastActive}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4 pt-4 border-t leading-relaxed" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          Members can see exactly what&apos;s visible here — and what always stays private — on every section of their own dashboard.
        </p>
      </div>
    </div>
  );
}
