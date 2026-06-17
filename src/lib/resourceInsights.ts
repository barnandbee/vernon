import { RESOURCE_LIBRARY, type LibraryResource } from './resourceLibrary';
import type { ProfileReport } from './profile';

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

// Naive keyword overlap between a resource and the user's profile report —
// a stand-in for an AI model generating a narrative tailored to that resource.
export function getResourceInsight(resource: LibraryResource, profile: ProfileReport): string {
  const matches = matchedSkills(resource, profile.skills);
  if (matches.length > 0) {
    const skill = matches[0].toLowerCase();
    const framing = CATEGORY_FRAMING[resource.category];
    return framing ? framing(skill) : `Given your strength in ${skill}, this is worth a look.`;
  }
  const fallbackSkill = profile.skills[0]?.toLowerCase();
  return fallbackSkill
    ? `This sits a little outside your core strengths in ${fallbackSkill}, but it's a solid grounding in ${resource.category.toLowerCase()} worth having.`
    : `A solid grounding in ${resource.category.toLowerCase()}.`;
}

// Resources with the least overlap with the user's profile — surfaced as
// genuine exploration rather than more of the same.
export function getExplorationResources(profile: ProfileReport, excludeIds: string[] = [], count = 3): LibraryResource[] {
  const scored = RESOURCE_LIBRARY
    .filter((r) => !excludeIds.includes(r.id))
    .map((r) => ({ resource: r, score: matchedSkills(r, profile.skills).length }));

  return scored
    .sort((a, b) => a.score - b.score || a.resource.id.localeCompare(b.resource.id))
    .slice(0, count)
    .map((s) => s.resource);
}
