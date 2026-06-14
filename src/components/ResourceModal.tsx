'use client';

import type { ReactNode } from 'react';
import { X, Clock } from 'lucide-react';
import { TYPE_META, type LibraryResource } from '@/lib/resourceLibrary';

type ResourceModalProps = {
  resource: LibraryResource;
  onClose: () => void;
  footer?: ReactNode;
};

export default function ResourceModal({ resource, onClose, footer }: ResourceModalProps) {
  const meta = TYPE_META[resource.type];
  const Icon = meta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-6"
        style={{ background: 'var(--surface)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
            <Icon size={18} style={{ color: meta.color }} />
          </div>
          <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: meta.bg, color: meta.color }}>
            {meta.label}
          </span>
        </div>

        <h2 className="text-lg font-bold leading-snug mb-2 pr-6" style={{ color: 'var(--foreground)' }}>
          {resource.title}
        </h2>

        <div className="flex items-center gap-3 mb-4 flex-wrap text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{resource.author}</span>
          <span>{resource.date}</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {resource.mins} min {meta.verb}
          </span>
        </div>

        <span
          className="inline-block text-xs px-2.5 py-1 rounded-lg font-medium mb-4"
          style={{ background: 'var(--surface-muted)', color: 'var(--text-muted)' }}
        >
          {resource.category}
        </span>

        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--foreground)' }}>
          {resource.content ?? resource.summary}
        </p>

        {footer && (
          <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
