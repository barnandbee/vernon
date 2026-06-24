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

export type SessionNote = {
  id: number;
  title: string;
  date: string;
  coach: string;
  status: 'completed' | 'upcoming';
  summary: string;
  notes: string[];
};

export type QuickWin = {
  id: string;
  title: string;
  description: string;
  minutes: number;
};

export type DevelopmentGoal = {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  progress: number;
};

export type JourneyContent = {
  actionItems: ActionItem[];
  sessionNotes: SessionNote[];
  quickWins: QuickWin[];
  developmentGoals: DevelopmentGoal[];
};

// Jamie Rivera — working professional building a case for a people-leadership move.
const JAMIE_CONTENT: JourneyContent = {
  actionItems: [
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
  ],
  sessionNotes: [
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
  ],
  quickWins: [
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
  ],
  developmentGoals: [
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
  ],
};

// Zara Ahmed — Year 12 student exploring subjects, work experience and
// apprenticeships vs. university before narrowing anything down.
const ZARA_CONTENT: JourneyContent = {
  actionItems: [
    {
      id: 1,
      title: 'Book a work experience taster day',
      description: 'Reach out to one local employer or ask your school’s careers office about a taster day in a field you’re curious about.',
      source: 'coach',
      sourceLabel: 'Sarah Mitchell',
      status: 'in-progress',
      pulseCheck: {
        timing: 'A few days after your taster day',
        prompt: 'What surprised you about how the day actually felt, compared to what you expected?',
      },
    },
    {
      id: 2,
      title: 'Compare an apprenticeship route with a university course',
      description: 'Pick a subject you’re interested in and look at what both paths actually involve day-to-day, not just the headline.',
      source: 'coach',
      sourceLabel: 'Sarah Mitchell',
      status: 'todo',
    },
    {
      id: 3,
      title: 'Practice introducing yourself and your interests in 30 seconds',
      description: 'Try it on a parent, friend, or just out loud in your room — notice which bits feel natural.',
      source: 'ai',
      sourceLabel: 'Vernon AI',
      status: 'todo',
      pulseCheck: {
        timing: 'The day after you practice',
        prompt: 'Quick pulse check — how natural did it feel, from 1–5?',
      },
    },
    {
      id: 4,
      title: 'Re-read your notes on what you enjoyed most this term',
      description: 'Look back at what actually held your attention, not just what you got the best mark in.',
      source: 'ai',
      sourceLabel: 'Vernon AI',
      status: 'done',
    },
    {
      id: 5,
      title: 'Book your next check-in with Sarah',
      description: 'Aim for 2–3 weeks out, after you’ve had a chance to try the taster day.',
      source: 'coach',
      sourceLabel: 'Sarah Mitchell',
      status: 'todo',
    },
  ],
  sessionNotes: [
    {
      id: 1,
      title: 'Getting to Know You',
      date: 'Jun 4, 2026',
      coach: 'Sarah Mitchell',
      status: 'completed',
      summary: 'We talked through what you enjoy in and out of school, and agreed a focus for the next few months: trying out a few different paths before narrowing anything down.',
      notes: [
        'Strongest theme: you come alive talking about projects where you got to make something, not just write about it.',
        'Agreed focus: try a taster day and properly compare apprenticeships vs. university for one subject area.',
        "Watch for: you're putting pressure on yourself to decide everything now — you don't have to.",
      ],
    },
    {
      id: 2,
      title: 'Check-in: Options & Next Steps',
      date: 'Jun 13, 2026 · 4:00 PM',
      coach: 'Sarah Mitchell',
      status: 'upcoming',
      summary: "We'll talk through how the taster day went, look at what you found out about apprenticeships vs. university, and start narrowing down your subject choices.",
      notes: [
        'Bring: how the taster day actually felt, compared to what you expected.',
        'Bring: what you found out comparing the apprenticeship and university routes.',
        "Think about: which subjects you actually want to keep studying, not just the ones you're ‘supposed’ to.",
      ],
    },
  ],
  quickWins: [
    {
      id: 'qw-1',
      title: 'Look up one apprenticeship in a field you’re curious about',
      description: 'Just 5 minutes on what it actually involves day-to-day and what it leads to.',
      minutes: 5,
    },
    {
      id: 'qw-2',
      title: 'Ask a parent or older sibling about their first job',
      description: 'A quick chat about what surprised them most — you might be surprised too.',
      minutes: 5,
    },
    {
      id: 'qw-3',
      title: 'Save an article for later',
      description: 'Bookmark something from Resources about subject choices or work experience — read when you have a moment.',
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
      title: 'Re-read your check-in notes',
      description: 'Refresh your memory on what you and Sarah agreed before the details fade.',
      minutes: 5,
    },
  ],
  developmentGoals: [
    {
      id: 'dg-1',
      title: 'Work out which subjects to carry forward',
      description: 'Try enough taster experiences and conversations to feel confident about what to keep studying.',
      timeframe: 'This term · agreed 4 Jun',
      progress: 35,
    },
    {
      id: 'dg-2',
      title: 'Build a clearer picture of apprenticeships vs. university',
      description: 'Properly compare both routes for at least one subject area, not just assumptions.',
      timeframe: 'Next 2 months',
      progress: 15,
    },
    {
      id: 'dg-3',
      title: 'Get more comfortable talking about yourself',
      description: 'Practice describing your interests and strengths so it feels natural in interviews or open days.',
      timeframe: 'Ongoing',
      progress: 20,
    },
  ],
};

// Marcus Reid — final-year university student weighing a graduate scheme
// offer against a Master's, drawing on his placement-year experience.
const MARCUS_CONTENT: JourneyContent = {
  actionItems: [
    {
      id: 1,
      title: 'Tailor your CV for graduate marketing and consulting schemes',
      description: 'Pull out the parts of your placement year that map most directly onto what these schemes actually ask for.',
      source: 'coach',
      sourceLabel: 'Sarah Mitchell',
      status: 'in-progress',
      pulseCheck: {
        timing: '3 days after your session',
        prompt: 'How did it feel revisiting your placement-year experience? Did anything stand out as stronger than you remembered?',
      },
    },
    {
      id: 2,
      title: 'Research three graduate schemes you’re seriously considering',
      description: 'For each one, note one thing that genuinely excites you about how they work — not just the brand name.',
      source: 'coach',
      sourceLabel: 'Sarah Mitchell',
      status: 'todo',
    },
    {
      id: 3,
      title: 'Practice your two-minute "why this scheme" pitch out loud',
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
      title: 'Re-read your notes on why you want a grad scheme over a Master’s',
      description: 'Check they still feel true now that a little time has passed.',
      source: 'ai',
      sourceLabel: 'Vernon AI',
      status: 'done',
    },
    {
      id: 5,
      title: 'Book your next strategy session with Sarah',
      description: 'Aim for 2–3 weeks out, ideally before your next application deadline.',
      source: 'coach',
      sourceLabel: 'Sarah Mitchell',
      status: 'todo',
    },
  ],
  sessionNotes: [
    {
      id: 1,
      title: 'Onboarding Review',
      date: 'Jun 2, 2026',
      coach: 'Sarah Mitchell',
      status: 'completed',
      summary: 'We mapped out your placement-year experience and agreed a focus: building a strong case for graduate marketing and consulting roles while you weigh up a Master’s.',
      notes: [
        'Strongest theme: you light up describing the client-facing work from your placement, not the admin around it.',
        'Agreed focus: a focused application push toward three graduate schemes, with the Master’s as a genuine fallback, not a default.',
        "Watch for: you're comparing yourself to coursemates with very different goals — focus on what fits you.",
      ],
    },
    {
      id: 2,
      title: 'Career Strategy Session',
      date: 'Jun 11, 2026 · 2:00 PM',
      coach: 'Sarah Mitchell',
      status: 'upcoming',
      summary: "We'll review your tailored CV, talk through the schemes you've shortlisted, and weigh up next steps if a scheme offer and a Master's place arrive around the same time.",
      notes: [
        'Bring: your tailored CV and the three schemes you’ve shortlisted.',
        "Bring: what you've found out about each scheme's actual day-to-day, not just the marketing.",
        "Think about: what you'd genuinely choose if a scheme offer and a Master's place landed in the same week.",
      ],
    },
  ],
  quickWins: [
    {
      id: 'qw-1',
      title: 'Add one placement-year achievement to your CV',
      description: 'Pick a single result from your placement and add a number to it — scope, outcome, impact.',
      minutes: 5,
    },
    {
      id: 'qw-2',
      title: 'Message one placement contact or course alum',
      description: 'A quick "thinking of you, how are things going" to someone from your placement or a course alum in your target sector.',
      minutes: 5,
    },
    {
      id: 'qw-3',
      title: 'Save an article for later',
      description: 'Bookmark something from Resources about graduate applications or negotiation — read when you have a moment.',
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
  ],
  developmentGoals: [
    {
      id: 'dg-1',
      title: 'Secure a graduate marketing or consulting offer',
      description: 'Build a focused, well-evidenced application case across your shortlisted schemes.',
      timeframe: 'This application cycle · agreed 2 Jun',
      progress: 48,
    },
    {
      id: 'dg-2',
      title: 'Decide between a grad scheme and a Master’s',
      description: 'Get clear enough on what each path actually offers to choose confidently if both come through.',
      timeframe: 'Next 2 months',
      progress: 25,
    },
    {
      id: 'dg-3',
      title: 'Turn placement experience into a clear personal pitch',
      description: 'Be able to talk about your placement year in a way that lands in interviews, not just on paper.',
      timeframe: 'Ongoing',
      progress: 30,
    },
  ],
};

const JOURNEY_CONTENT_BY_USER: Record<string, JourneyContent> = {
  'demo-user': JAMIE_CONTENT,
  'zara-ahmed': ZARA_CONTENT,
  'marcus-reid': MARCUS_CONTENT,
};

export function getJourneyContent(userId?: string | null): JourneyContent {
  if (!userId) return JAMIE_CONTENT;
  return JOURNEY_CONTENT_BY_USER[userId] ?? JAMIE_CONTENT;
}

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
