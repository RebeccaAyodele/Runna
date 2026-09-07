/**
 * Line-art icon set, sized by the caller via `className`.
 *
 * The Stitch designs draw these from Material Symbols, which isn't a dependency
 * here — these are hand-drawn equivalents on a shared 24px grid so the whole app
 * keeps one stroke weight instead of mixing icon families.
 *
 * A few glyphs read as solid shapes in the designs (the filled star on a rating,
 * the active tab in the bottom nav). Those take a `filled` prop rather than
 * living as a second, near-identical export.
 */

type IconProps = { className?: string };

function Icon({ className = "size-5", children }: IconProps & { children: React.ReactNode }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

/** Solid variant of the wrapper — used where the design shows a filled shape. */
function SolidIcon({ className = "size-5", children }: IconProps & { children: React.ReactNode }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">{children}</svg>;
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

export function ChevronRightIcon({ className }: IconProps) {
  return <Icon className={className}><path d="m9 6 6 6-6 6" /></Icon>;
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

export function ShieldIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  if (filled) return <SolidIcon className={className}><path d="M12 22s8.5-3.7 8.5-10V5L12 2 3.5 5v7c0 6.3 8.5 10 8.5 10Z" /></SolidIcon>;
  return <Icon className={className}><path d="M12 21.5s8-3.5 8-9.5V5.2L12 2.5 4 5.2V12c0 6 8 9.5 8 9.5Z" /></Icon>;
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

export function BoltIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  const d = "M13.2 2.5 5 13.4a.6.6 0 0 0 .5 1h5.3l-1 7.1 8.2-10.9a.6.6 0 0 0-.5-1h-5.3l1-7.1Z";
  if (filled) return <SolidIcon className={className}><path d={d} /></SolidIcon>;
  return <Icon className={className}><path d={d} /></Icon>;
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

const STAR_PATH = "m12 3 2.6 5.5 6 .8-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 9.3l6-.8L12 3Z";

export function StarIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  if (filled) return <SolidIcon className={className}><path d={STAR_PATH} /></SolidIcon>;
  return <Icon className={className}><path d={STAR_PATH} /></Icon>;
}

/**
 * Half-filled star for a rating like 4.5. The solid half is clipped rather than
 * drawn as a separate shape, so it lines up exactly with the outline behind it.
 */
export function StarHalfIcon({ className }: IconProps) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <defs><clipPath id="star-half-clip"><rect x="0" y="0" width="12" height="24" /></clipPath></defs>
    <path d={STAR_PATH} />
    <path d={STAR_PATH} fill="currentColor" stroke="none" clipPath="url(#star-half-clip)" />
  </svg>;
}

/* ------------------------------------------------------------------ *
 * App-screen glyphs
 * ------------------------------------------------------------------ */

export function LocationIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10.5" r="2.6" /></Icon>;
}

export function BuildingIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M3 21h18" /><path d="M5 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15" /><path d="M15 21V11h2a2 2 0 0 1 2 2v8" /><path d="M8.5 8h3M8.5 12h3M8.5 16h3" /></Icon>;
}

export function ExploreIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  if (filled) return <SolidIcon className={className}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 5.4-2.5 5.9a1 1 0 0 1-.53.53l-5.9 2.5a.5.5 0 0 1-.66-.66l2.5-5.9a1 1 0 0 1 .53-.53l5.9-2.5a.5.5 0 0 1 .66.66Z" /></SolidIcon>;
  return <Icon className={className}><circle cx="12" cy="12" r="9.2" /><path d="m15.6 8.4-2.3 5.2-5.2 2.3 2.3-5.2 5.2-2.3Z" /></Icon>;
}

export function AssignmentIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  if (filled) return <SolidIcon className={className}><path d="M17 3.5h-1.6a3.5 3.5 0 0 0-6.8 0H7a2 2 0 0 0-2 2V20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5.5a2 2 0 0 0-2-2ZM12 2.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM8.8 17.6H8v-1.4h.8v1.4Zm0-3.6H8v-1.4h.8V14Zm0-3.6H8V9h.8v1.4Zm7.2 7.2h-5.4v-1.4H16v1.4Zm0-3.6h-5.4v-1.4H16V14Zm0-3.6h-5.4V9H16v1.4Z" /></SolidIcon>;
  return <Icon className={className}><path d="M9 4.5H7a2 2 0 0 0-2 2V20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2h-2" /><rect x="9" y="2.5" width="6" height="4" rx="1.6" /><path d="M8.5 11h7M8.5 14.8h7M8.5 18.4h4" /></Icon>;
}

export function PersonIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  if (filled) return <SolidIcon className={className}><path d="M12 12.4a4.7 4.7 0 1 0 0-9.4 4.7 4.7 0 0 0 0 9.4Zm0 1.8c-4 0-8 2-8 4.6V21h16v-2.2c0-2.6-4-4.6-8-4.6Z" /></SolidIcon>;
  return <Icon className={className}><circle cx="12" cy="8" r="4.2" /><path d="M4.6 20.4c0-3.3 3.3-5.6 7.4-5.6s7.4 2.3 7.4 5.6" /></Icon>;
}

export function SearchIcon({ className }: IconProps) {
  return <Icon className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></Icon>;
}

export function PlusIcon({ className }: IconProps) {
  return <Icon className={className} ><path d="M12 5v14M5 12h14" /></Icon>;
}

export function CloseIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M18 6 6 18M6 6l12 12" /></Icon>;
}

export function CheckIcon({ className }: IconProps) {
  return <Icon className={className}><path d="m5 12.5 5 5L19 7" /></Icon>;
}

export function CheckCircleIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  if (filled) return <SolidIcon className={className}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.6-4-4 1.5-1.5 2.5 2.5 5.4-5.4 1.5 1.5-6.9 6.9Z" /></SolidIcon>;
  return <Icon className={className}><circle cx="12" cy="12" r="9.2" /><path d="m8 12.3 2.6 2.6L16 9.5" /></Icon>;
}

export function VerifiedIcon({ className }: IconProps) {
  return <SolidIcon className={className}><path d="m12 1.5 2.4 2.2 3.2-.4.9 3.1 2.9 1.4-1.2 3 1.2 3-2.9 1.4-.9 3.1-3.2-.4L12 22.5l-2.4-2.2-3.2.4-.9-3.1L2.6 16.2l1.2-3-1.2-3 2.9-1.4.9-3.1 3.2.4L12 1.5Zm-1.3 14.2 5.6-5.6-1.5-1.5-4.1 4.1-2-2L7.2 12l3.5 3.7Z" /></SolidIcon>;
}

export function CameraIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M3 8.8a2 2 0 0 1 2-2h1.9l1.3-2.3h7.6L17.1 6.8H19a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.8Z" /><circle cx="12" cy="13" r="3.6" /></Icon>;
}

export function ImageIcon({ className }: IconProps) {
  return <Icon className={className}><rect x="3" y="4.5" width="18" height="15" rx="2.5" /><circle cx="8.6" cy="10" r="1.7" /><path d="m4 17.4 4.6-4.4a1.6 1.6 0 0 1 2.2 0l3.4 3.3 2-1.8a1.6 1.6 0 0 1 2.2 0L20 16.6" /></Icon>;
}

export function RocketIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M13.5 3.6c3.4-1.4 6.2-1.2 6.9-.5.7.7.9 3.5-.5 6.9-1.2 2.9-4.8 6-7.4 7.3l-4.6-4.6c1.3-2.6 4.4-6.2 7.6-9.1Z" /><circle cx="14.8" cy="9.2" r="1.8" /><path d="m8.5 15.5-3.7 3.7M6.4 12.2 3.8 13l1.5 1.5M11.8 17.6l-.8 2.6L9.5 18.7" /></Icon>;
}

export function BikeIcon({ className }: IconProps) {
  return <Icon className={className}><circle cx="5.5" cy="17" r="3.3" /><circle cx="18.5" cy="17" r="3.3" /><path d="M8 17h3l4-8h-3" /><path d="m15 9 2 5M9.5 6.5H12" /></Icon>;
}

export function TruckIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M2 7.5a1.5 1.5 0 0 1 1.5-1.5H14v10H2V7.5Z" /><path d="M14 10h3.6l3.4 3.2V16h-7v-6Z" /><circle cx="7" cy="18" r="2" /><circle cx="17.5" cy="18" r="2" /></Icon>;
}

export function FlagIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M5 21V4" /><path d="M5 4.8h11.4l-1.9 3.6 1.9 3.6H5" /></Icon>;
}

export function LogOutIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M10 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H10" /><path d="M15.5 8.5 19.5 12l-4 3.5M19 12H9.5" /></Icon>;
}

export function DownloadIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M12 3.5v11m0 0 4-4m-4 4-4-4" /><path d="M4.5 17.5v1.2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.2" /></Icon>;
}

export function WifiOffIcon({ className }: IconProps) {
  return <Icon className={className}><path d="m2.5 2.5 19 19" /><path d="M8.4 13.6a5.4 5.4 0 0 1 6.2-.9M5 10.3a10 10 0 0 1 3.6-2.1M19 10.3a10 10 0 0 0-6.7-2.6" /><path d="M11.2 17.2a1.2 1.2 0 1 0 1.7 1.7" /></Icon>;
}

export function MenuIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>;
}

export function InfoIcon({ className }: IconProps) {
  return <Icon className={className}><circle cx="12" cy="12" r="9.2" /><path d="M12 11v5.5" /><circle cx="12" cy="7.9" r="1" fill="currentColor" stroke="none" /></Icon>;
}

export function AlertTriangleIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4.4" /><circle cx="12" cy="16.9" r="1" fill="currentColor" stroke="none" /></Icon>;
}
