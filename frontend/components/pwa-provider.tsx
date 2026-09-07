"use client";

import { useEffect, useState } from "react";
import { CloseIcon, DownloadIcon } from "@/components/icons";

/**
 * Service worker registration and the install prompt.
 *
 * Both live in one component because they answer the same question — is this
 * running as an installed app or in a browser tab. Rendered inside the `(app)`
 * layout only: CLAUDE.md scopes PWA behaviour to the authenticated routes, so a
 * visitor reading the landing page never gets asked to install anything.
 */

/** The slice of `beforeinstallprompt` we use. It isn't in lib.dom yet. */
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "runna:install-dismissed";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari reports installed apps through a non-standard `standalone` flag
  // rather than the display-mode media query.
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return window.matchMedia("(display-mode: standalone)").matches || iosStandalone;
}

export function PwaProvider() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // `updateViaCache: "none"` makes the browser revalidate the worker itself on
    // every check, so a fix ships without waiting out an HTTP cache entry.
    void navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (isStandalone()) return;

    // Remembering the dismissal is a per-device convenience, not app state — an
    // "I already said no" flag is exactly what localStorage is for, and there's
    // nothing sensitive in it.
    let alreadyDismissed = false;
    try {
      alreadyDismissed = window.localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // Private mode, or storage disabled. Showing the banner is the safe default.
    }
    setDismissed(alreadyDismissed);

    function handleBeforeInstallPrompt(event: Event) {
      // Chrome would otherwise show its own mini-infobar; we want the prompt to
      // appear at a moment that makes sense, from our own banner.
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  function remember() {
    try {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Nothing to do — the banner just reappears next visit.
    }
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    // The event is single-use either way, so the banner goes regardless of the
    // answer; an accepted install stops matching `isStandalone` next load.
    setInstallEvent(null);
    remember();
  }

  if (!installEvent || dismissed) return null;

  return <div className="fixed inset-x-0 bottom-24 z-40 px-5 md:bottom-6 md:left-auto md:right-6 md:w-80 md:px-0">
    <div className="mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-runna-outline bg-white p-4 shadow-runna-card">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-runna-blue-mist text-runna-blue">
        <DownloadIcon className="size-5" />
      </span>
      <div className="flex-1">
        <p className="font-heading text-base font-semibold">Add Runna to your home screen</p>
        <p className="mt-0.5 text-sm leading-5 text-runna-muted">Opens full screen and loads faster on campus wifi.</p>
        <button
          type="button"
          onClick={() => { void install(); }}
          className="mt-3 rounded-xl bg-runna-coral px-4 py-2 text-sm font-semibold tracking-[0.02em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral"
        >Install</button>
      </div>
      <button
        type="button"
        onClick={() => { setDismissed(true); remember(); }}
        aria-label="Dismiss install prompt"
        className="-mr-1 -mt-1 rounded-full p-1.5 text-runna-muted transition-colors hover:bg-runna-blue-mist hover:text-runna-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
      >
        <CloseIcon className="size-4" />
      </button>
    </div>
  </div>;
}
