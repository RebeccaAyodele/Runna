import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { ArrowLeftIcon } from "@/components/icons";

/**
 * The sticky top bar the app screens share.
 *
 * Two shapes, matching the designs: the feed's title-plus-avatar bar, and the
 * back-arrow bar on a task or a form. Both keep the title optically centred, so
 * the trailing slot is reserved even when it's empty — otherwise the title
 * shifts a few pixels between screens that have an avatar and screens that
 * don't.
 */

type AppHeaderProps = {
  title: string;
  /** Renders a back link on the left instead of nothing. */
  backHref?: string;
  /** The signed-in student's avatar, on the screens that show one. */
  user?: { fullName: string; avatarUrl: string | null };
  /** Anything extra on the right — a filter button, for instance. */
  action?: ReactNode;
};

export function AppHeader({ title, backHref, user, action }: AppHeaderProps) {
  return <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-runna-outline bg-runna-paper/95 px-5 backdrop-blur-sm">
    <div className="flex size-10 shrink-0 items-center">
      {backHref ? <Link
        href={backHref}
        aria-label="Go back"
        className="flex size-10 items-center justify-center rounded-full text-runna-ink transition-colors hover:bg-runna-blue-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
      >
        <ArrowLeftIcon className="size-6" />
      </Link> : null}
    </div>

    <h1 className="flex-1 truncate text-center font-heading text-2xl font-extrabold text-runna-blue">{title}</h1>

    <div className="flex size-10 shrink-0 items-center justify-end">
      {action}
      {!action && user ? <Link
        href="/profile"
        aria-label="Your profile"
        className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
      >
        <Avatar name={user.fullName} src={user.avatarUrl} size={32} />
      </Link> : null}
    </div>
  </header>;
}
