export type ActionItem = {
  id: string;
  text: string;
  done: boolean;
};

export type TranscriptInsight = {
  id: string;
  quote: string;
  text: string;
};

export type CoachingSession = {
  id: string;
  title: string;
  insights: TranscriptInsight[];
};

export type Client = {
  id: string;
  name: string;
  initials: string;
  color: string;
  focus: string;
  progress: number;
  lastSession: string;
  nextSession: string;
  tags: string[];
  note: string;
  actionPlan: ActionItem[];
  sessionNotes: CoachingSession[];
};

export const CLIENTS: Client[] = [
  {
    id: 'jamie-rivera',
    name: 'Jamie Rivera',
    initials: 'JR',
    color: '#be185d',
    focus: 'Mid-career pivot into people leadership',
    progress: 42,
    lastSession: 'Onboarding Review · 3 Jun',
    nextSession: 'Career Strategy Session · 12 Jun, 10:00 AM',
    tags: ['Leadership track', '6-month plan in progress'],
    note: 'Motivated but time-poor — keep action steps small and concrete.',
    actionPlan: [
      { id: 'jr-1', text: 'Complete strengths audit before next session', done: true },
      { id: 'jr-2', text: 'Draft a 6-month career plan outline', done: true },
      { id: 'jr-3', text: 'Identify two stretch projects to raise visibility', done: false },
      { id: 'jr-4', text: 'Schedule a 1:1 with manager about the leadership track', done: false },
    ],
    sessionNotes: [
      {
        id: 'jr-s1',
        title: 'Onboarding Review · 3 Jun',
        insights: [
          {
            id: 'jr-ti-1',
            quote: "I think I finally feel ready to actually say I want to lead a team, not just support one.",
            text: 'Write a short personal leadership statement describing the kind of leader you want to be',
          },
          {
            id: 'jr-ti-2',
            quote: "I get nervous about handing things off — I'd rather just do it myself and know it's right.",
            text: 'Read up on a delegation framework and try it with one task this week',
          },
        ],
      },
    ],
  },
  {
    id: 'maya-okafor',
    name: 'Maya Okafor',
    initials: 'MO',
    color: '#1d4ed8',
    focus: 'Returning to a senior IC role after a career break',
    progress: 68,
    lastSession: 'Confidence & Visibility · 29 May',
    nextSession: 'Interview Prep Session · 19 Jun, 11:00 AM',
    tags: ['Returner', 'Interview prep'],
    note: 'On a 12-day engagement streak — great momentum to build on.',
    actionPlan: [
      { id: 'mo-1', text: 'Update CV with recent freelance projects', done: true },
      { id: 'mo-2', text: 'Practice three STAR stories for senior IC interviews', done: true },
      { id: 'mo-3', text: 'Run a mock interview with a peer from Community', done: false },
    ],
    sessionNotes: [
      {
        id: 'mo-s2',
        title: 'Confidence & Visibility · 29 May',
        insights: [
          {
            id: 'mo-ti-1',
            quote: "Putting my freelance work into a portfolio actually made me realise how much I've grown.",
            text: 'Add a career-break highlights section to your LinkedIn summarising recent freelance wins',
          },
          {
            id: 'mo-ti-2',
            quote: "I keep thinking about reaching out to people I worked with before, but I never quite do it.",
            text: 'Message two former colleagues this month for an informal catch-up',
          },
        ],
      },
      {
        id: 'mo-s1',
        title: 'Returning to Work Kickoff · 15 May',
        insights: [
          {
            id: 'mo-ti-3',
            quote: "I keep telling myself I should've stayed current somehow, like I wasted those two years.",
            text: 'Reframe the career break as a chapter in your story — note 2-3 things it actually developed (resilience, perspective, new skills)',
          },
          {
            id: 'mo-ti-4',
            quote: "I don't even know what level to look at — am I still senior, or do I need to prove that again?",
            text: 'List three recent examples that prove senior-level judgement, to use as anchors in conversations',
          },
        ],
      },
    ],
  },
  {
    id: 'tom-baker',
    name: 'Tom Baker',
    initials: 'TB',
    color: '#15803d',
    focus: 'Exploring a pivot from finance into sustainability',
    progress: 35,
    lastSession: 'Values & Motivators · 1 Jun',
    nextSession: 'Not yet booked',
    tags: ['Early exploration', 'Needs a nudge'],
    note: 'Engagement has dipped this week — check in before the plan goes stale.',
    actionPlan: [
      { id: 'tb-1', text: 'Shortlist three sustainability-focused employers', done: false },
      { id: 'tb-2', text: 'Book a follow-up session to discuss findings', done: false },
    ],
    sessionNotes: [
      {
        id: 'tb-s2',
        title: 'Values & Motivators · 1 Jun',
        insights: [
          {
            id: 'tb-ti-1',
            quote: "Whenever we talk about environmental policy work, I notice I actually lean forward — I'm interested.",
            text: 'Spend 30 minutes researching one sustainability policy role that excites you',
          },
          {
            id: 'tb-ti-2',
            quote: "I worry my finance background won't mean anything to a sustainability employer.",
            text: 'List three finance skills that transfer directly to sustainability roles',
          },
        ],
      },
      {
        id: 'tb-s1',
        title: 'Initial Discovery Call · 18 May',
        insights: [
          {
            id: 'tb-ti-3',
            quote: "Finance pays well, and I feel guilty even thinking about walking away from that.",
            text: "Write down what 'enough' actually looks like financially, separate from what finance currently pays",
          },
          {
            id: 'tb-ti-4',
            quote: "I keep reading about sustainability roles late at night instead of admitting it's something I want.",
            text: 'Give yourself permission to treat the late-night reading as research, not a guilty habit — log what you learn',
          },
        ],
      },
    ],
  },
  {
    id: 'aiko-tanaka',
    name: 'Aiko Tanaka',
    initials: 'AT',
    color: '#0369a1',
    focus: 'Negotiating scope and pay for an upcoming promotion',
    progress: 54,
    lastSession: 'Negotiation Prep · 5 Jun',
    nextSession: 'Negotiation Follow-up · 16 Jun, 2:00 PM',
    tags: ['Promotion pending', 'Negotiation'],
    note: 'Has a promotion conversation booked with their manager next month.',
    actionPlan: [
      { id: 'at-1', text: 'Research market rate for the target role', done: true },
      { id: 'at-2', text: 'Draft talking points for the promotion conversation', done: false },
      { id: 'at-3', text: 'Review draft talking points together', done: false },
    ],
    sessionNotes: [
      {
        id: 'at-s2',
        title: 'Negotiation Prep · 5 Jun',
        insights: [
          {
            id: 'at-ti-1',
            quote: "I never know how to actually start the conversation — that's the bit I dread most.",
            text: 'Practise saying your opening line for the promotion conversation out loud',
          },
          {
            id: 'at-ti-2',
            quote: "The project I led last quarter landed really well with the team — I should mention that.",
            text: 'Write a short summary of your recent project win to use as supporting evidence',
          },
        ],
      },
      {
        id: 'at-s1',
        title: 'Goal Setting · 22 May',
        insights: [
          {
            id: 'at-ti-3',
            quote: "I want the promotion, but I haven't actually said out loud what scope I'm hoping for.",
            text: 'Write one sentence naming the exact scope and title you are aiming for',
          },
          {
            id: 'at-ti-4',
            quote: "I don't want to seem like I'm rushing it, but the timing window feels short.",
            text: 'Map out the realistic timeline for the promotion conversation against the next review cycle',
          },
        ],
      },
    ],
  },
];

export type Appointment = {
  id: number;
  clientId: string;
  clientName: string;
  title: string;
  day: number;
  time: string;
  duration: string;
  type: 'online' | 'in-person';
  status: 'confirmed' | 'pending' | 'completed';
};

export const APPOINTMENTS: Appointment[] = [
  { id: 1, clientId: 'jamie-rivera', clientName: 'Jamie Rivera', title: 'Career Strategy Session', day: 12, time: '10:00 AM', duration: '60 min', type: 'online', status: 'confirmed' },
  { id: 2, clientId: 'aiko-tanaka', clientName: 'Aiko Tanaka', title: 'Negotiation Follow-up', day: 16, time: '2:00 PM', duration: '45 min', type: 'online', status: 'confirmed' },
  { id: 3, clientId: 'maya-okafor', clientName: 'Maya Okafor', title: 'Interview Prep Session', day: 19, time: '11:00 AM', duration: '60 min', type: 'in-person', status: 'pending' },
  { id: 4, clientId: 'jamie-rivera', clientName: 'Jamie Rivera', title: 'Onboarding Review', day: 3, time: '9:00 AM', duration: '45 min', type: 'online', status: 'completed' },
];

export type CpdItemType = 'Document' | 'Course' | 'Webinar';
export type CpdStatus = 'completed' | 'in_progress' | 'not_started';

export type CpdItem = {
  id: string;
  title: string;
  programme: string;
  type: CpdItemType;
  status: CpdStatus;
  duration: string;
  description: string;
};

export const CPD_HOURS_LOGGED = 18;
export const CPD_HOURS_TARGET = 30;

export const CPD_ITEMS: CpdItem[] = [
  {
    id: 'cpd-1',
    title: 'Vernon Coach Accreditation Handbook',
    programme: 'Core Accreditation',
    type: 'Document',
    status: 'completed',
    duration: '40 page guide',
    description: 'Standards, code of conduct, and session structure expected of every Vernon-accredited coach.',
  },
  {
    id: 'cpd-2',
    title: 'Leadership Transitions Coaching Practicum',
    programme: 'Leadership Track',
    type: 'Course',
    status: 'in_progress',
    duration: '6 modules · 4 of 6 complete',
    description: 'Advanced techniques for coaching clients moving into people-leadership roles.',
  },
  {
    id: 'cpd-3',
    title: 'Supporting Returners: Confidence & Re-entry',
    programme: 'Returner Programme',
    type: 'Document',
    status: 'completed',
    duration: '25 min read',
    description: 'Best-practice guide for coaching clients re-entering the workforce after a career break.',
  },
  {
    id: 'cpd-4',
    title: 'Negotiation Coaching Masterclass',
    programme: 'Promotion & Negotiation',
    type: 'Webinar',
    status: 'not_started',
    duration: '90 min',
    description: 'Recorded masterclass on coaching clients through pay and scope negotiations.',
  },
  {
    id: 'cpd-5',
    title: 'Safeguarding & Ethics Refresher',
    programme: 'Core Accreditation',
    type: 'Course',
    status: 'in_progress',
    duration: '3 modules · 1 of 3 complete',
    description: 'Annual refresher required to maintain Vernon coaching accreditation.',
  },
  {
    id: 'cpd-6',
    title: 'Facilitating the Values & Motivators Card Sort',
    programme: 'Early Career Exploration',
    type: 'Document',
    status: 'completed',
    duration: '15 min read',
    description: 'Step-by-step guide for running the card sort exercise with clients exploring a pivot.',
  },
  {
    id: 'cpd-7',
    title: 'Trauma-Informed Coaching Conversations',
    programme: 'Core Accreditation',
    type: 'Webinar',
    status: 'not_started',
    duration: '60 min',
    description: 'Recognising signs of distress and responding with care during sensitive sessions.',
  },
  {
    id: 'cpd-8',
    title: 'Reflective Practice & CPD Log',
    programme: 'Core Accreditation',
    type: 'Document',
    status: 'in_progress',
    duration: 'Ongoing',
    description: 'Your running record of CPD hours and reflections for accreditation renewal.',
  },
];
