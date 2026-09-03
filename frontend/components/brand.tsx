export function RunnaIcon({ className = "size-7" }: { className?: string }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M13 23v-6l-2.1-2-1 4.4L3 18l.4-2 4.8 1 1.6-8.1-1.8.7V13H6V8.3l3.95-1.7q.875-.375 1.288-.487T12 6q.525 0 .975.275T13.7 7l1 1.6q.65 1.05 1.763 1.725T19 11v2q-1.65 0-3.088-.687T13.5 10.5l-.6 3 2.1 2V23zm-.913-18.088Q11.5 4.325 11.5 3.5t.588-1.412T13.5 1.5t1.413.588T15.5 3.5t-.587 1.413T13.5 5.5t-1.412-.587" /></svg>;
}

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return <span className={`inline-flex items-center gap-2 font-heading text-2xl font-bold tracking-tight ${inverse ? "text-white" : "text-runna-blue"}`}><RunnaIcon className="size-7 text-runna-blue" />Runna</span>;
}
