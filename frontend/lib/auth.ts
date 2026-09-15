/**
 * Auth guard for the `(app)` route group. Server-only.
 *
 * Every authenticated page starts by calling `requireSession()` — there's no
 * client-side gate, because a client-side gate is a suggestion. The token never
 * leaves the server: pages read it here, hand it to `lib/api.ts`, and render.
 */

import { redirect } from "next/navigation";
import { ApiError, getCurrentUser, type User } from "@/lib/api";
import { destroySession, getSessionToken } from "@/lib/session";

export const SIGN_IN_PATH = "/sign-in";

/**
 * The token, or a redirect to sign-in. `redirect()` throws, so this either
 * returns a string or never returns — callers don't need a null check.
 */
export async function requireSession(): Promise<string> {
  const token = await getSessionToken();
  if (!token) redirect(SIGN_IN_PATH);
  return token;
}

/**
 * The signed-in student, for screens that show their own name or avatar.
 *
 * A 401 here means the JWT expired or was revoked while the cookie was still
 * around — the cookie is cleared so the browser stops sending a dead token, and
 * they go back through sign-in. Any other failure is left to `error.tsx`: an
 * API outage shouldn't look like being logged out.
 */
export async function requireUser(): Promise<{ token: string; user: User }> {
  const token = await requireSession();

  let user: User;
  try {
    user = await getCurrentUser(token);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      await destroySession();
      redirect(SIGN_IN_PATH);
    }
    throw error;
  }
  return { token, user };
}

/**
 * Runs one authenticated API call with the session token.
 *
 * Screens use this instead of pulling the token out themselves so that a dead
 * session lands on sign-in from anywhere, not just the screens that happen to
 * need the user record. Everything other than a 401/403 is rethrown for
 * `error.tsx` — a task that's genuinely gone should read as "not found", and the
 * API being down shouldn't sign anyone out.
 *
 *   const tasks = await withSession((token) => listTasks(token));
 */
export async function withSession<T>(call: (token: string) => Promise<T>): Promise<T> {
  const token = await requireSession();
  try {
    return await call(token);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      await destroySession();
      redirect(SIGN_IN_PATH);
    }
    throw error;
  }
}
