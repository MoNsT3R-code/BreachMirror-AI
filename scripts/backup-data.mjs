import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve(process.env.BM_DATA_DIR || 'data');
const output = path.resolve(process.env.BM_BACKUP_FILE || 'breachmirror-data-backup.tar.gz');
if (!fs.existsSync(dataDir)) throw new Error(`Data directory does not exist: ${dataDir}`);
execFileSync('tar', ['-czf', output, '-C', dataDir, '.'], { stdio: 'inherit' });
fs.chmodSync(output, 0o600);
console.log(`Created encrypted-storage input backup at ${output}. Encrypt it with your secrets manager before transfer.`);
