import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const input = path.resolve(process.env.BM_BACKUP_FILE || 'breachmirror-data-backup.tar.gz');
const dataDir = path.resolve(process.env.BM_DATA_DIR || 'data');
if (!fs.existsSync(input)) throw new Error(`Backup does not exist: ${input}`);
fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 });
execFileSync('tar', ['-xzf', input, '-C', dataDir], { stdio: 'inherit' });
console.log(`Restored encrypted storage into ${dataDir}. Verify BM_DATA_KEY and the audit chain before starting the service.`);
