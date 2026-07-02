# CramWell 🦉

**Snap. Solve. Retain.**

CramWell is a study app built on one idea: every problem you photograph is a perfect signal of what you don't know yet. So every snap becomes a step-by-step solution *and* a flashcard, scheduled with real spaced repetition (FSRS) so you review it right before you'd forget it.

## Features (v1)

- 📸 **Snap a problem** — photo upload (camera on mobile) with a scan-sweep solve animation. Currently runs in **demo mode**: snaps cycle through pre-worked problems until the AI solver (Claude API) is wired up.
- 🪜 **Step-by-step solutions** — properly typeset math (KaTeX), steps cascade in, confetti on solve.
- 🃏 **Review** — flip cards, self-grade Again/Hard/Good/Easy, scheduled by [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs).
- ⏳ **Cram Mode** — set an exam date, see an honest coverage meter, and pull forward everything due in the next 3 days.
- 📋 **Notes → flashcards** — paste notes (one fact per line, `Term: definition` or `Question? Answer`) and get a deck instantly. AI generation from PDFs/photos plugs in here later.
- 🧠 **Learn Mode** — adaptive multiple-choice and true/false; each card needs 2 correct answers to be mastered, and answers feed the FSRS scheduler.
- 📝 **Practice test** — a scored 8-question dress rehearsal (doesn't touch your review schedule).
- ⚡ **Match** — timed tap-to-pair game: questions vs answers, race the clock.
- 🔥 Streaks, stats, and Crammy the owl. All data stays on-device (localStorage).

## Run it

```bash
cd app
npm install
npm run dev        # local dev server
npm run build      # production build to dist/
node scripts/walkthrough.mjs   # Playwright screenshot walkthrough (needs `npm run preview` on :4173)
```

## Design

The UI follows the CramWell design system — warm cream, crayon-box palette, Nunito, squishy pills, spring motion — codified in `.claude/skills/premiumapp/SKILL.md`.
