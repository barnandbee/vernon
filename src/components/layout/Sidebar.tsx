'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { normalizePathname } from '@/lib/utils';
import VernonLogo from '@/components/VernonLogo';
import {
  LayoutDashboard, Compass, BookOpen, CalendarDays, GraduationCap, Target, Lightbulb, Users, MessageCircle, Building2, LogOut, ChevronRight, Sparkles
} from 'lucide-react';

type NavItem = { href: string; icon: LucideIcon; label: string; badge?: boolean };

const MEMBER_NAV: NavItem[] = [
  { href: '/dashboard',             icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/journey',     icon: Compass,         label: 'My Journey', badge: true },
  { href: '/dashboard/calendar',    icon: CalendarDays,    label: 'Coaching Calendar' },
  { href: '/dashboard/learning',    icon: GraduationCap,   label: 'Learning' },
  { href: '/dashboard/articles',    icon: BookOpen,        label: 'Resources' },
  { href: '/dashboard/practice',    icon: Target,          label: 'Practice' },
  { href: '/dashboard/reflections', icon: Lightbulb,       label: 'Reflections' },
  { href: '/dashboard/community',   icon: Users,           label: 'Community' },
  { href: '/dashboard/chat',        icon: MessageCircle,   label: 'Career Chat' },
];

const ORG_STAFF_NAV: NavItem[] = [
  { href: '/dashboard', icon: Building2, label: 'Organisation Dashboard' },
];

const COACH_NAV: NavItem[] = [
  { href: '/dashboard',            icon: LayoutDashboard, label: 'Coach Home' },
  { href: '/dashboard/clients',    icon: Users,           label: 'My Clients' },
  { href: '/dashboard/schedule',   icon: CalendarDays,    label: 'Schedule' },
  { href: '/dashboard/resources',  icon: Sparkles,        label: 'Resource Finder' },
  { href: '/dashboard/development', icon: GraduationCap,  label: 'CPD & Training' },
];

export default function Sidebar() {
  const pathname = normalizePathname(usePathname());
  const router = useRouter();
  const { user, logout } = useAuth();
  const NAV = user?.accountType === 'org_staff' ? ORG_STAFF_NAV
    : user?.accountType === 'coach' ? COACH_NAV
    : MEMBER_NAV;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside
      className="flex flex-col h-full w-64 border-r"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <VernonLogo size={32} />
        <div>
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--primary)' }}>Vernon</span>
          <p className="text-xs leading-none" style={{ color: 'var(--text-muted)' }}>Career Coaching</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
              style={active ? {
                background: 'var(--primary)',
                color: '#fff',
              } : {
                color: 'var(--text-muted)',
              }}
            >
              <span className="relative inline-flex">
                <Icon size={18} />
                {badge && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />}
              </span>
              <span className="flex-1 text-left">{label}</span>
              {active && <ChevronRight size={14} />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 space-y-1 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
            style={{ background: 'var(--surface-muted)' }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'var(--primary)' }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{user.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: 'var(--text-muted)' }}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
