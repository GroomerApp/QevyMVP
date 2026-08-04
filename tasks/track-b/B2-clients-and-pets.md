# B2 — Client & Pet Profiles

**Track:** B (Shaq) · **Depends on:** B1 · **Estimate:** 4–5 hrs

**Owns:** `app/(app)/clients/**`, `app/(app)/pets/**`, `src/data/clients.ts`,
`src/data/pets.ts`, `src/data/notes.ts`

The salon's actual asset. This is the data they are switching software to keep.

## Goal

Full client and pet records that a groomer can read in five seconds between
appointments.

## Build

**Client list** — searchable by name, phone, and pet name. Pet-name search
matters: staff remember "Bella's owner" far more reliably than a surname.

**Client detail** — contact info, pets, appointment history, notes, and
**SMS consent state** shown plainly ("Consented 3 Aug 2026" / "Opted out
12 Jul 2026" / "No consent on file"). Staff need to know why a client is not
getting texts without asking anyone.

**Phone numbers stored E.164.** Accept messy input, normalise on save.

**Pet detail — the important screen.** Groomers open this before every groom.
Top of the page, above everything:

- **Behavior flags** as large, unmissable chips: `bites`, `muzzle_required`,
  `anxious`, `senior`, `reactive`. This is a safety field. Someone's hands
  depend on it being visible without scrolling.
- **Vaccination status** with an obvious expired/expiring warning.

Then breed, coat type, size, weight, birthdate, vet contact, photos, and the
notes timeline.

**Vaccinations** — add/edit records with type, administered date, expiry, and
an optional uploaded document. Warn on expired or expiring-within-30-days.

**Notes timeline** — reverse-chronological `pet_note` entries showing author,
date, and whether the source was manual or voice. Append-only; edits set
`edited_at` rather than destroying history. Build the component so A3's
appointment sheet can import it — Track A will, so keep it self-contained and
take its data as props.

**Merge duplicate clients** — nice to have, but the same client books twice
with two phone numbers constantly. Include it if time allows.

## Acceptance criteria

- [ ] Search by client name, phone, and pet name all work
- [ ] Phone numbers normalise to E.164 from messy input
- [ ] Behavior flags are visible on pet detail without scrolling, on mobile
- [ ] Expired vaccinations produce a clear warning
- [ ] Notes timeline is append-only; editing sets `edited_at`
- [ ] Notes component is importable by Track A with no page-level dependencies
- [ ] SMS consent state is legible to staff at a glance
- [ ] Every query is scoped by `salonId`
- [ ] Pet detail is fully usable one-handed at 390px

## Watch out for

- **Burying behavior flags** in a details accordion because it looked tidier.
  A groomer who does not see `bites` gets bitten. This is the one piece of UI in
  the app with a physical consequence.
- **Storing phone numbers as typed.** `(555) 123-4567` and `+15551234567` are
  the same client, and Track B's SMS layer needs E.164.
- **Making notes editable in place, destroying history.** Notes are a legal and
  operational record of what was done to an animal.
- **Coupling the notes component to the pet page.** Track A imports it into the
  appointment sheet. Props in, no data fetching inside.

## Checklist

- [ ] Client list with multi-field search
- [ ] Client detail with consent state
- [ ] E.164 normalisation
- [ ] Pet detail with prominent behavior flags
- [ ] Vaccination records with expiry warnings
- [ ] Append-only notes timeline, importable
- [ ] Mobile pass at 390px
- [ ] `npm run check` green
- [ ] Merged to `main`
