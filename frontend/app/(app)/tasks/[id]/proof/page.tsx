import { notFound, redirect } from "next/navigation";
import { TaskAltIcon } from "@/components/icons";
import { ApiError, getTask, type Task } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { AppHeader } from "@/app/(app)/_components/app-header";
import { ProofUploadForm } from "./_components/proof-upload-form";

export const metadata = { title: "Submit proof · Runna" };

type ProofPageProps = { params: Promise<{ id: string }> };

/**
 * The proof screen, for the runner who claimed the task.
 *
 * Anyone else lands back on the task rather than on a form they can't submit —
 * the backend would reject it anyway, and a screen you're not allowed to use is
 * worse than not being sent there.
 */
export default async function ProofPage({ params }: ProofPageProps) {
  const { id } = await params;
  const { token, user } = await requireUser();

  let task: Task;
  try {
    task = await getTask(token, id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const isDoer = task.doer?.id === user.id;
  if (!isDoer || task.status !== "in_progress") redirect(`/tasks/${task.id}`);

  return <>
    <AppHeader title="Submit proof" backHref={`/tasks/${task.id}`} />

    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6 md:py-10">
      <h2 className="font-heading text-3xl font-bold leading-tight text-runna-ink">Show the results</h2>
      <p className="mt-2 text-base leading-6 text-runna-slate">Snap a pic to prove you nailed it.</p>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-runna-outline bg-white p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-runna-blue-mist text-runna-blue">
          <TaskAltIcon className="size-5" />
        </span>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-runna-muted">Requirement</h3>
          <p className="mt-1 text-base leading-6 text-runna-ink">{task.proofRequirement}</p>
        </div>
      </div>

      <div className="mt-6">
        <ProofUploadForm taskId={task.id} />
      </div>
    </main>
  </>;
}
