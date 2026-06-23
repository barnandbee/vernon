'use client';

import { ArrowUpRight, Flame, CalendarDays } from 'lucide-react';
import type { ReportField, BarItem, BandItem, StatItem, MemberRow } from '@/lib/orgData';

function StatsView({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map(({ label, value, sub, icon: Icon, color, bg }) => (
        <div key={label} className="rounded-xl p-4" style={{ background: 'var(--surface-muted)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
            <Icon size={16} style={{ color }} />
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="text-xs mt-1.5 font-medium" style={{ color }}>{sub}</p>
        </div>
      ))}
    </div>
  );
}

function TrendView({ items }: { items: BarItem[] }) {
  const max = Math.max(...items.map((t) => t.value));
  const trendingUp = items.length > 1 && items[items.length - 1].value > items[0].value;
  return (
    <div>
      {trendingUp && (
        <div className="flex justify-end mb-2">
          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#15803d' }}>
            <ArrowUpRight size={12} /> Trending up
          </span>
        </div>
      )}
      <div className="flex items-end gap-3 h-32">
        {items.map((t) => (
          <div key={t.label} className="flex-1 h-full flex flex-col items-center justify-end gap-2">
            <div
              className="w-full rounded-lg"
              style={{ height: `${(t.value / max) * 100}%`, background: t.color, minHeight: 4 }}
            />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarsView({ items, unit, max }: { items: BarItem[]; unit?: string; max?: number }) {
  const scale = max ?? 100;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1 gap-2">
            <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--foreground)' }}>
              {item.icon && <item.icon size={13} style={{ color: item.color }} />} {item.label}
            </span>
            <span className="text-xs font-semibold flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
              {item.value}{unit ?? '%'}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
            <div className="h-full rounded-full" style={{ width: `${(item.value / scale) * 100}%`, background: item.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BandsView({ items }: { items: BandItem[] }) {
  const total = items.reduce((sum, b) => sum + b.count, 0);
  return (
    <div className="space-y-3">
      {items.map((b) => (
        <div key={b.label}>
          <div className="flex items-center justify-between mb-1 gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{b.label}</span>
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
              {b.count} members{b.range ? ` · ${b.range}` : ''}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
            <div className="h-full rounded-full" style={{ width: `${total ? (b.count / total) * 100 : 0}%`, background: b.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TableView({ members }: { members: MemberRow[] }) {
  return (
    <div className="space-y-2">
      {members.map((m) => (
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
  );
}

export default function ReportFieldCard({ field }: { field: ReportField }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
      <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>{field.title}</h2>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{field.description}</p>
      {field.kind === 'stats' && <StatsView items={field.items} />}
      {field.kind === 'trend' && <TrendView items={field.items} />}
      {field.kind === 'bars' && <BarsView items={field.items} unit={field.unit} max={field.max} />}
      {field.kind === 'bands' && <BandsView items={field.items} />}
      {field.kind === 'table' && <TableView members={field.members} />}
    </div>
  );
}
