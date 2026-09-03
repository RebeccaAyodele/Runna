"use client";

import { useFormStatus } from "react-dom";

/**
 * Action-level loading, scoped to the form it sits in via `useFormStatus`.
 * Disabled while the action is in flight so it can't be double-submitted.
 */
export function SubmitButton({ children, pendingLabel, icon }: { children: React.ReactNode; pendingLabel: string; icon?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <button
    type="submit"
    disabled={pending}
    aria-busy={pending}
    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-runna-coral px-6 py-3.5 font-heading text-lg font-semibold text-white shadow-runna-button transition-transform hover:bg-runna-coral/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
  >
    {pending ? pendingLabel : <>{children}{icon}</>}
  </button>;
}
