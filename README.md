# Verve
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4ba1cf22-a912-4130-bb2b-44b237d77972" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/77f7c926-7935-47b5-b0cc-a2a4b066e2fc" />


A calm academic workspace for **university students in Sierra Leone** — not a developer tool.

**Source:** [github.com/Dumbuya1475/verve](https://github.com/Dumbuya1475/verve)  
Clone: `https://github.com/Dumbuya1475/verve.git`

Students fill in an assignment cover page (Individual or Group), preview it against the faculty layout, and export PDF or Word. Later work may add a document body, study material from slides, and gated submit flows. This repository is the cover-page product plus account, feedback, and installable PWA support.

The public name in the UI is **Verve**. CommitCraft is the project name used in design and contributor docs.

## What you can do today

- Build Individual and Group assignment cover pages
- Preview and export (PDF / Word)
- Share Verve with classmates after exporting, and answer a short survey after your fourth export
- Sign up and sign in with **Firebase Auth** (email/password, plus Google)
- Send product feedback
- Install the app on a phone (PWA)
<!-- - Support the project via **Buy Me a Coffee** (optional link) -->

There is **no profile photo** in the account UI. The menu shows display name and email only.

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- Firebase Authentication (and Cloud Firestore for feedback)
- Vercel for hosting
- Design system: [`DESIGN.md`](./DESIGN.md) (“Warm Productivity”)
- Contributor conventions: [`AGENTS.md`](./AGENTS.md)

## 1. Clone and run locally

You need Node.js 20+ and npm.

```bash
git clone https://github.com/Dumbuya1475/verve.git
cd verve
npm install
cp .env.local.example .env.local
```

Fill in Firebase keys (step 2). Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |

Without Firebase keys the landing page and cover editor still load. Sign-in and saved sessions stay off until you add keys.

## 2. Create a Firebase project

1. Open the [Firebase console](https://console.firebase.google.com/) and create a project (or use an existing one).
2. Add a **Web** app. Copy the firebaseConfig values into `.env.local`:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
   ```

3. In Firebase **Project settings → Integrations**, enable Google Analytics for the project if it is not enabled. Copy the web app's **Measurement ID** (`G-...`) from the Google Analytics data stream into `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` in `.env.local` and your production environment. Analytics stays disabled when this variable is empty. Verve records page views and an `export_completed` event with export type, format, and guest/signed-in category; it does not send assignment content or account identifiers to Google Analytics.
4. **Authentication → Sign-in method**
   - Enable **Email/Password**
   - Enable **Google** (optional, but the UI includes “Continue with Google”)
5. **Authentication → Settings → Authorized domains**
   - Keep `localhost`
   - After you deploy, add your Vercel domain (for example `your-app.vercel.app` and any custom domain)
6. **Build → Firestore Database → Create database**
   - Start in production mode, then publish the rules in [`firestore.rules`](./firestore.rules)
   - From this repo (with the [Firebase CLI](https://firebase.google.com/docs/cli) logged in):

     ```bash
     firebase deploy --only firestore:rules
     ```

   The same rules also allow signed-in users to read and update only their own `coverDrafts/{uid}` document for cross-device cover sync. After changing Firestore rules, deploy them to the same Firebase project configured by `NEXT_PUBLIC_FIREBASE_PROJECT_ID`; otherwise cover sync can fail with a permissions error. Feedback is written to a `feedback` collection. The rules allow **create only** (no public reads).

Do not put a Firebase **service account** JSON in client env vars. The service-account key used for export analytics is kept server-side and is never shipped to the browser.

### Export usage dashboard (optional)

The administrator dashboard is available at `/usage`. To enable it:

1. Create and sign in to the account that should be the administrator.
2. In Firebase Console → **Authentication → Users**, copy that account's UID.
3. In local `.env.local` and your hosting provider's server-side environment variables, set:
   - `ADMIN_UID` to the copied UID
   - `FIREBASE_SERVICE_ACCOUNT_KEY` to the complete JSON key from Firebase Console → **Project settings → Service accounts → Generate new private key**. In Vercel, paste the JSON object itself with valid JSON escaping for the private key; do not paste explanatory text around it.
4. Use Node.js 22.x for the Vercel project runtime. Firebase Admin Auth depends on an ESM-only JOSE package that fails when loaded by older Node runtimes.
5. Redeploy after changing production environment variables or the Node.js version, then sign in with that account and open `/usage`.

The service-account key is a server secret: never use a `NEXT_PUBLIC_` prefix, commit the key, or share it. Only the configured UID can read analytics. The dashboard counts recorded exports and distinct signed-in accounts that exported; it does not query Firebase Authentication for the total number of registered accounts. Export events and guest export limits are written by the server using the Admin SDK, so `exportEvents`, `userExportStats`, `guestExportStats`, and `exportSurveyResponses` are denied to direct client reads and writes by [`firestore.rules`](./firestore.rules). Deploy the updated rules with `firebase deploy --only firestore:rules`.

The public homepage shows only the total recorded export count. It is calculated server-side from the `exportEvents` collection and cached for one hour; account and guest counts remain restricted to `/usage`.

Signed-out visitors can make one free export per browser cookie, shared between cover and document exports. Later exports require an account. The guest limit is intended to prevent repeat use in normal browsing; clearing cookies or using another browser may reset it. Guest exports are recorded without a Firebase account and are shown separately in the dashboard. These counts represent recorded export actions, not independently verified downloads: PDF and Word files are still generated in the browser.

<!-- ## 3. Buy Me a Coffee (optional) -->

## 4. Deploy to Vercel

Next.js on Vercel needs no extra `vercel.json` for this app.

1. Push to [github.com/Dumbuya1475/verve](https://github.com/Dumbuya1475/verve) (or fork it).
2. In [Vercel](https://vercel.com/), **Add New → Project** and import the GitHub repo.
3. Framework preset: Next.js (auto-detected).
<!-- 4. Add the same env vars as `.env.local.example` (at least the `NEXT_PUBLIC_FIREBASE_*` keys, plus Buy Me a Coffee if you use it). -->
5. Deploy.
6. Copy the production URL into:
   - Firebase **Authorized domains**
   - `NEXT_PUBLIC_SITE_URL` (used for canonical links, Open Graph metadata, and the sitemap)

### Search Console

After deploying, add your site to [Google Search Console](https://search.google.com/search-console/), verify ownership using the HTML verification file in `public/`, and submit `https://your-production-domain/sitemap.xml`. The generated sitemap includes the public landing page and privacy policy; private editor and account pages are excluded from indexing.

Preview deployments each get a unique hostname. Add those hostnames to Firebase authorized domains if you need Google sign-in on preview URLs, or test email/password there.

## 5. Install as a PWA

After a production (HTTPS) deploy:

- **Android / Chrome:** use Install app / Add to Home screen from the browser menu.
- **iPhone / iPad:** Share → Add to Home Screen.
- The web app manifest is generated from `src/app/manifest.ts` (`Verve`, standalone display, Warm White theme).
- A service worker (`public/sw.js`) caches the app shell, Next.js static chunks, and cover assets so the app opens offline after the first visit. Navigations fall back to a cached page, then `/offline`.
- Editing and downloads work offline: drafts persist in `localStorage`, export libraries (`docx`, `jspdf`, `html2canvas`, `file-saver`) are pre-downloaded on idle while online and served from cache, and export buttons never wait on Firebase session restore. An offline banner shows connection state.

## Feedback

Students and contributors can send a note at `/feedback` (also in the account menu and mobile nav). Message is required. Name and email are optional when signed out; signed-in users are tagged from their Firebase account (name and email, never a photo).

## License

[MIT](./LICENSE). The project is public at [github.com/Dumbuya1475/verve](https://github.com/Dumbuya1475/verve). Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).
