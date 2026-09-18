import Image from "next/image";
import { VerifiedIcon } from "@/components/icons";
import type { TrustTier } from "@/lib/api";

/**
 * A student's avatar, with initials as the fallback.
 *
 * Uploaded avatars are Cloudinary URLs, so they go through `next/image` to be
 * resized and re-encoded rather than shipping a full-size original to a phone.
 * Plenty of accounts won't have a photo at all, and initials on the brand tint
 * read better there than a generic silhouette repeated down the feed.
 */

type AvatarProps = {
  name: string;
  src: string | null;
  /** Rendered pixel size. Also the value handed to `next/image` for sizing. */
  size?: number;
  className?: string;
};

/** "Adaeze Okonkwo" -> "AO", "Tunde" -> "T". */
function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export function Avatar({ name, src, size = 40, className = "" }: AvatarProps) {
  const dimension = { width: size, height: size };

  if (src) {
    return <Image
      src={src}
      alt={name}
      {...dimension}
      className={`shrink-0 rounded-full bg-runna-blue-mist object-cover ${className}`}
    />;
  }

  return <span
    aria-hidden="true"
    style={dimension}
    className={`flex shrink-0 items-center justify-center rounded-full bg-runna-blue-soft font-heading font-bold text-runna-blue ${className}`}
  >{initialsFor(name)}</span>;
}

/**
 * The avatar with the trust badge the profile design pins to its corner — a blue
 * pill reading "Trusted", not a bare tick, so it's legible without knowing what
 * the icon means.
 *
 * Only `trusted` earns it, matching the design. The other two tiers are shown as
 * text in the profile body instead, so a `new` or `established` account still
 * says where it stands rather than looking like a badge failed to load. The tier
 * itself is assigned by the backend and never inferred here.
 */
export function AvatarWithTier({ name, src, tier, size = 96 }: AvatarProps & { tier: TrustTier }) {
  return <span className="relative inline-flex">
    <Avatar name={name} src={src} size={size} className="ring-2 ring-white shadow-runna-card-soft" />
    {tier === "trusted" ? <span
      className="absolute -bottom-1 right-0 flex items-center gap-1 rounded-full bg-runna-blue px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em] text-white ring-2 ring-white"
    >
      <VerifiedIcon className="size-3" />
      Trusted
    </span> : null}
  </span>;
}
