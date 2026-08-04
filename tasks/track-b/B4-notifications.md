# B4 — Notifications (SMS + Email)

**Track:** B (Shaq) · **Depends on:** B1, and A2's events being merged
**Estimate:** 6–8 hrs — the heaviest single task in the project

**Owns:** `src/services/sms/**`, `src/services/email/**`, `src/jobs/**`,
`src/data/notifications.ts`, `app/api/webhooks/twilio/**`

## Goal

Confirmation at booking, reminder 24 hours before, two-way replies, one number,
and compliance we can defend.

## Read this first — compliance is not polish

We run a **shared A2P 10DLC campaign** under the Qevy brand. Every salon sends
through it, which means **we carry the compliance liability for all of them.**
One salon texting people who never consented can get the campaign shut down for
every customer at once.

So the consent and STOP handling below are hard requirements, not nice-to-haves:

- **Never send to a client without `sms_consent_at` set.**
- **Never send to a client with `sms_opt_out_at` set.**
- STOP must opt out immediately and permanently.
- HELP must return a real help message with the salon name.

If the campaign is still pending approval, `salon.sms_status` is `pending`,
everything falls back to email, and settings shows a banner.

## Build

**Messenger** — implement per CONTRACT §3 against Twilio. **Check consent
inside `send()`**, not at each call site. Every caller will eventually forget;
the service must not let them. No consent or opted out → write a `notification`
row with `status: 'skipped'` and return without sending. Skipped is a normal
outcome, not an error, and must not alert.

**Mailer** — Resend + React Email. Confirmation and reminder templates.

**Inngest jobs:**

- `appointment/booked` → send confirmation immediately, then **schedule** the
  24-hour reminder using Inngest's `sleepUntil`. Not a cron scanning a table.
- `appointment/cancelled` → cancel the pending reminder, send cancellation
- `appointment/completed` → consumed by B6

**Inbound webhook** (`/api/webhooks/twilio/inbound`):

- **Verify the Twilio signature.** Unsigned requests rejected.
- Match `from_e164` to a client, write an `inbound_message`
- Classify intent: `C`/`YES`/`CONFIRM` → confirm the appointment;
  `STOP`/`UNSUBSCRIBE`/`CANCEL` (STOP keywords) → set `sms_opt_out_at`;
  `HELP` → help reply; anything else → `unknown`, surfaced to staff
- **An unmatched or `unknown` message must reach a human.** A client texting
  "can I move to 3pm?" into a void is worse than not offering replies.

**Status webhook** — update `delivered_at` / `failed_reason` from Twilio
callbacks.

**Idempotency** — every send takes an `idempotencyKey`. Inngest retries; a
client receiving the same reminder three times will churn.

**Notification log UI** in settings — what was sent, to whom, when, delivered
or failed or skipped. When an owner says "my client never got the text," this
is how it gets answered.

## Acceptance criteria

- [ ] Booking → confirmation lands on a **real phone**
- [ ] Reminder fires 24h before; verify by booking something 25h out
- [ ] Replying `C` confirms the appointment
- [ ] Replying `STOP` sets `sms_opt_out_at` and **no further messages send**
- [ ] `HELP` returns a message naming the salon
- [ ] A client with no consent gets `status: 'skipped'`, never a send
- [ ] An unrecognised reply is visible to staff
- [ ] Unsigned webhooks rejected
- [ ] Replaying a job does not double-send
- [ ] Cancelling an appointment cancels its pending reminder
- [ ] With `sms_status: 'pending'`, everything falls back to email cleanly
- [ ] Notification log shows sent / delivered / failed / skipped accurately

## Watch out for

- **Consent checks at the call site instead of inside `send()`.** Some future
  code path will skip it, and that path is the compliance incident.
- **Cron-scanning for reminders.** Durable scheduled jobs handle retries,
  cancellation, and restarts. A cron plus a status column will drift and
  double-send.
- **Sending the reminder for cancelled appointments.** Cancel the scheduled job.
- **Skipping signature verification** to test locally. Use the Twilio CLI to
  tunnel instead.
- **Treating `skipped` as a failure** and alerting on it. It is the correct,
  common outcome for a client who never consented.
- Testing only against Twilio's test credentials. Send to a real phone before
  calling this done — carrier behaviour is the thing being tested.

## Checklist

- [ ] `Messenger` with consent enforced inside `send()`
- [ ] `Mailer` + confirmation/reminder templates
- [ ] Booked / cancelled / completed job handlers
- [ ] `sleepUntil` 24h reminder, cancellable
- [ ] Signed inbound webhook + intent classification
- [ ] STOP / HELP / confirm handling
- [ ] Unknown replies surfaced to staff
- [ ] Delivery status webhook
- [ ] Idempotency keys throughout
- [ ] Email fallback when `sms_status` is pending
- [ ] Notification log UI
- [ ] End-to-end test on a real phone
- [ ] `npm run check` green
- [ ] Merged to `main`
