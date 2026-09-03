/**
 * The dashed route-path motif from the design system, used here as a quiet
 * background detail. It's the static version on purpose — the animated
 * `.route-path` treatment is reserved for moments that earn it.
 */
export function RouteMotif({ className }: { className?: string }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 100 100" fill="none"><path d="M10 90C40 90 60 10 90 10" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round" /></svg>;
}
