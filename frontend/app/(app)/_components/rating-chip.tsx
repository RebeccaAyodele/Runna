import { StarHalfIcon, StarIcon } from "@/components/icons";
import { formatRating } from "@/lib/format";

/**
 * The rating pill from the profile design: the average in blue, five stars, then
 * the number of ratings behind it.
 *
 * A brand-new account has no average at all, which the design doesn't cover. It
 * gets an honest "No ratings yet" rather than five empty stars — an empty row
 * reads as a bad score, which is the opposite of true.
 */

const STARS = [1, 2, 3, 4, 5] as const;

/**
 * 4.9 draws as four full stars and a half, not five — the same reading the design
 * shows for that value. The exact figure is right beside it, so the stars are the
 * glanceable version rather than the precise one.
 */
function starKindFor(position: number, rating: number): "full" | "half" | "empty" {
  if (position <= Math.floor(rating)) return "full";
  if (position === Math.floor(rating) + 1 && rating % 1 >= 0.25) return "half";
  return "empty";
}

export function RatingChip({ rating, count }: { rating: number | null; count: number }) {
  const average = formatRating(rating);

  if (rating === null || average === null) {
    return <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm text-runna-muted shadow-runna-card-soft">
      <StarIcon className="size-4 text-runna-outline-strong" />
      No ratings yet
    </p>;
  }

  return <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-runna-card-soft">
    <span className="font-heading text-2xl font-bold leading-none text-runna-blue">{average}</span>
    <span className="flex text-runna-star" aria-hidden="true">
      {STARS.map((position) => {
        const kind = starKindFor(position, rating);
        if (kind === "half") return <StarHalfIcon key={position} className="size-5" />;
        return <StarIcon key={position} className={`size-5 ${kind === "full" ? "" : "text-runna-outline-strong/60"}`} filled={kind === "full"} />;
      })}
    </span>
    <span className="text-sm text-runna-muted">({count})</span>
    <span className="sr-only">{average} out of 5, from {count} {count === 1 ? "rating" : "ratings"}</span>
  </p>;
}
