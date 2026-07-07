# CommitCraft — Design System ("Warm Productivity")

CommitCraft is a premium academic workspace for university students — not a
developer tool. This system exists to reduce the clinical coldness of most
academic software in favor of a soft, inviting environment that supports
focus without inducing stress. The emotional target is "calm confidence":
everything organized and within reach.

The style is Modern Corporate meets Minimalism, in the "warm minimalist"
vein: generous white space, subtle depth, off-whites and charcoals instead of
stark black and white. No dark mode, no IDE styling, no monospace-heavy UI.

## Colors

| Token | Hex | Use |
|---|---|---|
| Warm White (`background`) | `#FAFAF9` | Page background |
| Soft Gray (`surface`) | `#F5F5F4` | Secondary surfaces, fields at rest |
| White (`surface-strong`) | `#FFFFFF` | Cards, modals (Level 2 floating elements) |
| Dark Charcoal (`foreground`) | `#1C1917` | Body text — never pure black |
| Coral (`primary`) | `#F43F5E` | Primary actions, active nav state, critical feedback — used sparingly |
| `primary-container` | `#DC2C4F` | Hover/pressed state for primary |
| `secondary` | `#625D5B` | Muted text, inactive nav |
| `secondary-container` | `#E9E1DD` | Chips, avatar placeholders |
| `outline` / `outline-variant` | `#8F6F71` / `#E3BDBF` | Hairline separators, subtle borders |
| `error` / `error-container` | `#BA1A1A` / `#FFDAD6` | Validation and failure states |

Implemented as CSS variables in `src/app/globals.css`, exposed to Tailwind
via a `@theme inline` block — use the generated utilities (`bg-background`,
`text-primary`, `bg-surface`, etc.), not hard-coded hex values in components.

## Typography

Inter throughout (`next/font/google`, loaded once in `src/app/layout.tsx`),
for a systematic, highly readable feel.

- **Headlines**: tight letter-spacing (-0.01em to -0.02em) at larger sizes.
- **Hierarchy**: driven by weight, not just size — semibold (600) for
  structural headings, medium (500) for interactive labels.
- **Body text**: generous line height (1.5–1.6x) so long-form reading feels
  airy rather than cramped.

## Layout & spacing

- 12-column grid on desktop, max content width 1280px (`max-w-6xl` ≈ 1152px
  is the app shell's working width — adjust up if a screen genuinely needs
  more room).
- Mobile: single column, 16px side margins.
- All spacing in multiples of 4px — Tailwind's default scale already
  satisfies this; don't introduce arbitrary spacing values.
- On narrow/tablet widths, prioritize the primary content — collapse
  secondary panels rather than cramming columns.

## Elevation & depth

Hierarchy comes from ambient shadows and tonal layering, not borders.

- **Shadows**: use the `.shadow-soft` utility (`0px 4px 20px -2px
  rgba(28, 25, 23, 0.08)`) defined in `globals.css`.
- **Tiers**: Level 0 background = Warm White, no shadow. Level 1 secondary
  areas = Soft Gray, no shadow. Level 2 floating elements (cards, modals) =
  White with `.shadow-soft`.
- **Borders**: avoid high-contrast borders; where a separator is truly
  needed, use a 1px `outline-variant` stroke at low opacity (see `TopNav`'s
  `border-outline-variant/40`).

## Shape

- Standard elements (buttons, inputs, standard cards): `rounded-control`
  (8px).
- Large containers (modals, prominent dashboard cards): `rounded-container`
  (16px).
- Interactive states may use a slightly higher radius on hover to feel more
  tactile — don't apply this by default.

## Components

- **Buttons**: primary = Coral fill, white text; secondary = Soft Gray fill,
  Dark Charcoal text. Avoid outline-only buttons.
- **Cards**: white, `.shadow-soft`, generous internal padding (24px, i.e.
  Tailwind's `p-6`).
- **Input fields**: Soft Gray background at rest; on focus, background turns
  white with a Coral border and the shared `.focus-ring` treatment.
- **Chips/badges**: `rounded-full`, a desaturated tint of the text color as
  background.
- **Lists**: generous vertical padding (12–16px) between items; hover state
  = Soft Gray background.
- **Navigation**: active nav item gets Coral text plus a small vertical
  Coral indicator bar to the left of its label (see `TopNav`).

## Quality floor

- Responsive down to a narrow mobile viewport on every screen.
- Visible keyboard focus on every interactive element (`.focus-ring`).
- Respect `prefers-reduced-motion` (already handled globally in
  `globals.css`).
- Errors state what happened and how to fix it, in the interface's voice —
  never vague, never apologetic.
