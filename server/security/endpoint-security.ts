import crypto from 'node:crypto';
import { appendAudit } from './audit-log';
import { readSecureJson, writeSecureJson } from './secure-store';
import { enqueueNotification, type NotificationChannel } from './notification-outbox';

export type EndpointSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EndpointMetadata {
  deviceName: string;
  platform: string;
  version: string;
  region?: string;
}

export interface SecurityAlert {
  id: string;
  endpointId: string;
  ownerId: string;
  createdAt: string;
  severity: EndpointSeverity;
  eventType: string;
  summary: string;
  metadata: EndpointMetadata;
  status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';
  policyAcknowledged: boolean;
  history: Array<{ status: SecurityAlert['status']; actorId: string; at: string }>;
}

interface Endpoint {
  id: string;
  ownerId: string;
  metadata: EndpointMetadata;
  certFingerprintHash: string;
  bootstrapTokenHash: string;
  bootstrapUsedAt?: string;
  accessTokenHash?: string;
  accessTokenExpiresAt?: number;
  consentedAt: string;
  policyAcknowledgedAt?: string;
  revokedAt?: string;
  processedEventKeys: string[];
}

interface SecurityFile {
  endpoints: Endpoint[];
  alerts: SecurityAlert[];
}

interface EnrollmentInput {
  deviceName: string;
  platform: string;
  version: string;
  region?: string;
  certFingerprint: string;
}

interface EventInput {
  endpointId: string;
  eventType: string;
  severity: EndpointSeverity;
  summary: string;
  metadata?: Partial<EndpointMetadata>;
  remediationRequested?: boolean;
  idempotencyKey?: string;
}

type Result<T> = { ok: true; value: T } | { ok: false; status: number; message: string };
const FILE = 'endpoint-security.json';
const TOKEN_TTL_MS = 15 * 60 * 1000;
const MAX_ALERTS = 2_000;
const MAX_TEXT = 300;
const EVENT_TYPES = new Set(['suspicious_login', 'malware_detected', 'credential_exposure', 'policy_violation', 'unknown']);

const fail = (status: number, message: string): Result<never> => ({ ok: false, status, message });
const now = () => new Date().toISOString();
const hash = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
const clean = (value: unknown, max = MAX_TEXT): string | null => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max ? value.trim() : null;

function load(): SecurityFile {
  return readSecureJson<SecurityFile>(FILE, { endpoints: [], alerts: [] });
}

function save(file: SecurityFile): void {
  writeSecureJson(FILE, file);
}

function queueNotifications(alert: SecurityAlert): void {
  const destinations: Array<[NotificationChannel, string | undefined]> = [
    ['email', process.env.BM_ALERT_EMAIL],
    ['slack', process.env.BM_ALERT_SLACK_WEBHOOK],
    ['teams', process.env.BM_ALERT_TEAMS_WEBHOOK],
  ];
  destinations.forEach(([channel, destination]) => {
    if (destination) enqueueNotification(channel, destination, { alertId: alert.id, severity: alert.severity, summary: alert.summary });
  });
}

function validFingerprint(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}

function sanitizeMetadata(input: Partial<EndpointMetadata>): EndpointMetadata | null {
  const deviceName = clean(input.deviceName, 100);
  const platform = clean(input.platform, 60);
  const version = clean(input.version, 60);
  const region = input.region === undefined ? undefined : clean(input.region, 80);
  return deviceName && platform && version && (input.region === undefined || region) ? { deviceName, platform, version, region: region ?? undefined } : null;
}

export function createEnrollment(ownerId: string, input: EnrollmentInput): Result<{ endpointId: string; enrollmentToken: string; expiresAt: string }> {
  const metadata = sanitizeMetadata(input);
  if (!metadata || !validFingerprint(input.certFingerprint)) return fail(400, 'Provide valid device metadata and a SHA-256 client certificate fingerprint.');
  const token = crypto.randomBytes(32).toString('base64url');
  const endpointId = `END-${crypto.randomBytes(6).toString('hex')}`;
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const file = load();
  file.endpoints.push({
    id: endpointId,
    ownerId,
    metadata,
    certFingerprintHash: hash(input.certFingerprint.toLowerCase()),
    bootstrapTokenHash: hash(token),
    consentedAt: now(),
    processedEventKeys: [],
  });
  save(file);
  appendAudit({ event: 'endpoint_enrollment', username: ownerId, status: 'success', reason: endpointId });
  return { ok: true, value: { endpointId, enrollmentToken: token, expiresAt: new Date(expiresAt).toISOString() } };
}

export function registerEndpoint(token: string | null, fingerprint: string | null, endpointId: string): Result<{ accessToken: string; expiresAt: string }> {
  if (!token || !fingerprint || !validFingerprint(fingerprint)) return fail(401, 'Enrollment authentication failed.');
  const file = load();
  const endpoint = file.endpoints.find(item => item.id === endpointId && item.bootstrapTokenHash === hash(token) && item.certFingerprintHash === hash(fingerprint.toLowerCase()));
  if (!endpoint || endpoint.revokedAt || endpoint.bootstrapUsedAt) return fail(401, 'Enrollment token is invalid or has already been used.');
  const accessToken = crypto.randomBytes(32).toString('base64url');
  endpoint.bootstrapUsedAt = now();
  endpoint.accessTokenHash = hash(accessToken);
  endpoint.accessTokenExpiresAt = Date.now() + TOKEN_TTL_MS;
  save(file);
  appendAudit({ event: 'endpoint_registered', username: endpoint.ownerId, status: 'success', reason: endpoint.id });
  return { ok: true, value: { accessToken, expiresAt: new Date(endpoint.accessTokenExpiresAt).toISOString() } };
}

function authenticateAgent(token: string | null, fingerprint: string | null): Endpoint | null {
  if (!token || !fingerprint || !validFingerprint(fingerprint)) return null;
  const endpoint = load().endpoints.find(item => item.accessTokenHash === hash(token) && item.certFingerprintHash === hash(fingerprint.toLowerCase()));
  return endpoint && !endpoint.revokedAt && Boolean(endpoint.accessTokenExpiresAt && endpoint.accessTokenExpiresAt >= Date.now()) ? endpoint : null;
}

export function ingestEvent(token: string | null, fingerprint: string | null, input: EventInput): Result<{ alert: SecurityAlert | null }> {
  const endpoint = authenticateAgent(token, fingerprint);
  if (!endpoint || endpoint.id !== input.endpointId) return fail(401, 'Endpoint authentication failed.');
  const eventType = clean(input.eventType, 50);
  const summary = clean(input.summary);
  if (!eventType || !EVENT_TYPES.has(eventType) || !summary || !['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(input.severity)) return fail(400, 'Invalid security event.');
  if (input.remediationRequested && !endpoint.policyAcknowledgedAt) return fail(403, 'Policy acknowledgment is required before remediation actions.');
  const eventKey = clean(input.idempotencyKey, 120);
  if (eventKey && endpoint.processedEventKeys.includes(eventKey)) return { ok: true, value: { alert: null } };
  const metadata = sanitizeMetadata({ ...endpoint.metadata, ...input.metadata }) ?? endpoint.metadata;
  const alert: SecurityAlert | null = input.severity === 'HIGH' || input.severity === 'CRITICAL'
    ? { id: `ALT-${crypto.randomBytes(6).toString('hex')}`, endpointId: endpoint.id, ownerId: endpoint.ownerId, createdAt: now(), severity: input.severity, eventType, summary, metadata, status: 'OPEN', policyAcknowledged: Boolean(endpoint.policyAcknowledgedAt), history: [{ status: 'OPEN', actorId: endpoint.ownerId, at: now() }] }
    : null;
  const file = load();
  if (eventKey) endpoint.processedEventKeys = [...endpoint.processedEventKeys, eventKey].slice(-500);
  if (alert) file.alerts = [...file.alerts, alert].slice(-MAX_ALERTS);
  save(file);
  if (alert) queueNotifications(alert);
  appendAudit({ event: 'endpoint_event', username: endpoint.ownerId, status: 'success', reason: eventType });
  return { ok: true, value: { alert } };
}

export function acknowledgePolicy(ownerId: string): Result<{ ok: true }> {
  const file = load();
  const owned = file.endpoints.filter(endpoint => endpoint.ownerId === ownerId && !endpoint.revokedAt);
  if (owned.length === 0) return fail(404, 'Enroll an endpoint before acknowledging the policy.');
  const timestamp = now();
  owned.forEach(endpoint => { endpoint.policyAcknowledgedAt = timestamp; });
  file.alerts.forEach(alert => { if (alert.ownerId === ownerId) alert.policyAcknowledged = true; });
  save(file);
  appendAudit({ event: 'endpoint_policy_acknowledged', username: ownerId, status: 'success' });
  return { ok: true, value: { ok: true } };
}

export function rotateEnrollment(ownerId: string, endpointId: string): Result<{ enrollmentToken: string; expiresAt: string }> {
  const file = load();
  const endpoint = file.endpoints.find(item => item.id === endpointId && item.ownerId === ownerId && !item.revokedAt);
  if (!endpoint) return fail(404, 'Endpoint not found.');
  const token = crypto.randomBytes(32).toString('base64url');
  endpoint.bootstrapTokenHash = hash(token);
  endpoint.bootstrapUsedAt = undefined;
  endpoint.accessTokenHash = undefined;
  endpoint.accessTokenExpiresAt = undefined;
  save(file);
  appendAudit({ event: 'endpoint_token_rotated', username: ownerId, status: 'success', reason: endpointId });
  return { ok: true, value: { enrollmentToken: token, expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString() } };
}

export function revokeEndpoint(ownerId: string, endpointId: string): Result<{ ok: true }> {
  const file = load();
  const endpoint = file.endpoints.find(item => item.id === endpointId && item.ownerId === ownerId && !item.revokedAt);
  if (!endpoint) return fail(404, 'Endpoint not found.');
  endpoint.revokedAt = now();
  save(file);
  appendAudit({ event: 'endpoint_revoked', username: ownerId, status: 'success', reason: endpointId });
  return { ok: true, value: { ok: true } };
}

export function updateAlert(ownerId: string, alertId: string, status: SecurityAlert['status']): Result<{ ok: true }> {
  const file = load();
  const alert = file.alerts.find(item => item.id === alertId && item.ownerId === ownerId);
  if (!alert) return fail(404, 'Alert not found.');
  const allowed: Record<SecurityAlert['status'], SecurityAlert['status'][]> = {
    OPEN: ['INVESTIGATING'],
    INVESTIGATING: ['CONTAINED', 'RESOLVED'],
    CONTAINED: ['RESOLVED'],
    RESOLVED: ['OPEN'],
  };
  if (!allowed[alert.status].includes(status)) return fail(409, `Cannot move alert from ${alert.status} to ${status}.`);
  alert.status = status;
  alert.history.push({ status, actorId: ownerId, at: now() });
  save(file);
  appendAudit({ event: 'alert_status_changed', username: ownerId, status: 'success', reason: `${alertId}:${status}` });
  return { ok: true, value: { ok: true } };
}

export function recordExternalAlert(ownerId: string, eventType: string, severity: EndpointSeverity, summary: string, idempotencyKey: string): Result<{ alert: SecurityAlert | null }> {
  const file = load();
  const existing = file.alerts.find(alert => alert.ownerId === ownerId && alert.summary === `[${idempotencyKey}] ${summary}`);
  if (existing) return { ok: true, value: { alert: existing } };
  const alert: SecurityAlert = { id: `ALT-${crypto.randomBytes(6).toString('hex')}`, endpointId: 'github', ownerId, createdAt: now(), severity, eventType, summary: `[${idempotencyKey}] ${summary}`, metadata: { deviceName: 'GitHub', platform: 'GitHub', version: 'web' }, status: 'OPEN', policyAcknowledged: false, history: [{ status: 'OPEN', actorId: ownerId, at: now() }] };
  file.alerts = [...file.alerts, alert].slice(-MAX_ALERTS);
  save(file);
  queueNotifications(alert);
  appendAudit({ event: 'external_security_alert', username: ownerId, status: 'success', reason: eventType });
  return { ok: true, value: { alert } };
}

export function purgeAlerts(ownerId: string, before: Date): Result<{ deleted: number }> {
  const file = load();
  const beforeCount = file.alerts.length;
  file.alerts = file.alerts.filter(alert => alert.ownerId !== ownerId || Date.parse(alert.createdAt) >= before.getTime());
  save(file);
  const deleted = beforeCount - file.alerts.length;
  appendAudit({ event: 'alert_retention_purge', username: ownerId, status: 'success', reason: String(deleted) });
  return { ok: true, value: { deleted } };
}

export function listAlerts(ownerId: string): SecurityAlert[] {
  return load().alerts.filter(alert => alert.ownerId === ownerId).slice(-100).reverse();
}

export function listEndpoints(ownerId: string): Array<Pick<Endpoint, 'id' | 'metadata' | 'consentedAt' | 'policyAcknowledgedAt'>> {
  return load().endpoints
    .filter(endpoint => endpoint.ownerId === ownerId && !endpoint.revokedAt)
    .map(({ id, metadata, consentedAt, policyAcknowledgedAt }) => ({ id, metadata, consentedAt, policyAcknowledgedAt }));
}

export function exportPrivacyData(ownerId: string): { endpoints: ReturnType<typeof listEndpoints>; alerts: SecurityAlert[] } {
  return { endpoints: listEndpoints(ownerId), alerts: listAlerts(ownerId) };
}

export function deletePrivacyData(ownerId: string): Result<{ deletedEndpoints: number; deletedAlerts: number }> {
  const file = load();
  const endpointsBefore = file.endpoints.length;
  const alertsBefore = file.alerts.length;
  file.endpoints = file.endpoints.filter(endpoint => endpoint.ownerId !== ownerId);
  file.alerts = file.alerts.filter(alert => alert.ownerId !== ownerId);
  save(file);
  const deletedEndpoints = endpointsBefore - file.endpoints.length;
  const deletedAlerts = alertsBefore - file.alerts.length;
  appendAudit({ event: 'privacy_data_deleted', username: ownerId, status: 'success', reason: `${deletedEndpoints}:${deletedAlerts}` });
  return { ok: true, value: { deletedEndpoints, deletedAlerts } };
}
