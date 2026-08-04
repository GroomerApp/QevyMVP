# A2 — Appointment Persistence & Booking Safety

**Track:** A (Hadi) · **Depends on:** A1 · **Estimate:** 3–4 hrs

**Owns:** `src/data/appointments.ts`, `src/data/availability.ts`,
`src/domain/pricing/**`

## Goal

Turn the pure solver into real bookings that cannot double-book, ever.

## Build

**`src/data/availability.ts`** — loads working hours, time off, services, and
existing appointments for a salon/groomer/date range, hands them to
`computeAvailability`, returns slots. This is the only place the engine meets
the database.

**`src/data/appointments.ts`** — `createAppointment`, `rescheduleAppointment`,
`cancelAppointment`, `markNoShow`, `markCompleted`, `checkIn`, plus list and
get. Every function takes `salonId` first.

On create:

1. Resolve the service, compute both time ranges (buffered and unbuffered)
2. Snapshot `price_cents_snapshot` from the service
3. Insert inside a transaction
4. **Catch the `appointment_no_overlap` violation** and return a typed
   `SlotTakenError`, not a 500
5. Emit `appointment/booked` via Inngest

Cancel emits `appointment/cancelled`; complete emits `appointment/completed`.
Track B's notification jobs consume these. Track A does not know SMS exists.

**`src/domain/pricing/`** — resolve the price for a service, with hooks for
size- or breed-based modifiers later. Keep it pure.

## Acceptance criteria

- [ ] Two concurrent bookings for the same slot → exactly one succeeds, the
      other gets `SlotTakenError` with a usable message
- [ ] There is a test that actually fires both inserts in parallel and asserts
      this. Not a comment claiming it works.
- [ ] Cancelled and no-show appointments free their slot (the constraint's
      `WHERE` clause covers this — verify it)
- [ ] Rescheduling into a taken slot fails cleanly
- [ ] `price_cents_snapshot` does not change when the service price later does
- [ ] All three Inngest events fire with the right payloads
- [ ] Every function takes `salonId` first and filters on it

## Watch out for

- **Relying on a "check then insert" read.** The read-then-write gap is exactly
  where the race lives. The database constraint is the guarantee; the
  application check is only for a nicer error message.
- **Letting the constraint violation surface as a 500.** The user sees a broken
  app instead of "that slot was just taken."
- **Forgetting the buffer ranges** on the insert. `start_at`/`end_at` must be
  buffer-inclusive or the constraint protects the wrong interval.
- Do not emit Inngest events inside the transaction — emit after it commits, or
  a rolled-back booking still sends a confirmation text.

## Checklist

- [ ] `availability.ts` wired to the A1 engine
- [ ] Appointment CRUD with `salonId` scoping
- [ ] `SlotTakenError` mapped from the constraint violation
- [ ] Parallel-insert race test passing
- [ ] Inngest events emitted post-commit
- [ ] `npm run check` green
- [ ] Merged to `main`
