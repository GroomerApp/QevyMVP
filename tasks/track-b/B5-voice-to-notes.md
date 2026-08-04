# B5 — AI Voice-to-Notes

**Track:** B (Shaq) · **Depends on:** B3 · **Estimate:** 3–4 hrs

**Owns:** `src/services/transcription/**`, voice recorder in
`components/media/`, `app/api/webhooks/deepgram/**`

One of the two differentiators that genuinely carry the pitch. It delivers
value on day one even at a single-groomer salon.

## Goal

A groomer finishes a groom, taps record, talks for twenty seconds, and the
notes are on the pet's profile before the next dog is on the table.

## Build

**Recorder component** — one big record button, a visible timer, waveform or
level meter so it is obviously listening, stop, and a play-back-before-saving
step. `MediaRecorder` API. Cap at 3 minutes.

**Pipeline:**

1. Record → presigned upload via B3's `Storage` (prefix `voice-notes`)
2. Create `pet_note` with `source: 'voice'`, `transcript_status: 'pending'`,
   the audio key, and duration — **immediately**, before transcription
3. Emit `voice-note/uploaded`
4. Inngest job → signed read URL → Deepgram → write `body`,
   `transcript_confidence`, `transcript_status: 'complete'`
5. On failure after retries → `transcript_status: 'failed'`, audio retained

**Never block the UI on transcription.** The note appears instantly as
"Transcribing…" and fills in. The groomer has already moved on.

**Always keep the audio.** Transcription of dog breeds and product names will
sometimes be wrong, and the recording is the source of truth. Play button on
every voice note, permanently.

**Always editable.** Editing sets `edited_at` and keeps the original audio.

**Manual text fallback** — a plain "type a note instead" option, always
available. Sometimes the salon is loud, sometimes the groomer would rather
type. A voice-only feature is a worse feature.

**Failure state** — a failed transcript shows the audio with a retry button,
not an error the groomer cannot act on.

## Acceptance criteria

- [ ] Records and uploads from real iOS Safari and real Android Chrome
- [ ] Note appears immediately as pending; UI is never blocked
- [ ] Transcript populates within ~30s of a 30s memo
- [ ] Audio is playable on the note forever, including after success
- [ ] Editing works and sets `edited_at`
- [ ] Failed transcription retains audio and offers retry
- [ ] Manual text entry available everywhere voice is
- [ ] Note attaches to the correct pet and, when recorded from an appointment,
      the correct `appointment_id`
- [ ] Mic permission denial is explained, not a broken button

## Watch out for

- **iOS Safari `MediaRecorder` quirks.** Codec support differs from Chrome.
  Test on a real iPhone early — this is the most likely thing to eat the
  estimate.
- **Blocking the save on transcription.** The whole point is not waiting.
- **Discarding audio after transcribing.** Breed and product names come back
  wrong often enough that the recording must survive.
- **Not handling denied mic permission.** A dead button with no explanation
  reads as a broken app.
- **Over-processing the transcript with an LLM** to "clean it up." It adds
  latency, cost, and a way to invent details about someone's animal. Raw
  transcript, editable. That is the feature.

## Checklist

- [ ] Recorder with timer and level meter
- [ ] Upload via B3 storage
- [ ] Pending note created before transcription
- [ ] Inngest transcription job
- [ ] Deepgram `Transcriber` implemented
- [ ] Playback retained permanently
- [ ] Edit with `edited_at`
- [ ] Failure + retry state
- [ ] Manual text fallback
- [ ] Tested on real iOS and Android
- [ ] `npm run check` green
- [ ] Merged to `main`
