"use server";

import { redirect } from "next/navigation";
import { ApiError, requestPasswordReset, resendVerification, signIn, signUp, verifyEmail } from "@/lib/api";
import { createSession } from "@/lib/session";
import {
  collectFieldErrors,
  emptyFormState,
  validateFullName,
  validateMatricNumber,
  validatePassword,
  validatePasswordPresence,
  validateSchoolEmail,
  validateVerificationCode,
  type FormState,
} from "@/lib/validation";

/**
 * Server Actions for the onboarding forms.
 *
 * Each one takes `(previousState, formData)` so it can drive `useActionState`,
 * and returns a `FormState` the form re-renders from. Nothing here runs in the
 * browser: the password never reaches client JavaScript as state, and the JWT
 * goes straight from the API response into an httpOnly cookie.
 *
 * `redirect()` works by throwing, so every call sits outside its try/catch —
 * inside one it would be swallowed as a failure.
 */

/** Where a freshly authenticated student lands. Points at the task feed once `(app)` exists. */
const POST_SIGN_IN_REDIRECT = "/";

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Passwords are read verbatim — trimming would silently change what was typed. */
function readSecret(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function invalid(fieldErrors: Record<string, string>, values: Record<string, string>): FormState {
  return { ...emptyFormState, fieldErrors, values };
}

/**
 * Turns a failed API call into form state. Anything that isn't an `ApiError` is
 * a bug rather than a rejected submission, so it's rethrown for `error.tsx`.
 */
function toFormState(error: unknown, values: Record<string, string>): FormState {
  if (!(error instanceof ApiError)) throw error;
  return { ...emptyFormState, message: error.message, fieldErrors: error.fieldErrors, values };
}

function verifyEmailPath(schoolEmail: string): string {
  return `/verify-email?email=${encodeURIComponent(schoolEmail)}`;
}

export async function signUpAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const fullName = readField(formData, "fullName");
  const matricNumber = readField(formData, "matricNumber");
  const schoolEmail = readField(formData, "schoolEmail").toLowerCase();
  const password = readSecret(formData, "password");
  const values = { fullName, matricNumber, schoolEmail };

  const fieldErrors = collectFieldErrors({
    fullName: validateFullName(fullName),
    matricNumber: validateMatricNumber(matricNumber),
    schoolEmail: validateSchoolEmail(schoolEmail),
    password: validatePassword(password),
  });
  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors, values);

  try {
    await signUp({ fullName, matricNumber, schoolEmail, password });
  } catch (error) {
    return toFormState(error, values);
  }
  redirect(verifyEmailPath(schoolEmail));
}

export async function signInAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const schoolEmail = readField(formData, "schoolEmail").toLowerCase();
  const password = readSecret(formData, "password");
  const values = { schoolEmail };

  const fieldErrors = collectFieldErrors({
    schoolEmail: validateSchoolEmail(schoolEmail),
    password: validatePasswordPresence(password),
  });
  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors, values);

  let destination: string;
  try {
    const { token } = await signIn({ schoolEmail, password });
    await createSession(token);
    destination = POST_SIGN_IN_REDIRECT;
  } catch (error) {
    // An unverified account isn't a failed sign-in — it's a detour through the
    // code we already emailed them.
    if (error instanceof ApiError && error.code === "EMAIL_NOT_VERIFIED") destination = verifyEmailPath(schoolEmail);
    else return toFormState(error, values);
  }
  redirect(destination);
}

export async function verifyEmailAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const schoolEmail = readField(formData, "schoolEmail").toLowerCase();
  const code = readField(formData, "code");
  const values = { schoolEmail };

  const fieldErrors = collectFieldErrors({ code: validateVerificationCode(code) });
  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors, values);

  try {
    const { token } = await verifyEmail({ schoolEmail, code });
    await createSession(token);
  } catch (error) {
    return toFormState(error, values);
  }
  redirect(POST_SIGN_IN_REDIRECT);
}

export async function resendVerificationAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const schoolEmail = readField(formData, "schoolEmail").toLowerCase();
  try {
    await resendVerification(schoolEmail);
  } catch (error) {
    return toFormState(error, { schoolEmail });
  }
  return { ...emptyFormState, success: "Sent. Check your inbox — it can take a minute.", values: { schoolEmail } };
}

export async function requestPasswordResetAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const schoolEmail = readField(formData, "schoolEmail").toLowerCase();
  const values = { schoolEmail };

  const fieldErrors = collectFieldErrors({ schoolEmail: validateSchoolEmail(schoolEmail) });
  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors, values);

  const confirmation = { ...emptyFormState, success: "If that email belongs to a Runna account, a reset link is on its way.", values };
  try {
    await requestPasswordReset(schoolEmail);
  } catch (error) {
    // Deliberately identical whether or not the account exists — a different
    // answer here would let anyone test which students are registered. Only a
    // genuine outage is worth reporting.
    if (error instanceof ApiError && (error.status === 0 || error.status >= 500)) return toFormState(error, values);
    return confirmation;
  }
  return confirmation;
}
