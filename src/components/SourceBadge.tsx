import { Sparkles, UserRound } from 'lucide-react';

type SourceBadgeProps = {
  source: 'coach' | 'ai';
  label?: string;
};

// Visual shorthand used across the app to make it obvious whether something
// comes from a human coach or from Vernon's AI/digital prompts.
export default function SourceBadge({ source, label }: SourceBadgeProps) {
  const isCoach = source === 'coach';
  const Icon = isCoach ? UserRound : Sparkles;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium flex-shrink-0"
      style={{
        background: isCoach ? '#e8f4f8' : '#f5f3ff',
        color: isCoach ? 'var(--primary)' : '#7c3aed',
      }}
    >
      <Icon size={12} />
      {label ?? (isCoach ? 'From your coach' : 'Vernon AI')}
    </span>
  );
}
