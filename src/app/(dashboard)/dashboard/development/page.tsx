'use client';

import type { LucideIcon } from 'lucide-react';
import { Award, FileText, GraduationCap, Video, Clock, CheckCircle2, CircleDot, Circle } from 'lucide-react';
import { CPD_ITEMS, CPD_HOURS_LOGGED, CPD_HOURS_TARGET, type CpdItem, type CpdItemType, type CpdStatus } from '../coachData';

const TYPE_ICON: Record<CpdItemType, LucideIcon> = {
  Document: FileText,
  Course: GraduationCap,
  Webinar: Video,
};

const STATUS_STYLE: Record<CpdStatus, { bg: string; color: string; label: string; icon: LucideIcon }> = {
  completed:   { bg: '#f0fdf4', color: '#15803d', label: 'Completed',  icon: CheckCircle2 },
  in_progress: { bg: '#fffbeb', color: '#a16207', label: 'In progress', icon: CircleDot },
  not_started: { bg: 'var(--surface-muted)', color: 'var(--text-muted)', label: 'Not started', icon: Circle },
};

function CpdCard({ item }: { item: CpdItem }) {
  const TypeIcon = TYPE_ICON[item.type];
  const status = STATUS_STYLE[item.status];
  const StatusIcon = status.icon;
  return (
    <div className="rounded-2xl p-4 flex flex-col" style={{ background: 'var(--surface)' }}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#eff6ff' }}>
          <TypeIcon size={18} style={{ color: '#1d4ed8' }} />
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1 flex-shrink-0"
          style={{ background: status.bg, color: status.color }}
        >
          <StatusIcon size={11} />
          {status.label}
        </span>
      </div>
      <p className="text-sm font-semibold leading-snug mb-1" style={{ color: 'var(--foreground)' }}>{item.title}</p>
      <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
      <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
        <span className="px-2 py-0.5 rounded-md font-medium" style={{ background: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
          {item.programme}
        </span>
        <span className="flex items-center gap-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
          <Clock size={11} />
          {item.duration}
        </span>
      </div>
    </div>
  );
}

export default function DevelopmentPage() {
  const pct = Math.round((CPD_HOURS_LOGGED / CPD_HOURS_TARGET) * 100);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>CPD & Training</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Documents, courses, and certifications for the programmes you deliver
        </p>
      </div>

      {/* CPD progress */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award size={18} style={{ color: 'var(--primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>CPD Hours This Year</span>
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{CPD_HOURS_LOGGED}/{CPD_HOURS_TARGET} hrs</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--primary)' }} />
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          Logged through completed courses, webinars, and reflective practice below.
        </p>
      </div>

      {/* CPD items */}
      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Training & Documents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CPD_ITEMS.map((item) => (
            <CpdCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
