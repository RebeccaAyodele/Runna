import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The empty and error states every fetching screen needs, in one shape so they
 * read the same wherever they turn up.
 *
 * Both are deliberately plain: an empty feed isn't a failure, and an error isn't
 * the place for the route-path animation — that motif is reserved for moments
 * where progress is the point.
 */

type StateProps = {
  icon: ReactNode;
  title: string;
  copy: string;
  /** A link out of the dead end, when there's an obvious one. */
  action?: { label: string; href: string };
  children?: ReactNode;
};

export function EmptyState({ icon, title, copy, action, children }: StateProps) {
  return <div className="flex flex-col items-center px-5 py-16 text-center">
    <span className="flex size-16 items-center justify-center rounded-full bg-runna-blue-mist text-runna-blue">{icon}</span>
    <h2 className="mt-5 font-heading text-xl font-semibold text-runna-ink">{title}</h2>
    <p className="mt-2 max-w-sm text-base leading-6 text-runna-muted">{copy}</p>
    {action ? <Link
      href={action.href}
      className="mt-6 rounded-xl bg-runna-coral px-6 py-3 font-semibold tracking-[0.02em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral"
    >{action.label}</Link> : null}
    {children}
  </div>;
}

/**
 * The error twin. `retry` is wired to an `error.tsx` boundary's `reset`, which
 * re-runs the failed render rather than reloading the whole app — the point of
 * this over a "refresh the page" message.
 */
export function ErrorState({ icon, title, copy, retry }: Omit<StateProps, "action" | "children"> & { retry?: () => void }) {
  return <div className="flex flex-col items-center px-5 py-16 text-center">
    <span className="flex size-16 items-center justify-center rounded-full bg-runna-danger/10 text-runna-danger">{icon}</span>
    <h2 className="mt-5 font-heading text-xl font-semibold text-runna-ink">{title}</h2>
    <p className="mt-2 max-w-sm text-base leading-6 text-runna-muted">{copy}</p>
    {retry ? <button
      type="button"
      onClick={retry}
      className="mt-6 rounded-xl bg-runna-blue px-6 py-3 font-semibold tracking-[0.02em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
    >Try again</button> : null}
  </div>;
}
