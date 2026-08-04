# Tasks

## How this works

Each person drives one track. Your agent reads only your track's folder.

| Track | Owner | Folder |
|---|---|---|
| A | Hadi | [`track-a/`](./track-a/) |
| B | Shaq | [`track-b/`](./track-b/) |

Both start from [`shared/DAY-1-CONTRACT.md`](./shared/DAY-1-CONTRACT.md),
which is done **once, by one person, with both present.** Nothing else starts
until that is merged.

## Task file anatomy

- **Owns** — the files you may create and edit for this task. Outside this
  list, do not touch.
- **Depends on** — what must be merged to `main` first.
- **Build** — what to make.
- **Acceptance criteria** — how you know it works. These are the bar, not the
  suggestion.
- **Watch out for** — the specific ways this task goes wrong. Read these; they
  are the expensive lessons.
- **Checklist** — tick and commit as you go. This is how the other track sees
  your progress.

## Order

Work your track top to bottom. Tasks within a track assume the previous ones
are merged.

If you finish your track early, **do not start the other person's tasks.** Pick
up integration testing, or write E2E coverage for the flows that cross the
boundary. Reaching into the other lane is what breaks the parallel setup.

## Estimates

Estimates are agent-driven build time, not human typing time. They assume you
know the stack and are reviewing rather than writing. They do not include the
time it takes you to actually test the thing on a real device, which is real
and which you should not skip.
