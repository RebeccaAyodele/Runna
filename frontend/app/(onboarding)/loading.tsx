/**
 * Route-level loading for onboarding — a skeleton shaped like the auth card, so
 * the transition reads as "almost there" rather than a blank page.
 */
export default function OnboardingLoading() {
  return <div className="w-full max-w-md animate-pulse rounded-3xl border border-runna-outline bg-white p-6 shadow-runna-card sm:p-8" aria-hidden="true">
    <div className="h-11 rounded-full bg-runna-blue-soft" />
    <div className="mt-6 h-8 w-2/3 rounded-lg bg-runna-blue-soft" />
    <div className="mt-3 h-4 w-5/6 rounded bg-runna-outline" />
    <div className="mt-8 space-y-5">
      <div className="h-12 rounded-lg bg-runna-outline" />
      <div className="h-12 rounded-lg bg-runna-outline" />
    </div>
    <div className="mt-8 h-13 rounded-2xl bg-runna-coral/25" />
    <span className="sr-only">Loading</span>
  </div>;
}
