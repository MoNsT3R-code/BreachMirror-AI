import crypto from 'node:crypto';
import { readSecureJson, writeSecureJson } from './secure-store';

export type NotificationChannel = 'email' | 'slack' | 'teams';
export interface NotificationJob {
  id: string;
  channel: NotificationChannel;
  destination: string;
  payload: Record<string, string>;
  attempts: number;
  nextAttemptAt: string;
  status: 'pending' | 'delivered' | 'failed';
}

const FILE = 'notification-outbox.json';
const load = () => readSecureJson<NotificationJob[]>(FILE, []);
const save = (jobs: NotificationJob[]) => writeSecureJson(FILE, jobs.slice(-5_000));

export function enqueueNotification(channel: NotificationChannel, destination: string, payload: Record<string, string>): NotificationJob {
  const job: NotificationJob = { id: crypto.randomUUID(), channel, destination, payload, attempts: 0, nextAttemptAt: new Date().toISOString(), status: 'pending' };
  save([...load(), job]);
  return job;
}

export function pendingNotifications(now = new Date()): NotificationJob[] {
  return load().filter(job => job.status === 'pending' && Date.parse(job.nextAttemptAt) <= now.getTime());
}

export function markNotification(jobId: string, delivered: boolean): void {
  const jobs = load();
  const job = jobs.find(item => item.id === jobId);
  if (!job) return;
  job.attempts += 1;
  job.status = delivered ? 'delivered' : job.attempts >= 5 ? 'failed' : 'pending';
  job.nextAttemptAt = new Date(Date.now() + Math.min(60 * 60_000, 2 ** job.attempts * 1_000)).toISOString();
  save(jobs);
}
