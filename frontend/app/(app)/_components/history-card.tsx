import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { ClockIcon, PaymentsIcon } from "@/components/icons";
import type { Task, UserSummary } from "@/lib/api";
import { formatNaira, formatRelativeTime } from "@/lib/format";
import { statusMeta, TONE_PILL_CLASS } from "@/lib/task-status";

/**
 * A task in a history list — the profile's Posted/Completed tabs and the activity
 * screen.
 *
 * Distinct from the feed's `TaskCard` on purpose: the feed sells a task to
 * someone who might claim it, so it leads with the payout and the distance. This
 * one is a record of something already in motion, so it leads with the status and
 * who's on the other side of it. It carries the design's route-path strip down the
 * left edge — the one place the motif reads as "this is a journey you took".
 */

type Perspective = "posted" | "ran";

/** Who the other side is, and how the design labels them. */
function counterpartFor(task: Task, perspective: Perspective): { label: string; user: UserSummary | null } {
  if (perspective === "posted") return { label: "Run by", user: task.doer };
  return { label: "For", user: task.poster };
}

/**
 * The moment the card timestamps. The furthest-along one there is, so a confirmed
 * task reads from when it was confirmed rather than from when it was posted.
 */
function lastActivityAt(task: Task): string {
  return task.confirmedAt ?? task.completedAt ?? task.claimedAt ?? task.createdAt;
}

export function HistoryCard({ task, perspective }: { task: Task; perspective: Perspective }) {
  const meta = statusMeta(task.status);
  const { label, user } = counterpartFor(task, perspective);

  return <Link
    href={`/tasks/${task.id}`}
    className="group relative block overflow-hidden rounded-xl bg-white p-4 shadow-runna-card-soft transition-shadow hover:shadow-runna-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
  >
    {/* The route path, as a dashed rail down the edge of the card. */}
    <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 border-l-4 border-dashed border-runna-blue/25" />

    <div className="pl-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold leading-6 text-runna-ink">{task.title}</h3>
        <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold tracking-[0.02em] ${TONE_PILL_CLASS[meta.tone]}`}>{meta.label}</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-runna-muted">
        <span className="flex items-center gap-1">
          <ClockIcon className="size-4" />
          {formatRelativeTime(lastActivityAt(task))}
        </span>
        <span aria-hidden="true">•</span>
        <span className="flex items-center gap-1">
          <PaymentsIcon className="size-4" />
          {formatNaira(task.totalPrice)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-runna-outline pt-3">
        {user ? <span className="flex min-w-0 items-center gap-2">
          <Avatar name={user.fullName} src={user.avatarUrl} size={24} />
          <span className="truncate text-sm text-runna-slate">{label} {user.fullName}</span>
        </span> : <span className="text-sm text-runna-muted">Not claimed yet</span>}

        {/* Styled as the design's link, but it isn't one: the whole card is the
            link, so this stays a span rather than nesting an anchor in an anchor. */}
        <span aria-hidden="true" className="shrink-0 text-sm font-semibold tracking-[0.02em] text-runna-blue group-hover:underline">View details</span>
      </div>
    </div>
  </Link>;
}

/** Matches the card's proportions so a loading list doesn't reflow into place. */
export function HistoryCardSkeleton() {
  return <div className="rounded-xl bg-white p-4 shadow-runna-card-soft">
    <div className="pl-3">
      <div className="flex items-start justify-between gap-3">
        <span className="h-6 w-40 rounded bg-runna-blue-mist" />
        <span className="h-6 w-20 rounded-md bg-runna-blue-mist" />
      </div>
      <div className="mt-3 flex gap-3">
        <span className="h-4 w-20 rounded bg-runna-blue-mist" />
        <span className="h-4 w-16 rounded bg-runna-blue-mist" />
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-runna-outline pt-3">
        <span className="size-6 rounded-full bg-runna-blue-mist" />
        <span className="h-4 w-28 rounded bg-runna-blue-mist" />
      </div>
    </div>
  </div>;
}
