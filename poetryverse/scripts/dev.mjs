import 'dotenv/config';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { MongoMemoryServer } from 'mongodb-memory-server';

// This is a real mongod process, with a persistent local data directory.
let mongo;
if (!process.env.MONGODB_URI) {
  await mkdir('.local-data/mongodb', { recursive: true });
  mongo = await MongoMemoryServer.create({ instance: { dbPath: '.local-data/mongodb', storageEngine: 'wiredTiger' } });
  process.env.MONGODB_URI = mongo.getUri('poetryverse');
  console.log('Local MongoDB started. Data is saved in .local-data/mongodb.');
}
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.startsWith('replace-this')) {
  process.env.SESSION_SECRET = randomBytes(32).toString('hex');
}
process.env.NODE_ENV = 'development';
process.env.PORT = '3001';
const children = [
  spawn(process.execPath, ['--watch', 'server/index.js'], { stdio: 'inherit', env: process.env }),
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
  await mongo?.stop();
  process.exit(code);
}
children.forEach(child => child.on('exit', code => { if (!stopping) stop(code || 0); }));
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
