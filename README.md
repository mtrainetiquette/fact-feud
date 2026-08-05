# Fact Feud

A Family Feud–style classroom game for guessing statistics and poll results. Three pages, one Supabase backend, built to survive classroom Wi-Fi.

## Setup (once, ~5 minutes)

1. **Database:** open your Supabase dashboard → SQL Editor → New query → paste all of `schema.sql` → Run. This creates the tables and loads a fully-cited seed bank (33 questions, 2 ready-to-play games, a demo roster). Safe to re-run, but re-running wipes and reseeds everything.
2. **Hosting:** put these files on any static host (Netlify, GitHub Pages, Vercel, a school web server) — or just open `play.html` locally in a browser. No build step.
3. **Password:** open `admin.html`. On first visit it asks you to create the teacher password. That's it.

## The three pages

| Page | Who uses it | Where |
|---|---|---|
| `play.html` | Teacher | Projector laptop |
| `buzzer.html` | The two contestants | A student laptop at the front — one student on Left Shift, one on Right Shift. Space resets. Works with zero network. |
| `admin.html` | Teacher | Anywhere, password-gated. Needs a connection to save. |

## Running a round

1. Pick a game and a roster. Use **Call a random student** twice, assigning one to Left and one to Right.
2. Read the prompt. Students race on the buzzer laptop; you click (or Shift-key) whoever it shows won.
3. Type their guess. **Within the band → instant point.** The band is shown to you (not the class) under the input.
4. Outside the band → the opponent guesses and must land **strictly closer** to steal. Ties and worse guesses leave the point with the first buzzer — someone always scores once a round is underway.
5. The answer flips over with the **full citation displayed** — modelled the way students should cite it in their own research — plus an optional teaching note.
6. Override buttons on the reveal let you move or remove the point. Space bar advances.

## Tolerance rules

Default is **relative**: ±10% *of the true value* (true answer 40 → 36–44). Questions with small answers are seeded with **absolute** bands instead (e.g., ±2 points), because ±10% of 2 is unwinnable. Set either mode per question in Admin.

## Resilience

- Selecting a game caches all questions, answers, and rosters in the browser. Mid-game Wi-Fi loss changes nothing — an **OFFLINE · CACHED** chip just appears.
- Every score, player, and round survives a refresh, a crash, or a closed laptop lid. **End session** (with confirm) is the only way to clear it.
- No scores or student results are ever written to the database. Rosters store display names only.

## Security honesty

The password gate stops students from wandering into Admin. It does **not** stop someone who opens devtools — the anon key can write to the tables directly. Two habits cover the realistic risk: use **Settings → Export library to JSON** now and then, and migrate the write policies to real Supabase auth (`to authenticated`) when you're ready. The schema needs no changes for that migration.

## Files

- `schema.sql` — tables, RLS, and seed data. Every seeded value was retrieved from its live source (Census QuickFacts; Pew 2023–24 Religious Landscape Study) on 2026-08-05, with the full citation stored on the question.
- `config.js` — Supabase URL + publishable key, shared helpers. The only file with credentials.
- `factfeud.css` — shared theme, built from the class style guide palette.
- `play.html`, `admin.html`, `buzzer.html`
