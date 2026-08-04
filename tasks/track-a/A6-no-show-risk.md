# A6 — No-Show Risk Flag

**Track:** A (Hadi) · **Depends on:** A3 · **Estimate:** 2–3 hrs

**Owns:** `src/domain/risk/**`, the risk badge in `app/(app)/calendar/`

## Goal

Surface likely no-shows to the front desk, with reasons, without insulting good
clients.

## Read this before building

This feature has a **cold-start problem**. A new salon has no history, so any
score computed in the first months is noise. Worse, wrongly flagging a loyal
client as high-risk in front of them destroys trust in the feature permanently
and they will never look at it again.

The design answer is to say nothing when we do not know. `RiskResult.score` is
nullable for exactly this reason.

## Build

`scoreNoShowRisk` per `docs/CONTRACT.md` §3. Pure. **Rules-based, not ML** —
we have no data, and an unexplainable score is unusable at a front desk.

Signals:

- Prior no-shows, weighted by recency
- Late cancellations
- Very last-minute booking (< 24h notice)
- First-time client with no history — mild, and never on its own enough to flag
- Offset by completed appointments — a long good history should outweigh one
  old no-show

**Return `score: null`, `band: 'unknown'`** when the client has fewer than 3
completed appointments AND no prior no-show. Below that threshold we do not
know enough to say anything.

Recompute on booking and on the daily reminder job, writing `no_show_risk_score`
and a **`no_show_risk_reasons` JSON snapshot** to the appointment — so a score
from six months ago still explains itself.

**UI:** a small badge on the calendar block and detail sheet, shown only for
medium and high. Hovering or tapping shows the reasons. Never show a bare
number.

## Acceptance criteria

- [ ] Matches CONTRACT §3; pure, no vendor imports
- [ ] Returns `null` / `'unknown'` below the history threshold
- [ ] A client with 20 completed and 1 old no-show does **not** score high
- [ ] Every non-null score has at least one reason
- [ ] Reasons snapshot persists on the appointment
- [ ] Badge hidden entirely for low and unknown
- [ ] Table-driven tests covering: no history, good history, recent no-show,
      pattern of late cancels, last-minute booking

## Watch out for

- **Showing a score to the client.** This is staff-only, always. It never
  appears in booking, SMS, or any client-facing surface.
- **Flagging on thin data** because a number felt better than a blank. A wrong
  flag costs more than a missing one.
- **Reaching for a model.** There is no training data, and the front desk needs
  to be able to explain the flag out loud.
- Do not let the badge dominate the calendar block. It is a hint, not an alarm.

## Checklist

- [ ] Scoring rules implemented
- [ ] Null-below-threshold behavior
- [ ] Tests including the loyal-client-with-one-old-no-show case
- [ ] Persist score + reasons snapshot
- [ ] Badge with reasons, staff-only
- [ ] `npm run check` green
- [ ] Merged to `main`
