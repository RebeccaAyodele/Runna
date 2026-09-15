"use client";

import { useActionState, useState } from "react";
import { rateTaskAction } from "@/app/(app)/actions";
import { Avatar } from "@/components/avatar";
import { FieldError, inputClassName, labelClassName } from "@/components/field";
import { StarIcon } from "@/components/icons";
import type { UserSummary } from "@/lib/api";
import { emptyFormState } from "@/lib/validation";

/**
 * Rating the other side once a task is confirmed.
 *
 * The stars are a real radio group — five inputs with labels — so it works by
 * keyboard and reads correctly to a screen reader, rather than being a row of
 * buttons that only a pointer can use. The visual fill follows hover or focus,
 * which is why the highlight index is separate from the chosen value.
 *
 * Whether this person has already rated the task isn't in the API response, so
 * the form is offered and a second attempt is refused by the backend. Better
 * that than hiding it from someone who hasn't rated yet.
 */

const SCORES = [1, 2, 3, 4, 5] as const;

export function RateTaskForm({ taskId, subject }: { taskId: string; subject: UserSummary | null }) {
  const [state, formAction, pending] = useActionState(rateTaskAction, emptyFormState);
  const [score, setScore] = useState(0);
  const [preview, setPreview] = useState(0);

  if (state.success) {
    return <p role="status" className="rounded-2xl border border-runna-success/30 bg-runna-success/5 px-5 py-4 text-center text-sm text-runna-ink">{state.success}</p>;
  }

  const filledThrough = preview || score;

  return <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-runna-outline bg-white p-5">
    <input type="hidden" name="taskId" value={taskId} />
    <input type="hidden" name="score" value={score} />

    <div className="flex items-center gap-3">
      {subject ? <Avatar name={subject.fullName} src={subject.avatarUrl} size={40} /> : null}
      <div>
        <h3 className="font-heading text-lg font-semibold text-runna-ink">How did it go{subject ? ` with ${subject.fullName.split(" ")[0]}` : ""}?</h3>
        <p className="text-sm text-runna-muted">Ratings are what build trust tiers on Runna.</p>
      </div>
    </div>

    {state.message ? <p role="alert" className="rounded-xl border border-runna-danger/30 bg-runna-danger/5 px-4 py-3 text-sm text-runna-danger">{state.message}</p> : null}

    <fieldset className="flex flex-col gap-1.5" onMouseLeave={() => setPreview(0)}>
      <legend className={labelClassName}>Your rating</legend>
      <div className="mt-1 flex gap-1">
        {SCORES.map((value) => <label
          key={value}
          onMouseEnter={() => setPreview(value)}
          className="cursor-pointer rounded p-1 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-runna-blue"
        >
          <input
            type="radio"
            name="scoreChoice"
            value={value}
            checked={score === value}
            onChange={() => setScore(value)}
            onFocus={() => setPreview(value)}
            onBlur={() => setPreview(0)}
            className="sr-only"
          />
          <span className="sr-only">{value} {value === 1 ? "star" : "stars"}</span>
          <StarIcon className={`size-8 ${value <= filledThrough ? "text-runna-star" : "text-runna-outline-strong/50"}`} filled={value <= filledThrough} />
        </label>)}
      </div>
      <FieldError id="score-error" message={state.fieldErrors.score} />
    </fieldset>

    <div className="flex flex-col gap-1.5">
      <label htmlFor="comment" className={labelClassName}>Anything to add? <span className="font-normal text-runna-muted">(optional)</span></label>
      <textarea
        id="comment"
        name="comment"
        rows={3}
        maxLength={500}
        defaultValue={state.values.comment}
        placeholder="Fast, friendly, kept me updated."
        className={`${inputClassName} resize-none`}
      />
    </div>

    <button
      type="submit"
      disabled={pending || score === 0}
      className="rounded-xl bg-runna-coral px-6 py-3 font-semibold tracking-[0.02em] text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral"
    >{pending ? "Sending…" : "Submit rating"}</button>
  </form>;
}
