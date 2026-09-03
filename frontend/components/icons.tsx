/**
 * Line-art icon set, sized by the caller via `className`.
 *
 * The Stitch designs draw these from Material Symbols, which isn't a dependency
 * here — these are hand-drawn equivalents on a shared 24px grid so the whole app
 * keeps one stroke weight instead of mixing icon families.
 */

type IconProps = { className?: string };

function Icon({ className = "size-5", children }: IconProps & { children: React.ReactNode }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

export function ArrowLeftIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M19 12H5m7 7-7-7 7-7" /></Icon>;
}

export function ArrowRightIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M5 12h14m-7-7 7 7-7 7" /></Icon>;
}

export function ChevronDownIcon({ className }: IconProps) {
  return <Icon className={className}><path d="m6 9 6 6 6-6" /></Icon>;
}

export function GraduationCapIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M12 4 2 9l10 5 10-5-10-5Z" /><path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" /></Icon>;
}

export function EyeIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Icon>;
}

export function EyeOffIcon({ className }: IconProps) {
  return <Icon className={className}><path d="m3 3 18 18" /><path d="M10.6 10.7a2 2 0 0 0 2.8 2.8" /><path d="M9.4 5.2A9.9 9.9 0 0 1 12 5c6.2 0 10 7 10 7a17.7 17.7 0 0 1-3.3 4.2M6.3 6.4A17.5 17.5 0 0 0 2 12s3.8 7 10 7a9.7 9.7 0 0 0 3.9-.8" /></Icon>;
}

export function ShieldCheckIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M12 21.5s8-3.5 8-9.5V5.2L12 2.5 4 5.2V12c0 6 8 9.5 8 9.5Z" /><path d="m9 11.8 2.1 2.1 4-4.1" /></Icon>;
}

export function MailIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M3 8a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" /><path d="m3.6 7.4 6.9 5.1 6.9-5.1" /><circle cx="19.5" cy="5.5" r="2.5" fill="currentColor" stroke="none" /></Icon>;
}

export function LockIcon({ className }: IconProps) {
  return <Icon className={className}><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Icon>;
}

export function PostAddIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M15 3.5H6a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-6.5" /><path d="M8 9.5h4M8 13.5h5M8 17h3" /><path d="M19 2.5v6M22 5.5h-6" /></Icon>;
}

export function BoltIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M13.2 2.5 5 13.4a.6.6 0 0 0 .5 1h5.3l-1 7.1 8.2-10.9a.6.6 0 0 0-.5-1h-5.3l1-7.1Z" /></Icon>;
}

export function PaymentsIcon({ className }: IconProps) {
  return <Icon className={className}><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20" /><path d="M6 14.5h4" /></Icon>;
}

export function ClockIcon({ className }: IconProps) {
  return <Icon className={className}><circle cx="12" cy="12" r="9" /><path d="M12 6.8V12l3.4 2.1" /></Icon>;
}

export function CalendarCheckIcon({ className }: IconProps) {
  return <Icon className={className}><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 2.8v4M16 2.8v4" /><path d="m9.3 15.3 2 2 3.4-3.6" /></Icon>;
}

export function WalletIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M20 8.5v-1A2.5 2.5 0 0 0 17.5 5H5.5A2.5 2.5 0 0 0 3 7.5v9A2.5 2.5 0 0 0 5.5 19h12a2.5 2.5 0 0 0 2.5-2.5v-1" /><path d="M21.5 9h-4.2a3 3 0 0 0 0 6h4.2a.8.8 0 0 0 .8-.8V9.8a.8.8 0 0 0-.8-.8Z" /></Icon>;
}

export function StarIcon({ className }: IconProps) {
  return <Icon className={className}><path d="m12 3 2.6 5.5 6 .8-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 9.3l6-.8L12 3Z" /></Icon>;
}
