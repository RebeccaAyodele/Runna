/**
 * Presentation helpers. Nothing here makes a decision — these only format
 * values the backend already sent, so what a screen shows is what the API said.
 */

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const dayFormatter = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short" });
const timeFormatter = new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" });

export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount);
}

/** Rounded to the nearest 10m so a card doesn't read like a GPS readout. */
export function formatDistance(meters: number | null): string | null {
  if (meters === null) return null;
  if (meters < 1000) return `${Math.round(meters / 10) * 10}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Deliberately coarse. Relative time is rendered on the server and hydrated on
 * the client moments later — day/hour granularity reads the same in both, where
 * a live seconds counter would flip between them and warn about a mismatch.
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";

  const elapsedMs = now.getTime() - then.getTime();
  const minutes = Math.round(elapsedMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return dayFormatter.format(then);
}

/** "by 4:30 pm" for today, "by 4 Sep" beyond it — enough to plan around. */
export function formatDeadline(iso: string | null, now: Date = new Date()): string | null {
  if (!iso) return null;
  const deadline = new Date(iso);
  if (Number.isNaN(deadline.getTime())) return null;

  const sameDay = deadline.toDateString() === now.toDateString();
  return sameDay ? `by ${timeFormatter.format(deadline)}` : `by ${dayFormatter.format(deadline)}`;
}

export function formatDateTime(iso: string): string {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) return "";
  return `${dayFormatter.format(value)}, ${timeFormatter.format(value)}`;
}

/** Rating averages read better as "4.9" than "4.9000000001". */
export function formatRating(value: number | null): string | null {
  return value === null ? null : value.toFixed(1);
}
