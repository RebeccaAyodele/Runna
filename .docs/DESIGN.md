# Runna — Design System & Screen Prompts

## Product Context

Runna is a peer-to-peer errand marketplace app for university students. Students post small paid tasks (pick up a package, print and submit a form, queue for something) and other students claim and complete them for a fee. It's playful, energetic, and mobile-first, but also has to feel trustworthy since real money changes hands.

## Design System

| Token | Value | Usage |
|---|---|---|
| Primary — Signal Blue | `#1550FF` | Base UI color, primary structure |
| Accent — Coral | `#FF6B4A` | Used generously — buttons, price tags, highlights, icons |
| Background — Cool Paper | `#F7F8FB` | App background |
| Text — Ink | `#191D2B` | Body/heading text |
| Success/status — Go | `#12B76A` | Completed/confirmed states |

**Typography:**
- Headings: Bricolage Grotesque (bold, characterful, slightly irregular letterforms)
- Body: Instrument Sans (clean, highly legible)

**Layout & shape:**
- Rounded corners, 12–16px radius on cards and buttons
- Soft, subtle shadows (not harsh drop shadows)
- Generous whitespace

**Signature motif:** a dashed "route path" line with a small marker showing progress, used to represent task status across the app (status badges, task detail timeline, upload confirmation).

---

## Screen Prompts (for Stitch)

Paste the Product Context + Design System block above at the start of each prompt below so Stitch always has full grounding, since it has no memory of the product between prompts.

### 1. Landing Page

Design a mobile-first landing page for Runna. Top: simple nav bar with the Runna wordmark (Bricolage Grotesque, Signal Blue) left-aligned and a coral "Sign in" button right-aligned. Hero section: large bold headline in Bricolage Grotesque reading "Get it done. Get paid." on Cool Paper background, with a subtle animated dashed route-path line running behind or beside the text. Below the headline, a bold coral CTA button "Get started". Below the hero, three simple content blocks in a row (stack vertically on mobile): "Post a task", "Get it done", "Get paid" — each with a small line icon in Signal Blue and a short coral underline accent, no numbered markers. Keep it clean, energetic, generous whitespace, not corporate.

### 2. Sign Up / Login

Design a mobile sign-up/login screen for Runna. Centered card layout on Cool Paper background (not split-screen). Card has rounded corners, soft shadow, white background. Toggle at top between "Sign in" and "Sign up". Sign-up fields: full name, matric number, school email, password — clean input fields with Signal Blue focus states. Below the form: a short reassuring line of microcopy: "Verify you're an OAU student to get started." Primary button: coral, full-width, rounded, bold Bricolage Grotesque label. Keep it simple, fast, no heavy illustration.

### 3. Task Feed / Home Screen

Design a mobile task feed screen for Runna, the home screen students see after login. Top bar: "Nearby tasks" heading in Bricolage Grotesque. Below, a vertical scrolling list of task cards, each with rounded corners and soft shadow: task title in bold, a coral price tag badge in the top-right corner of the card (unmissable), a small Signal Blue distance badge (e.g. "250m"), a location line in muted gray, and a tiny colored status dot (blue for open, coral for claimed) next to a short status label. Floating action button: solid coral circle with a "+" icon, bottom-right corner, for posting a new task. Generous spacing between cards, easy one-thumb scrolling.

### 4. Post a Task

Design a mobile "post a task" form screen for Runna. Single scrolling form, not a multi-step wizard. Fields top to bottom: task title, description (multi-line), a labeled field asking "What should the person show you when it's done?" for proof requirements, price input, an auto-calculated "Estimated transport" line shown in a coral-highlighted box (read-only, separate from the price the user sets), and an optional toggle for "Set a deadline" that reveals a date/time picker when enabled. Primary submit button: coral, full-width, bold, reading "Post task". Clean input styling, Signal Blue focus states, rounded corners throughout.

### 5. Task Detail

Design a mobile task detail screen for Runna. Top: task title in Bricolage Grotesque, full description below in Instrument Sans, price and distance shown as small badges. Middle of the screen: a horizontal progress timeline using the dashed route-path motif, showing stages Open, Claimed, In Progress, Completed, Confirmed, with a small marker positioned at the current stage and completed stages shown in solid Signal Blue, upcoming stages shown as faint dashed gray. Bottom: a large coral action button that changes based on state — "Claim this task" if open, "Mark as completed" if you're the assigned doer. Keep the timeline visually central, since it's the signature element of the app.

### 6. Proof Upload / Completion

Design a mobile photo upload screen for Runna, shown when a student marks a task as completed. Simple camera/upload interface: a large rounded square upload area with a camera icon in Signal Blue, short instructional text above it restating what proof is needed (e.g. "Show the delivered package"), and a coral "Submit" button below, disabled until a photo is attached. Once submitted, show a small route-path marker animating one step forward as visual confirmation. Minimal, fast, no unnecessary steps.

### 7. Profile & Ratings

Design a mobile profile screen for Runna. Top: circular avatar, name, and a small trust-tier pill badge (coral for "New", Signal Blue for "Established" or "Trusted"). Below: a star rating display with the numeric average score in Bricolage Grotesque. Below that, two tabs: "Posted" and "Completed" tasks, each showing a simple list of past tasks with title, date, and status dot. Clean, card-based, generous spacing, Cool Paper background throughout.

### 8. Report / Dispute Modal

Design a mobile modal/bottom-sheet for reporting an issue with a task in Runna. Rounded top corners, white background, appears over a dimmed backdrop. Heading: "What went wrong?" in Bricolage Grotesque. A multi-line text input below for describing the issue. Below that, a short line of plain-language reassurance: "Payment is on hold until this is resolved." Primary button: coral, full-width, "Submit report". Secondary "Cancel" as a plain text link below it. Keep it compact and low-friction, not a full page.