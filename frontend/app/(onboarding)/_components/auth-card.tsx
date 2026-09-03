import { RouteMotif } from "./route-motif";

/** The white card every onboarding screen sits inside. */
export function AuthCard({ children }: { children: React.ReactNode }) {
  return <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-runna-outline bg-white p-6 shadow-runna-card sm:p-8">
    <RouteMotif className="pointer-events-none absolute -bottom-8 -right-8 size-32 text-runna-blue opacity-5" />
    <div className="relative">{children}</div>
  </div>;
}
