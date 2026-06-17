const FEEDBACK_KEY = 'vernon_resource_feedback';

export type FeedbackValue = 'up' | 'down';

export function getResourceFeedback(): Record<string, FeedbackValue> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(FEEDBACK_KEY);
    return stored ? (JSON.parse(stored) as Record<string, FeedbackValue>) : {};
  } catch {
    return {};
  }
}

// Clicking the active thumb again clears the feedback.
export function setResourceFeedback(resourceId: string, value: FeedbackValue): Record<string, FeedbackValue> {
  const current = getResourceFeedback();
  const updated = { ...current };
  if (current[resourceId] === value) {
    delete updated[resourceId];
  } else {
    updated[resourceId] = value;
  }
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
  return updated;
}
