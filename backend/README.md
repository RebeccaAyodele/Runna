# Campus Errand Marketplace — Backend

Express API for the OAU campus errand/task marketplace. Handles auth, task lifecycle,
payments (Paystack), photo proof uploads (Cloudinary), and real-time task status updates
over WebSockets.

See the companion Product Requirements Document (PRD) and Technical Design Document (TDD)
for full product scope and architecture decisions.

## Tech Stack

- Node.js / Express
- PostgreSQL (hosted on Neon)
- Socket.io (WebSockets)
- JWT + argon (custom auth)
- Paystack (payment collection)
- Cloudinary (photo storage)

## Getting Started

1. Clone the repo and install dependencies:
   ```
   pnpm install
   ```

2. Copy the environment template and fill in your own values:
   ```
   cp .env.example .env
   ```

3. Set up the database:
   - Create a free project at neon.tech
   - Copy the connection string into `DATABASE_URL` in `.env`
   - Run migrations: `npm run migrate` (once migration tooling is set up)

4. Start the dev server:
   ```
   pnpm run dev
   ```

   The API runs on `http://localhost:5000` by default.

## Project Structure (planned)

```
/src
  /routes        - Express route definitions
  /controllers    - Request handlers
  /services       - Business logic (task state transitions, payment flow, etc.)
  /models         - Database queries/models
  /middleware     - Auth verification, error handling
  /websocket      - Socket.io event handlers
  /config         - Environment/config loading
```

## Notes

- All task state transitions are enforced server-side — the frontend never decides
  whether a status change is valid.
- Photo proof upload is required, not optional, before a task can move to "Completed"
  status.
- Payout release is currently a manual step (Paystack Starter Business tier has no
  Transfers API access) — see the TDD for details.