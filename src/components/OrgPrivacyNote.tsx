import { Building2 } from 'lucide-react';

type OrgPrivacyNoteProps = {
  shared: string;
  org?: string;
};

// Reminds members what's visible to their organisation (top-level engagement
// stats only) versus what always stays private, on every section that feeds
// the Organisation Dashboard.
export default function OrgPrivacyNote({ shared, org = 'your organisation' }: OrgPrivacyNoteProps) {
  return (
    <div className="rounded-xl px-4 py-2.5 flex items-start gap-2.5" style={{ background: 'var(--surface-muted)' }}>
      <Building2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Shared with {org}: </span>
        {shared}.{' '}
        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Never shared: </span>
        the content of what you write or say here.
      </p>
    </div>
  );
}
