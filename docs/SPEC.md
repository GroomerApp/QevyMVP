# Qevy — Product Spec (Phase 1 MVP)

## What it is

Booking and client management for independent pet grooming salons with 1–3
groomers. The wedge is that existing tools take days to set up and charge for
every add-on.

## Who it's for

Owner-operators. Often one groomer, sometimes three. They are on their feet all
day, they run the business from a phone, and they have no patience for
software. Every screen a groomer touches must work one-handed on a phone with
wet hands.

## Core features (table stakes)

- Online booking + calendar (day / week / staff views)
- Client & pet profiles — name, breed, coat type, size, vaccination dates,
  behavior flags, notes, photos
- Two-way SMS/email reminders — confirmation at booking, 24-hour reminder,
  from one number, no second-number confusion
- Payments / checkout — Stripe, bring-your-own-processor, no forced processing fees
- Owner/staff dashboard — today's appointments at a glance
- Role-based views — owner/admin vs. groomer

## Differentiators

1. **AI voice-to-notes** — the groomer records a short voice memo after a
   groom; it is transcribed and attached to that pet's permanent profile. No
   typing between appointments.
2. **Auto before/after photos** — the groomer snaps a photo, the client gets a
   text the moment the groom is done. Retention and word-of-mouth.
3. **No-show risk flag** — transparent scoring from booking history, surfaced
   to the front desk.
4. **Groomer-to-dog matching** — groomers tag their specialties; booking
   recommends the best-suited groomer for that dog.
5. **One-sitting setup** — onboarding target under one hour.
6. **Transparent flat pricing** — no add-on stacking, no hidden SMS costs.

### Where the differentiators actually land

Ranked by real value at 1–2 groomers, which is the target customer:

**Voice-to-notes and auto-photos carry the pitch.** They deliver value on day
one with a single groomer and they are what a salon will describe to another
salon.

**No-show risk** has a cold-start problem — a new salon has no history, so the
score is noise for the first few months. It returns `null` and the flag is
hidden below a minimum history threshold. It gets good at month six.

**Groomer matching** is a genuine market gap, but at one groomer there is
nothing to match and at two the answer is usually obvious. It is cheap to build
and worth having, but it should not lead the sales conversation.

## Explicitly not in Phase 1

- AI phone receptionist / auto call answering — real-time voice plus telephony
  infrastructure, far bigger lift, not worth it before paying customers
- Multi-location / multi-van tooling
- Boarding / daycare modules
- Payroll / HR
- Square as a payment processor — the `PaymentProvider` interface is defined so
  it can be added without a rewrite, but only Stripe ships in Phase 1
- Client-facing accounts — clients book via a public link and manage their
  appointment through signed one-time links in SMS. No client login.

## Known risks

Ranked by what is actually most likely to hurt us.

### 1. A2P 10DLC registration — the critical path

To send business SMS to US numbers, a Brand and Campaign must be registered
with The Campaign Registry via Twilio. Approval takes days to weeks and cannot
be accelerated by writing code faster. Unregistered traffic gets filtered or
blocked.

We are running a **shared ISV campaign** under the Qevy brand: salons can text
immediately, onboarding stays under an hour, and we carry the compliance
liability for everyone on the campaign. That liability is why consent capture
and STOP handling are requirements in Milestone B4, not polish.

**This registration must be started before code, not after.** It is wall-clock
time, not effort.

Related: TCPA requires logged, explicit consent before texting, plus STOP and
HELP handling. `client.sms_consent_at` and `client.sms_opt_out_at` exist for
this and are not optional.

### 2. The scheduling engine

Least glamorous, most likely to break. DST transitions, per-service durations,
buffers, time off, and concurrent booking races. A double-booked Saturday loses
a customer permanently.

Mitigated three ways: pure functions in `src/domain/scheduling`, a table-driven
test suite written before the UI, and a Postgres `EXCLUDE USING gist`
constraint so the database refuses an overlap even if application logic is
wrong.

### 3. Mobile photo capture in a real salon

Wet hands, bad wifi, 8MB HEIC files, backgrounded tabs. Uploads will fail. A
photo silently not sending is worse than no feature. Client-side resize,
direct-to-storage presigned upload, visible per-photo state, retry.

Auto-sending photos requires **a human confirm tap**. An unflattering photo
auto-texted to a client is a churn event. One tap to send, not zero.

### 4. Unit economics of "transparent flat pricing"

SMS costs real money per message plus a monthly number fee. A busy salon can
send 600+ texts a month. Model this before publishing a price, or the flat-rate
promise quietly becomes negative margin.

### 5. Review capacity

Two agents can generate more booking-logic changes per evening than two humans
can meaningfully verify. The integration and real-device testing days at the
end of the roadmap are not padding. Code that typechecks and was never opened
on a real phone is not done.

## Data model notes

Full schema in [`CONTRACT.md`](./CONTRACT.md). The decisions worth knowing:

- **`app_user` / `membership` / `groomer` are three separate things.** Auth
  identity is not a staff record. Owners often do not groom; groomers often
  exist before they log in.
- **`service` is a first-class table.** Duration and buffers live there, and
  scheduling is impossible without it.
- **Appointments carry two time ranges** — buffer-inclusive for conflict
  detection, buffer-exclusive for what the client is told.
- **`price_cents_snapshot`** is copied at booking. Prices change; history
  must not.
- **Notes and photos are their own tables**, append-only history rather than an
  overwritten field on the pet.
- **`working_hours` is stored in salon-local minutes**, so a 9am shift stays
  9am across DST. Everything else is UTC.
- **`behavior_flags`** (bites, anxious, muzzle_required, senior) matters more
  to a groomer than breed does. It is a safety field.
