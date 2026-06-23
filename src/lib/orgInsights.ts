import {
  ACTIVE_MEMBERS, FEATURE_USAGE, COACHING_FREQUENCY, VI_VALUES, VI_READINESS, VI_FOCUS,
  REFLECTION_THEMES, LEARNING_TRACKS, RESOURCE_SENTIMENT, JOURNEY_BANDS,
} from './orgData';

type OrgInsight = { id: string; fieldIds: string[]; text: string };

// Deterministic, template-based narrative generation over the aggregate
// dataset — the org-dashboard equivalent of resourceInsights.ts, standing
// in for an AI model summarising themes and patterns rather than calling one.
function buildInsights(): OrgInsight[] {
  const topFeature = FEATURE_USAGE[0];
  const noSessions = COACHING_FREQUENCY.find((b) => b.label === 'No sessions yet')?.count ?? 0;
  const uptakePct = Math.round(((ACTIVE_MEMBERS - noSessions) / ACTIVE_MEMBERS) * 100);
  const topValue = VI_VALUES[0];
  const topReadiness = [...VI_READINESS].sort((a, b) => b.count - a.count)[0];
  const topFocus = [...VI_FOCUS].sort((a, b) => b.value - a.value)[0];
  const topTheme = [...REFLECTION_THEMES].sort((a, b) => b.value - a.value)[0];
  const topTrack = LEARNING_TRACKS[0];
  const helpfulPct = RESOURCE_SENTIMENT.find((s) => s.label === 'Marked helpful')?.value ?? 0;
  const topJourneyBand = [...JOURNEY_BANDS].sort((a, b) => b.count - a.count)[0];

  return [
    {
      id: 'feature-pattern', fieldIds: ['feature-usage'],
      text: `${topFeature.label} is the most active area of the platform, used by ${topFeature.value}% of members in the last 30 days — the clearest sign of where day-to-day value is landing.`,
    },
    {
      id: 'coaching-uptake', fieldIds: ['coaching-frequency', 'key-metrics'],
      text: `${uptakePct}% of members have booked at least one coaching session. The remaining ${noSessions} haven't taken that first step yet — a natural nudge list to share with your coaching team.`,
    },
    {
      id: 'vi-values-theme', fieldIds: ['vi-values'],
      text: `"${topValue.label}" is the work value members rank most highly on Vernon Insights, ahead of every other motivator — useful context when shaping group content or comms.`,
    },
    {
      id: 'vi-readiness-theme', fieldIds: ['vi-readiness'],
      text: `Most members describe themselves as "${topReadiness.label}" when asked about their readiness to make a move, suggesting the cohort skews toward active planning rather than early exploration.`,
    },
    {
      id: 'vi-focus-theme', fieldIds: ['vi-focus'],
      text: `The single biggest coaching focus members select is "${topFocus.label}" — worth checking that coaching capacity reflects this.`,
    },
    {
      id: 'reflection-theme', fieldIds: ['reflection-themes'],
      text: `"${topTheme.label}" prompts get the strongest response of any reflection theme, at ${topTheme.value}% engagement.`,
    },
    {
      id: 'learning-pattern', fieldIds: ['learning-tracks'],
      text: `${topTrack.label} is the learning track members start most often (${topTrack.value}%) — a good signal of where this cohort is in their journey overall.`,
    },
    {
      id: 'resource-sentiment-theme', fieldIds: ['resource-sentiment'],
      text: `${helpfulPct}% of rated resources are marked helpful, suggesting the library is broadly well-matched to what members need right now.`,
    },
    {
      id: 'journey-pattern', fieldIds: ['journey-bands'],
      text: `Most members (${topJourneyBand.count}) sit in the "${topJourneyBand.label}" band of their journey — useful for calibrating what "typical progress" looks like for this cohort.`,
    },
  ];
}

const ORG_INSIGHTS = buildInsights();

export function getOrgHighlightInsights(count = 4): string[] {
  return ORG_INSIGHTS.slice(0, count).map((i) => i.text);
}

export function getOrgFieldInsights(selectedIds: string[]): string[] {
  const matched = ORG_INSIGHTS.filter((i) => i.fieldIds.some((id) => selectedIds.includes(id)));
  if (matched.length === 0) {
    return ['Select one or more data fields above and run the report to generate Vernon AI insights.'];
  }
  return matched.map((i) => i.text);
}
