import 'dotenv/config';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { createApp } from './app.js';
import { User, Poem } from './models.js';

const production = process.env.NODE_ENV === 'production';
const secret = process.env.SESSION_SECRET;
if (!process.env.MONGODB_URI || !secret || secret.length < 32 || secret.startsWith('replace-this')) {
  console.error('Set MONGODB_URI and a random SESSION_SECRET of at least 32 characters in .env. See README.md.');
  process.exit(1);
}
let server;
let store;
try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  await Promise.all([User.init(), Poem.init()]);
  store = MongoStore.create({ client: mongoose.connection.getClient(), collectionName: 'sessions' });
  store.on('error', () => console.error('PoetryVerse session storage failed.'));
  const app = createApp({ store, secret, production, trustProxy: process.env.TRUST_PROXY === '1', serveClient: true });
  server = app.listen(Number(process.env.PORT) || 3001, '0.0.0.0', () => console.log(`PoetryVerse ready on port ${Number(process.env.PORT) || 3001}`));
} catch {
  console.error('Could not start PoetryVerse. Check MongoDB connectivity and .env configuration.');
  await mongoose.disconnect();
  process.exit(1);
}
async function shutdown() {
  server.close(async () => { await store.close(); await mongoose.disconnect(); process.exit(0); });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
