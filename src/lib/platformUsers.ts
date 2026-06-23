import type { AdminLevel } from './permissions';

export type PlatformAccountType = 'member' | 'org_staff' | 'coach' | 'platform_admin';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  accountType: PlatformAccountType;
  orgName?: string;
  adminLevel?: AdminLevel;
  status: 'active' | 'invited' | 'suspended';
  createdAt: string;
}

const STORAGE_KEY = 'vernon_platform_users';

const SEED_USERS: PlatformUser[] = [
  { id: 'user-jamie', name: 'Jamie Rivera', email: 'demo@vernon.app', role: 'Member · Demo Account', accountType: 'member', status: 'active', createdAt: '2 Jan 2026' },
  { id: 'user-priya', name: 'Priya Anand', email: 'org@vernon.app', role: 'Programme Lead · Lighthouse Partners', accountType: 'org_staff', orgName: 'Lighthouse Partners', status: 'active', createdAt: '14 Jan 2026' },
  { id: 'user-sarah', name: 'Sarah Mitchell', email: 'coach@vernon.app', role: 'Career Coach · Demo Account', accountType: 'coach', status: 'active', createdAt: '14 Jan 2026' },
  { id: 'user-jordan', name: 'Jordan Blake', email: 'admin@vernon.app', role: 'Platform Admin', accountType: 'platform_admin', adminLevel: 'super_admin', status: 'active', createdAt: '1 Jan 2026' },
  { id: 'user-maya', name: 'Maya Okonkwo', email: 'maya.okonkwo@lighthouse.org', role: 'Member', accountType: 'member', orgName: 'Lighthouse Partners', status: 'active', createdAt: '20 Jan 2026' },
  { id: 'user-tom', name: 'Tom Bracken', email: 'tom.bracken@brightpath.org', role: 'Member', accountType: 'member', orgName: 'BrightPath Trust', status: 'invited', createdAt: '3 Jun 2026' },
];

function read(): PlatformUser[] {
  if (typeof window === 'undefined') return SEED_USERS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as PlatformUser[]) : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

function write(users: PlatformUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getPlatformUsers(): PlatformUser[] {
  return read();
}

export function createPlatformUser(input: Omit<PlatformUser, 'id' | 'createdAt'>): PlatformUser {
  const user: PlatformUser = {
    ...input,
    id: `user-${Date.now()}`,
    createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  write([user, ...read()]);
  return user;
}

export function updatePlatformUser(id: string, updates: Partial<Omit<PlatformUser, 'id' | 'createdAt'>>): PlatformUser[] {
  const updated = read().map((u) => (u.id === id ? { ...u, ...updates } : u));
  write(updated);
  return updated;
}

export function deletePlatformUser(id: string): PlatformUser[] {
  const updated = read().filter((u) => u.id !== id);
  write(updated);
  return updated;
}
