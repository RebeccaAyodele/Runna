import type { NextConfig } from "next";

/**
 * Headers are set here rather than in a middleware because they apply to every
 * response including static assets, and because the service worker needs a few
 * that Next wouldn't otherwise send.
 */
const nextConfig: NextConfig = {
  images: {
    // Proof photos and avatars come back as Cloudinary URLs on the task record.
    // Allow-listing the host lets `next/image` optimise them instead of the app
    // dropping raw remote URLs into an `<img>`.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" }],
  },

  async headers() {
    return [
      {
        // The worker is served from `/public`, so Next would cache it like any
        // other static file. A stale service worker is effectively unfixable
        // from the server side, so it's explicitly never cached, and its own
        // CSP keeps it from pulling in anything off-origin.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // This app has no reason to read a camera stream, a microphone or a
          // location fix from JavaScript — proof photos come through a file
          // input, and distances are computed server-side.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
