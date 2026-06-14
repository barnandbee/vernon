const STORAGE_KEY = 'vernon_shared_notes';

export type SharedNote = {
  id: string;
  clientId: string;
  clientName: string;
  text: string;
  createdAt: string;
};

// Lets members send a note to their coach (e.g. from My Journey) and have it
// show up on the coach's client view — a lightweight stand-in for a real
// backend using localStorage, mirroring the `vernon_user` pattern in auth.tsx.
export function getSharedNotes(): SharedNote[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SharedNote[]) : [];
  } catch {
    return [];
  }
}

export function addSharedNote(clientId: string, clientName: string, text: string): SharedNote {
  const note: SharedNote = {
    id: `note-${Date.now()}`,
    clientId,
    clientName,
    text,
    createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  const updated = [note, ...getSharedNotes()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return note;
}
