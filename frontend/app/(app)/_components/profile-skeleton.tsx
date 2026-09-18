import { HistoryCardSkeleton } from "./history-card";

/**
 * The profile screens' first-load skeleton. Shared by your own profile and
 * someone else's, since the shape above the tabs is identical.
 */
export function ProfileSkeleton() {
  return <>
    <div className="sticky top-0 z-30 flex h-16 items-center border-b border-runna-outline bg-runna-paper/95 px-5 backdrop-blur-sm">
      <span className="mx-auto h-6 w-24 animate-pulse rounded bg-runna-blue-mist" />
    </div>

    <main
      aria-busy="true"
      aria-live="polite"
      className="mx-auto w-full max-w-[480px] flex-1 animate-pulse px-5 py-6 md:max-w-3xl md:px-8 md:py-10"
    >
      <span className="sr-only">Loading profile</span>

      <div className="flex flex-col items-center">
        <span className="size-24 rounded-full bg-runna-blue-mist" />
        <span className="mt-4 h-8 w-40 rounded bg-runna-blue-mist" />
        <span className="mt-3 h-9 w-44 rounded-full bg-runna-blue-mist" />
      </div>

      <div className="mt-6 flex gap-4 border-b border-runna-outline-strong/40 pb-2.5">
        <span className="h-4 flex-1 rounded bg-runna-blue-mist" />
        <span className="h-4 flex-1 rounded bg-runna-blue-mist" />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <HistoryCardSkeleton />
        <HistoryCardSkeleton />
        <HistoryCardSkeleton />
      </div>
    </main>
  </>;
}
