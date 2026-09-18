"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AssignmentIcon, ExploreIcon, PersonIcon, PlusIcon } from "@/components/icons";

/**
 * The app's primary navigation, in two forms from one source of truth.
 *
 * On a phone it's the bottom bar from the designs. From `md:` up it becomes a
 * left rail instead — a 480px-wide column of cards with a bottom bar underneath
 * is a phone screenshot stretched onto a monitor, not a desktop layout.
 *
 * The designs' fourth tab is Messages. There's no messaging in the backend
 * contract, so it isn't here: a tab that navigates nowhere is worse than three
 * that work. It slots in as a fourth entry below when the endpoints exist.
 */

const NAV_ITEMS = [
  { href: "/explore", label: "Explore", Icon: ExploreIcon },
  { href: "/activity", label: "Activity", Icon: AssignmentIcon },
  { href: "/profile", label: "Profile", Icon: PersonIcon },
] as const;

/**
 * A tab owns its own subtree: `/tasks/abc` keeps Explore lit rather than lighting
 * nothing, so the bar always shows where you are.
 */
function useActiveHref(): string | null {
  const pathname = usePathname();
  const match = NAV_ITEMS.find(({ href }) => pathname === href || pathname.startsWith(`${href}/`));
  if (match) return match.href;
  // Task screens are reached from the feed, so they belong to Explore.
  if (pathname.startsWith("/tasks")) return "/explore";
  if (pathname.startsWith("/users")) return "/profile";
  return null;
}

export function BottomNav() {
  const activeHref = useActiveHref();

  return <nav
    aria-label="Main"
    className="fixed inset-x-0 bottom-0 z-40 mx-auto flex h-20 max-w-[480px] items-center justify-around rounded-t-2xl border-t border-runna-outline bg-white px-4 shadow-runna-nav md:hidden"
  >
    {NAV_ITEMS.map(({ href, label, Icon }) => {
      const active = href === activeHref;
      return <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-transform duration-200 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue ${active ? "bg-runna-coral text-white" : "text-runna-slate hover:text-runna-blue"}`}
      >
        <Icon className="size-6" filled={active} />
        <span className="mt-1 text-sm font-semibold tracking-[0.02em]">{label}</span>
      </Link>;
    })}
  </nav>;
}

export function SideNav() {
  const activeHref = useActiveHref();

  return <div className="hidden w-64 shrink-0 border-r border-runna-outline bg-white md:block">
    <div className="sticky top-0 flex h-svh flex-col p-5">
      <Link
        href="/explore"
        aria-label="Runna home"
        className="flex items-center gap-2 rounded-lg px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
      >
        <span className="font-heading text-2xl font-extrabold tracking-tight text-runna-blue">Runna</span>
      </Link>

      <nav aria-label="Main" className="mt-8 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = href === activeHref;
          return <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 font-semibold tracking-[0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue ${active ? "bg-runna-coral text-white" : "text-runna-slate hover:bg-runna-blue-soft hover:text-runna-ink"}`}
          >
            <Icon className="size-6" filled={active} />
            {label}
          </Link>;
        })}
      </nav>

      <Link
        href="/tasks/new"
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-runna-coral px-4 py-3.5 font-heading text-lg font-semibold text-white shadow-runna-button transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral"
      >
        <PlusIcon className="size-5" />
        Post a task
      </Link>
    </div>
  </div>;
}
