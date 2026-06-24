// Reads the logged-in user id directly from localStorage (mirroring auth.tsx's
// own storage access) so per-user data modules can namespace their storage
// keys without creating a circular import with auth.tsx.
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('vernon_user');
    if (!stored) return null;
    const user = JSON.parse(stored) as { id?: string };
    return user.id ?? null;
  } catch {
    return null;
  }
}

export function namespacedKey(base: string): string {
  const id = getCurrentUserId();
  return id ? `${base}_${id}` : base;
}
