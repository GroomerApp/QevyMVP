# A4 — Public Online Booking

**Track:** A (Hadi) · **Depends on:** A2 · **Estimate:** 4–6 hrs

**Owns:** `app/book/**`

The only unauthenticated surface in the app. Where new clients arrive.

## Goal

A stranger books an appointment at `/book/[salonSlug]` on their phone in under
two minutes, with no account.

## Build

**The flow:** service → groomer (or "no preference") → date → slot → client and
pet details → confirm.

**New vs returning:** ask for a phone number early. If it matches an existing
client, prefill and show their pets. Do not expose any client data before the
number matches — no enumeration.

**SMS consent** — an explicit, unticked checkbox with real language:

> Text me appointment confirmations and reminders. Message and data rates may
> apply. Reply STOP to opt out.

Write `client.sms_consent_at` only when it is ticked. This is a legal
requirement under TCPA and we carry the liability for the shared 10DLC
campaign. If it is unticked, the booking still succeeds and notifications fall
back to email.

**Groomer recommendation** — when A5 lands, show a "recommended for [pet]"
badge with its reason. Leave the slot for it now.

**Confirmation page** — what, when, who, where, plus an add-to-calendar link.

**Signed management link** — `/book/[salonSlug]/confirm/[token]`, a signed,
expiring token letting a client confirm or cancel from their SMS. No login.
This is the whole reason clients have no accounts.

**Rate limit** the booking endpoint per IP and per phone number.

## Acceptance criteria

- [ ] Bookable end to end on a 390px phone in under two minutes
- [ ] Only genuinely available slots are offered, in salon-local time
- [ ] Booking the last slot from two devices at once → one clear success, one
      clear "just taken" with a re-pick, not a crash
- [ ] Consent unticked → booking succeeds, `sms_consent_at` stays null, and no
      SMS is ever sent to that client
- [ ] Signed token confirms and cancels correctly; an expired or tampered token
      fails safely
- [ ] No client data is retrievable without a matching phone number
- [ ] Rate limiting works
- [ ] Lighthouse mobile performance ≥ 90

## Watch out for

- **Pre-ticking the consent box.** It voids consent and it is exactly the thing
  that gets a shared 10DLC campaign shut down for everyone on it.
- **Leaking client data on phone lookup.** Returning "no client found" vs.
  prefilled data is an enumeration oracle. Rate-limit it and never return names
  or pets on a partial match.
- **Trusting client-side slot state.** Always re-validate availability
  server-side at submit. The user's list is seconds stale.
- **Losing form state** when someone picks a taken slot. Re-render the picker
  with their details intact — making them retype it is how you lose the
  booking.
- This page loads for people who have never heard of us. It must be fast and it
  must not look like an internal tool.

## Checklist

- [ ] Route and salon-by-slug resolution
- [ ] Service → groomer → date → slot picker
- [ ] Phone lookup for returning clients
- [ ] Consent checkbox writing `sms_consent_at`
- [ ] Server-side revalidation at submit
- [ ] Confirmation page
- [ ] Signed confirm/cancel token route
- [ ] Rate limiting
- [ ] Mobile + Lighthouse pass
- [ ] `npm run check` green
- [ ] Merged to `main`
