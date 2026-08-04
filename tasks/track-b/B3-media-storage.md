# B3 — Media Storage & Photo Upload

**Track:** B (Shaq) · **Depends on:** B2 · **Estimate:** 3–4 hrs

**Owns:** `src/services/storage/**`, `src/data/photos.ts`,
`components/media/**`

Foundation for both B5 (voice notes) and B6 (photo send). Get it right once.

## Goal

A groomer uploads a photo from their phone, in a salon, on bad wifi, and it
works — or visibly tells them it did not.

## Build

**Storage service** — implement `Storage` per `docs/CONTRACT.md` §3 against
Supabase Storage. Presigned upload URLs so files go **direct from device to
storage**, never through our server. Read URLs are short-TTL signed.

Key layout: `{salonId}/{prefix}/{yyyy}/{mm}/{uuid}.{ext}`. Tenant-prefixed so
access control is enforceable at the storage layer too.

**Upload component** — the piece everything else depends on:

- Camera capture on mobile (`capture="environment"`)
- **Client-side resize before upload.** Phone photos are 4–12MB and often HEIC.
  Resize to max 1600px on the long edge and re-encode to JPEG in a canvas. This
  single step is the difference between reliable and unusable on salon wifi.
- Per-file visible state: queued → uploading (with %) → done → failed
- **Retry on failure**, automatically twice then a manual retry button
- Multiple files at once
- Optimistic thumbnail from the local blob so the UI responds instantly

**Photo gallery** — on pet detail, grouped by appointment, labelled
before/after/other, tap to view full size.

## Acceptance criteria

- [ ] Uploads go direct to storage; no file passes through a Next.js route
- [ ] A 12MB HEIC from a real iPhone uploads successfully as a resized JPEG
- [ ] Progress is visible per file and accurate
- [ ] A failed upload is **obvious** and retryable — never a silent failure
- [ ] Throttle the network to 3G in devtools and it still completes
- [ ] Signed read URLs expire; an expired URL fails cleanly
- [ ] A user from another salon cannot read a storage key by guessing it
- [ ] Works on real iOS Safari and real Android Chrome, not just desktop

## Watch out for

- **Uploading full-size originals.** This is the number one reason photo
  features fail in the field. Salon wifi is bad and phone photos are enormous.
- **HEIC.** iPhones shoot it by default and browsers will not display it.
  Canvas re-encoding to JPEG handles this — verify on an actual iPhone.
- **Silent failure.** A groomer who thinks a photo saved and finds out later
  will stop trusting the whole app. Loud, retryable failure beats quiet loss.
- **Routing uploads through the server.** Vercel has request size limits and
  you will hit them.
- Testing only on desktop Chrome with a small PNG. It will pass and prove
  nothing.

## Checklist

- [ ] `Storage` interface implemented against Supabase
- [ ] Tenant-prefixed key layout
- [ ] Presigned direct upload
- [ ] Client-side resize + HEIC→JPEG
- [ ] Per-file progress, retry, failure states
- [ ] Photo gallery on pet detail
- [ ] Tested on real iOS and Android over throttled network
- [ ] `npm run check` green
- [ ] Merged to `main`
