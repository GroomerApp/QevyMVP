# Qevy — Agent Instructions

Booking and client management for independent pet grooming salons (1–3 groomers).

**This repo is built by two people in parallel, each driving an AI coding agent.**
Before doing anything else, work out which track you are on.

## Step 1 — Identify your track

Ask the user: **"Are you Hadi (Track A) or Shaq (Track B)?"**

Do not guess. Do not start work until you know.

| Track | Owner | Domain |
|---|---|---|
| **A** | Hadi | Scheduling engine, calendar, public booking, matching, no-show risk, payments |
| **B** | Shaq | Salon/service setup, client & pet records, media, notifications, voice notes, onboarding |

## Step 2 — Read your assignment

- Track A → read every file in `tasks/track-a/`, in numeric order.
- Track B → read every file in `tasks/track-b/`, in numeric order.

Then read, regardless of track:

1. `docs/CONTRACT.md` — the frozen database schema and module interfaces. **This is the single most important file in the repo.** It is the boundary that lets two agents work at once without colliding.
2. `docs/WORKFLOW.md` — branching and the rules that prevent merge conflicts.
3. `docs/SPEC.md` — what we're building and why.
4. `docs/ROADMAP.md` — order and sequencing.

## Step 3 — Work only inside your lane

`docs/CONTRACT.md` lists exactly which directories each track owns.

**Never edit a file owned by the other track.** If you need a change on the
other side of the boundary, stop and tell the user — they will coordinate it.
Silently editing across the boundary is how this project breaks.

## Hard rules

1. **The schema in `docs/CONTRACT.md` is frozen.** Changes are additive only,
   in a new migration file, and require telling the user first so the other
   track can rebase.
2. **Never edit an existing migration.** Ever.
3. **Do not run `shadcn add`.** All components are installed in the Day 1
   contract commit. If one is genuinely missing, tell the user.
4. **No shared `utils.ts`, `helpers.ts`, or `common/`.** These become the
   collision point every time. Put helpers next to the code that uses them.
5. **Small commits, pushed daily.** A branch older than ~24 hours will not
   merge cleanly at the speed this project moves.
6. **`src/domain/` never imports Next.js, Drizzle, or any vendor SDK.** It is
   pure functions over plain data so it can be unit-tested in milliseconds.
7. **Every function in `src/data/` takes `salonId` as its first argument.**
   This is a multi-tenant app. A tenant leak is the worst bug we can ship.

## Conventions

- TypeScript everywhere, `strict: true`.
- All timestamps stored UTC (`timestamptz`). Salon-local rendering uses
  `salon.timezone` (IANA). Never store a local time.
- Money is integer cents, never floats.
- Tests live beside the code for unit tests, `tests/e2e/` for Playwright.
- Run `npm run check` (typecheck + lint + unit tests) before every commit.

## Marking progress

Task files have a checklist at the bottom. Tick items as you complete them and
commit the updated task file with the work. That is how the other track sees
where you are.
