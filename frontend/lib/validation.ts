/**
 * Shared form state and field checks for the onboarding forms.
 *
 * These run inside Server Actions, before the request leaves for the backend —
 * they exist to give fast, specific feedback, not to be a security boundary.
 * The Express API re-validates everything and stays the source of truth.
 */

export type FormState = {
  /** Form-level message, e.g. "Those details don't match an account." */
  message: string | null;
  /** Confirmation shown after a successful non-navigating action. */
  success: string | null;
  /** Per-field messages keyed by the input's `name`. */
  fieldErrors: Record<string, string>;
  /** Non-secret values echoed back so the form can repopulate after an error. */
  values: Record<string, string>;
};

export const emptyFormState: FormState = { message: null, success: null, fieldErrors: {}, values: {} };

/**
 * What a one-tap action reports back — claiming, starting or confirming a task.
 * These don't have fields to annotate, so they don't need the whole `FormState`;
 * the caller only needs to know whether to keep its optimistic update or roll it
 * back with a reason.
 */
export type ActionResult = { ok: true } | { ok: false; message: string };

/** OAU-only for v1 — the backend enforces the same list. */
export const SCHOOL_EMAIL_DOMAINS = ["oauife.edu.ng", "student.oauife.edu.ng"] as const;

export const VERIFICATION_CODE_LENGTH = 6;

const MATRIC_PATTERN = /^[A-Za-z]{2,6}\/\d{4}\/\d{1,6}$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateFullName(value: string): string | null {
  if (value.length === 0) return "Enter your full name.";
  if (value.length < 3) return "That name looks too short.";
  if (!value.includes(" ")) return "Enter your first and last name.";
  return null;
}

export function validateMatricNumber(value: string): string | null {
  if (value.length === 0) return "Enter your matric number.";
  if (!MATRIC_PATTERN.test(value)) return "Use the format on your ID card, e.g. CSC/2019/001.";
  return null;
}

export function validateSchoolEmail(value: string): string | null {
  if (value.length === 0) return "Enter your school email.";
  const [, domain] = value.split("@");
  if (!domain || value.indexOf("@") < 1) return "That doesn't look like an email address.";
  if (!SCHOOL_EMAIL_DOMAINS.some((allowed) => domain === allowed)) return "Use your OAU email, e.g. student@oauife.edu.ng.";
  return null;
}

export function validatePassword(value: string): string | null {
  if (value.length === 0) return "Enter a password.";
  if (value.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  return null;
}

/** Sign-in only checks presence — telling people *why* a password is wrong helps attackers. */
export function validatePasswordPresence(value: string): string | null {
  return value.length === 0 ? "Enter your password." : null;
}

export function validateVerificationCode(value: string): string | null {
  if (value.length === 0) return "Enter the code we emailed you.";
  if (!new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`).test(value)) return `The code is ${VERIFICATION_CODE_LENGTH} digits.`;
  return null;
}

/** Drops the `null`s so an empty object means "no problems found". */
export function collectFieldErrors(checks: Record<string, string | null>): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const [field, message] of Object.entries(checks)) {
    if (message !== null) fieldErrors[field] = message;
  }
  return fieldErrors;
}

/* ------------------------------------------------------------------ *
 * Task forms
 * ------------------------------------------------------------------ */

/** Bounds for the money fields. The backend enforces its own copy of these. */
export const MIN_TASK_PRICE = 100;
export const MAX_TASK_PRICE = 100_000;

const MIN_TITLE_LENGTH = 6;
const MAX_TITLE_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 15;
const MAX_DESCRIPTION_LENGTH = 1000;
const MIN_PROOF_LENGTH = 5;
const MAX_PROOF_LENGTH = 200;
const MIN_DISPUTE_LENGTH = 20;
const MAX_DISPUTE_LENGTH = 1000;

/** 10MB, matching the copy on the upload screen. */
export const MAX_PROOF_PHOTO_BYTES = 10 * 1024 * 1024;

export function validateTaskTitle(value: string): string | null {
  if (value.length === 0) return "Give the task a title.";
  if (value.length < MIN_TITLE_LENGTH) return "A bit more detail — what needs doing?";
  if (value.length > MAX_TITLE_LENGTH) return `Keep the title under ${MAX_TITLE_LENGTH} characters.`;
  return null;
}

export function validateTaskDescription(value: string): string | null {
  if (value.length === 0) return "Describe what you need.";
  if (value.length < MIN_DESCRIPTION_LENGTH) return "Add a little more — the runner has to work from this.";
  if (value.length > MAX_DESCRIPTION_LENGTH) return `Keep it under ${MAX_DESCRIPTION_LENGTH} characters.`;
  return null;
}

export function validateProofRequirement(value: string): string | null {
  if (value.length === 0) return "Say what proof you want when it's done.";
  if (value.length < MIN_PROOF_LENGTH) return "Be specific — what should they show you?";
  if (value.length > MAX_PROOF_LENGTH) return `Keep it under ${MAX_PROOF_LENGTH} characters.`;
  return null;
}

export function validateLocationName(value: string): string | null {
  if (value.length === 0) return "Where should the runner go?";
  if (value.length > MAX_TITLE_LENGTH) return `Keep it under ${MAX_TITLE_LENGTH} characters.`;
  return null;
}

/**
 * People type prices as "1,500" or "₦1500" — both mean the same thing, so the
 * separators come off before the number is read. Returns null when there's no
 * number in there at all.
 */
export function parsePriceInput(value: string): number | null {
  const digits = value.replace(/[₦,\s]/g, "");
  if (digits.length === 0) return null;
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

export function validateTaskPrice(value: string): string | null {
  const amount = parsePriceInput(value);
  if (amount === null) return "Enter what you'll pay.";
  if (!Number.isInteger(amount)) return "Use a whole number of naira.";
  if (amount < MIN_TASK_PRICE) return `The minimum is ₦${MIN_TASK_PRICE}.`;
  if (amount > MAX_TASK_PRICE) return `That's above the ₦${MAX_TASK_PRICE.toLocaleString("en-NG")} limit for now.`;
  return null;
}

/**
 * A deadline is optional, but a deadline in the past is a typo rather than a
 * choice — a task nobody can finish in time shouldn't reach the feed.
 */
export function validateDeadline(value: string, now: Date = new Date()): string | null {
  if (value.length === 0) return null;
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return "That date didn't read as a time.";
  if (deadline.getTime() <= now.getTime()) return "Pick a time that hasn't passed yet.";
  return null;
}

export function validateDisputeReason(value: string): string | null {
  if (value.length === 0) return "Tell us what happened.";
  if (value.length < MIN_DISPUTE_LENGTH) return "A few more details will help us sort this out faster.";
  if (value.length > MAX_DISPUTE_LENGTH) return `Keep it under ${MAX_DISPUTE_LENGTH} characters.`;
  return null;
}

/**
 * The photo is checked here for a fast, specific message, but the backend is
 * what actually decides — it re-checks the type and size before anything reaches
 * Cloudinary.
 */
export function validateProofPhoto(file: File | null): string | null {
  if (!file || file.size === 0) return "Attach a photo of the finished task.";
  if (!file.type.startsWith("image/")) return "That's not an image — use a JPG or PNG.";
  if (file.size > MAX_PROOF_PHOTO_BYTES) return "That photo is over 10MB. Try a smaller one.";
  return null;
}

export function validateRatingScore(value: string): string | null {
  const score = Number(value);
  if (!Number.isInteger(score) || score < 1 || score > 5) return "Pick a rating from 1 to 5.";
  return null;
}
