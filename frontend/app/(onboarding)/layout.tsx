import { Brand } from "@/components/brand";
import { BackButton } from "./_components/back-button";

/**
 * The shell every onboarding screen shares: a Cool Paper page with a slim bar
 * carrying a back affordance and the wordmark. Typed structurally rather than
 * with the generated `LayoutProps`, since a route group covers several paths
 * rather than one.
 */
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-col bg-runna-paper text-runna-ink">
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-runna-outline bg-runna-paper/90 px-4 backdrop-blur-sm sm:px-6">
      <BackButton />
      <Brand />
      {/* Balances the back button so the wordmark sits optically centred. */}
      <span aria-hidden="true" className="w-10 shrink-0" />
    </header>
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:py-14">{children}</main>
  </div>;
}
