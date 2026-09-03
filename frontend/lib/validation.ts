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
