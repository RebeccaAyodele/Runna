import type { TaskStatus } from "@/lib/api";
import { isOffTrack, stageIndexFor, statusMeta, TASK_STAGES } from "@/lib/task-status";

/**
 * The route-path timeline — the app's signature motif, and the one place it's
 * load-bearing rather than decorative.
 *
 * Five stages, dashed for what's ahead and solid for what's done, with a pulsing
 * marker on where the task actually is. The stage comes from the status the
 * backend sent; nothing here infers progress from timestamps or from what the
 * viewer just tapped.
 *
 * A task that has expired, missed its deadline or gone to dispute has left the
 * path, so it gets a plain banner instead of a marker parked at a stage it never
 * reached — a timeline is a promise about what happens next, and those statuses
 * are the absence of one.
 */
export function StatusTimeline({ status }: { status: TaskStatus }) {
  const meta = statusMeta(status);

  if (isOffTrack(status)) {
    return <div role="status" className="flex items-start gap-3 rounded-xl border border-runna-danger/30 bg-runna-danger/5 p-4">
      <span aria-hidden="true" className="mt-1.5 size-2.5 shrink-0 rounded-full bg-runna-danger" />
      <p className="text-sm leading-5 text-runna-ink">
        <span className="font-semibold">{meta.label}.</span> {meta.hint}
      </p>
    </div>;
  }

  const currentIndex = stageIndexFor(status);
  const lastIndex = TASK_STAGES.length - 1;
  // Markers sit at the centre of five equal columns, so the first is a tenth of
  // the way across and the last a tenth from the end — the line spans between
  // those two rather than the full width.
  const trackInset = 100 / (TASK_STAGES.length * 2);
  const progress = (currentIndex / lastIndex) * (100 - trackInset * 2);

  return <div className="pb-2">
    <ol className="relative flex items-start" aria-label="Task progress">
      <span
        aria-hidden="true"
        className="absolute top-3 border-t-2 border-dashed border-runna-outline-strong/40"
        style={{ left: `${trackInset}%`, right: `${trackInset}%` }}
      />
      <span
        aria-hidden="true"
        className="absolute top-3 border-t-2 border-runna-blue transition-all duration-1000"
        style={{ left: `${trackInset}%`, width: `${progress}%` }}
      />

      {TASK_STAGES.map((stage, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;

        return <li key={stage.status} className="relative flex flex-1 flex-col items-center gap-2">
          {current ? <span className="flex size-6 items-center justify-center rounded-full border-2 border-runna-coral bg-white">
            <span aria-hidden="true" className="size-3 animate-pulse rounded-full bg-runna-coral" />
          </span> : <span className={`mt-1 size-4 rounded-full border-2 ${done ? "border-runna-blue bg-runna-blue" : "border-runna-outline-strong/50 bg-white"}`} />}

          <span className={`text-center text-[11px] leading-tight ${current ? "font-semibold text-runna-coral" : done ? "text-runna-blue" : "text-runna-muted"}`}>
            {stage.label}
            {current ? <span className="sr-only"> (current stage)</span> : null}
          </span>
        </li>;
      })}
    </ol>
  </div>;
}
