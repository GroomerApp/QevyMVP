# B1 — Salon Settings, Services & Hours

**Track:** B (Shaq) · **Depends on:** Day 1 · **Estimate:** 3–4 hrs

**Owns:** `app/(app)/settings/**`, `src/data/salons.ts`, `src/data/services.ts`

Start here. Track A's scheduling engine consumes this data, so getting it in
early makes their work testable against something real.

## Goal

An owner configures the salon, its services, its staff, and everyone's hours.

## Build

**Salon profile** — name, slug (used in the public booking URL — validate
uniqueness and URL-safety), address, phone, email, and **timezone as an IANA
picker**, defaulted from the browser but explicitly confirmed. Everything in
the app renders against this value; a wrong timezone here breaks the whole
calendar.

**Services** — CRUD over `name`, `description`, `duration_min`,
`buffer_before_min`, `buffer_after_min`, `price_cents`, `active`, `sort_order`.
Reorderable. Price entered in dollars, stored as integer cents.

Buffers need a one-line explanation in the UI — most owners will not know what
they are, and they materially affect how many appointments fit in a day.

**Staff** — invite by email (creates `app_user` + `membership`), assign role
(owner/groomer), create the `groomer` record with display name, bio, and a
calendar colour. Support a groomer who has not accepted their invite yet, and
an owner who does not groom.

**Working hours** — a weekly grid per groomer. **Store as salon-local minutes
from midnight**, per `docs/CONTRACT.md` §2 — not UTC. Support split shifts
(9–12, 2–5 same day).

**Time off** — date-range blocks per groomer with an optional reason.

## Acceptance criteria

- [ ] Slug is unique, URL-safe, and resolves the public booking page
- [ ] Timezone is explicitly confirmed, not silently defaulted
- [ ] Services CRUD works; prices round-trip as exact integer cents
- [ ] A groomer can be created before they have logged in
- [ ] An owner can exist without a groomer record
- [ ] Split shifts save and reload correctly
- [ ] Working hours are stored as local minutes — verify in the database, not
      just the UI
- [ ] Time off saves and is visible to Track A's availability query
- [ ] Only owners reach settings; groomers get a 403, not a broken page

## Watch out for

- **Storing working hours in UTC.** A 9am shift must stay 9am after a DST
  change. Storing UTC shifts everyone's schedule by an hour twice a year. This
  is the highest-consequence detail in the task.
- **Floats for price.** `19.99 * 100` is not reliably `1999`. Parse to integer
  cents carefully.
- **Silently defaulting the timezone** from the browser. An owner setting up
  from a laptop while travelling will configure the wrong salon timezone and
  not find out for weeks.
- Do not model working hours as JSON on the groomer row. It is a table for a
  reason — Track A queries it directly.

## Checklist

- [ ] Salon profile with IANA timezone picker
- [ ] Slug validation + uniqueness
- [ ] Services CRUD with buffers and cents handling
- [ ] Staff invite, roles, groomer records
- [ ] Weekly hours grid with split shifts
- [ ] Time off
- [ ] Owner-only access enforced
- [ ] `npm run check` green
- [ ] Merged to `main`
