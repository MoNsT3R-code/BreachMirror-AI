import type { StoredUser } from '../auth-service';

export type SecurityPermission = 'manage_endpoints' | 'manage_alerts' | 'view_audit' | 'manage_integrations';
export type SecurityRole = 'owner' | 'analyst' | 'administrator' | 'auditor';

function configured(name: string): Set<string> {
  return new Set((process.env[name] ?? '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean));
}

export function securityRole(user: Pick<StoredUser, 'username'>): SecurityRole {
  const username = user.username.toLowerCase();
  if (configured('BM_SECURITY_ADMINS').has(username)) return 'administrator';
  if (configured('BM_SECURITY_TEAM').has(username)) return 'analyst';
  if (configured('BM_SECURITY_AUDITORS').has(username)) return 'auditor';
  return 'owner';
}

export function can(user: Pick<StoredUser, 'username'>, permission: SecurityPermission): boolean {
  const role = securityRole(user);
  if (role === 'administrator') return true;
  if (role === 'analyst') return permission === 'manage_alerts' || permission === 'view_audit';
  if (role === 'auditor') return permission === 'view_audit';
  return permission === 'manage_endpoints' || permission === 'manage_alerts';
}
