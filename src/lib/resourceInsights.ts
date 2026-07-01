import { getResourceLibrary, type LibraryResource } from './resourceLibrary';
import type { ProfileReport } from './profile';
import { FOCUS_OPTIONS, VALUE_OPTIONS, type DiagnosticAnswers, type ValueKey, type CoachingFocus } from './diagnostic';

// Maps each profile skill to the resource categories/tags it's most relevant
// to — a stand-in for an AI model drawing on a user's profile report to
// decide what to highlight about a given resource.
const SKILL_RELATED_TAGS: Record<string, string[]> = {
  'Communication': ['communication', 'storytelling', 'visibility', 'networking'],
  'Leadership': ['leadership', 'influence'],
  'Problem solving': ['mindset', 'setbacks', 'resilience'],
  'Project management': ['boundaries', 'work-life balance', 'practice'],
  'Strategic thinking': ['pivot', 'transition', 'career change'],
  'Negotiation': ['negotiation', 'pay', 'promotion', 'salary & negotiation'],
  'Coaching others': ['leadership', 'relationship', 'trust'],
  'Data analysis': ['practice', 'skills'],
  'Creativity': ['branding', 'storytelling'],
  'Adaptability': ['resilience', 'pivot', 'transition', 'wellbeing'],
  'Stakeholder management': ['relationship', 'trust', 'influence', 'networking'],
  'Public speaking': ['storytelling', 'confidence', 'body language', 'interview'],
};

// Maps each ranked Vernon Insights value to the resource tags it connects to.
const VALUE_RELATED_TAGS: Record<ValueKey, string[]> = {
  autonomy: ['boundaries', 'wellbeing'],
  impact: ['leadership', 'influence', 'career change'],
  stability: ['resilience', 'wellbeing', 'setbacks'],
  growth: ['pivot', 'transition', 'practice', 'skills'],
  recognition: ['visibility', 'branding', 'promotion'],
  collaboration: ['relationship', 'trust', 'networking', 'community'],
  creativity: ['branding', 'storytelling'],
  reward: ['pay', 'negotiation', 'promotion'],
};

// The resource category each Vernon Insights coaching focus points to most directly.
const FOCUS_CATEGORY: Record<CoachingFocus, string> = {
  advancing: 'Skills',
  'career-change': 'Career Change',
  leadership: 'Leadership',
  negotiation: 'Salary & Negotiation',
  'personal-development': 'Resilience',
  returning: 'Career Change',
};

const CATEGORY_FRAMING: Record<string, (skill: string) => string> = {
  'Career Change': (skill) => `You've highlighted ${skill} as one of your strengths — that's exactly the kind of transferable story to lean on as you think through this.`,
  'Leadership': (skill) => `Your profile points to ${skill} as a strength, so look for how this connects to the way you already lead.`,
  'Networking': (skill) => `Given your strength in ${skill}, you're well placed to make this approach feel natural rather than forced.`,
  'Salary & Negotiation': (skill) => `Your strength in ${skill} is a real asset here — bring it into how you frame your case.`,
  'Work-Life Balance': (skill) => `With ${skill} as one of your strengths, you likely already model some of this — this just gives you the language for it.`,
  'Resilience': (skill) => `Your strength in ${skill} is a good foundation to build this kind of resilience on.`,
  'Skills': (skill) => `This builds well on your existing strength in ${skill}.`,
};

function resourceKeywords(resource: LibraryResource): string[] {
  return [resource.category.toLowerCase(), ...resource.tags.map((t) => t.toLowerCase())];
}

function matchedSkills(resource: LibraryResource, skills: string[]): string[] {
  const keywords = resourceKeywords(resource);
  return skills.filter((skill) => (SKILL_RELATED_TAGS[skill] ?? []).some((tag) => keywords.includes(tag)));
}

function matchedValues(resource: LibraryResource, values: ValueKey[]): ValueKey[] {
  const keywords = resourceKeywords(resource);
  return values.filter((value) => VALUE_RELATED_TAGS[value].some((tag) => keywords.includes(tag)));
}

// Naive keyword overlap between a resource and the user's profile report and
// Vernon Insights diagnostic — a stand-in for an AI model generating a
// narrative tailored to that resource.
export function getResourceInsight(resource: LibraryResource, profile: ProfileReport, diagnostic?: DiagnosticAnswers | null): string {
  const skillMatches = matchedSkills(resource, profile.skills);
  if (skillMatches.length > 0) {
    const skill = skillMatches[0].toLowerCase();
    const framing = CATEGORY_FRAMING[resource.category];
    return framing ? framing(skill) : `Given your strength in ${skill}, this is worth a look.`;
  }

  if (diagnostic) {
    if (FOCUS_CATEGORY[diagnostic.focus] === resource.category) {
      const focusLabel = (FOCUS_OPTIONS.find((o) => o.key === diagnostic.focus)?.label ?? '').toLowerCase();
      return `This lines up with what your Vernon Insights flagged as your focus right now — ${focusLabel}.`;
    }
    const valueMatches = matchedValues(resource, diagnostic.values);
    if (valueMatches.length > 0) {
      const valueLabel = (VALUE_OPTIONS.find((o) => o.key === valueMatches[0])?.label ?? '').toLowerCase();
      return `You ranked ${valueLabel} highly in your Vernon Insights — this speaks directly to that.`;
    }
  }

  const fallbackSkill = profile.skills[0]?.toLowerCase();
  return fallbackSkill
    ? `This sits a little outside your core strengths in ${fallbackSkill}, but it's a solid grounding in ${resource.category.toLowerCase()} worth having.`
    : `A solid grounding in ${resource.category.toLowerCase()}.`;
}

// Resources with the least overlap with the user's profile and Vernon
// Insights — surfaced as genuine exploration rather than more of the same.
export function getExplorationResources(
  profile: ProfileReport,
  excludeIds: string[] = [],
  count = 3,
  diagnostic?: DiagnosticAnswers | null,
  sourceLibrary?: LibraryResource[],
): LibraryResource[] {
  const scored = (sourceLibrary ?? getResourceLibrary())
    .filter((r) => !excludeIds.includes(r.id))
    .map((r) => {
      const skillScore = matchedSkills(r, profile.skills).length;
      const diagnosticScore = diagnostic
        ? matchedValues(r, diagnostic.values).length + (FOCUS_CATEGORY[diagnostic.focus] === r.category ? 1 : 0)
        : 0;
      return { resource: r, score: skillScore + diagnosticScore };
    });

  return scored
    .sort((a, b) => a.score - b.score || a.resource.id.localeCompare(b.resource.id))
    .slice(0, count)
    .map((s) => s.resource);
}
