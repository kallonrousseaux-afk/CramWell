---
name: premiumapp
description: CramWell's app-specific design skill. Use whenever building or restyling ANY CramWell UI — screens, components, prototypes, marketing pages. Extends the general frontend-design skill with CramWell's warm, colorful, welcoming design system (crayon palette, rounded type, squishy buttons, bouncy motion, Crammy the owl). Read frontend-design/SKILL.md first for general craft, then apply everything here on top.
---

# PremiumApp — CramWell UI Skill

CramWell is a study app whose core loop is **Snap → Solve → Retain**: students photograph a problem, get a step-by-step solution, and every solved snap auto-becomes a flashcard in a spaced-repetition (FSRS) review queue. The vibe is **warm, fun, and welcoming — never childish, never corporate-dark**. If a screen wouldn't make a stressed student exhale, redo it.

Always read `../frontend-design/SKILL.md` first for general premium-UI craft; this file overrides it wherever they conflict.

## Palette — "the crayon box"

Light-first. One hero accent per screen, never all five at once.

| Token | Hex | Use |
|---|---|---|
| `bg` | `#FFF9F0` | Warm cream app background |
| `surface` | `#FFFFFF` | Cards, sheets |
| `ink` | `#2B2438` | Primary text (warm near-black) |
| `ink-soft` | `#6E6580` | Secondary text |
| `coral` | `#FF6B6B` | Hero accent — Snap & Solve, primary CTAs |
| `sunshine` | `#FFC94D` | Streaks, celebrations, highlights |
| `mint` | `#3DDC97` | Success, "solved", correct answers |
| `sky` | `#5AB8FF` | Review/flashcards, info |
| `grape` | `#9B7BFF` | Cram Mode, stats, premium |

Subject wayfinding uses pastel tints of the above (e.g. math = pastel coral `#FFE3E3`, science = pastel mint `#DFF8EE`, history = pastel sunshine `#FFF3D6`, languages = pastel sky `#E3F2FF`, other = pastel grape `#EFE9FF`). All text/background pairs must pass WCAG AA.

## Type

- Display & UI: **Nunito** (800 for headings, 700 buttons, 600 body-strong). Rounded, friendly.
- Body: Nunito 400/600, 16px base, 1.5 line height.
- Math: **KaTeX**, properly typeset — the "luxury moment" of a solution.
- Scale: 32 / 24 / 20 / 16 / 14 / 12. Headings tight (-1% tracking), labels loose (+4%, uppercase 12px).

## Shape, depth, spacing

- 4pt grid. Screen padding 20px, card padding 16–20px.
- Radii: cards 20px, buttons full pill, inputs 14px, sheets 28px top.
- No hard shadows: soft colored shadows only (`0 6px 20px` of the element's own color at 25% alpha). Hairline borders `#F0E8DC` for quiet cards.
- Buttons are **squishy pills**: press scales to 0.96 with a spring, colored shadow tightens.

## Motion

Spring-based everywhere (stiffness ~300, damping ~22). Signature moments:
- **Solve animation**: scan sweep over the snapped photo → solution steps cascade in (60ms stagger) → answer card pops with a small confetti burst (mint/sunshine/coral, ≤1s, respects `prefers-reduced-motion`).
- Card flip for flashcards (3D Y-rotate, 350ms spring).
- Streak flame gently pulses; never guilt-trips.

## Voice & mascot

- **Crammy the owl** appears in empty states, onboarding, and celebrations only — small, expressive, never blocking content.
- Copy encourages, never shames: "Nice — 12 cards down!" not "You missed 8." Losing a streak: "Streaks rest too. Pick it back up today?"

## Screen rules

1. Home: greeting + big coral Snap button (the hero, thumb-reachable), today's review queue as sky cards, streak chip in sunshine.
2. Snap flow: full-bleed camera, coral shutter, crop handles; solving state shows the scan sweep, never a bare spinner.
3. Solution: photo thumbnail on top, KaTeX steps as expandable cards, mint "Got it → add to deck" CTA.
4. Review: one card at a time, big flip target, self-grade buttons (Again/Hard/Good/Easy) as four pastel pills.
5. Cram Mode: grape theme, exam-date countdown, honest "coverage" meter — no fake 100%.
6. Never more than one modal deep; sheets over modals; every screen works one-handed.

## Ten hard rules

1. One hero accent per screen.
2. Cream background, never pure white full-screen, never dark-first.
3. Every interactive element springs; nothing snaps instantly.
4. WCAG AA minimum on all text.
5. KaTeX for all math — never ASCII math in the UI.
6. Empty states always have Crammy + one clear action.
7. Celebrate effort, never shame gaps.
8. Pills for buttons, 20px radius cards — no sharp corners anywhere.
9. Soft colored shadows only; no gray drop shadows, no glassmorphism.
10. If it wouldn't feel at home next to Duolingo's polish with Headspace's warmth, redo it.
