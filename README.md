# Qevy

Booking and client management for independent pet grooming salons with 1–3
groomers.

> **Status:** planning complete, implementation not started. The Day 1 contract
> commit is the next step.

## If you just cloned this

**Open Claude Code (or Codex) in this directory and say:**

> Read CLAUDE.md. I'm Shaq — Track B.

Your agent will pick up its instructions, find your tasks, and read the shared
contract. Substitute your own name and track.

Then read, in this order:

1. [`docs/SPEC.md`](docs/SPEC.md) — what we're building and the known risks
2. [`docs/CONTRACT.md`](docs/CONTRACT.md) — **the important one.** Frozen schema,
   module interfaces, and who owns which directories
3. [`docs/WORKFLOW.md`](docs/WORKFLOW.md) — branching and the rules that stop us
   colliding
4. [`docs/ROADMAP.md`](docs/ROADMAP.md) — sequencing and what actually gates launch
5. Your tasks — [`tasks/track-a/`](tasks/track-a/) or [`tasks/track-b/`](tasks/track-b/)

## How this project is built

Two people, each driving an AI coding agent, working in parallel on separate
tracks. The tracks are defined so that neither ever needs to edit the other's
files.

| Track | Owner | Scope |
|---|---|---|
| **A** | Hadi | Scheduling engine, calendar, public booking, matching, no-show risk, payments |
| **B** | Shaq | Salon setup, client & pet records, media, notifications, voice notes, onboarding |

Both start from [`tasks/shared/DAY-1-CONTRACT.md`](tasks/shared/DAY-1-CONTRACT.md),
which is done once, together. Nothing else begins until it is merged.

## Tasks

**Track A** — [A1 scheduling engine](tasks/track-a/A1-scheduling-engine.md) ·
[A2 appointment persistence](tasks/track-a/A2-appointment-persistence.md) ·
[A3 calendar views](tasks/track-a/A3-calendar-views.md) ·
[A4 public booking](tasks/track-a/A4-public-booking.md) ·
[A5 groomer matching](tasks/track-a/A5-groomer-matching.md) ·
[A6 no-show risk](tasks/track-a/A6-no-show-risk.md) ·
[A7 payments](tasks/track-a/A7-payments.md)

**Track B** — [B1 salon & services](tasks/track-b/B1-salon-services-hours.md) ·
[B2 clients & pets](tasks/track-b/B2-clients-and-pets.md) ·
[B3 media storage](tasks/track-b/B3-media-storage.md) ·
[B4 notifications](tasks/track-b/B4-notifications.md) ·
[B5 voice-to-notes](tasks/track-b/B5-voice-to-notes.md) ·
[B6 photo send](tasks/track-b/B6-photo-send.md) ·
[B7 onboarding & dashboard](tasks/track-b/B7-onboarding-dashboard.md)

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind + shadcn/ui · Postgres via
Supabase · Drizzle · Supabase Auth + Storage · Inngest · Twilio · Resend ·
Deepgram · Stripe Connect · Vercel · Sentry

## The two things that gate launch

Neither is code. Both should be started on Day 1, before any building.

1. **A2P 10DLC campaign approval** — 1–3 weeks of wall-clock time from
   submission. Without it, SMS is filtered or blocked. This is the critical
   path, and writing code faster does not move it.
2. **A pilot salon** willing to run a real Saturday on this.

## Local setup

Not yet applicable — the scaffold lands in the Day 1 contract commit. After
that:

```bash
nvm use          # Node 22 — required
npm install
cp .env.example .env.local   # fill in
npm run db:migrate
npm run db:seed
npm run dev
```

Before every commit:

```bash
npm run check
```
