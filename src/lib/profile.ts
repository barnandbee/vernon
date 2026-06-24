import { getCurrentUserId, namespacedKey } from './currentUser';

const PROFILE_KEY = 'vernon_profile_report';

export type ProfileReport = {
  knownFor: string;
  proudMoment: string;
  impact: string;
  skills: string[];
};

// Seeded to match the demo member's (Jamie Rivera) coaching narrative —
// a mid-career pivot into people leadership.
export const DEFAULT_PROFILE_REPORT: ProfileReport = {
  knownFor: 'Quietly keeping projects on track and helping teammates do their best work',
  proudMoment: 'Stepped up to lead a cross-team project when our manager went on leave',
  impact: 'Wants to move from supporting a team to leading one',
  skills: ['Leadership', 'Coaching others', 'Strategic thinking', 'Stakeholder management'],
};

// Seeded for Zara — a Year 12 student still working out her next step.
const ZARA_PROFILE_REPORT: ProfileReport = {
  knownFor: 'Organising revision sessions for friends and explaining tricky topics until they click',
  proudMoment: 'Led her team to the final of a school debating competition',
  impact: 'Wants to work out whether university, an apprenticeship, or something else is the right next step',
  skills: ['Communication', 'Organisation', 'Problem solving', 'Teamwork'],
};

// Seeded for Marcus — a final-year student turning a placement year into a graduate offer.
const MARCUS_PROFILE_REPORT: ProfileReport = {
  knownFor: 'Spotting where a process is wasting time and fixing it before anyone has to ask',
  proudMoment: 'Presented a process improvement to senior leadership during his placement year',
  impact: 'Wants to turn his placement experience into a strong graduate scheme offer',
  skills: ['Initiative', 'Data analysis', 'Stakeholder management', 'Project management'],
};

const PROFILE_REPORT_BY_USER: Record<string, ProfileReport> = {
  'demo-user': DEFAULT_PROFILE_REPORT,
  'zara-ahmed': ZARA_PROFILE_REPORT,
  'marcus-reid': MARCUS_PROFILE_REPORT,
};

function getDefaultProfileReport(): ProfileReport {
  const id = getCurrentUserId();
  return PROFILE_REPORT_BY_USER[id ?? ''] ?? DEFAULT_PROFILE_REPORT;
}

export function getProfileReport(): ProfileReport {
  const fallback = getDefaultProfileReport();
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(namespacedKey(PROFILE_KEY));
    if (!stored) return fallback;
    return { ...fallback, ...(JSON.parse(stored) as Partial<ProfileReport>) };
  } catch {
    return fallback;
  }
}

export function saveProfileReport(profile: ProfileReport): ProfileReport {
  localStorage.setItem(namespacedKey(PROFILE_KEY), JSON.stringify(profile));
  return profile;
}
