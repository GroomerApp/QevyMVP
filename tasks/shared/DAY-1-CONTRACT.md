# Day 1 — The Contract Commit

**Both tracks. Done ONCE, by ONE agent, with both people present.**
**Nothing else in this repo starts until this is merged to `main`.**

Estimate: 3–5 hours.

## Why this exists

After this commit, Track A and Track B never need to edit the same file. The
entire parallel setup depends on getting the schema and the module interfaces
right up front. Spending an extra hour here saves days of merge conflicts.

## Owns

Everything. This is the only task that touches shared files freely.

---

## Part 1 — Off-keyboard, do this FIRST

These take days of wall-clock time and nothing about them gets faster if you
start them later. Do them before writing a line of code.

- [ ] **Submit Twilio A2P 10DLC Brand registration** for Qevy
- [ ] **Submit the shared ISV Campaign** — this is the launch critical path
- [ ] Create the Stripe platform account, enable Connect
- [ ] Create the Supabase project (pick the region closest to the pilot salon)
- [ ] Create Vercel, Inngest, Resend, Deepgram, Sentry accounts
- [ ] **Start looking for a pilot salon.** Zero build hours, and it is the
      other thing that gates launch.

---

## Part 2 — Scaffold

- [ ] `create-next-app` — TypeScript, App Router, Tailwind, ESLint, `src/`
- [ ] `tsconfig.json` with `"strict": true` and path alias `@/*`
- [ ] Prettier + ESLint, including a lint rule that forbids importing
      `next/*`, `drizzle-orm`, or any vendor SDK inside `src/domain/`
- [ ] Vitest for unit tests, Playwright for E2E
- [ ] `npm run check` = `tsc --noEmit && eslint . && vitest run`
- [ ] `.env.example` with every variable from `docs/CONTRACT.md` §5
- [ ] `.gitignore` — `.env.local`, `.next`, `node_modules`, `*.mkv`, `*.mp4`
- [ ] Deploy to Vercel, confirm the placeholder page loads

## Part 3 — Install every shadcn component now

Do this once, here. Two agents running `shadcn add` later will conflict in
`components/ui/` and `package.json` every time.

```
button input label textarea select checkbox switch radio-group
form dialog sheet drawer popover dropdown-menu tooltip
card table tabs badge avatar separator skeleton
calendar toast sonner alert alert-dialog scroll-area
command combobox progress accordion
```

- [ ] All installed and committed

## Part 4 — Database schema

Transcribe **every table** in `docs/CONTRACT.md` §2 into `src/db/schema/`,
one file per entity. All of them, even the ones neither track uses until Day 8.
Adding tables later is the thing that forces both tracks to rebase.

- [ ] Enable `pgcrypto` and `btree_gist` extensions
- [ ] All tables, enums, and foreign keys
- [ ] `salon_id` indexed on every tenant-scoped table
- [ ] The `appointment_no_overlap` EXCLUDE constraint from CONTRACT §2
- [ ] RLS policies scoping on `salon_id`
- [ ] Initial migration generated and applied
- [ ] Seed script: one salon, one owner, two groomers, four services,
      six clients, eight pets, a fortnight of appointments

The seed matters more than it looks. Both tracks develop against it all week,
and a realistic seed is what makes bugs visible early.

## Part 5 — Auth and tenancy

- [ ] Supabase Auth: email magic link + password
- [ ] Session helper resolving the current `app_user` and `membership`
- [ ] `requireSalon()` returning `{ salonId, userId, role }` or redirecting
- [ ] `requireRole('owner')` guard
- [ ] Authed layout shell with nav; groomers see a reduced nav
- [ ] Verify a second salon's account cannot read the first salon's data

**Do not move on until that last check passes.** A tenant leak is the worst bug
this app can ship.

## Part 6 — Stub every module interface

Create every module in `docs/CONTRACT.md` §3 with real type signatures and a
`throw new Error('not implemented')` body.

- [ ] `src/domain/scheduling`, `matching`, `risk`, `pricing`
- [ ] `src/services/sms`, `email`, `storage`, `transcription`, `payments`
- [ ] `src/data/` — one file per entity, every function taking `salonId` first
- [ ] Inngest client + the five events from CONTRACT §4 typed
- [ ] Empty route folders per the ownership map in CONTRACT §1

This is what lets both tracks start at once without either waiting. Track A can
import `Messenger` on Day 2 even though Twilio is not wired until Day 5.

## Part 7 — Handoff

- [ ] Merge to `main`
- [ ] Both people pull and confirm `npm run check` and `npm run dev` work
- [ ] Shaq confirms his agent reads `CLAUDE.md` and finds `tasks/track-b/`
- [ ] Split up and start A1 / B1

---

## Acceptance criteria

- `npm run check` passes on a clean clone
- `npm run dev` boots, login works, seeded data renders
- A second salon account sees none of the first salon's data
- Every interface in CONTRACT §3 exists and typechecks
- Both agents can start their Day 2 task without touching a shared file
- 10DLC campaign is **submitted**

## Watch out for

- **Skipping the "all tables now" step** because a table isn't needed yet. This
  is the single most likely cause of a painful mid-week rebase.
- **Storing `working_hours` in UTC.** It is salon-local minutes on purpose, so
  a 9am shift stays 9am across DST. See CONTRACT §2.
- **Forgetting `btree_gist`.** The overlap constraint silently cannot be
  created without it.
- **Deferring the 10DLC submission to "once we have something to show."** That
  choice directly moves the launch date.
