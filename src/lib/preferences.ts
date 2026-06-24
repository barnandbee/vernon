import { namespacedKey } from './currentUser';

const PREFERENCES_KEY = 'vernon_preferences';

export type Preferences = {
  aiTranscriptRecording: boolean;
  aiSuggestions: boolean;
  weeklyNewsletter: boolean;
  hideAiSuggestionsForClients: boolean;
  orgAiRecommendationsDisabled: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  aiTranscriptRecording: true,
  aiSuggestions: true,
  weeklyNewsletter: false,
  hideAiSuggestionsForClients: false,
  orgAiRecommendationsDisabled: false,
};

export function getPreferences(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(namespacedKey(PREFERENCES_KEY));
    if (!stored) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...(JSON.parse(stored) as Partial<Preferences>) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]): Preferences {
  const updated = { ...getPreferences(), [key]: value };
  localStorage.setItem(namespacedKey(PREFERENCES_KEY), JSON.stringify(updated));
  return updated;
}
