'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { normalizePathname } from '@/lib/utils';
import VernonLogo from '@/components/VernonLogo';
import {
  LayoutDashboard, Compass, BookOpen, CalendarDays, GraduationCap, Target, Lightbulb, Users, MessageCircle, Building2, Menu, X, LogOut, Sparkles, UserCog, FileBarChart
} from 'lucide-react';

type NavItem = { href: string; icon: LucideIcon; label: string; badge?: boolean };

const MEMBER_NAV: NavItem[] = [
  { href: '/dashboard',             icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/journey',     icon: Compass,         label: 'My Journey', badge: true },
  { href: '/dashboard/calendar',    icon: CalendarDays,    label: 'Calendar' },
  { href: '/dashboard/learning',    icon: GraduationCap,   label: 'Learning' },
  { href: '/dashboard/articles',    icon: BookOpen,        label: 'Resources' },
  { href: '/dashboard/practice',    icon: Target,          label: 'Practice' },
  { href: '/dashboard/reflections', icon: Lightbulb,       label: 'Reflections' },
  { href: '/dashboard/community',   icon: Users,           label: 'Community' },
  { href: '/dashboard/chat',        icon: MessageCircle,   label: 'Career Chat' },
  { href: '/dashboard/profile',     icon: UserCog,         label: 'Profile' },
];

const ORG_STAFF_NAV: NavItem[] = [
  { href: '/dashboard', icon: Building2, label: 'Organisation Dashboard' },
  { href: '/dashboard/reports', icon: FileBarChart, label: 'Reports' },
  { href: '/dashboard/profile', icon: UserCog, label: 'Profile' },
];

const COACH_NAV: NavItem[] = [
  { href: '/dashboard',            icon: LayoutDashboard, label: 'Coach Home' },
  { href: '/dashboard/clients',    icon: Users,           label: 'My Clients' },
  { href: '/dashboard/schedule',   icon: CalendarDays,    label: 'Schedule' },
  { href: '/dashboard/resources',  icon: Sparkles,        label: 'Resource Finder' },
  { href: '/dashboard/development', icon: GraduationCap,  label: 'CPD & Training' },
  { href: '/dashboard/profile',    icon: UserCog,         label: 'Profile' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = normalizePathname(usePathname());
  const router = useRouter();
  const { user, logout } = useAuth();
  const NAV = user?.accountType === 'org_staff' ? ORG_STAFF_NAV
    : user?.accountType === 'coach' ? COACH_NAV
    : MEMBER_NAV;

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
          <VernonLogo size={28} />
          <span className="font-bold font-playwrite" style={{ color: 'var(--primary)' }}>Vernon</span>
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
              <span className="font-bold text-lg font-playwrite" style={{ color: 'var(--primary)' }}>Vernon</span>
              <button onClick={() => setOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV.map(({ href, icon: Icon, label, badge }) => {
                const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                return (
                  <button
                    key={href}
                    onClick={() => go(href)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                    style={active ? { background: 'var(--primary)', color: '#fff' } : { color: 'var(--text-muted)' }}
                  >
                    <span className="relative inline-flex">
                      <Icon size={18} />
                      {badge && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />}
                    </span>
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
