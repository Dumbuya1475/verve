# Contributing to Verve

Thank you for helping a student-facing academic app. This is not a developer IDE clone: keep the UI calm, readable, and free of profile photos or hex colors in components.

## Before you start

1. Fork or clone [github.com/Dumbuya1475/verve](https://github.com/Dumbuya1475/verve):

   ```bash
   git clone https://github.com/Dumbuya1475/verve.git
   cd verve
   ```

2. Read [`README.md`](./README.md) for setup (Firebase, Vercel, PWA).
3. Read [`DESIGN.md`](./DESIGN.md) and use tokens from `src/app/globals.css` (`bg-background`, `text-primary`, `rounded-control`, `shadow-soft`, …).
4. Read [`AGENTS.md`](./AGENTS.md) for stack conventions. **Auth is Firebase**, not Supabase Auth.

## Local loop

```bash
npm install
cp .env.local.example .env.local
npm run dev
npm run typecheck
npm run lint
```

Do not commit `.env.local` or real API keys.

## Pull requests

- Keep cover export logic (`src/lib/cover/export.ts`, `src/lib/cover/html.ts`) intact unless the change is specifically about LUCT layout.
- Prefer small, reviewable diffs.
- Match existing TypeScript, App Router, and Tailwind v4 patterns.
- New API routes live under `src/app/api/.../route.ts` and validate input with Zod.

## Product voice

Errors should say what happened and how to fix it. No dark mode, no monospace-heavy chrome, no avatar images.
