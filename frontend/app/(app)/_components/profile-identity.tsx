import { AvatarWithTier } from "@/components/avatar";
import type { TrustTier, User } from "@/lib/api";
import { RatingChip } from "./rating-chip";

/**
 * The centred identity block at the top of a profile: avatar, name, rating.
 *
 * Shared by your own profile and someone else's so the two can't drift apart —
 * what differs between them is what sits underneath, not this.
 */

/**
 * `trusted` is already spelled out on the avatar badge, so it isn't repeated
 * here. The other two tiers have no badge in the design, and saying nothing would
 * leave a new account looking like a profile that failed to load.
 */
const TIER_LINE: Record<TrustTier, string | null> = {
  new: "New to Runna",
  established: "Established runner",
  trusted: null,
};

type ProfileIdentityProps = {
  user: User;
  ratingsCount: number;
};

export function ProfileIdentity({ user, ratingsCount }: ProfileIdentityProps) {
  const tierLine = TIER_LINE[user.trustTier];

  return <section className="flex flex-col items-center text-center">
    <AvatarWithTier name={user.fullName} src={user.avatarUrl} tier={user.trustTier} size={96} />

    <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-[-0.01em] text-runna-ink">{user.fullName}</h2>
    {tierLine ? <p className="mt-1 text-sm text-runna-muted">{tierLine}</p> : null}

    <div className="mt-3">
      <RatingChip rating={user.avgRating} count={ratingsCount} />
    </div>
  </section>;
}
