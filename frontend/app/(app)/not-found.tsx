import { SearchIcon } from "@/components/icons";
import { EmptyState } from "./_components/states";

/**
 * Reached when a task id doesn't resolve — usually an old link to something that
 * was completed and cleared, or a URL typed by hand.
 */
export default function AppNotFound() {
  return <div className="flex flex-1 items-center justify-center">
    <EmptyState
      icon={<SearchIcon className="size-7" />}
      title="We couldn't find that"
      copy="This task may have been completed or removed. The feed will have what's live right now."
      action={{ label: "Back to nearby tasks", href: "/explore" }}
    />
  </div>;
}
