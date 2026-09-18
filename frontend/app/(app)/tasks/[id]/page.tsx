import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { ImageIcon, LocationIcon, StarIcon } from "@/components/icons";
import { ApiError, getTask, type Task } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { formatDateTime, formatDeadline, formatDistance, formatNaira, formatRating } from "@/lib/format";
import { AppHeader } from "../../_components/app-header";
import { DisputeSheet } from "../../_components/dispute-sheet";
import { RateTaskForm } from "../../_components/rate-task-form";
import { StatusTimeline } from "../../_components/status-timeline";
import { TaskActions, type ViewerRole } from "../../_components/task-actions";

type TaskPageProps = { params: Promise<{ id: string }> };

/** Reporting a problem only makes sense while there's a payout to freeze. */
const DISPUTABLE_STATUSES = new Set(["claimed", "in_progress", "completed"]);

function roleFor(task: Task, userId: string): ViewerRole {
  if (task.poster.id === userId) return "poster";
  if (task.doer?.id === userId) return "doer";
  return "visitor";
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const { token, user } = await requireUser();

  let task: Task;
  try {
    task = await getTask(token, id);
  } catch (error) {
    // A task that's gone is a 404, not a broken app — `not-found.tsx` says so
    // properly instead of the error boundary blaming the server.
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const role = roleFor(task, user.id);
  const distance = formatDistance(task.distanceMeters);
  const deadline = formatDeadline(task.deadlineAt);
  const posterRating = formatRating(task.poster.avgRating);
  const canDispute = DISPUTABLE_STATUSES.has(task.status) && role !== "visitor";

  return <>
    <AppHeader title="Task details" backHref="/explore" />

    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6 md:px-8 md:py-10">
      <article className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-runna-card">
        {/* The route motif as a watermark — low enough not to compete with the
            text, present enough that the card reads as part of the same family
            as the timeline below it. */}
        <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute -bottom-8 -right-8 size-40 opacity-5">
          <path d="M10 90 Q 50 10 90 90" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" className="text-runna-blue" />
        </svg>

        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-heading text-2xl font-bold leading-tight text-runna-ink">{task.title}</h2>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="rounded-lg bg-runna-coral px-3 py-1.5 font-heading text-lg font-extrabold leading-none text-white">{formatNaira(task.totalPrice)}</span>
              {distance ? <span className="flex items-center gap-1 rounded-full bg-runna-blue/10 px-2 py-1 text-sm font-semibold tracking-[0.02em] text-runna-blue">
                <LocationIcon className="size-3.5" />
                {distance}
              </span> : null}
            </div>
          </div>

          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-runna-slate">
            <div className="flex gap-1">
              <dt className="text-runna-muted">Task</dt>
              <dd className="font-semibold">{formatNaira(task.taskPrice)}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="text-runna-muted">Transport</dt>
              <dd className="font-semibold">{formatNaira(task.transportEstimate)}</dd>
            </div>
            {task.locationName ? <div className="flex gap-1">
              <dt className="text-runna-muted">Where</dt>
              <dd className="font-semibold">{task.locationName}</dd>
            </div> : null}
            {deadline ? <div className="flex gap-1">
              <dt className="text-runna-muted">Needed</dt>
              <dd className="font-semibold">{deadline}</dd>
            </div> : null}
          </dl>

          <Link
            href={`/users/${task.poster.id}`}
            className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-runna-blue-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
          >
            <Avatar name={task.poster.fullName} src={task.poster.avatarUrl} size={40} />
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-semibold text-runna-ink">{task.poster.fullName}</span>
              <span className="flex items-center gap-1 text-sm text-runna-muted">
                {posterRating ? <>
                  <StarIcon className="size-3.5 text-runna-star" filled />
                  {posterRating} student rating
                </> : "New to Runna"}
              </span>
            </span>
          </Link>
        </div>
      </article>

      <section aria-label="Progress" className="mt-8">
        <StatusTimeline status={task.status} />
      </section>

      <section className="mt-8 flex flex-col gap-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-runna-ink">What&rsquo;s needed</h3>
          {/* Task text is student-written. React escapes it on render, and it's
              never passed through `dangerouslySetInnerHTML` anywhere. */}
          <p className="mt-1.5 whitespace-pre-line text-base leading-6 text-runna-slate">{task.description}</p>
        </div>

        <div className="rounded-xl border border-runna-outline bg-white p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-runna-muted">Proof required</h3>
          <p className="mt-1 text-base leading-6 text-runna-ink">{task.proofRequirement}</p>
        </div>

        {task.proofPhotoUrl ? <div className="rounded-xl border border-runna-outline bg-white p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-runna-muted">
            <ImageIcon className="size-4" />
            Proof submitted
          </h3>
          <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-xl bg-runna-blue-mist">
            <Image
              src={task.proofPhotoUrl}
              alt={`Proof photo for ${task.title}`}
              fill
              sizes="(min-width: 768px) 640px, 100vw"
              className="object-cover"
            />
          </div>
          {task.completedAt ? <p className="mt-2 text-sm text-runna-muted">Submitted {formatDateTime(task.completedAt)}</p> : null}
        </div> : null}
      </section>

      <section aria-label="Actions" className="mt-8 flex flex-col gap-3">
        <TaskActions taskId={task.id} status={task.status} role={role} />
        {canDispute ? <DisputeSheet taskId={task.id} /> : null}
      </section>

      {task.status === "confirmed" && role !== "visitor" ? <section className="mt-8">
        <RateTaskForm taskId={task.id} subject={role === "poster" ? task.doer : task.poster} />
      </section> : null}
    </main>
  </>;
}
