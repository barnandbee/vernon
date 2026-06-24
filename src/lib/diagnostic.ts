import { namespacedKey } from './currentUser';

export type ValueKey = 'autonomy' | 'impact' | 'stability' | 'growth' | 'recognition' | 'collaboration' | 'creativity' | 'reward';
export type SectorKey = 'technology' | 'healthcare' | 'finance' | 'education' | 'nonprofit' | 'creative' | 'sustainability' | 'retail';
export type ReadinessLevel = 'exploring' | 'planning' | 'ready' | 'unsure';
export type ExperienceLevel = 'student' | 'early' | 'mid' | 'senior' | 'executive';
export type CoachingFocus = 'advancing' | 'career-change' | 'leadership' | 'negotiation' | 'personal-development' | 'returning';

export type DiagnosticAnswers = {
  values: ValueKey[];
  sectors: SectorKey[];
  readiness: ReadinessLevel;
  experience: ExperienceLevel;
  focus: CoachingFocus;
};

export type DiagnosticInsights = {
  topValues: string[];
  sectorLabels: string[];
  readinessLabel: string;
  experienceLabel: string;
  focusLabel: string;
  focus: CoachingFocus;
  summary: string;
};

type Option<K extends string> = { key: K; label: string; description?: string };

export const VALUE_OPTIONS: Option<ValueKey>[] = [
  { key: 'autonomy', label: 'Autonomy & independence' },
  { key: 'impact', label: 'Making an impact' },
  { key: 'stability', label: 'Stability & security' },
  { key: 'growth', label: 'Growth & learning' },
  { key: 'recognition', label: 'Recognition & visibility' },
  { key: 'collaboration', label: 'Collaboration & belonging' },
  { key: 'creativity', label: 'Creativity & expression' },
  { key: 'reward', label: 'Financial reward' },
];

export const SECTOR_OPTIONS: Option<SectorKey>[] = [
  { key: 'technology', label: 'Technology' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'finance', label: 'Finance & Professional Services' },
  { key: 'education', label: 'Education' },
  { key: 'nonprofit', label: 'Nonprofit & Public Sector' },
  { key: 'creative', label: 'Creative & Media' },
  { key: 'sustainability', label: 'Sustainability & Climate' },
  { key: 'retail', label: 'Retail & Consumer' },
];

export const READINESS_OPTIONS: Option<ReadinessLevel>[] = [
  { key: 'exploring', label: 'Just exploring', description: 'Curious, but not actively planning a change' },
  { key: 'planning', label: 'Actively planning', description: 'Preparing for a move in the next few months' },
  { key: 'ready', label: 'Ready to act', description: 'Ready to make a move now' },
  { key: 'unsure', label: 'Not sure yet', description: 'Still figuring out what I want next' },
];

export const EXPERIENCE_OPTIONS: Option<ExperienceLevel>[] = [
  { key: 'student', label: 'Still studying', description: 'At school, college or university — little or no full-time work experience yet' },
  { key: 'early', label: 'Early career', description: '0–3 years experience' },
  { key: 'mid', label: 'Mid-career', description: '4–9 years experience' },
  { key: 'senior', label: 'Senior', description: '10–15 years experience' },
  { key: 'executive', label: 'Leadership / executive', description: '15+ years experience' },
];

export const FOCUS_OPTIONS: Option<CoachingFocus>[] = [
  { key: 'advancing', label: 'Advancing my current career', description: 'Growing and progressing where I am' },
  { key: 'career-change', label: 'Exploring a career change', description: 'Finding a new direction' },
  { key: 'leadership', label: 'Growing as a leader', description: 'Stepping into or growing in leadership' },
  { key: 'negotiation', label: 'Negotiating pay or promotion', description: 'Preparing to ask for more' },
  { key: 'personal-development', label: 'Personal development & confidence', description: 'Building skills and self-belief' },
  { key: 'returning', label: 'Returning to work', description: 'Re-entering after a break' },
];

const EXPERIENCE_NARRATIVE: Record<ExperienceLevel, string> = {
  student: 'still studying, with little or no full-time experience yet',
  early: 'early in their career',
  mid: 'a mid-career professional',
  senior: 'a senior professional',
  executive: 'an experienced leader',
};

const READINESS_NARRATIVE: Record<ReadinessLevel, string> = {
  exploring: 'just starting to explore their options',
  planning: 'actively planning their next move',
  ready: 'ready to act on a change now',
  unsure: 'still working out what they want next',
};

const FOCUS_NARRATIVE: Record<CoachingFocus, string> = {
  advancing: 'advancing in their current role',
  'career-change': 'exploring a career change',
  leadership: 'growing into leadership',
  negotiation: 'preparing to negotiate pay or promotion',
  'personal-development': 'building confidence and personal development',
  returning: 'returning to work after a break',
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function labelsFor<K extends string>(keys: K[], options: Option<K>[]): string[] {
  return keys.map((key) => options.find((o) => o.key === key)?.label ?? key);
}

// Derives a top-level "Vernon Insights" narrative from diagnostic answers —
// a stand-in for an AI model summarising a user's intake responses.
export function getDiagnosticInsights(answers: DiagnosticAnswers): DiagnosticInsights {
  const topValues = labelsFor(answers.values, VALUE_OPTIONS);
  const sectorLabels = labelsFor(answers.sectors, SECTOR_OPTIONS);
  const readinessLabel = READINESS_OPTIONS.find((o) => o.key === answers.readiness)?.label ?? answers.readiness;
  const experienceLabel = EXPERIENCE_OPTIONS.find((o) => o.key === answers.experience)?.label ?? answers.experience;
  const focusLabel = FOCUS_OPTIONS.find((o) => o.key === answers.focus)?.label ?? answers.focus;

  const valuesPhrase = topValues.length > 0
    ? topValues.slice(0, 2).join(' and ').toLowerCase()
    : 'a clear sense of what matters most to them';
  const sectorPhrase = sectorLabels.length > 0 ? sectorLabels.join(', ').toLowerCase() : 'no particular sector';

  const summary = `Most motivated by ${valuesPhrase}, with an interest in ${sectorPhrase}. ` +
    `${capitalize(EXPERIENCE_NARRATIVE[answers.experience])}, ${READINESS_NARRATIVE[answers.readiness]}, ` +
    `and currently ${FOCUS_NARRATIVE[answers.focus]}.`;

  return { topValues, sectorLabels, readinessLabel, experienceLabel, focusLabel, focus: answers.focus, summary };
}

const DIAGNOSTIC_KEY = 'vernon_diagnostic';

// Set on login and consumed once by the dashboard shell — for the demo this
// re-triggers the diagnostic every login rather than only the first time.
export const DIAGNOSTIC_PENDING_SESSION_KEY = 'vernon_diagnostic_pending';

export function getDiagnosticAnswers(): DiagnosticAnswers | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(namespacedKey(DIAGNOSTIC_KEY));
    return stored ? (JSON.parse(stored) as DiagnosticAnswers) : null;
  } catch {
    return null;
  }
}

export function saveDiagnosticAnswers(answers: DiagnosticAnswers): DiagnosticAnswers {
  localStorage.setItem(namespacedKey(DIAGNOSTIC_KEY), JSON.stringify(answers));
  return answers;
}
