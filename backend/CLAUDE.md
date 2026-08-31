# Runna — Backend Project Instructions (Express)

## Stack
Node.js, Express, PostgreSQL (Neon), Socket.io, JWT + argon auth,
Paystack, Cloudinary.

## Commands
- Dev: `pnpm run dev`
- Migrate: `pnpm run migrate`
- Test: `pnpm run test`

## Structure
- `/routes` — route definitions only, no business logic here
- `/controllers` — request/response handling, calls into services
- `/services` — business logic (task state transitions, payment flow,
  matching, ratings) — this is where the real rules live, not in routes
- `/models` — database queries
- `/middleware` — auth verification, error handling, rate limiting
- `/websocket` — Socket.io event handlers
- `/config` — environment/config loading

## Conventions
- Validate every incoming request body against a schema (e.g. Zod or
  Joi) before it reaches business logic — don't assume the frontend
  sent well-formed data, since the API can be called directly too
- Use parameterized queries or an ORM/query builder for every database
  call — never build SQL by string concatenation
- All task state transitions (Open → Claimed → In Progress → Completed
  → Confirmed, plus Expired/Missed Deadline/Disputed) are enforced here,
  server-side, as the single source of truth — the frontend never
  decides a transition is valid, it only requests one
- Consistent error response shape across all endpoints, with correct
  HTTP status codes (400 for bad input, 401/403 for auth issues, 404,
  500 for actual server errors) — not everything returning 200

## Scalability
- Add database indexes on frequently queried/filtered columns: task
  `status`, `poster_id`, `doer_id`, and location fields used for
  proximity sorting
- Every list endpoint (task feed, task history) must be paginated —
  never return an unbounded result set
- Watch for N+1 query patterns, especially anywhere tasks are joined
  with users/ratings — batch or join instead of looping queries
- Keep the API stateless (no in-memory session state tied to a single
  server instance) so it can scale horizontally later without rework
- Note for later, not v1: a read-heavy endpoint (like the task feed)
  is a reasonable future candidate for caching (e.g. Redis) once real
  traffic justifies it — don't build this prematurely

## Security
- Passwords hashed with argon, minimum 12 salt rounds
- JWT secrets loaded only from environment variables, never hardcoded
  or committed
- Auth tokens set as httpOnly cookies
- CORS locked to the actual deployed frontend origin — never a wildcard
  `*`, since this API handles payments and personal student data
- Rate-limit sensitive endpoints: login (brute-force protection), task
  posting and claiming (spam/abuse protection), not just login alone
- Verify Paystack webhook signatures before trusting any webhook
  payload — an unverified webhook is a direct path for someone to fake
  a "payment successful" event
- Use `helmet` (or equivalent) for standard security headers
- Never log full request bodies containing passwords, tokens, or
  payment details

## Good engineering practices
- Centralized error-handling middleware — don't scatter try/catch
  error formatting across every controller
- Structured logging (not scattered `console.log`), especially around
  payment state changes and auth events, since these are the things
  you'll need to debug under pressure
- Write tests for the things that are expensive to get wrong: auth,
  task state transitions, and the payment flow — 100% coverage isn't
  the goal, covering the critical paths is
- Database migrations tracked in version control, never manual schema
  edits against the live database
- A basic `/health` endpoint, useful for confirming the Render deploy
  is actually up before debugging further

## Reference docs
See PRD.pdf and TDD.pdf in `/.docs` for full product scope, the database
schema, and architecture decisions.