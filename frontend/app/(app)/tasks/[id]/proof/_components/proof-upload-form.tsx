"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitProofAction } from "@/app/(app)/actions";
import { StatusTimeline } from "@/app/(app)/_components/status-timeline";
import { CameraIcon, CheckCircleIcon } from "@/components/icons";
import { emptyFormState } from "@/lib/validation";

/**
 * Proof of completion.
 *
 * Submit stays disabled until there's actually a photo attached — the design is
 * explicit about it, and it's the difference between "you missed a step" and a
 * rejected submission after a wait on campus wifi.
 *
 * This is the one screen where the route-path animation earns its keep: on submit
 * the marker walks forward a stage, which is precisely what the request is doing.
 * The timeline is fed the stage the task is *becoming*, so the movement is the
 * pending state rather than decoration layered on top of it.
 */
export function ProofUploadForm({ taskId }: { taskId: string }) {
  const [state, formAction, pending] = useActionState(submitProofAction, emptyFormState);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  // Object URLs hold the file in memory until they're revoked, and this screen
  // can go through a few attempts before one sticks.
  useEffect(() => () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current); }, []);

  function choose(file: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    if (!file) {
      previewRef.current = null;
      setPreview(null);
      setFileName(null);
      return;
    }
    const url = URL.createObjectURL(file);
    previewRef.current = url;
    setPreview(url);
    setFileName(file.name);
  }

  return <form action={formAction} className="flex flex-col gap-6">
    <input type="hidden" name="taskId" value={taskId} />

    {state.message ? <p role="alert" className="rounded-xl border border-runna-danger/30 bg-runna-danger/5 px-4 py-3 text-sm text-runna-danger">{state.message}</p> : null}

    <label className="group flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-runna-blue bg-white p-6 text-center transition-colors hover:bg-runna-blue-soft focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-runna-blue">
      {preview ? <>
        {/* A local object URL, not an uploaded photo — `next/image` can't optimise
            a blob, and there's nothing to optimise: the bytes are already here.
            The uploaded copy is rendered through `next/image` on the task screen. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="The photo you're about to submit" className="aspect-square w-full rounded-2xl object-cover" />
        <span className="flex items-center gap-2 text-sm font-semibold text-runna-blue">
          <CheckCircleIcon className="size-5" filled />
          {fileName ? `${fileName} — tap to change` : "Tap to change"}
        </span>
      </> : <div className="flex aspect-square w-full flex-col items-center justify-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-full bg-runna-blue-mist text-runna-blue">
          <CameraIcon className="size-8" />
        </span>
        <span className="font-heading text-lg font-semibold text-runna-ink">Tap to take a photo or upload</span>
        <span className="text-sm text-runna-muted">JPG, PNG up to 10MB</span>
      </div>}

      <span className="sr-only">Proof photo</span>
      <input
        type="file"
        name="photo"
        accept="image/*"
        // Opens the camera straight away on a phone, while still allowing a pick
        // from the gallery — the errand was just done, so the photo usually
        // doesn't exist yet.
        capture="environment"
        required
        onChange={(event) => choose(event.target.files?.[0] ?? null)}
        aria-invalid={state.fieldErrors.photo ? true : undefined}
        aria-describedby={state.fieldErrors.photo ? "photo-error" : undefined}
        className="sr-only"
      />
    </label>

    {state.fieldErrors.photo ? <p id="photo-error" className="text-sm text-runna-danger">{state.fieldErrors.photo}</p> : null}

    <StatusTimeline status={pending ? "completed" : "in_progress"} />

    <button
      type="submit"
      disabled={pending || preview === null}
      className="rounded-2xl bg-runna-coral px-6 py-4 font-heading text-lg font-bold text-white shadow-runna-button transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral"
    >{pending ? "Submitting proof…" : "Submit proof"}</button>
  </form>;
}
