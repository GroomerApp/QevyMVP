# A7 — Payments (Stripe Connect)

**Track:** A (Hadi) · **Depends on:** A3 · **Estimate:** 4–5 hrs

**Owns:** `src/services/payments/**`, `app/api/webhooks/stripe/**`,
checkout UI in `app/(app)/appointments/`

## Goal

Salons connect their own Stripe account and take payment at checkout. We never
touch their money and charge no processing fee.

## Scope decision — read this

**Stripe only. Payment links only. No Square, no Terminal hardware.**

"Bring your own processor" in the pitch means the salon uses their own Stripe
account, not that we support every processor on day one. Square shares almost
no code with Stripe — different onboarding, webhooks, and refunds — and doubles
the maintenance surface. The `PaymentProvider` interface exists so Square can
be added later without a rewrite. Implement it only when a real prospect blocks
on it.

Card-present via Stripe Terminal means hardware, and it is out of scope.

## Build

**Connect onboarding** — Stripe Connect Standard. A settings page where the
owner connects their account, with a clear connected/pending state. Store the
connected account id on the salon.

**Checkout at completion** — when an appointment is marked completed, the
groomer can:
- Generate a Stripe payment link and text it to the client (Track B's
  `Messenger` handles the send — emit an event, do not call Twilio directly)
- Or mark it paid in person (cash/card/other), which writes a `payment` row
  with `provider: 'manual'`

Marking paid in person must be one tap. Most salons will use it for most
appointments, because they already have a terminal on the counter. Do not bury
it behind the Stripe flow.

**Webhooks** — handle `checkout.session.completed`, `charge.refunded`, and
failures. **Verify the signature.** Idempotent by event id — Stripe retries,
and a double-processed payment is a very bad bug.

**Refunds** — owner-only, full or partial, reflected on the appointment.

## Acceptance criteria

- [ ] A test salon completes Connect onboarding and the state persists
- [ ] A real $1.00 test-mode charge succeeds and reconciles to the appointment
- [ ] Replaying the same webhook event twice produces exactly one `payment` row
- [ ] Unsigned or badly-signed webhooks are rejected
- [ ] "Mark paid in person" is one tap and writes a manual payment row
- [ ] Refund works and updates status
- [ ] `amount_cents` is integer cents everywhere, no floats
- [ ] Only owners can refund
- [ ] Nothing in this task imports Twilio

## Watch out for

- **Skipping webhook signature verification** to get it working locally. It is
  the whole security model.
- **Non-idempotent webhook handling.** Stripe retries on any non-2xx. Key on
  the event id.
- **Floats for money.** Integer cents, always.
- **Calling the SMS service directly** to send a payment link. Emit an event —
  the boundary in CONTRACT §4 is what keeps the tracks separate.
- Test-mode success does not mean live-mode success. Connect onboarding behaves
  differently live; verify before the pilot.

## Checklist

- [ ] `PaymentProvider` interface implemented for Stripe
- [ ] Connect onboarding + settings state
- [ ] Payment link generation, sent via event
- [ ] One-tap mark-paid-in-person
- [ ] Signed, idempotent webhook handler
- [ ] Refunds, owner-only
- [ ] `npm run check` green
- [ ] Merged to `main`
