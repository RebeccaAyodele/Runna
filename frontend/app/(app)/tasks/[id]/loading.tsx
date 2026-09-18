/**
 * First load of a task. The shapes match the real screen — header card, timeline
 * row, body text — so the layout doesn't reflow when the task arrives.
 */
export default function TaskLoading() {
  return <>
    <div className="sticky top-0 z-30 flex h-16 items-center border-b border-runna-outline bg-runna-paper/95 px-5 backdrop-blur-sm">
      <span className="mx-auto h-6 w-32 animate-pulse rounded bg-runna-blue-mist" />
    </div>

    <main aria-busy="true" className="mx-auto w-full max-w-2xl flex-1 animate-pulse px-5 py-6 md:px-8 md:py-10">
      <span className="sr-only">Loading task</span>

      <div className="rounded-2xl bg-white p-6 shadow-runna-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <span className="block h-6 w-4/5 rounded bg-runna-blue-mist" />
            <span className="block h-6 w-1/2 rounded bg-runna-blue-mist" />
          </div>
          <span className="h-8 w-20 shrink-0 rounded-lg bg-runna-coral/15" />
        </div>
        <div className="mt-4 flex gap-4">
          <span className="h-4 w-20 rounded bg-runna-blue-mist" />
          <span className="h-4 w-24 rounded bg-runna-blue-mist" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="size-10 rounded-full bg-runna-blue-mist" />
          <span className="h-4 w-32 rounded bg-runna-blue-mist" />
        </div>
      </div>

      <div className="mt-8 flex justify-between px-2">
        {[0, 1, 2, 3, 4].map((stage) => <span key={stage} className="size-4 rounded-full bg-runna-blue-mist" />)}
      </div>

      <div className="mt-8 space-y-2">
        <span className="block h-4 w-full rounded bg-runna-blue-mist" />
        <span className="block h-4 w-full rounded bg-runna-blue-mist" />
        <span className="block h-4 w-2/3 rounded bg-runna-blue-mist" />
      </div>

      <span className="mt-8 block h-14 w-full rounded-2xl bg-runna-coral/15" />
    </main>
  </>;
}
