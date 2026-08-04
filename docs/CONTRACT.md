# The Contract

**Status: frozen as of the Day 1 contract commit.**

This file defines the boundary between Track A and Track B. It exists so two
agents can work on this repo simultaneously without stepping on each other.

Changes to anything here are **additive only** and must be announced to the
other track before they are made.

---

## 1. Directory ownership

One owner per directory. No exceptions.

### Track A — Hadi

```
src/domain/scheduling/        availability solver, conflict detection
src/domain/matching/          groomer <-> dog scoring
src/domain/risk/              no-show scoring
src/domain/pricing/           price resolution
src/data/appointments.ts
src/data/availability.ts
src/services/payments/        PaymentProvider + stripe/
app/(app)/calendar/
app/(app)/appointments/
app/book/                     public booking flow
app/api/webhooks/stripe/
```

### Track B — Shaq

```
src/data/salons.ts
src/data/services.ts
src/data/clients.ts
src/data/pets.ts
src/data/notes.ts
src/data/photos.ts
src/data/notifications.ts
src/services/sms/             Twilio behind the Messenger interface
src/services/email/           Resend
src/services/storage/         Supabase Storage, presigned uploads
src/services/transcription/   Deepgram
src/jobs/                     all Inngest functions
app/(app)/dashboard/
app/(app)/clients/
app/(app)/pets/
app/(app)/settings/
app/(app)/onboarding/
app/api/webhooks/twilio/
app/api/webhooks/deepgram/
```

### Shared — Day 1 only, then frozen

Touching these after Day 1 requires telling the other track first.

```
src/db/schema/                the tables below
src/db/migrations/            additive only, never edit an existing file
src/auth/                     session, roles, tenant resolution
components/ui/                shadcn primitives, all pre-installed
package.json
```

---

## 2. Database schema

All tables carry `created_at` and `updated_at` (`timestamptz`, default now).
All ids are `uuid` primary keys with `gen_random_uuid()` default.
All timestamps are UTC. All money is integer cents.

Every tenant-scoped table has `salon_id` with an index. Row-level security
policies scope on `salon_id`.

### Identity & tenancy

```
salon
  id, name, slug (unique), timezone (IANA, e.g. 'America/New_York'),
  address_line1, address_line2, city, region, postal_code, country (default 'US'),
  phone, email, sms_number_e164 (nullable), sms_status
    (enum: pending | active | failed),
  onboarding_completed_at (nullable)

app_user                       -- auth identity, mirrors Supabase auth.users
  id, email (unique), full_name, avatar_url, phone

membership                     -- links a user to a salon with a role
  id, salon_id, user_id, role (enum: owner | groomer),
  status (enum: active | invited | disabled)
  UNIQUE (salon_id, user_id)

groomer                        -- staff record; may exist before a login does
  id, salon_id, user_id (nullable), display_name, bio, color_hex,
  active (bool, default true)
```

`app_user` is who logs in. `groomer` is who grooms. An owner who does not
groom has a membership but no groomer row. A groomer hired last week may have
a groomer row and no `app_user` yet. Do not merge these.

### Catalog & availability

```
service
  id, salon_id, name, description,
  duration_min (int), buffer_before_min (int, default 0),
  buffer_after_min (int, default 0),
  price_cents (int), active (bool, default true), sort_order (int)

working_hours                  -- recurring weekly availability
  id, salon_id, groomer_id, weekday (0=Sun .. 6=Sat),
  start_minute (int, minutes from salon-local midnight),
  end_minute (int)

time_off                       -- one-off blocks; overrides working_hours
  id, salon_id, groomer_id, start_at, end_at, reason
```

`working_hours` is stored in **salon-local minutes**, not UTC — a 9am shift
stays 9am across a DST boundary. The scheduling engine resolves it to UTC
per-day using `salon.timezone`. This is deliberate; do not "fix" it.

### People & pets

```
client
  id, salon_id, first_name, last_name, phone_e164, email, notes,
  sms_consent_at (nullable), sms_opt_out_at (nullable),
  preferred_channel (enum: sms | email | none, default 'sms')

pet
  id, salon_id, client_id, name, species (default 'dog'), breed,
  coat_type, size (enum: xs | s | m | l | xl), weight_lbs (nullable),
  birthdate (nullable), behavior_flags (text[]),
  vet_name, vet_phone, active (bool, default true)

vaccination
  id, salon_id, pet_id, type (e.g. 'rabies', 'dhpp', 'bordetella'),
  administered_on (date), expires_on (date, nullable),
  document_storage_key (nullable)

pet_note
  id, salon_id, pet_id, appointment_id (nullable), author_user_id (nullable),
  body (text), source (enum: manual | voice),
  audio_storage_key (nullable), audio_duration_sec (nullable),
  transcript_status (enum: none | pending | complete | failed),
  transcript_confidence (numeric, nullable), edited_at (nullable)

pet_photo
  id, salon_id, pet_id, appointment_id (nullable),
  kind (enum: before | after | other), storage_key,
  width, height, sent_to_client_at (nullable)
```

`behavior_flags` carries things like `bites`, `anxious`, `senior`,
`muzzle_required`. Groomers care about this more than breed — it is a safety
field, surface it prominently.

### Appointments

```
appointment
  id, salon_id, groomer_id, client_id, pet_id, service_id,
  start_at, end_at,                       -- UTC, INCLUDING buffers
  service_start_at, service_end_at,       -- UTC, EXCLUDING buffers (what the client sees)
  status (enum: booked | confirmed | checked_in | completed
               | no_show | cancelled),
  source (enum: online | staff),
  price_cents_snapshot (int),
  no_show_risk_score (int 0-100, nullable),
  no_show_risk_reasons (jsonb, nullable),
  notes (text),
  checked_in_at, completed_at, cancelled_at (all nullable),
  cancellation_reason
```

Two time ranges, on purpose. `start_at`/`end_at` include buffers and are what
conflict detection uses. `service_start_at`/`service_end_at` are what the
client is told. Confusing these will double-book.

`price_cents_snapshot` is copied from the service at booking time. Service
prices change; appointment history must not.

**Overlap is prevented at the database level**, not just in application code:

```sql
ALTER TABLE appointment ADD CONSTRAINT appointment_no_overlap
  EXCLUDE USING gist (
    groomer_id WITH =,
    tstzrange(start_at, end_at) WITH &&
  ) WHERE (status NOT IN ('cancelled', 'no_show'));
```

If application logic is ever wrong, Postgres still refuses. Track A owns making
this constraint produce a clean user-facing error rather than a 500.

### Matching

```
groomer_specialty
  id, salon_id, groomer_id,
  tag_type (enum: breed | coat | size | temperament),
  tag_value (text), proficiency (int 1-5)
```

### Notifications & payments

```
notification
  id, salon_id, appointment_id (nullable), client_id,
  type (enum: booking_confirmation | reminder_24h | photo_send
             | cancellation | custom),
  channel (enum: sms | email),
  to_address, body,
  status (enum: queued | sent | delivered | failed | skipped),
  provider (text), provider_message_id (text, nullable),
  scheduled_for, sent_at, delivered_at, failed_reason

inbound_message
  id, salon_id, client_id (nullable), from_e164, body,
  intent (enum: confirm | cancel | stop | help | unknown),
  handled_at (nullable), received_at

payment
  id, salon_id, appointment_id, provider (enum: stripe | square | manual),
  method (enum: card | cash | other, nullable),
  provider_charge_id (nullable),
  amount_cents, tip_cents (default 0),
  status (enum: pending | succeeded | failed | refunded),
  refunded_at (nullable)
```

`notification.status = 'skipped'` covers the real case where a client has
opted out or never consented. That is not a failure and must not alert.

---

## 3. Module interfaces

These signatures are the contract. Track B may call Track A's exports and vice
versa, against these types only. Implementations are stubbed on Day 1 and
filled in by the owning track.

### `src/domain/scheduling` — Track A

```ts
export type Interval = { startAt: Date; endAt: Date };

export type AvailabilityInput = {
  timezone: string;                  // IANA, from salon.timezone
  dateRange: Interval;               // UTC window to solve within
  serviceDurationMin: number;
  bufferBeforeMin: number;
  bufferAfterMin: number;
  workingHours: WorkingHoursRule[];  // salon-local minutes, by weekday
  timeOff: Interval[];
  existingAppointments: Interval[];  // buffer-inclusive ranges
  slotGranularityMin: number;        // default 15
  minimumNoticeMin: number;          // default 0
};

export type Slot = {
  serviceStartAt: Date;
  serviceEndAt: Date;
  startAt: Date;                     // buffer-inclusive
  endAt: Date;
};

export function computeAvailability(input: AvailabilityInput): Slot[];

export function hasConflict(
  candidate: Interval,
  existing: Interval[],
): boolean;
```

Pure. No I/O, no Date.now(), no framework imports. Every input is explicit so
the whole thing is table-testable, including DST-transition days.

### `src/domain/matching` — Track A

```ts
export type MatchInput = {
  pet: { breed: string | null; coatType: string | null;
         size: string | null; behaviorFlags: string[] };
  groomers: Array<{
    groomerId: string;
    specialties: Array<{ tagType: string; tagValue: string;
                         proficiency: number }>;
  }>;
};

export type MatchResult = {
  groomerId: string;
  score: number;        // 0-100
  reasons: string[];    // human-readable, shown in the UI
};

export function rankGroomers(input: MatchInput): MatchResult[];
```

### `src/domain/risk` — Track A

```ts
export type RiskInput = {
  bookedAt: Date;
  appointmentStartAt: Date;
  history: {
    completedCount: number;
    noShowCount: number;
    lateCancelCount: number;
    lastNoShowAt: Date | null;
  };
};

export type RiskResult = {
  score: number | null;   // null = not enough history, suppress the flag
  band: 'low' | 'medium' | 'high' | 'unknown';
  reasons: string[];
};

export function scoreNoShowRisk(input: RiskInput): RiskResult;
```

Rules-based and transparent. Never show a bare number without its reasons, and
return `null` below the minimum-history threshold — flagging a loyal client as
high-risk destroys trust in the feature permanently.

### `src/services/sms` — Track B

```ts
export interface Messenger {
  send(msg: {
    salonId: string;
    toE164: string;
    body: string;
    idempotencyKey: string;
  }): Promise<{ providerMessageId: string }>;
}
```

### `src/services/email` — Track B

```ts
export interface Mailer {
  send(msg: {
    salonId: string;
    to: string;
    subject: string;
    react: React.ReactElement;
    idempotencyKey: string;
  }): Promise<{ providerMessageId: string }>;
}
```

### `src/services/storage` — Track B

```ts
export interface Storage {
  createUploadUrl(input: {
    salonId: string;
    contentType: string;
    prefix: 'pet-photos' | 'voice-notes' | 'vaccination-docs';
  }): Promise<{ uploadUrl: string; storageKey: string }>;

  createReadUrl(storageKey: string, ttlSec: number): Promise<string>;
}
```

### `src/services/transcription` — Track B

```ts
export interface Transcriber {
  transcribe(input: { audioUrl: string }): Promise<{
    text: string;
    confidence: number;
    durationSec: number;
  }>;
}
```

### `src/services/payments` — Track A

```ts
export interface PaymentProvider {
  createConnectOnboardingUrl(salonId: string): Promise<{ url: string }>;
  createCheckoutLink(input: {
    salonId: string; appointmentId: string;
    amountCents: number; description: string;
  }): Promise<{ url: string; providerChargeId: string }>;
  refund(providerChargeId: string,
         amountCents?: number): Promise<{ ok: true }>;
}
```

Square is **not** implemented in Phase 1. The interface exists so adding it
later is contained.

---

## 4. Cross-track events

Where the two tracks meet, they meet through Inngest events — never a direct
function call. Track A emits, Track B consumes.

| Event | Emitted by | Consumed by | Payload |
|---|---|---|---|
| `appointment/booked` | A | B | `{ salonId, appointmentId }` |
| `appointment/cancelled` | A | B | `{ salonId, appointmentId }` |
| `appointment/completed` | A | B | `{ salonId, appointmentId }` |
| `photo/send-requested` | B | B | `{ salonId, photoIds[], clientId }` |
| `voice-note/uploaded` | B | B | `{ salonId, petNoteId }` |

Track A does not know that SMS exists. Track B does not know how a slot is
computed. That is the point.

---

## 5. Environment variables

Declared on Day 1 in `.env.example`. Add new ones there in the same commit that
uses them.

```
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_MESSAGING_SERVICE_SID
RESEND_API_KEY
DEEPGRAM_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_CONNECT_CLIENT_ID
INNGEST_EVENT_KEY
INNGEST_SIGNING_KEY
SENTRY_DSN
```

Never commit a real value. `.env.local` is gitignored.
