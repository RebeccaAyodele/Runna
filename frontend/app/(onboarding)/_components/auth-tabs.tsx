"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  ["/sign-in", "Sign in"],
  ["/sign-up", "Sign up"],
] as const;

/**
 * The segmented control from the design. Real links rather than local state, so
 * each screen stays its own route: bookmarkable, code-split, and still working
 * if JavaScript hasn't loaded yet.
 */
export function AuthTabs() {
  const pathname = usePathname();
  return <nav aria-label="Account access" className="flex gap-1 rounded-xl bg-runna-blue-soft p-1">
    {tabs.map(([href, label]) => {
      const active = pathname === href;
      return <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold tracking-[0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue ${active ? "border-b-2 border-runna-blue bg-white text-runna-blue shadow-sm" : "text-runna-muted hover:text-runna-ink"}`}
      >{label}</Link>;
    })}
  </nav>;
}
