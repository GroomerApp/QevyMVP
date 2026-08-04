# A3 — Calendar Views

**Track:** A (Hadi) · **Depends on:** A2 · **Estimate:** 5–7 hrs

**Owns:** `app/(app)/calendar/**`, `app/(app)/appointments/**`,
`components/calendar/**`

The screen the salon lives in all day. Everything else is visited; this is
inhabited.

## Goal

Day, week, and staff views. Create, move, and edit appointments.

## Build

**Day view** — vertical timeline, one column per groomer, 15-minute gridlines,
a now-indicator line. Default view on desktop.

**Week view** — seven columns, compressed blocks. Read-heavy.

**Staff view** — one groomer at a time, full week. This is what an individual
groomer opens.

**Appointment block** — pet name, breed, service, and the behavior flags from
`pet.behavior_flags`. If a pet is flagged `bites` or `muzzle_required`, that
must be visible on the block itself without opening anything. It is a safety
field, not metadata.

**Appointment detail sheet** — opens on click. Client and pet summary, service,
price, status transitions (check in, complete, no-show, cancel), notes, and the
photo strip. Track B owns the notes and photo components; import them, do not
rebuild them.

**Create / edit** — a drawer that picks client → pet → service → groomer →
slot, sourcing slots from `src/data/availability.ts`. Show the `SlotTakenError`
inline, not as a toast that disappears.

**Drag to reschedule** on day view. Optimistic move, revert visibly on
conflict.

## Acceptance criteria

- [ ] All times render in `salon.timezone` regardless of the viewer's device
      timezone — test with the machine clock set to another timezone
- [ ] Day, week, and staff views all render seeded data correctly
- [ ] Behavior flags are visible on the block without opening the detail
- [ ] Creating an appointment only offers genuinely available slots
- [ ] A conflicting drag reverts and explains why
- [ ] Status transitions persist and fire the right Inngest events
- [ ] Usable one-handed on a 390px-wide phone. Groomers are not at a desk.
- [ ] A groomer role sees only their own column by default; owner sees all

## Watch out for

- **Rendering in the browser's timezone.** The salon owner checking the
  schedule from vacation must see salon time. This will look fine on your
  machine and be wrong in production.
- **Building on a heavyweight calendar library.** You will spend longer
  fighting its model than writing the grid. Absolute-positioned blocks over a
  CSS grid is genuinely less work here.
- **Desktop-first.** Groomers use phones. If you build the desktop grid first
  you will rebuild it.
- **Rebuilding Track B's note and photo components** because importing felt
  awkward. Import them.

## Checklist

- [ ] Day view with now-indicator
- [ ] Week view
- [ ] Staff view
- [ ] Appointment block with behavior flags
- [ ] Detail sheet with status transitions
- [ ] Create/edit drawer against real availability
- [ ] Drag to reschedule with conflict revert
- [ ] Mobile pass at 390px
- [ ] `npm run check` green
- [ ] Merged to `main`
