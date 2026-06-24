import type { ResourceType } from './resourceLibrary';
import { namespacedKey } from './currentUser';

const BOOKMARKS_KEY = 'vernon_bookmarks';
const ASSIGNED_KEY = 'vernon_assigned_resources';
const HISTORY_KEY = 'vernon_activity_history';

const MAX_HISTORY = 30;

export type AssignedResource = {
  id: string;
  clientId: string;
  resourceId: string;
  assignedAt: string;
};

// A resource Sarah has already assigned to Jamie, so "Assigned by your
// coach" has something to show before the coach assigns anything new.
const SEED_ASSIGNED: AssignedResource[] = [
  { id: 'seed-assign-1', clientId: 'jamie-rivera', resourceId: 'res-5', assignedAt: '10 Jun 2026' },
];

export type ActivityAction = 'viewed' | 'bookmarked' | 'unbookmarked';

export type ActivityEntry = {
  id: string;
  resourceId: string;
  title: string;
  type: ResourceType;
  action: ActivityAction;
  date: string;
};

function read<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T[]) : [];
  } catch {
    return [];
  }
}

// Bookmarks — lets a member save resources to access again later.
export function getBookmarks(): string[] {
  return read<string>(namespacedKey(BOOKMARKS_KEY));
}

export function toggleBookmark(resourceId: string): string[] {
  const current = getBookmarks();
  const updated = current.includes(resourceId)
    ? current.filter((id) => id !== resourceId)
    : [...current, resourceId];
  localStorage.setItem(namespacedKey(BOOKMARKS_KEY), JSON.stringify(updated));
  return updated;
}

// Assigned resources — lets a coach assign a resource to a coachee, who then
// sees it under "Assigned by your coach".
export function getAssignedResources(): AssignedResource[] {
  if (typeof window === 'undefined') return SEED_ASSIGNED;
  return [...read<AssignedResource>(namespacedKey(ASSIGNED_KEY)), ...SEED_ASSIGNED];
}

export function assignResource(clientId: string, resourceId: string): AssignedResource[] {
  const entry: AssignedResource = {
    id: `assign-${Date.now()}`,
    clientId,
    resourceId,
    assignedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  const updated = [entry, ...read<AssignedResource>(namespacedKey(ASSIGNED_KEY))];
  localStorage.setItem(namespacedKey(ASSIGNED_KEY), JSON.stringify(updated));
  return [...updated, ...SEED_ASSIGNED];
}

// Activity history — a running log of what a member has viewed and bookmarked.
export function getActivityHistory(): ActivityEntry[] {
  return read<ActivityEntry>(namespacedKey(HISTORY_KEY));
}

export function logActivity(resourceId: string, title: string, type: ResourceType, action: ActivityAction): ActivityEntry[] {
  const entry: ActivityEntry = {
    id: `activity-${Date.now()}`,
    resourceId,
    title,
    type,
    action,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  const updated = [entry, ...getActivityHistory()].slice(0, MAX_HISTORY);
  localStorage.setItem(namespacedKey(HISTORY_KEY), JSON.stringify(updated));
  return updated;
}
