import crypto from 'node:crypto';
import { appendAudit, AuditEvent } from './security/audit-log';
import { hashPassword, verifyPassword } from './security/password';
import { hmac, readSecureJson, writeSecureJson } from './security/secure-store';

export type AuthRole = 'Incident Commander' | 'Threat Hunter' | 'SOC Security Lead' | 'Cloud Security Architect';

export interface StoredUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: AuthRole;
  /** scrypt$N$r$p$salt$hash, or a legacy PBKDF2 hex hash (upgraded on next login). */
  passwordHash: string;
  passwordSalt?: string;
  passwordIterations?: number;
  failedAttempts: number;
  lockUntil: string | null;
  createdAt: string;
  updatedAt: string;
  passwordChangedAt: string;
  /** Employee details shared with the Security Team when a question is escalated. */
  profile?: EmployeeProfile;
  /** Pseudonymous Security Team ID (e.g. SEC-1042). The only agent identifier users ever see. */
  securityAgentId?: string;
}

export interface EmployeeProfile {
  employeeId: string;
  department: string;
  businessUnit: string;
  phone: string;
  /** Whether the Security Team may see this person's email address and phone number. */
  shareContact: boolean;
  updatedAt: string;
}

/** What the browser learns about the signed-in user. */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  isSecurityAgent: boolean;
  securityAgentId?: string;
}

interface Session {
  userId: string;
  createdAt: number;
  lastActivity: number;
  /** HMAC of the browser user agent: a stolen cookie used from another browser is rejected. */
  agent: string;
}

interface ResetRecord {
  userId: string;
  expiresAt: number;
}

const USERS_FILE = 'auth-users.json';
const SESSION_IDLE_MS = 30 * 60 * 1000;
const SESSION_ABSOLUTE_MS = 8 * 60 * 60 * 1000;
const RESET_TTL_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const sessions = new Map<string, Session>();
const resetTokens = new Map<string, ResetRecord>();
const COMMON_PASSWORDS = new Set(['password', 'password123', 'password123!', 'qwerty', 'qwerty123', 'letmein', 'welcome', 'admin', 'admin123', 'changeme', 'iloveyou', '12345678', '123456789']);
const PASSWORD_POLICY_MESSAGE = 'Password must be 8-64 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
const COMPANY_EMAIL_MESSAGE = 'Only @xyz.com email addresses are allowed.';
const USERNAME_EMAIL_MESSAGE = 'Username must match your company email username.';
const CONFIRM_PASSWORD_MESSAGE = 'Passwords do not match. Please confirm your password.';

let cachedDummy: string | null = null;
function dummyHash(): string {
  cachedDummy ??= hashPassword(crypto.randomBytes(16).toString('hex'));
  return cachedDummy;
}

function users(): StoredUser[] {
  return readSecureJson<StoredUser[]>(USERS_FILE, []);
}
function saveUsers(value: StoredUser[]): void {
  writeSecureJson(USERS_FILE, value);
}
function normalize(value: string): string {
  return value.trim().toLowerCase();
}
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
function agentHash(userAgent?: string): string {
  return hmac(`ua:${userAgent ?? ''}`);
}
function audit(event: Omit<AuditEvent, 'ipHash'>, ip?: string): void {
  appendAudit({ ...event, ipHash: ip ? hmac(`ip:${ip}`).slice(0, 16) : undefined });
}

export function validatePassword(password: string, identifier = ''): string | null {
  if (password.length < 8 || password.length > 64) return PASSWORD_POLICY_MESSAGE;
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) return PASSWORD_POLICY_MESSAGE;
  const normalizedPassword = password.toLowerCase();
  const identifiers = identifier.toLowerCase().split(/\s+/).filter(value => value.length > 0);
  if (COMMON_PASSWORDS.has(normalizedPassword) || identifiers.some(value => normalizedPassword.includes(value))) return PASSWORD_POLICY_MESSAGE;
  return null;
}

export function createUser(input: { name: string; username: string; email: string; role: AuthRole; password: string; confirmPassword: string }, ip?: string): { ok: true; user: StoredUser } | { ok: false; message: string } {
  const name = input.name.trim();
  const username = input.username.trim();
  const email = normalize(input.email);
  if (name.length < 2 || name.length > 80) return { ok: false, message: 'Please check the registration details.' };
  if (!/^[^\s@]+@xyz\.com$/.test(email)) return { ok: false, message: COMPANY_EMAIL_MESSAGE };
  if (username !== email.slice(0, email.indexOf('@'))) return { ok: false, message: USERNAME_EMAIL_MESSAGE };
  if (!input.confirmPassword || input.password !== input.confirmPassword) return { ok: false, message: CONFIRM_PASSWORD_MESSAGE };
  const passwordError = validatePassword(input.password, `${username} ${email} ${name}`);
  if (passwordError) return { ok: false, message: passwordError };
  const storedUsers = users();
  if (storedUsers.some(user => user.email === email || user.username === username)) return { ok: false, message: 'Unable to create this account.' };
  const now = new Date().toISOString();
  const user: StoredUser = { id: crypto.randomUUID(), name, username, email, role: input.role, passwordHash: hashPassword(input.password), failedAttempts: 0, lockUntil: null, createdAt: now, updatedAt: now, passwordChangedAt: now };
  storedUsers.push(user);
  saveUsers(storedUsers);
  audit({ event: 'registration', username, status: 'success' }, ip);
  return { ok: true, user };
}

export function authenticate(identifier: string, password: string, ip?: string, userAgent?: string): { ok: true; user: StoredUser; token: string } | { ok: false; message: string } {
  const login = normalize(identifier);
  const storedUsers = users();
  const user = storedUsers.find(item => item.username === login || item.email === login);
  const now = new Date().toISOString();
  if (!user) {
    // Spend comparable time to a real check so response timing does not reveal which usernames exist.
    verifyPassword(password, { passwordHash: dummyHash() });
    audit({ event: 'login', username: login.slice(0, 120), status: 'failed', reason: 'unregistered_username' }, ip);
    return { ok: false, message: 'Username is not registered. Please register before logging in.' };
  }
  if (user.lockUntil && Date.parse(user.lockUntil) > Date.now()) {
    audit({ event: 'login', username: user.username, status: 'failed', reason: 'locked' }, ip);
    return { ok: false, message: 'Account temporarily locked due to multiple failed login attempts. Please try again later.' };
  }
  if (user.lockUntil) user.lockUntil = null;

  const result = verifyPassword(password, user);
  if (!result.ok) {
    user.failedAttempts += 1;
    let reason = 'invalid_credentials';
    if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCKOUT_MS).toISOString();
      reason = 'lockout';
      audit({ event: 'lockout', username: user.username, status: 'failed', reason }, ip);
    }
    user.updatedAt = now;
    saveUsers(storedUsers);
    audit({ event: 'login', username: user.username, status: 'failed', reason }, ip);
    return { ok: false, message: user.lockUntil ? 'Account temporarily locked due to multiple failed login attempts. Please try again later.' : 'Invalid username or password.' };
  }

  if (result.needsRehash) {
    user.passwordHash = hashPassword(password);
    delete user.passwordSalt;
    delete user.passwordIterations;
    audit({ event: 'password_rehash', username: user.username, status: 'success', reason: 'upgraded_to_scrypt' }, ip);
  }
  user.failedAttempts = 0;
  user.lockUntil = null;
  user.updatedAt = now;
  saveUsers(storedUsers);
  const token = crypto.randomBytes(32).toString('base64url');
  const time = Date.now();
  sessions.set(hashToken(token), { userId: user.id, createdAt: time, lastActivity: time, agent: agentHash(userAgent) });
  audit({ event: 'login', username: user.username, status: 'success' }, ip);
  return { ok: true, user, token };
}

export function getSession(token: string | undefined, ip?: string, userAgent?: string): StoredUser | null {
  if (!token) return null;
  const key = hashToken(token);
  const session = sessions.get(key);
  if (!session) return null;
  const now = Date.now();
  const expiredReason = now - session.lastActivity > SESSION_IDLE_MS ? 'inactivity' : now - session.createdAt > SESSION_ABSOLUTE_MS ? 'absolute_lifetime' : session.agent !== agentHash(userAgent) ? 'agent_mismatch' : null;
  if (expiredReason) {
    sessions.delete(key);
    audit({ event: 'session_expiry', status: 'failed', reason: expiredReason }, ip);
    return null;
  }
  session.lastActivity = now;
  return users().find(user => user.id === session.userId) ?? null;
}

export function logout(token: string | undefined, ip?: string): void {
  if (!token) return;
  const key = hashToken(token);
  const session = sessions.get(key);
  sessions.delete(key);
  audit({ event: 'logout', status: 'success', reason: session ? 'user_requested' : 'unknown_session' }, ip);
}

export function requestPasswordReset(identifier: string, ip?: string): string | null {
  const login = normalize(identifier);
  const user = users().find(item => item.email === login || item.username === login);
  audit({ event: 'password_reset_request', username: login.slice(0, 120), status: 'success' }, ip);
  if (!user) return null;
  const token = crypto.randomBytes(32).toString('base64url');
  resetTokens.set(hashToken(token), { userId: user.id, expiresAt: Date.now() + RESET_TTL_MS });
  if (process.env.NODE_ENV !== 'production') console.info(`[auth] development password reset token for ${user.username}: ${token}`);
  return token;
}

export function confirmPasswordReset(token: string, password: string, ip?: string): boolean {
  const record = resetTokens.get(hashToken(token));
  if (!record || record.expiresAt < Date.now()) return false;
  const storedUsers = users();
  const user = storedUsers.find(item => item.id === record.userId);
  if (!user || validatePassword(password, user.email)) return false;
  const now = new Date().toISOString();
  user.passwordHash = hashPassword(password);
  delete user.passwordSalt;
  delete user.passwordIterations;
  user.failedAttempts = 0;
  user.lockUntil = null;
  user.passwordChangedAt = now;
  user.updatedAt = now;
  saveUsers(storedUsers);
  resetTokens.delete(hashToken(token));
  // A password change ends every existing session for that user.
  for (const [key, session] of sessions) if (session.userId === user.id) sessions.delete(key);
  audit({ event: 'password_change', username: user.username, status: 'success', reason: 'reset' }, ip);
  return true;
}

/* ------------------------------------------------------------------ profiles and the Security Team */

/**
 * Security Team membership is configured by the operator (BM_SECURITY_TEAM, comma-separated
 * usernames), never self-selected: the role picked at registration grants nothing.
 */
export function isSecurityAgent(user: Pick<StoredUser, 'username'>): boolean {
  return (process.env.BM_SECURITY_TEAM ?? '')
    .split(',')
    .map(value => normalize(value))
    .filter(Boolean)
    .includes(user.username.toLowerCase());
}

/** Gives a Security Team member a stable, unique pseudonymous ID the first time it is needed. */
export function ensureSecurityAgentId(userId: string): string | null {
  const storedUsers = users();
  const user = storedUsers.find(item => item.id === userId);
  if (!user || !isSecurityAgent(user)) return null;
  if (user.securityAgentId) return user.securityAgentId;
  const taken = new Set(storedUsers.map(item => item.securityAgentId).filter(Boolean));
  let id = '';
  do id = `SEC-${crypto.randomInt(1000, 10000)}`;
  while (taken.has(id));
  user.securityAgentId = id;
  user.updatedAt = new Date().toISOString();
  saveUsers(storedUsers);
  audit({ event: 'security_agent_id_assigned', username: user.username, status: 'success', reason: id });
  return id;
}

/** Active Security Team members (each with an agent ID). */
export function securityAgents(): Array<{ userId: string; agentId: string }> {
  return users()
    .filter(user => isSecurityAgent(user))
    .map(user => ({ userId: user.id, agentId: ensureSecurityAgentId(user.id) as string }));
}

export function getUserById(id: string): StoredUser | undefined {
  return users().find(user => user.id === id);
}

export function publicUser(user: StoredUser): PublicUser {
  const agent = isSecurityAgent(user);
  return { id: user.id, name: user.name, email: user.email, role: user.role, isSecurityAgent: agent, securityAgentId: agent ? ensureSecurityAgentId(user.id) ?? undefined : undefined };
}

const PROFILE_TEXT = /^[\p{L}\p{N} &.,'()/-]{0,80}$/u;

export function updateProfile(userId: string, input: { employeeId: string; department: string; businessUnit: string; phone: string; shareContact: boolean }): { ok: true; profile: EmployeeProfile } | { ok: false; message: string } {
  const employeeId = input.employeeId.trim().toUpperCase();
  const department = input.department.trim();
  const businessUnit = input.businessUnit.trim();
  const phone = input.phone.trim();
  if (employeeId && !/^[A-Z0-9-]{3,20}$/.test(employeeId)) return { ok: false, message: 'Employee ID can contain 3-20 letters, numbers and dashes.' };
  if (!PROFILE_TEXT.test(department) || !PROFILE_TEXT.test(businessUnit)) return { ok: false, message: 'Department and business unit can be up to 80 characters.' };
  if (phone && !/^[+()0-9 .-]{7,25}$/.test(phone)) return { ok: false, message: 'Enter a valid phone number, or leave it blank.' };
  const storedUsers = users();
  const user = storedUsers.find(item => item.id === userId);
  if (!user) return { ok: false, message: 'Account not found.' };
  const profile: EmployeeProfile = { employeeId, department, businessUnit, phone, shareContact: Boolean(input.shareContact), updatedAt: new Date().toISOString() };
  user.profile = profile;
  user.updatedAt = profile.updatedAt;
  saveUsers(storedUsers);
  audit({ event: 'profile_update', username: user.username, status: 'success', reason: profile.shareContact ? 'contact_shared' : 'contact_private' });
  return { ok: true, profile };
}

/** Internal session lookup for the RAG memory thread id (never exposes the token). */
export function sessionThreadId(token: string | undefined): string | null {
  return token ? hmac(`thread:${hashToken(token)}`).slice(0, 32) : null;
}
