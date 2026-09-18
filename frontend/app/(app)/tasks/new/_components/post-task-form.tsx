"use client";

import { useActionState, useState } from "react";
import { createTaskAction } from "@/app/(app)/actions";
import { PriceField, TextAreaField, TextField, inputClassName, labelClassName } from "@/components/field";
import { BikeIcon, RocketIcon } from "@/components/icons";
import { formatNaira } from "@/lib/format";
import { emptyFormState } from "@/lib/validation";

/**
 * Posting a task.
 *
 * One scrolling form, not a wizard — the design is explicit about that, and it's
 * the right call: five short fields behind four "Next" taps is slower than five
 * short fields you can see at once.
 *
 * Client-side validation runs in the action, not here. The browser's own
 * `required` handling catches the obvious misses early, and the backend is what
 * actually decides whether the task is acceptable.
 */

/**
 * What the transport line shows before anything is posted. The real figure is
 * calculated by the backend from the distance — this is the typical case, which
 * is why the copy says "estimated" and the amount isn't submitted.
 */
const TYPICAL_TRANSPORT_ESTIMATE = 200;

export function PostTaskForm() {
  const [state, formAction, pending] = useActionState(createTaskAction, emptyFormState);
  const [wantsDeadline, setWantsDeadline] = useState(false);

  return <form action={formAction} className="flex flex-col gap-6">
    {state.message ? <p role="alert" className="rounded-xl border border-runna-danger/30 bg-runna-danger/5 px-4 py-3 text-sm text-runna-danger">{state.message}</p> : null}

    <TextField
      id="title"
      name="title"
      label="Task title"
      placeholder="Pick up my package from the gate"
      defaultValue={state.values.title}
      error={state.fieldErrors.title}
      maxLength={100}
    />

    <TextAreaField
      id="description"
      name="description"
      label="Description"
      placeholder="Where it is, who to ask for, anything the runner needs to know."
      defaultValue={state.values.description}
      error={state.fieldErrors.description}
      rows={4}
      maxLength={1000}
    />

    <TextField
      id="locationName"
      name="locationName"
      label="Where"
      placeholder="Angola Hall, Room 12"
      defaultValue={state.values.locationName}
      error={state.fieldErrors.locationName}
      maxLength={100}
    />

    <TextAreaField
      id="proofRequirement"
      name="proofRequirement"
      label="Proof requirement"
      hint="What should the person show you when it's done?"
      placeholder="A photo of the package at my door"
      defaultValue={state.values.proofRequirement}
      error={state.fieldErrors.proofRequirement}
      rows={2}
      maxLength={200}
    />

    <PriceField
      id="taskPrice"
      name="taskPrice"
      label="Price"
      hint="What the runner earns. Transport is added on top."
      defaultValue={state.values.taskPrice}
      error={state.fieldErrors.taskPrice}
    />

    {/* Read-only on purpose: transport is the backend's calculation, so making it
        look editable would promise something the poster can't actually change. */}
    <div className="flex items-start gap-3 rounded-xl border border-runna-coral/20 bg-white p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-runna-coral/10 text-runna-coral">
        <BikeIcon className="size-5" />
      </span>
      <div>
        <p className="font-heading text-base font-semibold text-runna-ink">Estimated transport: {formatNaira(TYPICAL_TRANSPORT_ESTIMATE)}</p>
        <p className="mt-0.5 text-sm leading-5 text-runna-muted">Based on typical distances for this type of task. The exact amount is worked out from the distance when you post.</p>
      </div>
    </div>

    <div className="flex flex-col gap-3 rounded-xl border border-runna-outline bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="flex flex-col">
          <span className={labelClassName}>Set a deadline</span>
          <span className="text-sm leading-5 text-runna-muted">Runners see how much time they have.</span>
        </span>
        {/* A real checkbox, styled — a div with a click handler wouldn't be
            reachable by keyboard or announced as a switch. */}
        <label className="relative inline-flex shrink-0 cursor-pointer items-center">
          <input
            type="checkbox"
            name="hasDeadline"
            checked={wantsDeadline}
            onChange={(event) => setWantsDeadline(event.target.checked)}
            className="peer sr-only"
          />
          <span className="sr-only">Set a deadline</span>
          <span aria-hidden="true" className="h-6 w-11 rounded-full bg-runna-outline-strong/40 transition-colors peer-checked:bg-runna-blue peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-runna-blue" />
          <span aria-hidden="true" className="absolute left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
        </label>
      </div>

      {wantsDeadline ? <div className="flex flex-col gap-1.5">
        <label htmlFor="deadlineAt" className={labelClassName}>Needed by</label>
        <input
          id="deadlineAt"
          name="deadlineAt"
          type="datetime-local"
          defaultValue={state.values.deadlineAt}
          required
          aria-invalid={state.fieldErrors.deadlineAt ? true : undefined}
          aria-describedby={state.fieldErrors.deadlineAt ? "deadlineAt-error" : undefined}
          className={inputClassName}
        />
        {state.fieldErrors.deadlineAt ? <p id="deadlineAt-error" className="text-sm text-runna-danger">{state.fieldErrors.deadlineAt}</p> : null}
      </div> : null}
    </div>

    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 rounded-xl bg-runna-coral px-6 py-4 font-heading text-lg font-bold text-white shadow-runna-button transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral"
    >
      {pending ? "Posting…" : "Post task"}
      {pending ? null : <RocketIcon className="size-5" />}
    </button>
  </form>;
}
