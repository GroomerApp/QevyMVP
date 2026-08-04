# B6 — Before/After Photo Send

**Track:** B (Shaq) · **Depends on:** B3, B4 · **Estimate:** 3–4 hrs

**Owns:** photo-send flow in `app/(app)/appointments/` (the send UI only —
coordinate with Track A, who owns the appointment page shell), the
`photo/send-requested` job in `src/jobs/`

The other differentiator that actually carries the pitch. This is the feature
clients tell their friends about.

## Goal

The groomer finishes, taps once, and the owner gets a text with their dog
looking great — while they are still thinking about the appointment.

## Build

**Capture** — before/after slots on the appointment view, using B3's uploader.
Tag `kind` as `before` or `after`. Multiple photos per slot.

**Send flow — one tap, not zero.**

Auto-sending without review is a churn event waiting to happen: a blurry or
unflattering photo going out automatically will lose a client, and the groomer
is the only one who can judge. So: when an appointment is marked completed,
prompt "Send photos to [client]?" with the selected photos visible and a single
Send button.

The pitch is "the client gets a text the moment the groom is done." One
deliberate tap satisfies that. Zero taps is a liability.

**Sending:**

1. Emit `photo/send-requested` with the photo ids
2. Job creates short-lived signed read URLs
3. Send via B4's `Messenger` — **consent is enforced inside `send()`**, so a
   non-consented client is skipped automatically
4. MMS if the number supports it; otherwise SMS with a signed link to a simple
   public photo page
5. Set `sent_to_client_at` per photo

**Never send the same photo twice.** `sent_to_client_at` gates it, and already-
sent photos show as sent in the UI.

**Public photo page** — a minimal, unauthenticated page behind a signed
expiring token showing the photos and the salon name. No client data on it
beyond the pet's first name.

**Fallback** — if the client has no SMS consent, offer email. If neither, say
so plainly rather than failing silently.

## Acceptance criteria

- [ ] Photos capture and tag before/after correctly
- [ ] Send requires exactly one deliberate tap, never automatic
- [ ] A real MMS with a real photo arrives on a real phone
- [ ] SMS-with-link fallback works where MMS does not
- [ ] `sent_to_client_at` prevents re-sending
- [ ] A non-consented client is skipped, and the UI says why
- [ ] Signed photo page loads without login and expires
- [ ] The photo page leaks no client data beyond the pet's first name
- [ ] Whole flow is usable one-handed on a phone

## Watch out for

- **Making it fully automatic** because the spec says "auto-sent." The
  automation is the pipeline, not the judgement. One tap.
- **MMS cost.** MMS is several times the price of SMS. Factor it into the flat
  pricing model — a salon sending 200 photo MMS a month is real money.
- **Sending full-resolution images.** B3's resize handles this; do not bypass it
  for "quality."
- **Re-sending on a job retry.** Gate on `sent_to_client_at`.
- **A photo page that exposes phone numbers or full names.** It is a public URL.
- Coordinate with Track A on the appointment page — they own the shell, you own
  the send component inside it. Import, do not rebuild.

## Checklist

- [ ] Before/after capture slots
- [ ] One-tap send prompt on completion
- [ ] `photo/send-requested` job
- [ ] MMS with SMS+link fallback
- [ ] `sent_to_client_at` gating
- [ ] Signed public photo page
- [ ] No-consent handling with clear UI
- [ ] Real-device MMS test
- [ ] `npm run check` green
- [ ] Merged to `main`
