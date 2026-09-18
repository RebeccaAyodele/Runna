"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { claimTaskAction, confirmTaskAction, startTaskAction } from "@/app/(app)/actions";
import type { TaskStatus } from "@/lib/api";
import type { ActionResult } from "@/lib/validation";

/**
 * The one thing there is to do with a task right now, for this viewer.
 *
 * Which button appears depends on the status and on whether you posted the task
 * or claimed it. The backend enforces every transition — this only asks for one,
 * and when there's nothing to ask for it says what's being waited on instead of
 * showing a disabled button with no explanation.
 *
 * Claiming updates immediately and reconciles afterwards, because on a
 * first-come feed the tap has to feel instant. If someone else got there first
 * the marker falls back and says so, which is different information from "that
 * didn't work".
 */

export type ViewerRole = "poster" | "doer" | "visitor";

type Cta =
  | { kind: "action"; label: string; pendingLabel: string; nextStatus: TaskStatus; becomesDoer?: boolean; run: (taskId: string) => Promise<ActionResult> }
  | { kind: "link"; label: string; href: string }
  | { kind: "note"; text: string }
  | null;

function ctaFor(status: TaskStatus, role: ViewerRole, taskId: string): Cta {
  switch (status) {
    case "open":
      if (role === "poster") return { kind: "note", text: "Waiting for a runner to claim this." };
      return { kind: "action", label: "Claim this task", pendingLabel: "Claiming…", nextStatus: "claimed", becomesDoer: true, run: claimTaskAction };
    case "claimed":
      if (role === "doer") return { kind: "action", label: "Start task", pendingLabel: "Starting…", nextStatus: "in_progress", run: startTaskAction };
      return { kind: "note", text: "A runner has claimed this and will start shortly." };
    case "in_progress":
      if (role === "doer") return { kind: "link", label: "Upload proof", href: `/tasks/${taskId}/proof` };
      return { kind: "note", text: "Your runner is on it. You'll see their proof photo here when they're done." };
    case "completed":
      if (role === "poster") return { kind: "action", label: "Confirm & release payment", pendingLabel: "Confirming…", nextStatus: "confirmed", run: confirmTaskAction };
      return { kind: "note", text: "Proof submitted. Waiting for the poster to confirm and release payment." };
    case "confirmed":
      return { kind: "note", text: "Done, confirmed and paid out." };
    // Expired, missed deadline and disputed have no next step from here — the
    // timeline banner already explains where the task stands.
    default:
      return null;
  }
}

const PRIMARY_CLASS = "flex w-full items-center justify-center rounded-2xl bg-runna-coral px-6 py-4 font-heading text-lg font-bold text-white shadow-runna-button transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral";

export function TaskActions({ taskId, status, role }: { taskId: string; status: TaskStatus; role: ViewerRole }) {
  const [optimistic, setOptimistic] = useOptimistic({ status, role });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const cta = ctaFor(optimistic.status, optimistic.role, taskId);

  function submit(next: Extract<Cta, { kind: "action" }>) {
    setError(null);
    startTransition(async () => {
      setOptimistic({ status: next.nextStatus, role: next.becomesDoer ? "doer" : optimistic.role });
      const result = await next.run(taskId);
      // No success branch: the action revalidated this route, so the real status
      // arrives as a new prop and the optimistic value is dropped on its own.
      if (!result.ok) setError(result.message);
    });
  }

  return <div className="flex flex-col gap-3">
    {error ? <p role="alert" className="rounded-xl border border-runna-danger/30 bg-runna-danger/5 px-4 py-3 text-sm text-runna-danger">{error}</p> : null}

    {cta?.kind === "action" ? <button type="button" onClick={() => submit(cta)} disabled={pending} className={PRIMARY_CLASS}>
      {pending ? cta.pendingLabel : cta.label}
    </button> : null}

    {cta?.kind === "link" ? <Link href={cta.href} className={PRIMARY_CLASS}>{cta.label}</Link> : null}

    {cta?.kind === "note" ? <p className="rounded-2xl border border-runna-outline bg-white px-5 py-4 text-center text-sm leading-5 text-runna-slate">{cta.text}</p> : null}
  </div>;
}
