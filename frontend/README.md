
# Campus Errand Marketplace — Frontend
 
Next.js app for the OAU campus errand/task marketplace. Includes the public landing page
and the authenticated PWA app experience in a single deployment, split by route groups.
 
See the companion Product Requirements Document (PRD) and Technical Design Document (TDD)
for full product scope and architecture decisions.
 
## Tech Stack
 
- Next.js (App Router)
- Deployed on Vercel
## Getting Started
 
1. Clone the repo and install dependencies:
```
   pnpm install
```
 
2. Copy the environment template and fill in your own values:
```
   cp .env.example .env.local
```
 
3. Start the dev server:
```
   pnpm run dev
```
 
   The app runs on `http://localhost:3000` by default.
 
## Project Structure
 
```
/app
  /(marketing)     - Public landing page, no auth required
  /(app)           - Authenticated app routes (dashboard, tasks, profile)
    /dashboard
    /tasks
    /profile
/components         - Shared UI components
/lib                - API client, WebSocket client, helpers
/public              - Static assets, PWA manifest
```
 
## Notes
 
- The `(app)` route group is where PWA behavior (manifest, service worker,
  installability) applies — the marketing pages stay lightweight and statically
  generated.
- All data fetching goes through the backend API — no direct database, Cloudinary,
  or Paystack calls from the frontend.
 
