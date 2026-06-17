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

export function getProfileReport(): ProfileReport {
  if (typeof window === 'undefined') return DEFAULT_PROFILE_REPORT;
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) return DEFAULT_PROFILE_REPORT;
    return { ...DEFAULT_PROFILE_REPORT, ...(JSON.parse(stored) as Partial<ProfileReport>) };
  } catch {
    return DEFAULT_PROFILE_REPORT;
  }
}

export function saveProfileReport(profile: ProfileReport): ProfileReport {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}
