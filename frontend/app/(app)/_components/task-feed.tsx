"use client";

import { useEffect, useRef, useState } from "react";
import { loadMoreTasksAction } from "@/app/(app)/actions";
import type { Task } from "@/lib/api";
import { TaskCard, TaskCardSkeleton } from "./task-card";

/**
 * The paginated list behind the feed.
 *
 * The first page is rendered on the server and handed in as a prop; this only
 * owns the pages appended after it. `cursor` always comes from the previous
 * response — the client never works out where it is in the list, so a task added
 * or claimed mid-scroll can't shift a page boundary underneath it.
 *
 * The button is the real control, and the observer just presses it when it scrolls
 * into view. That way keyboard and screen-reader users get a proper "Load more"
 * instead of a list that only grows if you can scroll it.
 */

type TaskFeedProps = {
  initialTasks: Task[];
  initialCursor: string | null;
  /** Echoed into the next page request so paging stays inside the same search. */
  search: string;
};

export function TaskFeed({ initialTasks, initialCursor, search }: TaskFeedProps) {
  const [appended, setAppended] = useState<Task[]>([]);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A revalidated feed arrives as a new `initialTasks` — after a claim, say. The
  // appended pages were paged off the old list, so they're dropped rather than
  // left to show a task twice.
  const [seed, setSeed] = useState(initialTasks);
  if (seed !== initialTasks) {
    setSeed(initialTasks);
    setAppended([]);
    setCursor(initialCursor);
    setError(null);
  }

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  async function loadMore() {
    // Both the observer and the button can fire; the ref is what stops the second
    // one, since a state update hasn't landed yet when they arrive together.
    if (loadingRef.current || cursor === null) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const page = await loadMoreTasksAction(cursor, search);
      setAppended((current) => [...current, ...page.tasks]);
      setCursor(page.nextCursor);
    } catch {
      setError("Couldn't load more tasks. Tap to try again.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || cursor === null) return;

    // Fires a screen early so the next page is usually there by the time the
    // bottom of the list is.
    const observer = new IntersectionObserver(
      (entries) => { if (entries.some((entry) => entry.isIntersecting)) void loadMore(); },
      { rootMargin: "400px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-arms per page; `loadMore` reads the current cursor through the ref guard.
  }, [cursor, search]);

  // Two pages can overlap if a task's position moved between requests, and React
  // needs the keys to stay unique either way.
  const seen = new Set<string>();
  const tasks = [...seed, ...appended].filter((task) => {
    if (seen.has(task.id)) return false;
    seen.add(task.id);
    return true;
  });

  return <>
    <ul className="flex flex-col gap-4">
      {tasks.map((task) => <li key={task.id}>
        <TaskCard task={task} />
      </li>)}
    </ul>

    {loading ? <div className="mt-4 flex flex-col gap-4">
      <TaskCardSkeleton />
      <TaskCardSkeleton />
    </div> : null}

    {error ? <p role="alert" className="mt-4 text-center text-sm text-runna-danger">{error}</p> : null}

    {cursor !== null ? <div ref={sentinelRef} className="mt-6 flex justify-center">
      <button
        type="button"
        onClick={() => { void loadMore(); }}
        disabled={loading}
        className="rounded-xl border border-runna-outline bg-white px-6 py-3 text-sm font-semibold tracking-[0.02em] text-runna-blue transition-colors hover:bg-runna-blue-soft disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
      >{loading ? "Loading…" : "Load more tasks"}</button>
    </div> : null}

    {cursor === null && tasks.length > 0 ? <p className="mt-6 text-center text-sm text-runna-muted">That&rsquo;s everything nearby right now.</p> : null}
  </>;
}
