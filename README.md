# CommitCraft

A calm, premium academic workspace for university students — not a developer
tool. Students assemble an assignment cover page, write the document body,
turn uploaded lecture slides into study material, and export/submit the
finished work.

See **`AGENTS.md`** for the fixed tech stack and repo conventions, and
**`DESIGN.md`** for the full design system. Both are read automatically by
GitHub Copilot (Agent Mode and the cloud coding agent).

## Status

This is the Issue 1 scaffold: app shell, design tokens, the four routes as
placeholders, and unused Supabase client helpers. No business logic yet —
see `AGENTS.md` > Status for what's next.

## Getting started

1. Copy the env template and fill in what you have so far (just the
   Supabase block is needed for this issue; the rest are placeholders for
   later issues):

   ```bash
   cp .env.local.example .env.local
   ```

2. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Open <http://localhost:3000> — it redirects to `/cover`. All four nav
   tabs should be clickable and styled per `DESIGN.md`.

## Scripts

- `npm run dev` — start the dev server (Turbopack).
- `npm run build` — production build.
- `npm run start` — run the production build.
- `npm run lint` — ESLint.
