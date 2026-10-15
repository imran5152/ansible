import 'dotenv/config';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { createApp } from './app.js';
import { connectDatabase } from './db.js';
import { User, Poem } from './models.js';

const production = process.env.NODE_ENV === 'production';
const secret = process.env.SESSION_SECRET;
if (!secret || secret.length < 32 || secret.startsWith('replace-this')) {
  console.error('Set a random SESSION_SECRET of at least 32 characters in .env. See README.md.');
  process.exit(1);
}
let server;
let store;
try {
  await connectDatabase();
  await Promise.all([User.init(), Poem.init()]);
  store = MongoStore.create({ client: mongoose.connection.getClient(), collectionName: 'sessions' });
  store.on('error', () => console.error('PoetryVerse session storage failed.'));
  const app = createApp({ store, secret, production, trustProxy: process.env.TRUST_PROXY === '1', serveClient: true });
  server = app.listen(Number(process.env.PORT) || 3001, '0.0.0.0', () => console.log(`PoetryVerse ready on port ${Number(process.env.PORT) || 3001}`));
} catch {
  console.error('Could not start PoetryVerse. Start MongoDB Community Server on 127.0.0.1:27017, or check MONGODB_URI in .env.');
  await mongoose.disconnect();
  process.exit(1);
}
async function shutdown() {
  server.close(async () => { await store.close(); await mongoose.disconnect(); process.exit(0); });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
