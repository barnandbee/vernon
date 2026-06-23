'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getPlatformUsers, type PlatformUser } from '@/lib/platformUsers';
import { getOrganisations, type Organisation } from '@/lib/organisations';
import { getResourceLibrary } from '@/lib/resourceLibrary';
import { getVisibleReportFields, REPORT_FIELDS } from '@/lib/orgData';
import { ADMIN_LEVELS } from '@/lib/permissions';
import { Users, Building2, Library, FileBarChart, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [resourceCount, setResourceCount] = useState(0);
  const [enabledFieldCount, setEnabledFieldCount] = useState(0);

  useEffect(() => {
    setUsers(getPlatformUsers());
    setOrgs(getOrganisations());
    setResourceCount(getResourceLibrary().length);
    setEnabledFieldCount(getVisibleReportFields().length);
  }, []);

  const levelLabel = ADMIN_LEVELS.find((l) => l.value === user?.adminLevel)?.label ?? 'Admin';

  const STATS = [
    { label: 'Platform users', value: String(users.length), icon: Users, color: '#1d4ed8', bg: '#eff6ff' },
    { label: 'Organisations', value: String(orgs.length), icon: Building2, color: '#15803d', bg: '#f0fdf4' },
    { label: 'Library resources', value: String(resourceCount), icon: Library, color: '#c2410c', bg: '#fff7ed' },
    { label: 'Enabled report fields', value: `${enabledFieldCount}/${REPORT_FIELDS.length}`, icon: FileBarChart, color: '#7e22ce', bg: '#fdf4ff' },
  ];

  const QUICK_ACCESS = [
    { href: '/dashboard/admin/users', icon: Users, color: '#1d4ed8', bg: '#eff6ff', title: 'Users', desc: 'Add and manage platform users' },
    { href: '/dashboard/admin/organisations', icon: Building2, color: '#15803d', bg: '#f0fdf4', title: 'Organisations', desc: 'Add and manage organisations' },
    { href: '/dashboard/admin/resources', icon: Library, color: '#c2410c', bg: '#fff7ed', title: 'Resources', desc: 'Edit the shared resource library' },
    { href: '/dashboard/admin/reports', icon: FileBarChart, color: '#7e22ce', bg: '#fdf4ff', title: 'Report Fields', desc: 'Edit what org staff can see' },
    { href: '/dashboard/admin/permissions', icon: ShieldCheck, color: '#be185d', bg: '#fdf2f8', title: 'Permissions', desc: 'Manage admin permission levels' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          You&apos;re signed in as a {levelLabel} — here&apos;s what&apos;s happening across the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently added users */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Recently Added Users</h2>
            <button
              onClick={() => router.push('/dashboard/admin/users')}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--primary)' }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {users.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-muted)' }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--primary)' }}
                >
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{u.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{u.role}</p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0"
                  style={u.status === 'active' ? { background: '#f0fdf4', color: '#15803d' } : { background: '#fffbeb', color: '#a16207' }}
                >
                  {u.status === 'active' ? 'Active' : u.status === 'invited' ? 'Invited' : 'Suspended'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Organisations */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Organisations</h2>
            <button
              onClick={() => router.push('/dashboard/admin/organisations')}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--primary)' }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {orgs.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-muted)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f0fdf4' }}>
                  <Building2 size={16} style={{ color: '#15803d' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{o.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{o.memberCount} members · {o.plan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {QUICK_ACCESS.map(({ href, icon: Icon, color, bg, title, desc }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="text-left rounded-2xl p-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'var(--surface)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>{title}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
