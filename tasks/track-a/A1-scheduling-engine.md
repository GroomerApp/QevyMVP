# A1 — Scheduling Engine

**Track:** A (Hadi) · **Depends on:** Day 1 · **Estimate:** 4–6 hrs

**Owns:** `src/domain/scheduling/**`

The most correctness-sensitive task in the project. Everything downstream —
booking, calendar, reminders — is wrong if this is wrong.

## Goal

A pure function that takes a salon's rules and returns bookable slots.

## Build

Implement `computeAvailability` and `hasConflict` exactly as typed in
`docs/CONTRACT.md` §3.

The solver, in order:

1. Expand the UTC `dateRange` into salon-local days using `timezone`.
2. For each local day, resolve `workingHours` for that weekday into real UTC
   instants. **This is where DST is handled** — resolve local-minutes-to-UTC
   per day, never by adding a fixed offset.
3. Subtract `timeOff` intervals.
4. Subtract `existingAppointments` (already buffer-inclusive).
5. Walk the remaining windows at `slotGranularityMin`, emitting a slot wherever
   `bufferBefore + duration + bufferAfter` fits.
6. Drop slots starting sooner than `minimumNoticeMin` from `dateRange.startAt`.
7. Return both the service range and the buffer-inclusive range per slot.

Use `date-fns-tz` or `Temporal`. No hand-rolled offset math.

## Testing — write these first

Table-driven, one case per row. Target 60+ cases.

Must cover:

- Empty day, full day, exactly-one-slot-left
- Buffers that make a nominally-free gap unusable
- Appointment ending exactly when another begins (adjacent, not overlapping)
- Split shifts (9–12, 2–5 on the same weekday)
- Time off partially and fully covering a shift
- **Spring-forward day** — 2am does not exist; a 9am shift is still 9am local
- **Fall-back day** — 1am–2am happens twice; must not emit duplicate slots
- A salon in a non-US timezone
- A `dateRange` spanning a DST boundary
- `minimumNoticeMin` filtering
- Service longer than any available window → zero slots

## Acceptance criteria

- [ ] Both functions match CONTRACT §3 signatures exactly
- [ ] 60+ table-driven cases pass, including all DST cases above
- [ ] Zero imports of `next/*`, `drizzle-orm`, or any vendor SDK — the lint
      rule enforces this
- [ ] No `Date.now()`, no `new Date()` without an argument — every input is
      explicit and the whole suite is deterministic
- [ ] Suite runs in under 500ms

## Watch out for

- **Adding a fixed UTC offset instead of resolving per-day.** This works for
  ~360 days a year and produces a wrong calendar twice. It is the single most
  likely bug in this file.
- **Confusing the two ranges.** Buffers are included for conflict detection and
  excluded from what the client is shown. Mixing them double-books.
- **Off-by-one at window edges.** An appointment ending at 10:00 and one
  starting at 10:00 do not overlap. Use half-open ranges `[start, end)`
  consistently.
- Do not reach for a scheduling library. The rules here are specific enough
  that you will spend longer fighting it than writing it.

## Checklist

- [ ] Types transcribed from CONTRACT §3
- [ ] Test table written (before implementation)
- [ ] `hasConflict` implemented
- [ ] `computeAvailability` implemented
- [ ] DST cases pass
- [ ] `npm run check` green
- [ ] Merged to `main`
