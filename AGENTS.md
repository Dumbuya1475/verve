<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CommitCraft — Repository Instructions

## What this is
CommitCraft is a premium academic workspace web app for university students in
Sierra Leone — NOT a developer tool. Students assemble an assignment cover
page, write the document body, turn uploaded lecture slides/past questions
into study material, and export/submit the finished work (Word export, a
gated GitHub push, and a gated "compress and email to faculty" flow).

## Stack — fixed, do not introduce alternatives without asking
- **Next.js 16**, App Router, TypeScript, Tailwind CSS v4. Note: Next.js 16
  renamed `middleware.ts` to **`proxy.ts`** (exported function is now
  `proxy`, not `middleware`) — always check `node_modules/next/dist/docs/`
  before writing anything touching routing/auth, since this changes fast.
- **Firebase Authentication** for sign-up / sign-in (email/password and Google). Client
  helpers live in `src/lib/firebase/` — do not scatter `initializeApp` in components.
  Session cookies are set via `/api/auth/session`; `src/proxy.ts` redirects signed-out
  users away from app routes (`/cover`, `/document`, …). **No profile pictures** in the
  account UI — display name and email only.
- **Supabase** remains optional for a later Postgres/storage data layer (same helpers
  as before). It is **not** used for Auth. If you add it, only `getAll`/`setAll` cookie
  methods — never `get`/`set`/`remove`, and never import from the deprecated
  `@supabase/auth-helpers-nextjs`.
  - Env vars for that later path: `NEXT_PUBLIC_SUPABASE_URL` and
    `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Payments: Monime (docs.monime.io) — Checkout Sessions + Webhooks. Covers
  mobile money (Orange Money, Afrimoney) and card in one integration, so it
  handles both local and international payers.
- AI generation: Google Gemini API, used for its native PDF/document
  understanding, to turn uploaded slides into the Study Guide and Speaker
  Script. All model calls go through one function, `lib/ai/generateStudyMaterial()`,
  so the provider is swappable later without touching callers.
- Word export: the `docx` npm package.
- Zipping: `archiver`. Email delivery: Resend.
- GitHub push: a registered GitHub OAuth App, `repo` scope.

## Design system
Follow `DESIGN.md` at the repo root (the "Warm Productivity" system — Warm
White background, Soft Gray secondary surfaces, Dark Charcoal text, Coral
`#F43F5E` primary accent, Inter typeface, soft shadows, 8px/16px radii).
Tokens are implemented in `src/app/globals.css` as a Tailwind v4 `@theme`
block — use the generated utilities (`bg-background`, `text-primary`,
`rounded-control`, `.shadow-soft`, etc.), never hard-coded hex values in
components. No dark mode, no IDE styling, no monospace-heavy UI — this is
explicitly not a developer tool.

## Conventions
- API routes live under `app/api/.../route.ts`, validate input with `zod`,
  return typed JSON.
- All Supabase access goes through `lib/db/*.ts` helper functions (to be
  added starting Issue 3) — no raw client calls scattered through
  components.
- Every gated action (GitHub push, Multimedia Zipper) must check a
  `premium_unlocks` row for the current user + feature server-side before
  running. Never trust client-side state for gating.
- Money is handled in the smallest currency unit (matching Monime's API) —
  never as floats.
- Secrets (Monime access token, Gemini API key, GitHub OAuth client secret,
  Supabase service role key) live in server-side env vars only — see
  `.env.local.example` for the full list, grouped by which issue introduces
  them.

## Data model (Supabase migrations — to be added starting Issue 3)
- `assignments`: id, user_id, type (individual/group), student_name,
  student_id, lecturer_name, course_code, year_semester, intro_text,
  body_text, conclusion_text, font_size, created_at, updated_at
- `group_members`: id, assignment_id, name, student_id
- `uploads`: id, assignment_id, kind (slide/code/asset), storage_path,
  created_at
- `generated_material`: id, assignment_id, study_guide (jsonb),
  speaker_script (jsonb), generated_at
- `premium_unlocks`: id, user_id, feature (github_push | multimedia_zip),
  monime_checkout_id, status (pending/paid/failed), unlocked_at

## Non-goals for this phase
- No admin dashboard beyond a simple view of failed/pending webhooks.
- No real-time collaboration on Group Project fields — last-write-wins is
  fine for MVP.
- No payment providers other than Monime in this phase.

## Status
- **Issue 1 (scaffold) — done.** App shell, design tokens, placeholder routes.
- **Auth — Firebase (user override of the original Supabase Auth plan).** Sign up /
  sign in, `src/proxy.ts` session gate, account menu without avatars, PWA, feedback,
  Buy Me a Coffee, Vercel + open-source docs.
- Cover-page editor and export are the current product surface. Exam, submit, and a
  full document-builder backend are out of scope unless a later issue opens them.
