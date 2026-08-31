# Runna — Frontend Project Instructions (Next.js)

## Stack
Next.js (App Router), TypeScript, Tailwind CSS, Socket.io client.
Backend is a separate Express API. This repo never talks to Postgres,
Cloudinary, or Paystack directly — everything goes through the backend API.

## Commands
- Dev: `pnpm run dev`
- Build: `pnpm run build`
- Lint: `pnpm run lint`
- Test: `pnpm run test`

## Structure
- `/app/(marketing)` — public landing page, no auth, statically generated
- `/app/(app)` — authenticated app routes; PWA behavior (manifest, service
  worker, installability) applies to this route group only
- `/components` — shared UI components
- `/lib` — API client, WebSocket client, shared helpers
- `/lib/api.ts` — the only place fetch/API calls should be made from;
  don't call the backend directly from inside components

## Conventions
- Strict TypeScript, no `any`
- Design tokens (colors, fonts, spacing) come from `design.md` — don't
  hardcode one-off hex values or fonts inside components
- Task status/state is always read from the backend response, never
  computed or assumed client-side
- Every screen that fetches data needs three explicit states designed
  and handled: loading, empty, and error — not just the happy path
- Use semantic HTML and visible keyboard focus states; this app needs to
  be usable on a phone browser, not just look good in a screenshot

## Scalability
- Task feed uses pagination or infinite scroll — never fetch and render
  an unbounded list of tasks at once
- Use `next/image` for any uploaded photos (proof-of-completion, avatars)
  so they're automatically optimized, not raw Cloudinary URLs dropped
  into an `<img>` tag
- Centralize data fetching/caching (e.g. SWR or React Query) rather than
  scattering `useEffect` fetches across components — this also avoids
  duplicate requests for the same data
- Code-split routes naturally via the App Router; avoid one giant bundle

## Security
- Auth tokens are stored in httpOnly cookies, never in localStorage or
  client-accessible state — this is a payments app, treat token handling
  as security-critical, not a convenience detail
- Never trust client-side form validation alone — it's a UX nicety, the
  backend is the actual source of truth and re-validates everything
- Sanitize any user-generated content rendered back to other users (task
  descriptions, dispute messages) to prevent XSS
- Never put a Paystack secret key, or any non-`NEXT_PUBLIC_` value, in
  frontend code — if it needs to stay secret, it belongs on the backend

## Loading State
- Page/route-level loading (first load of a screen) uses Next.js's
  `loading.tsx` convention, not manual state
- Data-fetching state (fetching, refetching, error) is handled through
  a data-fetching library (e.g. React Query or SWR), not hand-rolled
  `useState`/`useEffect` combinations repeated across components
- Action-level loading (button taps: claim task, submit report, mark
  completed) gets its own local, scoped loading state on the component
  triggering it — disable the button and show it's in progress so the
  action can't be double-submitted
- Every screen that fetches data needs loading, empty, and error states
  designed and handled, not just the happy path (see Conventions above)
- Use skeleton screens (not spinners) for the task feed, matching the
  card layout, so loading reads as "almost there" rather than blank
- Task claiming uses optimistic UI: update the UI immediately on tap,
  then reconcile quietly if it fails — show a clear message (e.g.
  "This task was just claimed by someone else") rather than a generic
  error if the optimistic update turns out to be wrong
- Reserve the route-path motif animation for moments it's already
  meaningful (e.g. proof-upload submission) — don't apply it to every
  loading state, or it stops feeling like a signature element
- Never manage loading globally (no single app-wide "isLoading" flag) —
  keep it scoped to the page, the data, or the action it belongs to

## Reference docs
See PRD.pdf and TDD.pdf in `/.docs` for full product scope and
architecture. See `DESIGN.md` for the full design system and per-screen
specs.