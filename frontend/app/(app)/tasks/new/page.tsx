import { AppHeader } from "../../_components/app-header";
import { PostTaskForm } from "./_components/post-task-form";

export const metadata = { title: "Post a task · Runna" };

export default function NewTaskPage() {
  return <>
    <AppHeader title="Post a task" backHref="/explore" />

    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6 md:px-8 md:py-10">
      <p className="mb-6 text-base leading-6 text-runna-slate">
        Say what you need and what it&rsquo;s worth. Your payment sits in escrow until you confirm the task is done.
      </p>
      <PostTaskForm />
    </main>
  </>;
}
