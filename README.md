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
- Sign up and sign in with **Firebase Auth** (email/password, plus Google)
- Send product feedback
- Install the app on a phone (PWA)
- Support the project via **Buy Me a Coffee** (optional link)

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
   ```

3. **Authentication → Sign-in method**
   - Enable **Email/Password**
   - Enable **Google** (optional, but the UI includes “Continue with Google”)
4. **Authentication → Settings → Authorized domains**
   - Keep `localhost`
   - After you deploy, add your Vercel domain (for example `your-app.vercel.app` and any custom domain)
5. **Build → Firestore Database → Create database**
   - Start in production mode, then publish the rules in [`firestore.rules`](./firestore.rules)
   - From this repo (with the [Firebase CLI](https://firebase.google.com/docs/cli) logged in):

     ```bash
     firebase deploy --only firestore:rules
     ```

   Feedback is written to a `feedback` collection. The rules allow **create only** (no public reads).

Do not put a Firebase **service account** JSON in client env vars. This app verifies ID tokens with the web API key on the server and never ships admin credentials to the browser.

## 3. Buy Me a Coffee (optional)

Create a profile at [buymeacoffee.com](https://www.buymeacoffee.com/), then set:

```
NEXT_PUBLIC_BUY_ME_A_COFFEE_URL=https://www.buymeacoffee.com/your-username
```

The link appears in the account menu, on the [Feedback](/feedback) page, and in the landing footer. If the variable is empty, those controls stay hidden.

## 4. Deploy to Vercel

Next.js on Vercel needs no extra `vercel.json` for this app.

1. Push to [github.com/Dumbuya1475/verve](https://github.com/Dumbuya1475/verve) (or fork it).
2. In [Vercel](https://vercel.com/), **Add New → Project** and import the GitHub repo.
3. Framework preset: Next.js (auto-detected).
4. Add the same env vars as `.env.local.example` (at least the `NEXT_PUBLIC_FIREBASE_*` keys, plus Buy Me a Coffee if you use it).
5. Deploy.
6. Copy the production URL into:
   - Firebase **Authorized domains**
   - `NEXT_PUBLIC_SITE_URL` (optional, used as the public origin)

Preview deployments each get a unique hostname. Add those hostnames to Firebase authorized domains if you need Google sign-in on preview URLs, or test email/password there.

## 5. Install as a PWA

After a production (HTTPS) deploy:

- **Android / Chrome:** use Install app / Add to Home screen from the browser menu.
- **iPhone / iPad:** Share → Add to Home Screen.
- The web app manifest is generated from `src/app/manifest.ts` (`Verve`, standalone display, Warm White theme).
- A service worker (`public/sw.js`) caches the app shell in **production** only so a flaky connection can still open a recently visited page.

## Feedback

Students and contributors can send a note at `/feedback` (also in the account menu and mobile nav). Message is required. Name and email are optional when signed out; signed-in users are tagged from their Firebase account (name and email, never a photo).

## License

[MIT](./LICENSE). The project is public at [github.com/Dumbuya1475/verve](https://github.com/Dumbuya1475/verve). Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).
