/**
 * Session cookie plumbing. Server-only — every function here touches
 * `next/headers`, which throws if it's ever pulled into a client component.
 *
 * The JWT lives in an httpOnly cookie so client-side JavaScript can't read it.
 * This is a payments app: nothing here should ever be relaxed to localStorage
 * or handed to the browser as a prop.
 */

import { cookies } from "next/headers";

export const SESSION_COOKIE = "runna_session";

/** Matches the backend's refresh-token lifetime; the JWT itself expires sooner. */
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function createSession(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
