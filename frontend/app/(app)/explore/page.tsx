import Link from "next/link";
import { ExploreIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { listTasks } from "@/lib/api";
import { requireUser, withSession } from "@/lib/auth";
import { AppHeader } from "../_components/app-header";
import { EmptyState } from "../_components/states";
import { TaskFeed } from "../_components/task-feed";

export const metadata = { title: "Nearby tasks · Runna" };

type ExplorePageProps = { searchParams: Promise<{ q?: string }> };

/**
 * The feed — the app's home screen.
 *
 * Rendered on the server so the first page arrives with the HTML instead of
 * after a client fetch, which matters on campus wifi. Search is a plain GET form
 * for the same reason: the query lives in the URL, so a search is shareable, and
 * back does what it looks like it should.
 */
export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { q } = await searchParams;
  const search = typeof q === "string" ? q.trim() : "";

  // Both need the session; running them together saves a round trip, which on a
  // free-tier backend that has just woken up is worth having.
  const [{ user }, page] = await Promise.all([
    requireUser(),
    withSession((token) => listTasks(token, { search: search.length > 0 ? search : undefined })),
  ]);

  return <>
    <AppHeader title="Nearby tasks" user={user} />

    <main className="mx-auto w-full max-w-[480px] flex-1 px-5 pb-8 md:max-w-3xl md:px-8">
      <form action="/explore" className="sticky top-16 z-20 -mx-5 bg-runna-paper/95 px-5 py-4 backdrop-blur-sm md:-mx-8 md:px-8">
        <label className="flex items-center gap-2 rounded-xl border border-runna-outline bg-white px-4 py-3 focus-within:border-runna-blue focus-within:shadow-runna-focus">
          <SearchIcon className="size-5 shrink-0 text-runna-muted" />
          <span className="sr-only">Search tasks</span>
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search tasks near you"
            className="w-full bg-transparent text-base text-runna-ink outline-none placeholder:text-runna-muted"
          />
        </label>
      </form>

      {page.tasks.length === 0 ? <EmptyState
        icon={<ExploreIcon className="size-7" />}
        title={search.length > 0 ? "Nothing matched that" : "No tasks nearby yet"}
        copy={search.length > 0
          ? "Try a shorter search, or clear it to see everything open around you."
          : "Nobody on your campus has posted an errand right now. Post one and a runner will pick it up."}
        action={search.length > 0 ? { label: "Clear search", href: "/explore" } : { label: "Post a task", href: "/tasks/new" }}
      /> : <TaskFeed initialTasks={page.tasks} initialCursor={page.nextCursor} search={search} />}
    </main>

    {/* The desktop rail already carries a Post a task button, so the floating one
        is the phone's version of it rather than a second copy. */}
    <Link
      href="/tasks/new"
      aria-label="Post a task"
      className="fixed bottom-28 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-runna-coral text-white shadow-lg shadow-runna-coral/30 transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral md:hidden"
    >
      <PlusIcon className="size-7" />
    </Link>
  </>;
}
