'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import {
  VALUE_OPTIONS, SECTOR_OPTIONS, READINESS_OPTIONS, EXPERIENCE_OPTIONS, FOCUS_OPTIONS,
  getDiagnosticInsights, type DiagnosticAnswers, type ValueKey, type SectorKey,
  type ReadinessLevel, type ExperienceLevel, type CoachingFocus,
} from '@/lib/diagnostic';

const TOTAL_STEPS = 5;

type DiagnosticModalProps = {
  onComplete: (answers: DiagnosticAnswers) => void;
  onDismiss?: () => void;
  initialAnswers?: DiagnosticAnswers | null;
};

export default function DiagnosticModal({ onComplete, onDismiss, initialAnswers }: DiagnosticModalProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ValueKey[]>(initialAnswers?.values ?? []);
  const [sectors, setSectors] = useState<SectorKey[]>(initialAnswers?.sectors ?? []);
  const [readiness, setReadiness] = useState<ReadinessLevel | null>(initialAnswers?.readiness ?? null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(initialAnswers?.experience ?? null);
  const [focus, setFocus] = useState<CoachingFocus | null>(initialAnswers?.focus ?? null);

  const toggleValue = (key: ValueKey) => {
    if (values.includes(key)) { setValues(values.filter((v) => v !== key)); return; }
    if (values.length >= 3) return;
    setValues([...values, key]);
  };

  const toggleSector = (key: SectorKey) => {
    if (sectors.includes(key)) { setSectors(sectors.filter((s) => s !== key)); return; }
    if (sectors.length >= 3) return;
    setSectors([...sectors, key]);
  };

  const canAdvance =
    step === 0 ? values.length === 3 :
    step === 1 ? sectors.length >= 1 :
    step === 2 ? readiness !== null :
    step === 3 ? experience !== null :
    focus !== null;

  const isSummary = step === TOTAL_STEPS;

  const finalAnswers: DiagnosticAnswers | null =
    values.length === 3 && sectors.length >= 1 && readiness && experience && focus
      ? { values, sectors, readiness, experience, focus }
      : null;

  const insights = finalAnswers ? getDiagnosticInsights(finalAnswers) : null;

  const handleNext = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const handleBack = () => setStep((s) => Math.max(0, s - 1));
  const handleFinish = () => { if (finalAnswers) onComplete(finalAnswers); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onDismiss} />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6"
        style={{ background: 'var(--surface)' }}
      >
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-1 rounded-lg"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        {!isSummary ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} style={{ color: '#7c3aed' }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7c3aed' }}>
                Vernon Insights diagnostic
              </span>
            </div>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Question {step + 1} of {TOTAL_STEPS}</p>
            <div className="h-1.5 rounded-full overflow-hidden mb-6" style={{ background: 'var(--surface-muted)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%`, background: 'var(--primary)' }}
              />
            </div>

            {step === 0 && (
              <div>
                <h2 className="text-lg font-bold mb-1.5" style={{ color: 'var(--foreground)' }}>
                  What matters most to you at work?
                </h2>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Pick your top 3, in order of importance.</p>
                <div className="flex flex-wrap gap-2">
                  {VALUE_OPTIONS.map((opt) => {
                    const rank = values.indexOf(opt.key);
                    const selected = rank !== -1;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => toggleValue(opt.key)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
                        style={selected
                          ? { background: 'var(--primary)', color: '#fff' }
                          : { background: 'var(--surface-muted)', color: 'var(--foreground)' }
                        }
                      >
                        {selected && (
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{ background: 'rgba(255,255,255,0.25)' }}
                          >
                            {rank + 1}
                          </span>
                        )}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold mb-1.5" style={{ color: 'var(--foreground)' }}>Which sectors interest you?</h2>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Choose up to 3.</p>
                <div className="flex flex-wrap gap-2">
                  {SECTOR_OPTIONS.map((opt) => {
                    const selected = sectors.includes(opt.key);
                    return (
                      <button
                        key={opt.key}
                        onClick={() => toggleSector(opt.key)}
                        className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
                        style={selected
                          ? { background: 'var(--primary)', color: '#fff' }
                          : { background: 'var(--surface-muted)', color: 'var(--foreground)' }
                        }
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                  How ready do you feel to make a move?
                </h2>
                <div className="space-y-2">
                  {READINESS_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setReadiness(opt.key)}
                      className="w-full text-left p-3.5 rounded-xl transition-all"
                      style={readiness === opt.key
                        ? { background: 'var(--primary)', color: '#fff' }
                        : { background: 'var(--surface-muted)', color: 'var(--foreground)' }
                      }
                    >
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: readiness === opt.key ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }}>
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--foreground)' }}>What&rsquo;s your experience so far?</h2>
                <div className="space-y-2">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setExperience(opt.key)}
                      className="w-full text-left p-3.5 rounded-xl transition-all"
                      style={experience === opt.key
                        ? { background: 'var(--primary)', color: '#fff' }
                        : { background: 'var(--surface-muted)', color: 'var(--foreground)' }
                      }
                    >
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: experience === opt.key ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }}>
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-lg font-bold mb-1.5" style={{ color: 'var(--foreground)' }}>
                  How would you like to navigate coaching?
                </h2>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Pick what feels closest to where you are right now.</p>
                <div className="space-y-2">
                  {FOCUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setFocus(opt.key)}
                      className="w-full text-left p-3.5 rounded-xl transition-all"
                      style={focus === opt.key
                        ? { background: 'var(--primary)', color: '#fff' }
                        : { background: 'var(--surface-muted)', color: 'var(--foreground)' }
                      }
                    >
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: focus === opt.key ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }}>
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg disabled:opacity-0"
                style={{ color: 'var(--text-muted)' }}
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canAdvance}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white disabled:opacity-40"
                style={{ background: 'var(--primary)' }}
              >
                {step === TOTAL_STEPS - 1 ? 'See my Vernon Insights' : 'Next'} <ArrowRight size={14} />
              </button>
            </div>
          </>
        ) : insights && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} style={{ color: '#7c3aed' }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7c3aed' }}>Your Vernon Insights</span>
            </div>
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--foreground)' }}>Thanks — here&rsquo;s your snapshot</h2>
            <div className="rounded-xl p-4 mb-4" style={{ background: '#f5f3ff' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#5b21b6' }}>{insights.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Top values</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{insights.topValues.join(', ')}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Sector interest</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{insights.sectorLabels.join(', ')}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Readiness</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{insights.readinessLabel}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Coaching focus</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{insights.focusLabel}</p>
              </div>
            </div>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
              This shapes the resources Vernon recommends for you, and gives your coach a top-level view of where you&rsquo;re starting from.
              You can revisit it anytime from your Profile.
            </p>
            <button
              onClick={handleFinish}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl text-white"
              style={{ background: 'var(--primary)' }}
            >
              <CheckCircle2 size={16} /> Continue to my dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
