export type Status = 'todo' | 'in-progress' | 'done';

export type ActionItem = {
  id: number;
  title: string;
  description: string;
  source: 'coach' | 'ai';
  sourceLabel: string;
  status: Status;
  pulseCheck?: { timing: string; prompt: string };
};

export const ACTION_ITEMS: ActionItem[] = [
  {
    id: 1,
    title: 'Update your CV with quantified achievements',
    description: 'Add measurable outcomes to your last three roles — numbers, scope, impact.',
    source: 'coach',
    sourceLabel: 'Sarah Mitchell',
    status: 'in-progress',
    pulseCheck: {
      timing: '3 days after your session',
      prompt: 'How did it feel revisiting your achievements? Did anything surprise you?',
    },
  },
  {
    id: 2,
    title: 'Research three companies in your target sector',
    description: 'For each one, note one thing that genuinely excites you about how they work.',
    source: 'coach',
    sourceLabel: 'James Park',
    status: 'todo',
  },
  {
    id: 3,
    title: 'Practice your two-minute career pitch out loud',
    description: "Say it to a mirror, a friend, or record yourself — notice what feels natural and what doesn't.",
    source: 'ai',
    sourceLabel: 'Vernon AI',
    status: 'todo',
    pulseCheck: {
      timing: 'The day after you practice',
      prompt: 'Quick pulse check — how confident did saying it out loud feel, from 1–5?',
    },
  },
  {
    id: 4,
    title: 'Re-read your "why I want to move on" notes',
    description: 'Check they still feel true now that a little time has passed.',
    source: 'ai',
    sourceLabel: 'Vernon AI',
    status: 'done',
  },
  {
    id: 5,
    title: 'Book your next strategy session with Sarah',
    description: 'Aim for 2–3 weeks out so you have time to work through this plan.',
    source: 'coach',
    sourceLabel: 'Sarah Mitchell',
    status: 'todo',
  },
];

export type SessionNote = {
  id: number;
  title: string;
  date: string;
  coach: string;
  status: 'completed' | 'upcoming';
  summary: string;
  notes: string[];
};

export const SESSION_NOTES: SessionNote[] = [
  {
    id: 1,
    title: 'Onboarding Review',
    date: 'Jun 3, 2026',
    coach: 'Sarah Mitchell',
    status: 'completed',
    summary: 'We mapped out where you are now and agreed a focus for the next six months: building the case for a move into people leadership.',
    notes: [
      'Strongest theme: you light up describing times you helped someone else do their best work.',
      'Agreed focus: a 6-month plan toward a team-lead or manager-track role.',
      "Watch for: you're time-poor — keep weekly actions small and concrete.",
    ],
  },
  {
    id: 2,
    title: 'Career Strategy Session',
    date: 'Jun 12, 2026 · 10:00 AM',
    coach: 'Sarah Mitchell',
    status: 'upcoming',
    summary: "We'll review your CV updates, talk through the stretch projects you've shortlisted, and plan how to raise the leadership conversation with your manager.",
    notes: [
      'Bring: your updated CV with quantified achievements.',
      "Bring: a shortlist of two stretch projects you'd like to put your name forward for.",
      "Think about: how you'd like to frame the leadership conversation with your manager.",
    ],
  },
];

export type ExplorationItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  tag: string;
};

// "Career is non-linear" — suggested detours into other parts of the site
// that aren't part of the current plan but might spark something useful.
export const FREE_EXPLORATION: ExplorationItem[] = [
  {
    id: 'fe-1',
    title: 'Browse Learning & Tools',
    description: "Courses and workshops outside your current plan — sometimes the next step finds you sideways.",
    href: '/dashboard/learning',
    tag: 'Learning',
  },
  {
    id: 'fe-2',
    title: 'Try a Real-World Practice activity',
    description: 'Low-stakes ways to test out a skill or scenario before it matters.',
    href: '/dashboard/practice',
    tag: 'Practice',
  },
  {
    id: 'fe-3',
    title: 'See what the Community is discussing',
    description: "Other members' wins and questions can spark ideas you wouldn't get to alone.",
    href: '/dashboard/community',
    tag: 'Community',
  },
  {
    id: 'fe-4',
    title: 'Ask Vernon AI an open-ended question',
    description: 'No agenda needed — try "what am I not seeing about my situation?"',
    href: '/dashboard/chat',
    tag: 'Career Chat',
  },
  {
    id: 'fe-5',
    title: 'Skim an article outside your usual topics',
    description: 'Sometimes the most useful read is the one you almost skipped.',
    href: '/dashboard/articles',
    tag: 'Resources',
  },
];

export type QuickWin = {
  id: string;
  title: string;
  description: string;
  minutes: number;
};

// "Things I could do right now" — small, low-effort actions for whenever a
// few spare minutes show up.
export const QUICK_WINS: QuickWin[] = [
  {
    id: 'qw-1',
    title: 'Add one achievement to your CV',
    description: 'Pick a single recent win and add a number to it — team size, time saved, revenue, anything.',
    minutes: 5,
  },
  {
    id: 'qw-2',
    title: 'Message one person in your network',
    description: 'A quick "thinking of you, how are things going" to someone in your target sector.',
    minutes: 5,
  },
  {
    id: 'qw-3',
    title: 'Save an article for later',
    description: 'Bookmark something from Resources that relates to people leadership — read when you have a moment.',
    minutes: 3,
  },
  {
    id: 'qw-4',
    title: "Jot down today's win",
    description: 'One sentence about something that went well today, however small.',
    minutes: 2,
  },
  {
    id: 'qw-5',
    title: 'Re-read your session notes',
    description: 'Refresh your memory on what you and Sarah agreed before the details fade.',
    minutes: 5,
  },
];

export type DevelopmentGoal = {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  progress: number;
};

// Longer-horizon goals that the day-to-day action plan and quick wins ladder
// up to.
export const DEVELOPMENT_GOALS: DevelopmentGoal[] = [
  {
    id: 'dg-1',
    title: 'Move into a people-leadership role',
    description: 'Build the experience and visibility to be a credible candidate for a team-lead or manager position.',
    timeframe: '6-month plan · agreed 3 Jun',
    progress: 42,
  },
  {
    id: 'dg-2',
    title: 'Build a track record of mentoring',
    description: 'Take on informal mentoring so you can speak to leadership experience with real examples.',
    timeframe: 'Ongoing',
    progress: 20,
  },
  {
    id: 'dg-3',
    title: 'Grow visibility across the wider team',
    description: 'Become known for more than your day-to-day role through stretch projects and sharing your work.',
    timeframe: 'Next 3 months',
    progress: 10,
  },
];
