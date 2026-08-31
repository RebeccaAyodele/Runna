# Runna

A peer-to-peer errand marketplace for university students. Post a small task, get it done by another verified student — or complete tasks yourself and earn money on campus.

Currently in active development, scoped to Obafemi Awolowo University (OAU) as a v1 validation phase.

## The Problem

Students regularly need small tasks done — picking up a package, printing and submitting a document, queueing at the bursary, running a quick errand — but have no structured, trustworthy way to find someone to do it, or to get paid for doing it for others. Informal WhatsApp arrangements are unreliable and offer no protection to either side.

## What It Does

- **Post a task** — describe what you need, set a price, and specify what counts as proof it's done
- **Browse nearby tasks** — see open tasks sorted by proximity, claim on a first-come basis
- **Verified students only** — accounts are tied to matric number / school email, so users aren't anonymous
- **Payment protection** — payment is collected upfront and held until the task is confirmed complete, protecting both the poster and the person doing the task
- **Ratings & trust tiers** — both sides rate each other after every task; a track record unlocks access to higher-value tasks
- **Real-time status updates** — task progress (open → claimed → in progress → completed → confirmed) updates live

## Tech Stack

**Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
**Backend:** Node.js, Express, PostgreSQL (Neon), Socket.io
**Auth:** Custom (JWT + bcrypt)
**Payments:** Paystack
**Photo storage:** Cloudinary
**Hosting:** Vercel (frontend), Render (backend)

## Project Structure

```
/frontend   - Next.js app (landing page + authenticated app, PWA)
/backend    - Express API, WebSocket server, database
/docs       - Product Requirements Document, Technical Design Document,
              design system
```

See `/frontend/README.md` and `/backend/README.md` for setup instructions specific to each.

## Documentation

- Product Requirements Document — `/docs/PRD.pdf`
- Technical Design Document — `/docs/TDD.pdf`
- Design system — `/docs/design.md`

## Status

Actively in development. This is a v1 MVP focused on validating real demand on a single campus before any wider rollout.

## Author

Built by [Rebecca Ayodele] — [https://github.com/RebeccaAyodele]
