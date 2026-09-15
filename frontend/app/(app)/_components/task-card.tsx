import Link from "next/link";
import { BuildingIcon, ChevronRightIcon, LocationIcon, VerifiedIcon } from "@/components/icons";
import type { Task } from "@/lib/api";
import { formatDeadline, formatDistance, formatNaira, formatRelativeTime } from "@/lib/format";
import { statusMeta, TONE_DOT_CLASS } from "@/lib/task-status";

/**
 * One task in a list. Used by the feed, the activity screen and the profile
 * tabs, so everything shown here comes off the task record — no screen passes in
 * its own idea of what the status is.
 */
export function TaskCard({ task }: { task: Task }) {
  const meta = statusMeta(task.status);
  const distance = formatDistance(task.distanceMeters);
  const deadline = formatDeadline(task.deadlineAt);

  return <Link
    href={`/tasks/${task.id}`}
    className="group relative flex w-full flex-col gap-3 rounded-xl border border-transparent bg-white p-4 shadow-runna-card-soft transition-all duration-200 hover:-translate-y-1 hover:border-runna-blue/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
  >
    {/* Reserved space on the right of the title keeps the absolute price badge
        from ever sitting on top of a long one. */}
    <h2 className="line-clamp-2 pr-20 font-heading text-xl font-semibold text-runna-ink">{task.title}</h2>
    <span className="absolute right-4 top-4 rounded-lg bg-runna-coral px-3 py-1 font-heading text-lg font-extrabold leading-[18px] text-white shadow-sm">
      {formatNaira(task.totalPrice)}
    </span>

    <div className="flex flex-wrap items-center gap-2">
      {distance ? <span className="flex items-center gap-1 rounded-full bg-runna-blue/10 px-2 py-1 text-sm font-semibold tracking-[0.02em] text-runna-blue">
        <LocationIcon className="size-3.5" />
        {distance}
      </span> : null}
      {task.poster.trustTier === "trusted" ? <span className="flex items-center gap-1 rounded-full bg-runna-success/10 px-2 py-1 text-sm font-semibold tracking-[0.02em] text-runna-success">
        <VerifiedIcon className="size-3.5" />
        Trusted
      </span> : null}
      {task.locationName ? <span className="flex min-w-0 items-center gap-1 text-sm text-runna-muted">
        <BuildingIcon className="size-4 shrink-0" />
        <span className="truncate">{task.locationName}</span>
      </span> : null}
    </div>

    <span aria-hidden="true" className="h-px w-full bg-runna-outline-strong/30" />

    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className={`relative flex size-2.5 shrink-0 rounded-full ${TONE_DOT_CLASS[meta.tone]}`}>
          {/* Only an open task pings — it's the one state where the dot means
              "act on this now" rather than just reporting where things stand. */}
          {task.status === "open" ? <span aria-hidden="true" className={`absolute inset-0 animate-ping rounded-full opacity-75 ${TONE_DOT_CLASS[meta.tone]}`} /> : null}
        </span>
        <span className="truncate text-sm text-runna-slate">
          {meta.label}
          {" • "}
          {deadline ?? formatRelativeTime(task.createdAt)}
        </span>
      </div>
      <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-runna-blue/10 text-runna-blue transition-colors group-hover:bg-runna-blue/20">
        <ChevronRightIcon className="size-5" />
      </span>
    </div>
  </Link>;
}

/**
 * Loading placeholder with the card's own proportions, so the feed settles into
 * place rather than jumping when the real tasks land.
 */
export function TaskCardSkeleton() {
  return <div aria-hidden="true" className="flex w-full animate-pulse flex-col gap-3 rounded-xl bg-white p-4 shadow-runna-card-soft">
    <div className="flex justify-between gap-4">
      <div className="flex-1 space-y-2">
        <span className="block h-5 w-4/5 rounded bg-runna-blue-mist" />
        <span className="block h-5 w-2/5 rounded bg-runna-blue-mist" />
      </div>
      <span className="h-7 w-16 shrink-0 rounded-lg bg-runna-coral/15" />
    </div>
    <div className="flex gap-2">
      <span className="h-6 w-16 rounded-full bg-runna-blue-mist" />
      <span className="h-6 w-28 rounded-full bg-runna-blue-mist" />
    </div>
    <span className="h-px w-full bg-runna-outline-strong/30" />
    <div className="flex items-center justify-between">
      <span className="h-4 w-32 rounded bg-runna-blue-mist" />
      <span className="size-9 rounded-full bg-runna-blue-mist" />
    </div>
  </div>;
}
