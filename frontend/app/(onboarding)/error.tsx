"use client";

import Link from "next/link";
import { AuthCard } from "./_components/auth-card";

/**
 * Catches anything the forms rethrow — an unreachable API, a bug in an action.
 * `reset()` re-renders the segment, which is usually enough after a blip.
 */
export default function OnboardingError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <AuthCard>
    <h1 className="font-heading text-2xl font-bold">Something went wrong</h1>
    <p className="mt-2 leading-6 text-runna-muted">
      We couldn&apos;t reach Runna just then. Check your connection and try again — nothing you entered was submitted.
    </p>
    {error.digest ? <p className="mt-3 text-xs text-runna-muted">Reference: {error.digest}</p> : null}
    <div className="mt-8 flex flex-col gap-3">
      <button
        type="button"
        onClick={reset}
        className="w-full rounded-2xl bg-runna-coral px-6 py-3.5 font-heading text-lg font-semibold text-white shadow-runna-button transition-transform hover:bg-runna-coral/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral active:scale-[0.98]"
      >Try again</button>
      <Link
        href="/"
        className="w-full rounded-2xl px-6 py-3 text-center text-sm font-semibold tracking-[0.02em] text-runna-blue transition-colors hover:bg-runna-blue-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
      >Back to home</Link>
    </div>
  </AuthCard>;
}
