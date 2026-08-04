# Workflow

Two people, two AI agents, one repo. These rules exist because at this velocity
a merge conflict costs more than the feature did.

## Branching

- `main` is always deployable.
- Work on `a/<task-id>-<slug>` or `b/<task-id>-<slug>`.
  - `a/A3-calendar-day-view`
  - `b/B4-twilio-inbound`
- Open a PR into `main`. Small. Merge same day.

**A branch older than 24 hours is a problem.** If a task is taking longer,
split it and merge the finished half.

## Before you commit

```bash
npm run check
```

Typecheck, lint, and unit tests. If it fails, it does not get committed.

## Pull before you start, always

```bash
git checkout main && git pull && git checkout -b a/A3-calendar-day-view
```

The other track merged while you were asleep. Assume it every time.

## The collision rules

These are the five things that will actually bite. They are also in
`CLAUDE.md` so your agent sees them.

1. **Never edit a file owned by the other track.** Ownership is in
   `docs/CONTRACT.md` §1. If you need something across the boundary, say so in
   the group chat — do not just reach over.

2. **Never edit an existing migration.** Schema changes are new files only,
   named `NNNN_<track>_<description>.sql`. Announce them before writing them so
   the other track can pull.

3. **Do not run `shadcn add`.** Everything needed is installed in the Day 1
   commit. Two agents adding components independently will conflict in
   `components/ui/` and `package.json` every single time.

4. **No shared `utils.ts` / `helpers.ts` / `common/`.** Helpers live next to
   the code that uses them. A shared junk drawer is a guaranteed conflict file.

5. **`package.json` changes get announced.** Adding a dependency is fine.
   Adding it silently while the other track is mid-branch is not.

## Cross-track handoffs

Track A and Track B talk through Inngest events, not direct imports
(`docs/CONTRACT.md` §4). If you find yourself wanting to import from the other
track's directory, that is the signal that the boundary is in the wrong place —
raise it rather than working around it.

Stub modules exist for both sides from Day 1, so neither track is ever blocked
waiting on the other to finish.

## Commit messages

```
A3: day view renders appointments in salon-local time
B4: handle STOP keyword and set sms_opt_out_at
```

Track prefix, task id, what changed. That is enough.

## Definition of done

A task is done when:

- [ ] Acceptance criteria in the task file all pass
- [ ] `npm run check` is green
- [ ] Checklist in the task file is ticked and committed
- [ ] Merged to `main`
- [ ] Deployed preview actually works when a human clicks it

That last one is not a formality. Code that typechecks and was never opened in
a browser is not done.
