/**
 * How each backend task status is presented.
 *
 * The status itself is never computed here — it arrives on the task and this
 * module only maps it to a label, a colour and a position on the timeline. If
 * the backend adds a status, TypeScript will flag every table below as missing
 * a case rather than letting an unknown status render as a blank badge.
 */

import type { TaskStatus } from "./api";

/**
 * The happy path, in order, exactly as the design's route-path timeline draws
 * it. Statuses outside this list (expired, missed deadline, disputed) leave the
 * path rather than sitting somewhere on it.
 */
export const TASK_STAGES = [
  { status: "open", label: "Open" },
  { status: "claimed", label: "Claimed" },
  { status: "in_progress", label: "In Progress" },
  { status: "completed", label: "Completed" },
  { status: "confirmed", label: "Confirmed" },
] as const satisfies ReadonlyArray<{ status: TaskStatus; label: string }>;

export type StatusTone = "open" | "active" | "done" | "blocked";

type StatusMeta = {
  label: string;
  tone: StatusTone;
  /** One-liner for the feed card, under the title. */
  hint: string;
};

const STATUS_META: Record<TaskStatus, StatusMeta> = {
  open: { label: "Open", tone: "open", hint: "Waiting for a runner" },
  claimed: { label: "Claimed", tone: "active", hint: "A runner is on it" },
  in_progress: { label: "In progress", tone: "active", hint: "Runner is on the way" },
  completed: { label: "Completed", tone: "active", hint: "Proof submitted — awaiting confirmation" },
  confirmed: { label: "Confirmed", tone: "done", hint: "Done and paid out" },
  expired: { label: "Expired", tone: "blocked", hint: "The claim window ran out" },
  missed_deadline: { label: "Missed deadline", tone: "blocked", hint: "Not finished in time" },
  disputed: { label: "Disputed", tone: "blocked", hint: "Payment is on hold while this is reviewed" },
};

export function statusMeta(status: TaskStatus): StatusMeta {
  return STATUS_META[status];
}

/** Index into `TASK_STAGES`, or -1 when the task has left the happy path. */
export function stageIndexFor(status: TaskStatus): number {
  return TASK_STAGES.findIndex((stage) => stage.status === status);
}

export function isOffTrack(status: TaskStatus): boolean {
  return stageIndexFor(status) === -1;
}

/** Dot colour for the small status marker on a feed card. */
export const TONE_DOT_CLASS: Record<StatusTone, string> = {
  open: "bg-runna-blue",
  active: "bg-runna-coral",
  done: "bg-runna-success",
  blocked: "bg-runna-danger",
};

/** Pill colours for the same status shown as a badge. */
export const TONE_PILL_CLASS: Record<StatusTone, string> = {
  open: "bg-runna-blue/10 text-runna-blue",
  active: "bg-runna-coral/10 text-runna-coral",
  done: "bg-runna-success/10 text-runna-success",
  blocked: "bg-runna-danger/10 text-runna-danger",
};
