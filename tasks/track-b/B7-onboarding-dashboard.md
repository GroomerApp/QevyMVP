# B7 — Onboarding, CSV Import & Dashboard

**Track:** B (Shaq) · **Depends on:** B1, B2 · **Estimate:** 4–5 hrs

**Owns:** `app/(app)/onboarding/**`, `app/(app)/dashboard/**`, CSV import in
`app/(app)/settings/`

The "one-sitting setup" promise is the answer to the #1 complaint about
competitor tools. This task is where that promise is kept or broken.

## Goal

A salon owner goes from signup to a usable, populated app in under an hour,
alone, with no call.

## Build

**Onboarding wizard** — resumable, showing progress, skippable per step:

1. Salon name, timezone, address
2. Business hours
3. Services — **offer sensible defaults** (Full Groom, Bath & Brush, Nail Trim,
   De-shed) with typical durations and buffers pre-filled. Editing a
   pre-filled list is minutes; building one from nothing is where owners give
   up and close the tab.
4. Staff — or "it's just me," which should be the fastest path since it is the
   most common case
5. Import clients (CSV) or skip
6. SMS setup — with an honest status. If the 10DLC campaign is pending, say so
   plainly: reminders go by email until it clears, and here is roughly when.

**Resumable is not optional.** Owners will be interrupted by an actual dog.
Persist after every step and let them land back where they left off.

**CSV import** — the make-or-break for the one-hour promise. They are switching
*from* something and their client book must come with them.

- Upload → column mapping UI (never assume a fixed header order)
- Preview the first 10 rows as they will be imported
- Validate: normalise phones to E.164, flag duplicates and bad rows
- Import valid rows, produce a downloadable error report for the rest
- **Partial success is the normal outcome** — never all-or-nothing on one bad
  row in a 400-row file
- Support one row per pet with owner columns repeated, which is how every
  competitor exports

**Dashboard** — the daily home screen:

- Today's appointments, time-ordered, with pet, client, groomer, service,
  status, and behavior flags
- One-tap status changes (check in, complete)
- No-show risk badges from A6 where present
- Quick counts: today's appointment count, expected revenue, unconfirmed count
- Groomers see their own day; owners see everyone
- **Mobile-first.** This is opened on a phone, standing up, many times a day.

**Empty states everywhere** — every list needs a real first-run state that says
what to do next. A new salon sees nothing but empty screens on day one, and
that is their first impression of the product.

## Acceptance criteria

- [ ] A new account reaches a usable app in under an hour, timed for real, with
      nobody helping
- [ ] Wizard is resumable across sessions and devices
- [ ] Default services are pre-filled and editable
- [ ] "It's just me" is the fastest staff path
- [ ] A 200-row CSV with 5 bad rows imports 195 and reports the 5
- [ ] Column mapping handles arbitrary header names and orders
- [ ] Phones normalise to E.164 on import
- [ ] Dashboard shows today accurately in salon-local time
- [ ] Behavior flags visible on dashboard rows
- [ ] Status changes are one tap on mobile
- [ ] Every empty state tells the user what to do next
- [ ] SMS-pending status is stated honestly, not hidden

## Watch out for

- **A wizard that loses progress on refresh.** Guaranteed to happen mid-setup,
  and it is the exact moment the one-hour promise dies.
- **All-or-nothing CSV import.** Real exports always have a few malformed rows.
  Rejecting the whole file is the most common reason an import "doesn't work."
- **Assuming a fixed CSV format.** Every competitor exports differently. The
  mapping step is the feature.
- **Hiding the 10DLC pending state.** An owner who thinks SMS is live and finds
  out from an angry client is worse than one who was told up front.
- **Empty states that just say "No data."** This is the new user's entire first
  impression.
- Do not put anything on the dashboard that needs explaining. It is read in
  three seconds between dogs.

## Checklist

- [ ] Resumable wizard, all six steps
- [ ] Default service templates
- [ ] CSV upload + column mapping + preview
- [ ] Validation, partial import, error report
- [ ] Dashboard with today's appointments
- [ ] One-tap status changes
- [ ] Role-scoped views
- [ ] Empty states across the app
- [ ] Timed under-one-hour setup run
- [ ] `npm run check` green
- [ ] Merged to `main`
