# Roadmap

Two builders, each driving an AI coding agent, working in parallel tracks.

## Sequencing

```
Day 1      SHARED — contract commit (one agent only, both people present)
           + kick off 10DLC registration, Stripe account, pilot salon search

Day 2-3    A1 scheduling engine          |  B1 salon/services/hours
           A2 appointment persistence    |  B2 clients & pets

Day 4-5    A3 calendar views             |  B3 media storage
           A4 public booking flow        |  B4 notifications  <-- heaviest on B

Day 6-7    A5 groomer matching           |  B5 voice-to-notes
           A6 no-show risk               |  B6 before/after photo send

Day 8      A7 payments                   |  B7 onboarding, CSV import, dashboard

Day 9-12   INTEGRATION + real-device testing + bug fixing (both)
```

Track A owns 7 tasks, Track B owns 7. B4 is the heaviest single task in the
project; A1 is the most correctness-sensitive.

## What gates launch

**Not code.** After Day 12 the app is code-complete and tested. Launch is gated
on two things that no amount of build speed affects:

1. **A2P 10DLC campaign approval** — typically 1–3 weeks from submission.
   Submit on Day 1. Until it clears, reminders fall back to email and the
   settings page shows an SMS-pending banner.
2. **A pilot salon** willing to run their real Saturday on this.

Start both on Day 1. They are the schedule.

## Realistic dates

| | |
|---|---|
| Contract commit | Day 1 |
| Code complete | ~Day 12 |
| 10DLC approval | 1–3 weeks from Day 1 submission |
| **Live pilot** | **early-to-mid September 2026** |

## Deliberately deferred

- Square as a second processor — interface defined, not implemented
- Client-facing accounts — SMS signed links only
- AI phone receptionist — Phase 2
- Multi-location, boarding/daycare, payroll

## The one thing to protect

Days 9–12. A booking system built in under two weeks will have bugs that only
appear when a human tries to double-book a slot, or watches a reminder land on
a real phone, or uploads a photo on bad wifi. Those days are where that gets
found. Cutting them is how this ships broken.
