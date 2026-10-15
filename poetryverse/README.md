# PoetryVerse — React + Tailwind + Node.js + MongoDB

A complete conversion of your supplied PoetryVerse PHP website. Original text, cream/terracotta colours, Playfair Display/DM Sans fonts, artwork, desktop layout and responsive breakpoints are retained. The pages are React components; styling uses Tailwind CSS 4 utilities and `@apply` in the components layer. The API runs on Express and stores users, poems and sessions in MongoDB.

## Sabse aasan tareeqa: apne computer par chalao

1. **Node.js 24 LTS** install karo: https://nodejs.org/
2. ZIP extract karo aur `poetryverse` folder terminal/VS Code mein kholo.
3. Ye commands chalao:

   ```bash
   npm ci
   npm run dev
   ```

4. Browser mein **http://localhost:5173** kholo.
5. **Sign Up** se apna account banao, phir **Log In** karo.

React code badalne ki zaroorat nahi hai. PHP, XAMPP aur MySQL ki zaroorat nahi hai.

`npm run dev` frontend, Node API aur **real MongoDB server** saath mein start karta hai. Pehli baar MongoDB binary download hoti hai, isliye internet aur thoda waqt lagega. MongoDB data `poetryverse/.local-data/mongodb/` mein save hota hai aur dev server band/restart hone par bhi rehta hai. Is folder ko delete karne se local data delete ho jayega. Ek waqt mein is project ka ek dev server chalao. Stop karne ke liye **Ctrl+C**.

Development session secret har launch par generate hota hai, isliye restart ke baad dobara login karna pad sakta hai. Accounts aur poems rehte hain. Permanent session secret ke liye neeche `.env` configure karo.

## Apna MongoDB / MongoDB Atlas lagana ho

1. `.env.example` ki copy `.env` naam se banao.
2. `MONGODB_URI` wali line se `#` hatao aur apna connection string lagao. URI mein database naam zaroor do, jaise `/poetryverse`.
3. `SESSION_SECRET` ko random secret se replace karo. Generate karne ke liye:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. `npm run dev` chalao. Ab local MongoDB start hone ke bajaye tumhara configured MongoDB use hoga.

Atlas par database user aur apne computer/server ka network access configure karna hota hai. URI aur `.env` kisi ke saath share ya Git mein commit mat karo. `.env` backend ke liye hai; ise `VITE_` variables ya frontend mein mat rakho.

**Existing data:** supplied PHP `db.php` used MySQL on port 3307. No database export or MongoDB credentials were supplied, so this conversion does **not** copy existing accounts/poems. New data is stored in MongoDB `users`, `poems` and `sessions` collections. Importing old data requires its database export and schema mapping. Use a separate database initially if an existing MongoDB database already has collections with these names.

## Features

- Original home page, feeling categories, three featured poems and working heart buttons.
- Signup, login, persistent sessions, logout and protected pages.
- Dashboard and profile editing (display name and 500-character bio).
- Poem editor with title, pen name, mood, word count and preview.
- Draft saved on this device and restored after refresh; drafts are separated by account.
- Start again with confirmation, permanent MongoDB save, private collection and delete confirmation.
- Author/mood are stored too; the original PHP save handler discarded them.
- Old `.php`/`index.html` page links redirect to their React pages. Both `/my-poems` and the original purple collection `/poem` remain available.
- Corrected broken `my_poems.php`/`delete_poem.php` references and misplaced delete form.

The home page retains its original static featured poems. Saving a poem adds it to the signed-in user's private collection, matching the supplied application's behaviour.

## Production build

Configure `.env` with a reachable MongoDB and a persistent random session secret, then:

```bash
npm ci
npm run build
npm start
```

Open **http://localhost:3001** for a local production-build check. Express serves both `dist/` and `/api`, including direct links to React pages. `npm start` does not launch a database; MongoDB must already be reachable.

For public deployment, serve behind HTTPS, set `NODE_ENV=production`, and set `TRUST_PROXY=1` **only** when the application is behind exactly one trusted reverse proxy. Production cookies require HTTPS. Never expose the development server as a production deployment. External Google Fonts need internet; local serif/sans-serif fallbacks remain available offline.

## Code map

```text
client/src/pages/     React pages: Home, Auth, Dashboard, Profile, Write, Poems
client/src/styles.css Tailwind component styles preserving the original design
client/src/auth.jsx   Session state and protected routes
client/src/api.js     API requests and CSRF token handling
server/app.js        Express routes, validation, authentication and security
server/models.js     MongoDB User and Poem schemas
server/index.js      MongoDB/session connection and production server
scripts/dev.mjs      Starts local MongoDB, Node and Vite together
scripts/start.bat    Windows double-click launcher (after installing Node)
scripts/start.sh     macOS/Linux launcher
tests/               API integration and frontend request-boundary tests
```

## Verification

```bash
npm run check
```

This builds the React app and runs the API integration suite against an isolated MongoDB with synthetic data. It does not touch your `.env` database. Tests cover signup/login/logout, session rotation, CSRF, validation, profile changes, Unicode poems, ownership isolation, MongoDB storage, deletion, and production route serving.

## Troubleshooting

- **`npm` command not found:** install Node.js 24, then reopen your terminal.
- **Port 5173 or 3001 in use:** stop the other PoetryVerse terminal/process and retry.
- **MongoDB binary download failed:** check internet access or configure your own running MongoDB via `MONGODB_URI`.
- **MongoDB connection failed:** check the URI, database user/password and Atlas network access. Special characters in URI passwords must be URL encoded.
- **Form expired / logged out after restart:** refresh and log in again. For stable sessions, set a permanent `SESSION_SECRET`.
- **Draft unavailable in another browser:** drafts are local to the same device/browser and account; use **Save Poem** for permanent database storage.
- **Missing fonts offline:** reconnect to load the original Google Fonts.

Original source was downloaded from the PoetryVerse folder inside the Drive link supplied in this task. XAMPP's dashboard, server distribution files and the unused alternative `index.php.txt` are not application pages.
