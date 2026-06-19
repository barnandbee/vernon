'use client';

import { useRouter } from 'next/navigation';
import { Building2, ShieldCheck, FileBarChart, Sparkles } from 'lucide-react';
import { KEY_METRICS, getReportField } from './orgData';
import { getOrgHighlightInsights } from './orgInsights';
import ReportFieldCard from '@/components/ReportFieldCard';

export default function OrganisationDashboard({ orgName }: { orgName: string }) {
  const router = useRouter();
  const highlights = getOrgHighlightInsights();

  const trendField = getReportField('engagement-trend')!;
  const journeyField = getReportField('journey-bands')!;
  const featureField = getReportField('feature-usage')!;
  const viValuesField = getReportField('vi-values')!;
  const coachingField = getReportField('coaching-frequency')!;
  const memberField = getReportField('member-activity')!;

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
          onClick={() => router.push('/dashboard/reports')}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-white flex-shrink-0"
          style={{ background: 'var(--primary)' }}
        >
          <FileBarChart size={14} /> Reports
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {KEY_METRICS.map(({ label, value, sub, icon: Icon, color, bg }) => (
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

      {/* Vernon AI insights */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
          <Sparkles size={15} style={{ color: 'var(--primary)' }} /> Vernon AI insights
        </h2>
        <ul className="space-y-2.5">
          {highlights.map((text) => (
            <li key={text} className="text-xs leading-relaxed flex gap-2" style={{ color: 'var(--text-muted)' }}>
              <span className="flex-shrink-0" style={{ color: 'var(--primary)' }}>•</span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportFieldCard field={trendField} />
        <ReportFieldCard field={journeyField} />
      </div>

      <ReportFieldCard field={featureField} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportFieldCard field={viValuesField} />
        <ReportFieldCard field={coachingField} />
      </div>

      <div>
        <ReportFieldCard field={memberField} />
        <p className="text-xs mt-3 px-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Members can see exactly what&apos;s visible here — and what always stays private — on every section of their own dashboard.
        </p>
      </div>
    </div>
  );
}
