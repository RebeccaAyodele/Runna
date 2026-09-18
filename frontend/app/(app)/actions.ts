"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ApiError,
  claimTask,
  completeTask,
  confirmTask,
  createTask,
  disputeTask,
  listTasks,
  rateTask,
  startTask,
  type TaskPage,
} from "@/lib/api";
import { SIGN_IN_PATH, withSession } from "@/lib/auth";
import { destroySession } from "@/lib/session";
import {
  collectFieldErrors,
  emptyFormState,
  parsePriceInput,
  validateDeadline,
  validateDisputeReason,
  validateLocationName,
  validateProofPhoto,
  validateProofRequirement,
  validateRatingScore,
  validateTaskDescription,
  validateTaskPrice,
  validateTaskTitle,
  type ActionResult,
  type FormState,
} from "@/lib/validation";

/**
 * Server Actions for the authenticated app.
 *
 * Every mutation goes through here rather than from a component, so the session
 * token stays on the server and `lib/api.ts` stays the only thing calling the
 * backend. Actions never decide a task's next status — they ask, and the task
 * that comes back is what the screen re-renders from.
 *
 * `redirect()` throws, so it always sits outside a try/catch.
 */

/* ------------------------------------------------------------------ *
 * Shared plumbing
 * ------------------------------------------------------------------ */

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function invalid(fieldErrors: Record<string, string>, values: Record<string, string>): FormState {
  return { ...emptyFormState, fieldErrors, values };
}

/** A rejected submission becomes form state; anything else is a bug for `error.tsx`. */
function toFormState(error: unknown, values: Record<string, string>): FormState {
  if (!(error instanceof ApiError)) throw error;
  return { ...emptyFormState, message: error.message, fieldErrors: error.fieldErrors, values };
}

/**
 * Turns a failed one-tap action into a message. The claim race gets its own
 * wording: losing it is a normal outcome on a first-come feed, not an error the
 * student did anything wrong.
 */
function toActionResult(error: unknown): ActionResult {
  if (!(error instanceof ApiError)) throw error;
  if (error.code === "TASK_ALREADY_CLAIMED" || error.status === 409) {
    return { ok: false, message: "This task was just claimed by someone else." };
  }
  return { ok: false, message: error.message };
}

/**
 * Re-reads every screen a task appears on.
 *
 * A status change shows up in the feed, on the task itself and in both profile
 * tabs, so they're invalidated together — otherwise a student navigates back to
 * a cached feed still showing a task they just claimed as open.
 */
function revalidateTask(taskId: string): void {
  revalidatePath("/explore");
  revalidatePath("/activity");
  revalidatePath("/profile");
  revalidatePath(`/tasks/${taskId}`);
}

/* ------------------------------------------------------------------ *
 * Posting a task
 * ------------------------------------------------------------------ */

/**
 * The deadline arrives from a `datetime-local` input, which has no timezone —
 * "2026-09-09T16:00" means 4pm where the student is standing. Constructing a
 * `Date` from it applies the *server's* zone, which on a deployed box is UTC, so
 * it's converted here rather than sent through as a bare local string.
 */
function toIsoDeadline(value: string): string | null {
  if (value.length === 0) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export async function createTaskAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const title = readField(formData, "title");
  const description = readField(formData, "description");
  const proofRequirement = readField(formData, "proofRequirement");
  const locationName = readField(formData, "locationName");
  const taskPrice = readField(formData, "taskPrice");
  // The toggle governs whether the deadline counts at all, so an unchecked box
  // discards whatever is still sitting in the hidden field.
  const wantsDeadline = formData.get("hasDeadline") !== null;
  const deadline = wantsDeadline ? readField(formData, "deadlineAt") : "";

  const values = { title, description, proofRequirement, locationName, taskPrice, deadlineAt: deadline };

  const fieldErrors = collectFieldErrors({
    title: validateTaskTitle(title),
    description: validateTaskDescription(description),
    proofRequirement: validateProofRequirement(proofRequirement),
    locationName: validateLocationName(locationName),
    taskPrice: validateTaskPrice(taskPrice),
    deadlineAt: validateDeadline(deadline),
  });
  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors, values);

  const amount = parsePriceInput(taskPrice);
  if (amount === null) return invalid({ taskPrice: "Enter what you'll pay." }, values);

  let taskId: string;
  try {
    const task = await withSession((token) => createTask(token, {
      title,
      description,
      proofRequirement,
      locationName,
      taskPrice: amount,
      deadlineAt: toIsoDeadline(deadline),
    }));
    taskId = task.id;
  } catch (error) {
    return toFormState(error, values);
  }

  revalidateTask(taskId);
  redirect(`/tasks/${taskId}`);
}

/* ------------------------------------------------------------------ *
 * Status transitions
 * ------------------------------------------------------------------ */

/**
 * Claiming is first-come, so two students can tap at the same moment and only
 * one wins. The screen updates optimistically; this is what tells it whether to
 * keep that update.
 */
export async function claimTaskAction(taskId: string): Promise<ActionResult> {
  try {
    await withSession((token) => claimTask(token, taskId));
  } catch (error) {
    return toActionResult(error);
  }
  revalidateTask(taskId);
  return { ok: true };
}

export async function startTaskAction(taskId: string): Promise<ActionResult> {
  try {
    await withSession((token) => startTask(token, taskId));
  } catch (error) {
    return toActionResult(error);
  }
  revalidateTask(taskId);
  return { ok: true };
}

/** Confirming releases the escrowed payment, so it's the poster's tap only. */
export async function confirmTaskAction(taskId: string): Promise<ActionResult> {
  try {
    await withSession((token) => confirmTask(token, taskId));
  } catch (error) {
    return toActionResult(error);
  }
  revalidateTask(taskId);
  return { ok: true };
}

/* ------------------------------------------------------------------ *
 * Proof, disputes and ratings
 * ------------------------------------------------------------------ */

/**
 * Marks a task complete with its proof photo. The file goes straight through to
 * the backend, which owns the Cloudinary credentials — it's never written to the
 * frontend's own storage or exposed as a URL from here.
 */
export async function submitProofAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const taskId = readField(formData, "taskId");
  const entry = formData.get("photo");
  const photo = entry instanceof File ? entry : null;

  const fieldErrors = collectFieldErrors({ photo: validateProofPhoto(photo) });
  if (Object.keys(fieldErrors).length > 0 || !photo) return invalid(fieldErrors, {});

  try {
    await withSession((token) => completeTask(token, taskId, photo));
  } catch (error) {
    return toFormState(error, {});
  }

  revalidateTask(taskId);
  redirect(`/tasks/${taskId}`);
}

export async function submitDisputeAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const taskId = readField(formData, "taskId");
  const reason = readField(formData, "reason");
  const values = { reason };

  const fieldErrors = collectFieldErrors({ reason: validateDisputeReason(reason) });
  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors, values);

  try {
    await withSession((token) => disputeTask(token, taskId, reason));
  } catch (error) {
    return toFormState(error, values);
  }

  revalidateTask(taskId);
  // Back to the task rather than a confirmation screen — the status there now
  // reads "Disputed", which is the confirmation.
  redirect(`/tasks/${taskId}`);
}

export async function rateTaskAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const taskId = readField(formData, "taskId");
  const score = readField(formData, "score");
  const comment = readField(formData, "comment");
  const values = { score, comment };

  const fieldErrors = collectFieldErrors({ score: validateRatingScore(score) });
  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors, values);

  try {
    await withSession((token) => rateTask(token, { taskId, score: Number(score), comment: comment.length > 0 ? comment : null }));
  } catch (error) {
    return toFormState(error, values);
  }

  revalidateTask(taskId);
  return { ...emptyFormState, success: "Thanks — your rating is in." };
}

/* ------------------------------------------------------------------ *
 * Feed pagination
 * ------------------------------------------------------------------ */

/**
 * The next page of the feed.
 *
 * The feed renders on the server, so paging can't just re-run the page query on
 * the client — this hands back one more page for the list to append. `cursor` is
 * whatever the previous page reported, never an offset the client computed.
 */
export async function loadMoreTasksAction(cursor: string, search: string): Promise<TaskPage> {
  return withSession((token) => listTasks(token, { cursor, search: search.length > 0 ? search : undefined }));
}

/* ------------------------------------------------------------------ *
 * Session
 * ------------------------------------------------------------------ */

/**
 * Clears the session cookie. The caller also tells the service worker to drop
 * its caches — signing out on a shared phone shouldn't leave the last feed
 * sitting in the cache for whoever opens the app next.
 */
export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect(SIGN_IN_PATH);
}
