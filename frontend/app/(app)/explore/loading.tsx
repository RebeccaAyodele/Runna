import { TaskCardSkeleton } from "../_components/task-card";

/**
 * First load of the feed.
 *
 * Skeleton cards rather than a spinner, and the same header and search bar the
 * real screen has, so nothing moves when the tasks arrive — the placeholders just
 * become cards.
 */
export default function ExploreLoading() {
  return <>
    <div className="sticky top-0 z-30 flex h-16 items-center border-b border-runna-outline bg-runna-paper/95 px-5 backdrop-blur-sm">
      <span className="mx-auto h-6 w-32 animate-pulse rounded bg-runna-blue-mist" />
    </div>

    <main className="mx-auto w-full max-w-[480px] flex-1 px-5 pb-8 md:max-w-3xl md:px-8">
      <div className="py-4">
        <span className="block h-12 w-full animate-pulse rounded-xl border border-runna-outline bg-white" />
      </div>
      <div aria-busy="true" aria-live="polite" className="flex flex-col gap-4">
        <span className="sr-only">Loading nearby tasks</span>
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </main>
  </>;
}
