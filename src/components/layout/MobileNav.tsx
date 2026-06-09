'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard, BookOpen, CalendarDays, Lightbulb, MessageCircle, Menu, X, LogOut
} from 'lucide-react';

const NAV = [
  { href: '/dashboard',             icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/articles',    icon: BookOpen,        label: 'Articles' },
  { href: '/dashboard/calendar',    icon: CalendarDays,    label: 'Calendar' },
  { href: '/dashboard/reflections', icon: Lightbulb,       label: 'Reflections' },
  { href: '/dashboard/chat',        icon: MessageCircle,   label: 'Career Chat' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <>
      <header
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#e8f4f8" />
            <path d="M12 13 L20 27 L28 13" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="20" cy="27" r="2.5" fill="var(--primary)" />
          </svg>
          <span className="font-bold" style={{ color: 'var(--primary)' }}>Vernon</span>
        </div>
        <button onClick={() => setOpen(true)} style={{ color: 'var(--text-muted)' }}>
          <Menu size={22} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div
            className="relative w-72 h-full flex flex-col shadow-2xl"
            style={{ background: 'var(--surface)' }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>Vernon</span>
              <button onClick={() => setOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                return (
                  <button
                    key={href}
                    onClick={() => go(href)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                    style={active ? { background: 'var(--primary)', color: '#fff' } : { color: 'var(--text-muted)' }}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                );
              })}
            </nav>
            {user && (
              <div className="px-3 pb-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => { logout(); router.push('/login'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
