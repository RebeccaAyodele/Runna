"use client";

import { useEffect } from "react";
import { AlertTriangleIcon } from "@/components/icons";
import { ErrorState } from "./_components/states";

/**
 * Error boundary for every authenticated screen.
 *
 * It sits at the route-group level so the nav stays put and only the content
 * area is replaced — a failed feed shouldn't strand anyone on a dead screen with
 * no way to reach the rest of the app.
 *
 * `reset` re-runs the render that failed. On this app the usual cause is the
 * free-tier backend cold-starting, where a second attempt 30 seconds later just
 * works, so retrying in place is worth more than a message telling people to
 * reload.
 */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Server-side details are stripped before they reach the browser, so the
    // digest is the only thing that ties this to the server log.
    console.error("Runna app error", error.digest ?? error.message);
  }, [error]);

  return <div className="flex flex-1 items-center justify-center">
    <ErrorState
      icon={<AlertTriangleIcon className="size-7" />}
      title="That didn't load"
      copy="Runna couldn't reach the server. It may just be waking up — give it a moment and try again."
      retry={reset}
    />
  </div>;
}
