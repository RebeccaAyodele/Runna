"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitDisputeAction } from "@/app/(app)/actions";
import { FieldError, inputClassName, labelClassName } from "@/components/field";
import { CloseIcon, FlagIcon, ShieldIcon } from "@/components/icons";
import { emptyFormState } from "@/lib/validation";

/**
 * The report/dispute bottom sheet.
 *
 * A native `<dialog>` rather than a styled div: it traps focus, closes on Escape
 * and is announced as a modal without any of that being reimplemented. It's still
 * shaped like the design's sheet — bottom-anchored with a drag handle on a phone,
 * centred from `sm:` up.
 *
 * Opening a dispute freezes the payout, so the reassurance panel says so plainly.
 * Nobody should have to guess whether reporting a problem means losing the money.
 */
export function DisputeSheet({ taskId }: { taskId: string }) {
  const [state, formAction, pending] = useActionState(submitDisputeAction, emptyFormState);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // A rejected submission has to be visible, and the sheet closes optimistically
  // on submit in browsers that treat a form action as a dismissal — so it's
  // reopened if the action came back with something to say.
  useEffect(() => {
    if (state.message && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [state.message]);

  return <>
    <button
      type="button"
      onClick={() => dialogRef.current?.showModal()}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-runna-outline bg-white px-6 py-3 text-sm font-semibold tracking-[0.02em] text-runna-slate transition-colors hover:bg-runna-blue-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
    >
      <FlagIcon className="size-4" />
      Report a problem
    </button>

    <dialog
      ref={dialogRef}
      aria-labelledby="dispute-title"
      className="mb-0 ml-auto mr-auto mt-auto max-h-[92svh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-0 shadow-runna-card backdrop:bg-runna-ink/40 backdrop:backdrop-blur-[2px] sm:my-auto sm:rounded-3xl"
    >
      <form action={formAction} className="flex flex-col gap-5 p-6">
        <input type="hidden" name="taskId" value={taskId} />

        <span aria-hidden="true" className="mx-auto h-1.5 w-12 rounded-full bg-runna-outline-strong/50 sm:hidden" />

        <div className="flex items-start justify-between gap-4">
          <h2 id="dispute-title" className="font-heading text-2xl font-bold text-runna-blue">What went wrong?</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="-mr-2 -mt-1 rounded-full p-2 text-runna-muted transition-colors hover:bg-runna-blue-soft hover:text-runna-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <p className="text-base leading-6 text-runna-slate">Please provide details so we can help resolve the issue quickly.</p>

        {state.message ? <p role="alert" className="rounded-xl border border-runna-danger/30 bg-runna-danger/5 px-4 py-3 text-sm text-runna-danger">{state.message}</p> : null}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="reason" className={labelClassName}>What happened</label>
          <textarea
            id="reason"
            name="reason"
            rows={4}
            required
            defaultValue={state.values.reason}
            placeholder="Tell us what happened..."
            aria-invalid={state.fieldErrors.reason ? true : undefined}
            aria-describedby={state.fieldErrors.reason ? "reason-error" : undefined}
            className={`${inputClassName} resize-none`}
          />
          <FieldError id="reason-error" message={state.fieldErrors.reason} />
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-runna-blue-soft p-4">
          <span className="mt-0.5 shrink-0 text-runna-blue">
            <ShieldIcon className="size-5" filled />
          </span>
          <p className="text-sm leading-5 text-runna-slate">
            <span className="font-semibold text-runna-ink">Payment is on hold</span> until this is resolved. Your funds are secure in escrow.
          </p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-runna-coral px-6 py-4 font-heading text-lg font-bold text-white shadow-runna-button transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral"
        >{pending ? "Sending…" : "Submit report"}</button>

        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="rounded-xl px-6 py-2 text-sm font-semibold tracking-[0.02em] text-runna-slate transition-colors hover:text-runna-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
        >Cancel</button>
      </form>
    </dialog>
  </>;
}
