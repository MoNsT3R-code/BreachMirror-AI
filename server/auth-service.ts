import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export type AuthRole = 'Incident Commander' | 'Threat Hunter' | 'SOC Security Lead' | 'Cloud Security Architect';

export interface StoredUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: AuthRole;
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  failedAttempts: number;
  lockUntil: string | null;
  createdAt: string;
  updatedAt: string;
  passwordChangedAt: string;
}

interface AuditEntry {
  event: string;
  username?: string;
  timestamp: string;
  ip?: string;
  status?: 'success' | 'failed';
  reason?: string;
}

interface ResetRecord { userId: string; tokenHash: string; expiresAt: number; }

const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'auth-users.json');
const AUDIT_FILE = path.join(DATA_DIR, 'auth-audit.json');
const PASSWORD_ITERATIONS = 210_000;
const SESSION_TTL_MS = 30 * 60 * 1000;
const RESET_TTL_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;
const MAX_AUDIT_ENTRIES = 2_000;
const sessions = new Map<string, { userId: string; lastActivity: number }>();
const resetTokens = new Map<string, ResetRecord>();
const COMMON_PASSWORDS = new Set(['password', 'password123', 'password123!', 'qwerty', 'qwerty123', 'letmein', 'welcome', 'admin', 'admin123', 'changeme', 'iloveyou', '12345678', '123456789']);
const PASSWORD_POLICY_MESSAGE = 'Password must be 8-64 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
const COMPANY_EMAIL_MESSAGE = 'Only @stewart.com email addresses are allowed.';
const USERNAME_EMAIL_MESSAGE = 'Username must match your company email username.';
const CONFIRM_PASSWORD_MESSAGE = 'Passwords do not match. Please confirm your password.';

function ensureStorage(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]\n', 'utf8');
  if (!fs.existsSync(AUDIT_FILE)) fs.writeFileSync(AUDIT_FILE, '[]\n', 'utf8');
}
function readJson<T>(file: string, fallback: T): T { ensureStorage(); try { return JSON.parse(fs.readFileSync(file, 'utf8')) as T; } catch { return fallback; } }
function writeJson(file: string, value: unknown): void { const temporaryFile = `${file}.tmp`; fs.writeFileSync(temporaryFile, `${JSON.stringify(value, null, 2)}\n`, 'utf8'); fs.renameSync(temporaryFile, file); }
function users(): StoredUser[] { return readJson<StoredUser[]>(USERS_FILE, []); }
function saveUsers(value: StoredUser[]): void { writeJson(USERS_FILE, value); }
function normalize(value: string): string { return value.trim().toLowerCase(); }
function hashPassword(password: string, salt: Buffer, iterations = PASSWORD_ITERATIONS): string { return crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex'); }
function hashToken(token: string): string { return crypto.createHash('sha256').update(token).digest('hex'); }
function safeEqual(left: string, right: string): boolean { const leftBuffer = Buffer.from(left, 'hex'); const rightBuffer = Buffer.from(right, 'hex'); return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer); }
function audit(entry: AuditEntry): void { const entries = readJson<AuditEntry[]>(AUDIT_FILE, []); entries.push(entry); writeJson(AUDIT_FILE, entries.slice(-MAX_AUDIT_ENTRIES)); }

export function validatePassword(password: string, identifier = ''): string | null {
  if (password.length < 8 || password.length > 64) return PASSWORD_POLICY_MESSAGE;
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) return PASSWORD_POLICY_MESSAGE;
  const normalizedPassword = password.toLowerCase();
  const identifiers = identifier.toLowerCase().split(/\s+/).filter(value => value.length > 0);
  if (COMMON_PASSWORDS.has(normalizedPassword) || identifiers.some(value => normalizedPassword.includes(value))) return PASSWORD_POLICY_MESSAGE;
  return null;
}

export function createUser(input: { name: string; username: string; email: string; role: AuthRole; password: string; confirmPassword: string }, ip?: string): { ok: true; user: StoredUser } | { ok: false; message: string } {
  const name = input.name.trim(); const username = input.username.trim(); const email = normalize(input.email);
  if (name.length < 2 || name.length > 80) return { ok: false, message: 'Please check the registration details.' };
  if (!/^[^\s@]+@stewart\.com$/.test(email)) return { ok: false, message: COMPANY_EMAIL_MESSAGE };
  if (username !== email.slice(0, email.indexOf('@'))) return { ok: false, message: USERNAME_EMAIL_MESSAGE };
  if (!input.confirmPassword || input.password !== input.confirmPassword) return { ok: false, message: CONFIRM_PASSWORD_MESSAGE };
  const passwordError = validatePassword(input.password, `${username} ${email} ${name}`); if (passwordError) return { ok: false, message: passwordError };
  const storedUsers = users(); if (storedUsers.some(user => user.email === email || user.username === username)) return { ok: false, message: 'Unable to create this account.' };
  const now = new Date().toISOString(); const salt = crypto.randomBytes(16);
  const user: StoredUser = { id: crypto.randomUUID(), name, username, email, role: input.role, passwordHash: hashPassword(input.password, salt), passwordSalt: salt.toString('hex'), passwordIterations: PASSWORD_ITERATIONS, failedAttempts: 0, lockUntil: null, createdAt: now, updatedAt: now, passwordChangedAt: now };
  storedUsers.push(user); saveUsers(storedUsers); audit({ event: 'registration', username, timestamp: now, ip, status: 'success' }); return { ok: true, user };
}

export function authenticate(identifier: string, password: string, ip?: string): { ok: true; user: StoredUser; token: string } | { ok: false; message: string } {
  const login = normalize(identifier); const storedUsers = users(); const user = storedUsers.find(item => item.username === login || item.email === login); const now = new Date().toISOString();
  if (!user) { audit({ event: 'login', username: login.slice(0, 120), timestamp: now, ip, status: 'failed', reason: 'unregistered_username' }); return { ok: false, message: 'Username is not registered. Please register before logging in.' }; }
  if (user.lockUntil && Date.parse(user.lockUntil) > Date.now()) { audit({ event: 'login', username: user.username, timestamp: now, ip, status: 'failed', reason: 'locked' }); return { ok: false, message: 'Account temporarily locked due to multiple failed login attempts. Please try again later.' }; }
  if (user.lockUntil) user.lockUntil = null;
  const candidate = hashPassword(password, Buffer.from(user.passwordSalt, 'hex'), user.passwordIterations);
  if (!safeEqual(candidate, user.passwordHash)) { user.failedAttempts += 1; let reason = 'invalid_credentials'; if (user.failedAttempts >= 5) { user.lockUntil = new Date(Date.now() + LOCKOUT_MS).toISOString(); reason = 'lockout'; audit({ event: 'lockout', username: user.username, timestamp: now, ip, status: 'failed', reason }); } user.updatedAt = now; saveUsers(storedUsers); audit({ event: 'login', username: user.username, timestamp: now, ip, status: 'failed', reason }); return { ok: false, message: user.lockUntil ? 'Account temporarily locked due to multiple failed login attempts. Please try again later.' : 'Invalid username or password.' }; }
  user.failedAttempts = 0; user.lockUntil = null; user.updatedAt = now; saveUsers(storedUsers); const token = crypto.randomBytes(32).toString('base64url'); sessions.set(hashToken(token), { userId: user.id, lastActivity: Date.now() }); audit({ event: 'login', username: user.username, timestamp: now, ip, status: 'success' }); return { ok: true, user, token };
}

export function getSession(token: string | undefined, ip?: string): StoredUser | null { if (!token) return null; const key = hashToken(token); const session = sessions.get(key); if (!session) return null; if (Date.now() - session.lastActivity > SESSION_TTL_MS) { sessions.delete(key); audit({ event: 'session_expiry', timestamp: new Date().toISOString(), ip, status: 'failed', reason: 'inactivity' }); return null; } session.lastActivity = Date.now(); return users().find(user => user.id === session.userId) ?? null; }
export function logout(token: string | undefined, ip?: string): void { if (!token) return; const key = hashToken(token); const session = sessions.get(key); sessions.delete(key); audit({ event: 'logout', timestamp: new Date().toISOString(), ip, status: 'success', reason: session ? 'user_requested' : 'unknown_session' }); }
export function requestPasswordReset(identifier: string, ip?: string): string | null { const login = normalize(identifier); const user = users().find(item => item.email === login || item.username === login); audit({ event: 'password_reset_request', username: login.slice(0, 120), timestamp: new Date().toISOString(), ip, status: 'success' }); if (!user) return null; const token = crypto.randomBytes(32).toString('base64url'); resetTokens.set(hashToken(token), { userId: user.id, tokenHash: hashToken(token), expiresAt: Date.now() + RESET_TTL_MS }); if (process.env.NODE_ENV !== 'production') console.info(`[auth] development password reset token for ${user.username}: ${token}`); return token; }
export function confirmPasswordReset(token: string, password: string, ip?: string): boolean { const record = resetTokens.get(hashToken(token)); if (!record || record.expiresAt < Date.now()) return false; const storedUsers = users(); const user = storedUsers.find(item => item.id === record.userId); if (!user || validatePassword(password, user.email)) return false; const now = new Date().toISOString(); const salt = crypto.randomBytes(16); user.passwordSalt = salt.toString('hex'); user.passwordHash = hashPassword(password, salt); user.passwordIterations = PASSWORD_ITERATIONS; user.failedAttempts = 0; user.lockUntil = null; user.passwordChangedAt = now; user.updatedAt = now; saveUsers(storedUsers); resetTokens.delete(hashToken(token)); audit({ event: 'password_change', username: user.username, timestamp: now, ip, status: 'success', reason: 'reset' }); return true; }