'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileBarChart, ShieldCheck, Sparkles, Download, RefreshCw, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { REPORT_FIELDS, fieldsByGroup, type ReportField } from '../orgData';
import { getOrgFieldInsights } from '../orgInsights';
import ReportFieldCard from '@/components/ReportFieldCard';

const GROUPS = fieldsByGroup();
const ALL_IDS = REPORT_FIELDS.map((f) => f.id);

export default function ReportsPage() {
  const { user } = useAuth();
  const orgName = user?.orgName ?? 'your organisation';

  const [selectedIds, setSelectedIds] = useState<string[]>(ALL_IDS);
  const [ranIds, setRanIds] = useState<string[]>(ALL_IDS);

  const toggleField = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleGroup = (fields: ReportField[]) => {
    const ids = fields.map((f) => f.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) => (allSelected ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]));
  };

  const ranFields = REPORT_FIELDS.filter((f) => ranIds.includes(f.id));
  const insights = getOrgFieldInsights(ranIds);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const marginX = 14;
    const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;
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

    const wrappedLine = (text: string) => {
      (doc.splitTextToSize(text, maxWidth) as string[]).forEach((l) => line(l));
    };

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Vernon - Organisation Report', marginX, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text(`${orgName} | Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, marginX, y);
    doc.setTextColor(0);
    y += 12;

    if (insights.length > 0) {
      section('Vernon AI insights');
      insights.forEach((text) => wrappedLine(`- ${text}`));
      y += 4;
    }

    ranFields.forEach((field) => {
      section(field.title);
      if (field.kind === 'stats') {
        field.items.forEach((s) => line(`${s.label}: ${s.value} (${s.sub})`));
      } else if (field.kind === 'trend') {
        field.items.forEach((t) => line(`${t.label}: ${t.value}%`));
      } else if (field.kind === 'bars') {
        field.items.forEach((b) => line(`${b.label}: ${b.value}${field.unit ?? '%'}`));
      } else if (field.kind === 'bands') {
        field.items.forEach((b) => line(`${b.label}${b.range ? ` (${b.range})` : ''}: ${b.count} members`));
      } else if (field.kind === 'table') {
        field.members.forEach((m) => line(`${m.name} - ${m.progress}% of journey, ${m.streak}-day streak, ${m.sessions} sessions, last active ${m.lastActive}`));
      }
      y += 4;
    });

    doc.save(`vernon-${orgName.toLowerCase().replace(/\s+/g, '-')}-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5 font-playwrite" style={{ color: 'var(--foreground)' }}>
          <FileBarChart size={22} style={{ color: 'var(--primary)' }} />
          Reports
        </h1>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Choose the aggregate data fields you want to see, run the report, and export it as a PDF.
        </p>
      </div>

      {/* Privacy / methodology note */}
      <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'var(--surface-muted)' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface)' }}>
          <ShieldCheck size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Aggregated and anonymised. </span>
          Every field below is a participation or progress metric, never the content someone wrote or said.
          Reflection content, Career Chat conversations, group prompt responses, and coaching notes stay private.
        </p>
      </div>

      {/* Field picker */}
      <div className="rounded-2xl p-5 space-y-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Choose data fields</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Select the fields to include, then run the report.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds(ALL_IDS)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg"
              style={{ color: 'var(--primary)', background: 'var(--surface-muted)' }}
            >
              Select all
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg"
              style={{ color: 'var(--text-muted)', background: 'var(--surface-muted)' }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {GROUPS.map(({ group, fields }) => (
            <div key={group}>
              <button
                onClick={() => toggleGroup(fields)}
                className="text-xs font-semibold mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                {group}
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {fields.map((f) => {
                  const checked = selectedIds.includes(f.id);
                  return (
                    <label
                      key={f.id}
                      className="flex items-start gap-2 px-2.5 py-2 rounded-lg cursor-pointer"
                      style={{ background: 'var(--surface-muted)' }}
                    >
                      <input type="checkbox" className="hidden" checked={checked} onChange={() => toggleField(f.id)} />
                      {checked
                        ? <CheckSquare size={16} style={{ color: 'var(--primary)' }} className="flex-shrink-0 mt-0.5" />
                        : <Square size={16} style={{ color: 'var(--text-muted)' }} className="flex-shrink-0 mt-0.5" />}
                      <span className="text-xs" style={{ color: 'var(--foreground)' }}>{f.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {selectedIds.length} of {ALL_IDS.length} fields selected
          </p>
          <button
            onClick={() => setRanIds(selectedIds)}
            disabled={selectedIds.length === 0}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50"
            style={{ background: 'var(--primary)' }}
          >
            <RefreshCw size={14} /> Run report
          </button>
        </div>
      </div>

      {ranFields.length === 0 ? (
        <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--surface)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No fields selected. Choose at least one field above and run the report.
          </p>
        </div>
      ) : (
        <>
          {/* AI insights */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
            <h2 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Sparkles size={15} style={{ color: 'var(--primary)' }} /> Vernon AI insights
            </h2>
            <ul className="space-y-2.5">
              {insights.map((text) => (
                <li key={text} className="text-xs leading-relaxed flex gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex-shrink-0" style={{ color: 'var(--primary)' }}>•</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
              Report — {ranFields.length} field{ranFields.length === 1 ? '' : 's'}
            </h2>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-white flex-shrink-0"
              style={{ background: 'var(--primary)' }}
            >
              <Download size={14} /> Download PDF
            </button>
          </div>

          <div className="space-y-6">
            {ranFields.map((f) => (
              <ReportFieldCard key={f.id} field={f} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
