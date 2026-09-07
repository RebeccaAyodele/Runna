import Link from "next/link";
import { WifiOffIcon } from "@/components/icons";

export const metadata = { title: "Offline | Runna" };

/**
 * Served by the service worker when a navigation fails with no network. It's a
 * plain static page on purpose — it has to render from cache with nothing
 * fetched, so nothing here reads a task, a profile, or the session.
 */
export default function OfflinePage() {
  return <main className="flex min-h-svh flex-col items-center justify-center bg-runna-paper px-6 text-center">
    <span className="flex size-16 items-center justify-center rounded-full bg-runna-blue-mist text-runna-blue">
      <WifiOffIcon className="size-8" />
    </span>
    <h1 className="mt-6 font-heading text-3xl font-extrabold tracking-[-0.01em] text-runna-ink">You&rsquo;re offline</h1>
    <p className="mt-2 max-w-sm leading-6 text-runna-muted">
      Runna needs a connection to show live task status — a cached page could tell you something&rsquo;s open when it&rsquo;s already been claimed.
    </p>
    <Link
      href="/explore"
      className="mt-8 rounded-2xl bg-runna-coral px-6 py-3.5 font-heading text-lg font-semibold text-white shadow-runna-button transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral"
    >Try again</Link>
  </main>;
}
