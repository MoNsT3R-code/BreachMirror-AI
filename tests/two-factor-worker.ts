import { authenticate } from '../server/auth-service';

const [, , identifier, password, code] = process.argv;
const result = authenticate(identifier, password, undefined, 'worker-race', code);
process.stdout.write(JSON.stringify({ ok: result.ok }));
