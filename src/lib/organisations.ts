export interface Organisation {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  memberCount: number;
  plan: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'suspended';
  createdAt: string;
}

const STORAGE_KEY = 'vernon_organisations';

const SEED_ORGANISATIONS: Organisation[] = [
  { id: 'org-lighthouse', name: 'Lighthouse Partners', contactName: 'Priya Anand', contactEmail: 'org@vernon.app', memberCount: 86, plan: 'growth', status: 'active', createdAt: '14 Jan 2026' },
  { id: 'org-brightpath', name: 'BrightPath Trust', contactName: 'Tom Bracken', contactEmail: 'tom.bracken@brightpath.org', memberCount: 23, plan: 'starter', status: 'active', createdAt: '3 Mar 2026' },
  { id: 'org-northfield', name: 'Northfield Council', contactName: 'Dana Reyes', contactEmail: 'dana.reyes@northfield.gov.uk', memberCount: 154, plan: 'enterprise', status: 'active', createdAt: '18 Nov 2025' },
];

function read(): Organisation[] {
  if (typeof window === 'undefined') return SEED_ORGANISATIONS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Organisation[]) : SEED_ORGANISATIONS;
  } catch {
    return SEED_ORGANISATIONS;
  }
}

function write(organisations: Organisation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(organisations));
}

export function getOrganisations(): Organisation[] {
  return read();
}

export function createOrganisation(input: Omit<Organisation, 'id' | 'createdAt'>): Organisation {
  const organisation: Organisation = {
    ...input,
    id: `org-${Date.now()}`,
    createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  write([organisation, ...read()]);
  return organisation;
}

export function updateOrganisation(id: string, updates: Partial<Omit<Organisation, 'id' | 'createdAt'>>): Organisation[] {
  const updated = read().map((o) => (o.id === id ? { ...o, ...updates } : o));
  write(updated);
  return updated;
}

export function deleteOrganisation(id: string): Organisation[] {
  const updated = read().filter((o) => o.id !== id);
  write(updated);
  return updated;
}
