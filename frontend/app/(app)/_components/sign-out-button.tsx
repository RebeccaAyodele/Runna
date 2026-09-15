"use client";

import { useFormStatus } from "react-dom";
import { signOutAction } from "@/app/(app)/actions";
import { LogOutIcon } from "@/components/icons";

/**
 * Sign out.
 *
 * A form rather than a click handler, so it still works if the JavaScript hasn't
 * loaded yet — the action clears the httpOnly cookie server-side either way.
 *
 * The service worker's cached shell has to go with the session: without this, the
 * next person to open Runna on a shared phone can be served the previous
 * student's screens straight from the cache. It's posted on submit rather than
 * after, because the action ends in a redirect and nothing queued behind it runs.
 */

function SubmitButton() {
  const { pending } = useFormStatus();

  return <button
    type="submit"
    disabled={pending}
    className="flex w-full items-center justify-center gap-2 rounded-xl border border-runna-danger/30 px-6 py-3 font-semibold tracking-[0.02em] text-runna-danger transition-colors hover:bg-runna-danger/5 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-danger"
  >
    <LogOutIcon className="size-5" />
    {pending ? "Signing out…" : "Sign out"}
  </button>;
}

export function SignOutButton() {
  return <form
    action={signOutAction}
    onSubmit={() => {
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.controller?.postMessage("runna:clear-caches");
      }
    }}
  >
    <SubmitButton />
  </form>;
}
