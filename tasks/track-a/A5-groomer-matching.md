# A5 — Groomer-to-Dog Matching

**Track:** A (Hadi) · **Depends on:** A4 · **Estimate:** 2–3 hrs

**Owns:** `src/domain/matching/**`, the recommendation UI inside `app/book/`

## Goal

Groomers tag their specialties; booking recommends the best-suited groomer for
that dog, with a visible reason.

## Read this before building

This is a real gap — no known competitor does it. But be clear-eyed about where
it lands for our actual customer: **at one groomer there is nothing to match,
and at two the answer is usually obvious.** It gets genuinely valuable at 5+
groomers, which is outside Phase 1.

It is cheap to build and worth having. It should not be the lead in a sales
conversation, and it should not consume more than the estimate. If it starts
sprawling, ship what you have.

## Build

`rankGroomers` per `docs/CONTRACT.md` §3. Pure, no I/O.

Scoring, roughly:

- Exact breed match on a specialty tag — strongest signal
- Coat type match — strong
- Size match — moderate
- Temperament match against the pet's `behavior_flags` — moderate, and it
  should dominate when a pet is flagged `bites` or `muzzle_required`
- Weight each by the groomer's `proficiency` (1–5)
- Normalize to 0–100

Return `reasons` as short human strings: `"Handles poodle coats (expert)"`,
`"Experienced with anxious dogs"`. The reasons are the feature — a bare number
nobody can explain gets ignored.

**Suppress the whole thing when the salon has fewer than two active groomers.**
Recommending the only groomer is noise.

**UI:** a "Recommended for Bella" badge on the groomer step of booking, with
the top reason inline. Never hide or reorder the other groomers — the client
always picks freely.

## Acceptance criteria

- [ ] Matches CONTRACT §3 signature; pure, no vendor imports
- [ ] Table-driven tests: exact breed, coat-only, no tags at all, tie-break,
      temperament dominating for a flagged pet
- [ ] Every result carries at least one human-readable reason
- [ ] Returns empty / suppresses UI below two active groomers
- [ ] A groomer with no tags still appears, just unranked — never excluded
- [ ] Badge renders in booking without reordering the list

## Watch out for

- **Hiding or disabling non-recommended groomers.** Clients have existing
  relationships with a specific person. Overriding that is worse than having no
  feature.
- **A score with no explanation.** Front desk staff ignore anything they cannot
  justify to a client.
- **Gold-plating this.** It is the lowest-value differentiator for a 1–3
  groomer salon. Timebox it.

## Checklist

- [ ] Scoring implemented
- [ ] Tests including tie-break and temperament cases
- [ ] Suppression below two groomers
- [ ] Badge in the booking flow
- [ ] `npm run check` green
- [ ] Merged to `main`
