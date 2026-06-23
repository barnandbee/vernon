export type AdminLevel = 'super_admin' | 'admin' | 'editor' | 'viewer';

export type AdminCapability =
  | 'manage_users'
  | 'manage_organisations'
  | 'manage_resources'
  | 'manage_reports'
  | 'manage_permissions';

export const ADMIN_LEVELS: { value: AdminLevel; label: string; description: string }[] = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full access to every admin tool, including assigning permission levels to other admins.' },
  { value: 'admin', label: 'Admin', description: 'Can manage users, organisations, resources, and reports.' },
  { value: 'editor', label: 'Editor', description: 'Can edit resources and reports, but cannot manage users, organisations, or permissions.' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access across the admin section.' },
];

const CAPABILITIES_BY_LEVEL: Record<AdminLevel, AdminCapability[]> = {
  super_admin: ['manage_users', 'manage_organisations', 'manage_resources', 'manage_reports', 'manage_permissions'],
  admin: ['manage_users', 'manage_organisations', 'manage_resources', 'manage_reports'],
  editor: ['manage_resources', 'manage_reports'],
  viewer: [],
};

export const CAPABILITY_LABELS: Record<AdminCapability, string> = {
  manage_users: 'Manage users',
  manage_organisations: 'Manage organisations',
  manage_resources: 'Manage resources',
  manage_reports: 'Manage reports',
  manage_permissions: 'Manage permission levels',
};

export function hasCapability(level: AdminLevel | undefined, capability: AdminCapability): boolean {
  if (!level) return false;
  return CAPABILITIES_BY_LEVEL[level].includes(capability);
}

export function getCapabilities(level: AdminLevel | undefined): AdminCapability[] {
  if (!level) return [];
  return CAPABILITIES_BY_LEVEL[level];
}
