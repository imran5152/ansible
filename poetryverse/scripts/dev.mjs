import 'dotenv/config';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';

// Connect to your running local MongoDB through server/db.js.
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.startsWith('replace-this')) {
  process.env.SESSION_SECRET = randomBytes(32).toString('hex');
}
process.env.NODE_ENV = 'development';
process.env.PORT = '3001';
const children = [
  spawn(process.execPath, ['server/index.js'], { stdio: 'inherit', env: process.env }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'inherit', env: process.env }),
];
let stopping = false;
async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  await Promise.all(children.map(child => new Promise(resolve => {
    if (child.exitCode !== null || child.signalCode) return resolve();
    child.once('exit', resolve);
    child.kill('SIGTERM');
  })));
  process.exit(code);
}
children.forEach(child => child.on('exit', code => { if (!stopping) stop(code || 0); }));
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
