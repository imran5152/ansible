import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { z } from 'zod';
import { User, Poem, moods, publicUser, publicPoem } from './models.js';

const email = z.string().trim().toLowerCase().max(255).email();
const name = z.string().trim().min(1, 'Please enter your name.').max(100);
const password = z.string().min(8, 'Your password must be at least 8 characters.').refine(
  value => Buffer.byteLength(value, 'utf8') <= 72, 'Please use a password of 72 bytes or fewer.',
);
const signup = z.object({ name, email, password, confirmPassword: z.string() })
  .refine(data => data.password === data.confirmPassword, { message: 'Your passwords do not match.' });
const login = z.object({ email, password: z.string().min(1).max(1024) });
const profile = z.object({ name, bio: z.string().trim().max(500) });
const poemInput = z.object({
  title: z.string().trim().min(1, 'Please enter a poem title.').max(200),
  content: z.string().trim().min(1, 'Please write your poem.').max(50000),
  author: z.string().trim().max(100).default(''), mood: z.enum(moods).default('Love'),
});
const asyncSession = (req, action) => new Promise((resolve, reject) => req.session[action](err => err ? reject(err) : resolve()));
const csrfToken = req => (req.session.csrfToken ||= randomBytes(32).toString('hex'));

export function createApp({ store, secret, production = false, trustProxy = false, serveClient = false }) {
  const app = express();
  app.disable('x-powered-by');
  if (trustProxy) app.set('trust proxy', 1);
  app.use(helmet({
    contentSecurityPolicy: { directives: {
      'style-src': ["'self'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'upgrade-insecure-requests': production ? [] : null,
    } },
    strictTransportSecurity: production ? undefined : false,
  }));
  app.use(express.json({ limit: '256kb' }));
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use('/api', session({
    name: 'poetryverse.sid', secret, store, resave: false, saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: production, maxAge: 7 * 24 * 60 * 60 * 1000 },
  }));
  app.get('/api/health', (_req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'unavailable', database: connected ? 'connected' : 'disconnected' });
  });
  app.use('/api', (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const supplied = req.get('X-CSRF-Token');
    const expected = req.session.csrfToken;
    if (!supplied || !expected || !/^[a-f0-9]{64}$/.test(supplied) || supplied.length !== expected.length ||
        !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
      return res.status(403).json({ message: 'Your form expired. Refresh the page and try again.' });
    }
    next();
  });
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again in 15 minutes.' } });
  async function requireUser(req, res, next) {
    if (!req.session.userId) return res.status(401).json({ message: 'Please log in to continue.' });
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(401).json({ message: 'Please log in again.' });
    req.user = user;
    next();
  }
  app.get('/api/auth/session', async (req, res) => {
    const user = req.session.userId ? await User.findById(req.session.userId) : null;
    res.json({ user: user ? publicUser(user) : null, csrfToken: csrfToken(req) });
  });
  app.post('/api/auth/register', authLimiter, async (req, res) => {
    const data = signup.parse(req.body);
    const passwordHash = await bcrypt.hash(data.password, 12);
    await User.create({ name: data.name, email: data.email, passwordHash });
    res.status(201).json({ message: 'Your account has been created successfully! You can now log in.' });
  });
  // A valid dummy hash keeps unknown-email and wrong-password requests on the same hashing path.
  const dummyHash = bcrypt.hashSync(randomBytes(32).toString('hex'), 12);
  app.post('/api/auth/login', authLimiter, async (req, res) => {
    const data = login.parse(req.body);
    const user = await User.findOne({ email: data.email }).select('+passwordHash');
    const valid = await bcrypt.compare(data.password, user?.passwordHash || dummyHash);
    if (!user || !valid) return res.status(401).json({ message: 'Invalid email or password.' });
    await asyncSession(req, 'regenerate');
    req.session.userId = String(user._id);
    const token = csrfToken(req);
    await asyncSession(req, 'save');
    res.json({ user: publicUser(user), csrfToken: token });
  });
  app.post('/api/auth/logout', async (req, res) => {
    await asyncSession(req, 'destroy');
    res.clearCookie('poetryverse.sid', { httpOnly: true, sameSite: 'lax', secure: production });
    res.json({ message: 'You have been logged out.' });
  });
  app.patch('/api/profile', requireUser, async (req, res) => {
    const data = profile.parse(req.body);
    req.user.set(data);
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  });
  app.get('/api/poems', requireUser, async (req, res) => {
    const poems = await Poem.find({ userId: req.user._id }).sort({ updatedAt: -1, _id: -1 });
    res.json({ poems: poems.map(publicPoem) });
  });
  app.post('/api/poems', requireUser, async (req, res) => {
    const data = poemInput.parse(req.body);
    const poem = await Poem.create({ ...data, userId: req.user._id });
    res.status(201).json({ poem: publicPoem(poem) });
  });
  app.delete('/api/poems/:id', requireUser, async (req, res) => {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid poem ID.' });
    const poem = await Poem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!poem) return res.status(404).json({ message: 'Poem not found.' });
    res.json({ message: 'Your poem has been deleted.' });
  });
  app.use('/api', (_req, res) => res.status(404).json({ message: 'This API route does not exist.' }));
  if (serveClient) {
    const dist = fileURLToPath(new URL('../dist', import.meta.url));
    app.use(express.static(dist));
    app.get('/{*path}', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }
  app.use((err, _req, res, _next) => {
    if (err instanceof z.ZodError) return res.status(400).json({ message: err.issues[0].message });
    if (err.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON request.' });
    if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Your submission is too large.' });
    // Never include connection strings or submitted data in logs or responses.
    console.error('PoetryVerse request failed:', err.name || 'Error');
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  });
  return app;
}
