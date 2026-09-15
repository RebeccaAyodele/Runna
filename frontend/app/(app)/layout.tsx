import type { ReactNode } from "react";
import { PwaProvider } from "@/components/pwa-provider";
import { requireSession } from "@/lib/auth";
import { BottomNav, SideNav } from "./_components/app-nav";

export const metadata = {
  title: "Runna",
  // The installed app fills the notch area, so the bar behind it gets the brand
  // blue rather than the browser's default white.
  themeColor: "#1550ff",
};

/**
 * Shell for every authenticated screen.
 *
 * The guard lives here rather than in each page so a route added under `(app)`
 * later is authenticated by default instead of by remembering to add a check.
 * It only looks at the cookie — no API call — because this layout re-runs on
 * navigation and a round trip per tap isn't worth it. Screens then fetch through
 * `withSession`, which turns a dead token into a redirect at the point it's
 * actually discovered.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireSession();

  return <div className="min-h-svh bg-runna-paper md:flex">
    <SideNav />
    {/* `min-w-0` keeps long task titles truncating instead of widening the flex
        row past the viewport. */}
    <div className="flex min-h-svh w-full min-w-0 flex-col pb-24 md:pb-0">{children}</div>
    <BottomNav />
    <PwaProvider />
  </div>;
}
