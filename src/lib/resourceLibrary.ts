import type { LucideIcon } from 'lucide-react';
import { BookOpen, Video, Headphones, Wrench } from 'lucide-react';

export type ResourceType = 'Article' | 'Video' | 'Podcast' | 'Toolkit';

export type LibraryResource = {
  id: string;
  type: ResourceType;
  title: string;
  summary: string;
  content?: string;
  category: string;
  tags: string[];
  mins: number;
  author: string;
  date: string;
  featured?: boolean;
};

export const TYPE_META: Record<ResourceType, { label: string; icon: LucideIcon; verb: string; bg: string; color: string }> = {
  Article: { label: 'Article', icon: BookOpen, verb: 'read', bg: '#eff6ff', color: '#1d4ed8' },
  Video: { label: 'Video', icon: Video, verb: 'watch', bg: '#fdf2f8', color: '#be185d' },
  Podcast: { label: 'Podcast', icon: Headphones, verb: 'listen', bg: '#f5f3ff', color: '#7c3aed' },
  Toolkit: { label: 'Activity', icon: Wrench, verb: 'complete', bg: '#fff7ed', color: '#c2410c' },
};

export const RESOURCE_LIBRARY: LibraryResource[] = [
  {
    id: 'res-1',
    type: 'Article',
    title: 'Navigating Career Transitions in Your 30s',
    summary: 'Practical strategies for making a meaningful career pivot while managing risk and maintaining momentum.',
    content: `Your 30s often bring a quieter, more deliberate kind of career change. It's less about escaping a bad situation and more about aligning your work with who you've become. The first step is separating what you're moving away from from what you're moving toward — clarity about the destination makes a transition feel like progress rather than a leap into the unknown.

Start by auditing your transferable skills rather than your job titles. Years of experience translate into judgement, communication, stakeholder management and problem-solving that apply far beyond your current industry — you just need to learn to describe them in language your new field recognises.

Build the transition in stages. Spend 90 days exploring through conversations, shadowing, and small projects before committing to a focused job search. Protect your finances and your support network along the way; a pivot that costs you both rarely sticks. Treat the change itself as evidence of strength — it shows self-awareness, courage, and the capacity to keep growing.`,
    category: 'Career Change',
    tags: ['transition', 'pivot', 'confidence', 'career change'],
    mins: 5,
    author: 'Dr. Sarah Mitchell',
    date: 'Jun 5, 2026',
    featured: true,
  },
  {
    id: 'res-2',
    type: 'Article',
    title: 'Building a Personal Brand That Opens Doors',
    summary: 'How to craft an authentic professional identity that attracts the right opportunities.',
    content: `A personal brand isn't a logo or a tagline — it's the pattern other people notice when they think about your work. Left undefined, that pattern forms anyway, just without your input. Building it deliberately means deciding which strengths and values you want to be known for, and then making sure your day-to-day work reflects them consistently.

Start small: pick two or three themes that genuinely represent how you work — perhaps "calm under pressure", "makes complex things simple", or "brings people together". Look for everyday opportunities to demonstrate them, from how you run a meeting to how you write an update.

Visibility matters too. Share what you're learning, contribute to conversations beyond your immediate team, and let colleagues see the thinking behind your decisions, not just the results. Over time, a consistent, authentic brand becomes a shortcut — people recommend you for opportunities before you even know they exist, because they already know what you stand for.`,
    category: 'Networking',
    tags: ['visibility', 'branding', 'leadership', 'networking'],
    mins: 7,
    author: 'James Park',
    date: 'Jun 2, 2026',
  },
  {
    id: 'res-3',
    type: 'Article',
    title: 'How to Ask for the Promotion You Deserve',
    summary: 'A step-by-step guide to preparing your case, timing the conversation, and handling objections.',
    content: `Asking for a promotion well starts long before the conversation itself. Begin by building a clear record of impact — outcomes, not just activities — framed in the language your organisation uses to describe the next level. If you're not sure what that language is, ask someone already in the role what they're measured on.

Timing matters. Raise the conversation when you have evidence to share, not only when you're frustrated. A short note ahead of the meeting — "I'd like to talk about my development and next steps" — gives your manager time to prepare rather than feel ambushed.

In the conversation itself, lead with contribution, then make the ask explicit: name the role or level you want, and why you believe you're ready. Expect questions, not instant yes-or-no answers, and treat the first response as the start of a conversation rather than a verdict. If the answer is "not yet", ask what specifically needs to change and agree a date to revisit it.`,
    category: 'Salary & Negotiation',
    tags: ['negotiation', 'promotion', 'pay', 'confidence'],
    mins: 4,
    author: 'Lisa Chen',
    date: 'May 28, 2026',
  },
  {
    id: 'res-4',
    type: 'Article',
    title: "The Introvert's Guide to Powerful Networking",
    summary: 'Reframe networking as relationship-building and discover strategies that suit your natural style.',
    content: `Networking advice is often written for extroverts — work the room, make small talk with strangers, collect contacts. No wonder it feels exhausting if that's not how you're wired. The good news is that the qualities introverts often bring — careful listening, genuine curiosity, and follow-through — are exactly what make connections last.

Reframe networking as relationship-building, one conversation at a time. Instead of aiming to "meet everyone" at an event, set a goal of having two or three real conversations. Prepare a few open questions in advance so you're not relying on improvisation under pressure.

Smaller, structured settings — a workshop, a panel Q&A, a shared interest group — often work better than large mixers. And remember that following up is networking too: a short message referencing something specific from your conversation does more than a dozen new business cards. A small number of genuine connections, nurtured consistently, will outlast a large pile of names you barely remember meeting.`,
    category: 'Networking',
    tags: ['networking', 'introvert', 'confidence'],
    mins: 6,
    author: 'Mark Davies',
    date: 'May 24, 2026',
  },
  {
    id: 'res-5',
    type: 'Article',
    title: 'Leading Without Authority: Influence at Every Level',
    summary: "How to drive change and inspire teams even when you don't hold a formal leadership title.",
    content: `Some of the most important leadership happens without a title to back it up — coordinating across teams, championing an idea, or holding a group accountable to a shared goal when no one has formally appointed you to do so. Influence in these situations comes from clarity, credibility and consistency rather than positional power.

Start by being unmistakably clear about what you're proposing and why it matters — vague suggestions are easy to ignore, but a well-framed case for action is hard to dismiss. Build credibility by doing the unglamorous groundwork: research, scheduling, follow-up, the things that make collaboration easier for everyone else.

Bring people in early, and give credit generously; influence grows when others feel ownership too, not when they feel managed. Finally, be consistent — show up for the things you said mattered even when no one's watching. Over time, colleagues start treating your judgement as a signal worth following, regardless of what your job title says.`,
    category: 'Leadership',
    tags: ['leadership', 'influence', 'visibility'],
    mins: 8,
    author: 'Dr. Aisha Patel',
    date: 'May 20, 2026',
  },
  {
    id: 'res-6',
    type: 'Article',
    title: 'Setting Boundaries Without Burning Bridges',
    summary: 'Communicate your limits at work in ways that build respect rather than resentment.',
    content: `Boundaries often get a bad reputation, as though setting one is an act of conflict. In practice, a well-communicated boundary usually protects a relationship rather than damaging it — it tells people what they can rely on from you, which builds trust rather than eroding it.

The key is framing. Instead of "I can't", try "Here's what I can do" — offering an alternative shows you're still engaged, just within different limits. If you need to decline a request outright, a brief reason plus an alternative ("I can't take this on this week, but I could look at it Monday") lands very differently from a flat no.

Boundaries also need consistency to hold. If you say you won't answer messages after 7pm but reply within minutes anyway, the boundary effectively doesn't exist. Start with one or two boundaries that matter most to you, communicate them calmly and early, and hold them consistently — most colleagues will adjust faster than you expect.`,
    category: 'Work-Life Balance',
    tags: ['boundaries', 'wellbeing', 'communication', 'resilience'],
    mins: 5,
    author: 'Tom Hargreaves',
    date: 'May 15, 2026',
  },
  {
    id: 'res-7',
    type: 'Video',
    title: 'Reframing Setbacks as Data, Not Verdicts',
    summary: 'A short watch on treating setbacks as information rather than a verdict on your ability — with simple reframes you can use straight away.',
    category: 'Resilience',
    tags: ['resilience', 'mindset', 'confidence', 'setbacks'],
    mins: 12,
    author: 'Dr. Aisha Patel',
    date: 'Jun 8, 2026',
  },
  {
    id: 'res-8',
    type: 'Video',
    title: 'Inside a Real Salary Negotiation (Roleplay)',
    summary: 'Watch a coach and client roleplay a negotiation conversation from opening to close, including the awkward pauses.',
    category: 'Salary & Negotiation',
    tags: ['negotiation', 'roleplay', 'confidence', 'pay'],
    mins: 18,
    author: 'Lisa Chen',
    date: 'Jun 1, 2026',
  },
  {
    id: 'res-9',
    type: 'Video',
    title: 'Five Body Language Tips for Interviews',
    summary: 'Quick, practical adjustments that help you come across as calm and confident on camera or in person.',
    category: 'Skills',
    tags: ['interview', 'confidence', 'body language'],
    mins: 8,
    author: 'Mark Davies',
    date: 'May 22, 2026',
  },
  {
    id: 'res-10',
    type: 'Podcast',
    title: 'The Portfolio Career: Myth or Model?',
    summary: "Two coaches debate whether 'portfolio careers' are a realistic option or just a rebrand of job insecurity.",
    category: 'Career Change',
    tags: ['portfolio career', 'pivot', 'transition'],
    mins: 34,
    author: 'Vernon Conversations',
    date: 'Jun 6, 2026',
  },
  {
    id: 'res-11',
    type: 'Podcast',
    title: 'Negotiating Without Losing the Relationship',
    summary: 'How to ask for more without damaging trust with your manager — practical scripts included.',
    category: 'Salary & Negotiation',
    tags: ['negotiation', 'relationship', 'trust', 'pay'],
    mins: 28,
    author: 'Vernon Conversations',
    date: 'May 30, 2026',
  },
  {
    id: 'res-12',
    type: 'Podcast',
    title: 'Finding Your People: Networking for Introverts',
    summary: "Why networking doesn't have to mean small talk, and what to do instead.",
    category: 'Networking',
    tags: ['networking', 'introvert', 'community'],
    mins: 25,
    author: 'Vernon Conversations',
    date: 'May 18, 2026',
  },
  {
    id: 'res-13',
    type: 'Toolkit',
    title: 'The STAR Method for Interview Storytelling',
    summary: 'A worksheet for structuring compelling, specific answers to behavioural interview questions.',
    category: 'Skills',
    tags: ['interview', 'confidence', 'storytelling'],
    mins: 20,
    author: 'Vernon Coaching Team',
    date: 'Jun 3, 2026',
  },
  {
    id: 'res-14',
    type: 'Toolkit',
    title: 'Values & Motivators Card Sort',
    summary: "A printable card sort to help you articulate what 'good work' really means to you.",
    category: 'Career Change',
    tags: ['exploration', 'values', 'pivot'],
    mins: 25,
    author: 'Vernon Coaching Team',
    date: 'May 26, 2026',
  },
  {
    id: 'res-15',
    type: 'Toolkit',
    title: 'Resilience Through Change Workbook',
    summary: 'Exercises for staying grounded and focused through uncertainty and setbacks.',
    category: 'Resilience',
    tags: ['resilience', 'pivot', 'wellbeing'],
    mins: 20,
    author: 'Vernon Coaching Team',
    date: 'May 12, 2026',
  },
  {
    id: 'res-16',
    type: 'Toolkit',
    title: 'Mock Interview Question Bank',
    summary: 'A bank of behavioural and technical questions, organised by role family, for practising out loud or with a peer.',
    category: 'Skills',
    tags: ['interview', 'practice', 'confidence'],
    mins: 15,
    author: 'Vernon Coaching Team',
    date: 'Jun 10, 2026',
  },
];

const STORAGE_KEY = 'vernon_resource_library';

function read(): LibraryResource[] {
  if (typeof window === 'undefined') return RESOURCE_LIBRARY;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as LibraryResource[]) : RESOURCE_LIBRARY;
  } catch {
    return RESOURCE_LIBRARY;
  }
}

function write(resources: LibraryResource[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

// The live resource library — seeded from RESOURCE_LIBRARY, then overlaid
// with any admin edits/additions/deletions made via the platform admin tools.
export function getResourceLibrary(): LibraryResource[] {
  return read();
}

export function createLibraryResource(input: Omit<LibraryResource, 'id'>): LibraryResource {
  const resource: LibraryResource = { ...input, id: `res-${Date.now()}` };
  write([resource, ...read()]);
  return resource;
}

export function updateLibraryResource(id: string, updates: Partial<Omit<LibraryResource, 'id'>>): LibraryResource[] {
  const updated = read().map((r) => (r.id === id ? { ...r, ...updates } : r));
  write(updated);
  return updated;
}

export function deleteLibraryResource(id: string): LibraryResource[] {
  const updated = read().filter((r) => r.id !== id);
  write(updated);
  return updated;
}

// Naive keyword match across title, summary, category and tags — a stand-in
// for an AI search step over the resource library.
export function searchResources(query: string): LibraryResource[] {
  const library = getResourceLibrary();
  const words = query.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2);

  const scored = library.map((resource) => {
    const haystack = [resource.title, resource.summary, resource.category, ...resource.tags].join(' ').toLowerCase();
    const score = words.reduce((acc, word) => acc + (haystack.includes(word) ? 1 : 0), 0);
    return { resource, score };
  });

  const matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.resource);

  return matched.length > 0 ? matched.slice(0, 4) : library.slice(0, 3);
}
