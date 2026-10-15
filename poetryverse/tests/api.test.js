import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { createApp } from '../server/app.js';
import { connectDatabase, LOCAL_MONGODB_URI } from '../server/db.js';
import { User, Poem } from '../server/models.js';

let app, store;
const secret = randomBytes(32).toString('hex');
const account = { name: 'Test Poet', email: 'poet@example.test', password: 'A synthetic password 42', confirmPassword: 'A synthetic password 42' };
const createStore = () => MongoStore.create({ client: mongoose.connection.getClient(), collectionName: 'test_sessions' });
before(async () => {
  assert.equal(LOCAL_MONGODB_URI, 'mongodb://127.0.0.1:27017/poetryverse');
  await connectDatabase(process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017', {
    dbName: `poetryverse_test_${randomBytes(8).toString('hex')}`,
  });
  await Promise.all([User.init(), Poem.init()]);
  store = createStore();
  app = createApp({ secret, store, serveClient: true });
});
after(async () => {
  if (mongoose.connection.readyState === 1) await mongoose.connection.dropDatabase();
  await store?.close();
  await mongoose.disconnect();
});
async function session(agent = request.agent(app)) {
  const res = await agent.get('/api/auth/session').expect(200);
  return { agent, token: res.body.csrfToken, cookie: res.headers['set-cookie'][0].split(';')[0] };
}
async function registered(details = account) {
  const current = await session();
  await current.agent.post('/api/auth/register').set('X-CSRF-Token', current.token).send(details).expect(201);
  return current;
}
async function signIn(current, details = account) {
  const result = await current.agent.post('/api/auth/login').set('X-CSRF-Token', current.token).send({ email: details.email, password: details.password }).expect(200);
  return { ...current, token: result.body.csrfToken, user: result.body.user, cookie: result.headers['set-cookie'][0].split(';')[0] };
}
let poet, saved;

test('session uses HttpOnly/SameSite cookies and MongoDB; health and API responses are uncached', async () => {
  const res = await request(app).get('/api/auth/session').expect(200);
  assert.equal(res.body.user, null);
  assert.match(res.body.csrfToken, /^[a-f0-9]{64}$/);
  assert.match(res.headers['set-cookie'][0], /HttpOnly/);
  assert.match(res.headers['set-cookie'][0], /SameSite=Lax/);
  assert.equal(res.headers['cache-control'], 'no-store');
  await request(app).get('/api/health').expect(200);
});
test('mutations reject missing, incorrect and non-ASCII CSRF tokens', async () => {
  const current = await session();
  for (const token of ['', 'f'.repeat(64), 'é'.repeat(64)]) {
    await current.agent.post('/api/auth/register').set('X-CSRF-Token', token).send(account).expect(403);
  }
  assert.equal(await User.countDocuments(), 0);
});
test('signup validates passwords, email, field types and stores only a bcrypt hash', async () => {
  const current = await session();
  for (const data of [
    { ...account, confirmPassword: 'different' }, { ...account, email: { $ne: null } },
    { ...account, password: 'x', confirmPassword: 'x' }, { ...account, name: ' '.repeat(5) },
    { ...account, password: '🌷'.repeat(20), confirmPassword: '🌷'.repeat(20) },
  ]) await current.agent.post('/api/auth/register').set('X-CSRF-Token', current.token).send(data).expect(400);
  poet = await registered();
  const user = await User.findOne({ email: account.email }).select('+passwordHash');
  assert.notEqual(user.passwordHash, account.password);
  assert.equal(await bcrypt.compare(account.password, user.passwordHash), true);
  await poet.agent.post('/api/auth/register').set('X-CSRF-Token', poet.token).send(account).expect(409);
});
test('login has generic failures and rotates session ID and CSRF token', async () => {
  const previousCookie = poet.cookie;
  for (const email of ['unknown@example.test', account.email]) {
    const res = await poet.agent.post('/api/auth/login').set('X-CSRF-Token', poet.token).send({ email, password: 'wrong password' }).expect(401);
    assert.equal(res.body.message, 'Invalid email or password.');
  }
  const oldToken = poet.token;
  poet = await signIn(poet);
  assert.notEqual(poet.token, oldToken);
  assert.equal(poet.user.name, account.name);
  assert.equal('passwordHash' in poet.user, false);
  assert.notEqual(poet.cookie, previousCookie);
  const previousSession = await request(app).get('/api/auth/session').set('Cookie', previousCookie).expect(200);
  assert.equal(previousSession.body.user, null);
  await poet.agent.patch('/api/profile').set('X-CSRF-Token', oldToken).send({ name: 'No', bio: '' }).expect(403);
});
test('profile updates persist and reject operator injection and length overflow', async () => {
  await poet.agent.patch('/api/profile').set('X-CSRF-Token', poet.token).send({ name: 'Updated Poet', bio: 'Words in English and हिन्दी 🌷' }).expect(200);
  const res = await poet.agent.get('/api/auth/session').expect(200);
  assert.equal(res.body.user.bio, 'Words in English and हिन्दी 🌷');
  for (const body of [{ name: { $set: 'no' }, bio: '' }, { name: 'x', bio: 'x'.repeat(501) }]) {
    await poet.agent.patch('/api/profile').set('X-CSRF-Token', poet.token).send(body).expect(400);
  }
});
test('poems preserve whitespace, Unicode, author and mood in MongoDB', async () => {
  const res = await poet.agent.post('/api/poems').set('X-CSRF-Token', poet.token).send({ title: 'A little poem', content: 'First line\n\nदूसरी पंक्ति 🌷\n  indented line', author: 'A Pen Name', mood: 'Healing' }).expect(201);
  saved = res.body.poem;
  assert.equal(saved.author, 'A Pen Name'); assert.equal(saved.mood, 'Healing');
  assert.match(saved.content, /\n\nदूसरी पंक्ति/);
  const stored = await Poem.findById(saved.id);
  assert.equal(stored.content, saved.content);
  const list = await poet.agent.get('/api/poems').expect(200);
  assert.equal(list.body.poems[0].id, saved.id);
});
test('poem validation rejects blank content, oversized title, unknown moods and object values', async () => {
  for (const body of [
    { title: 'x', content: ' ' }, { title: 'x'.repeat(201), content: 'a' },
    { title: 'x', content: 'a', mood: 'Unknown' }, { title: { $ne: null }, content: 'a' },
    { title: 'x', content: 'a'.repeat(50001) },
  ]) await poet.agent.post('/api/poems').set('X-CSRF-Token', poet.token).send(body).expect(400);
  assert.equal(await Poem.countDocuments(), 1);
});
test('another user cannot read or delete private poems; anonymous users cannot access protected APIs', async () => {
  const otherAccount = { ...account, name: 'Other Poet', email: 'other@example.test' };
  const other = await signIn(await registered(otherAccount), otherAccount);
  const list = await other.agent.get('/api/poems').expect(200);
  assert.deepEqual(list.body.poems, []);
  await other.agent.delete(`/api/poems/${saved.id}`).set('X-CSRF-Token', other.token).expect(404);
  assert.equal(await Poem.countDocuments(), 1);
  const anon = await session();
  await anon.agent.get('/api/poems').expect(401);
  await anon.agent.post('/api/poems').set('X-CSRF-Token', anon.token).send({ title: 'No', content: 'No' }).expect(401);
  await anon.agent.patch('/api/profile').set('X-CSRF-Token', anon.token).send({ name: 'No', bio: '' }).expect(401);
});
test('new app instance reads existing MongoDB sessions and poems', async () => {
  const sessionResponse = await poet.agent.get('/api/auth/session');
  const cookie = sessionResponse.headers['set-cookie']?.[0]?.split(';')[0];
  // Get the persisted, signed cookie from a fresh login response.
  const loginResponse = await poet.agent.post('/api/auth/login').set('X-CSRF-Token', poet.token).send({ email: account.email, password: account.password }).expect(200);
  poet.token = loginResponse.body.csrfToken;
  const persistedCookie = loginResponse.headers['set-cookie'][0].split(';')[0] || cookie;
  const restartedApp = createApp({ secret, store });
  const res = await request(restartedApp).get('/api/poems').set('Cookie', persistedCookie).expect(200);
  assert.equal(res.body.poems[0].id, saved.id);
});
test('invalid IDs fail safely and owner delete removes the poem from MongoDB', async () => {
  await poet.agent.delete('/api/poems/not-an-id').set('X-CSRF-Token', poet.token).expect(400);
  await poet.agent.delete(`/api/poems/${saved.id}`).set('X-CSRF-Token', poet.token).expect(200);
  assert.equal(await Poem.countDocuments(), 0);
});
test('logout invalidates the session and subsequent protected reads fail', async () => {
  await poet.agent.post('/api/auth/logout').set('X-CSRF-Token', poet.token).expect(200);
  await poet.agent.get('/api/poems').expect(401);
  const res = await poet.agent.get('/api/auth/session').expect(200);
  assert.equal(res.body.user, null);
});
test('production build is served on clean and legacy client routes; unknown API and malformed payloads are JSON', async () => {
  for (const route of ['/', '/profile', '/write.php', '/mypoems.php']) {
    const response = await request(app).get(route).expect(200);
    assert.match(response.headers['content-type'], /html/);
    assert.match(response.text, /PoetryVerse/);
  }
  await request(app).get('/api/missing').expect(404);
  const current = await session();
  await current.agent.post('/api/auth/login').set('Content-Type', 'application/json').send('{bad json').expect(400);
});
