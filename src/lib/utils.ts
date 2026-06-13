// With `trailingSlash: true` (used for the GitHub Pages export), the App
// Router reflects the trailing slash in `usePathname()`, so comparisons
// against literal route paths like '/dashboard/clients' need this
// normalization to avoid mismatches.
export function normalizePathname(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}
