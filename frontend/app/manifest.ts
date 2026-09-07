import type { MetadataRoute } from "next";

/**
 * PWA manifest.
 *
 * `start_url` and `scope` point at `/explore` rather than `/`: the landing page
 * is a marketing page for people who haven't signed up, and an installed app
 * should open where the student actually works. The scope keeps the installed
 * window inside the `(app)` routes — following a link out to the marketing site
 * hands off to the browser, which is what CLAUDE.md means by PWA behaviour
 * applying to that route group only.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Runna — Campus Errands",
    short_name: "Runna",
    description: "Post a campus errand or run one. Verified students, escrowed payments.",
    start_url: "/explore",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f8fb",
    theme_color: "#1550ff",
    categories: ["productivity", "lifestyle", "social"],
    icons: [
      { src: "/icons/runna-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/runna-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Post a task", short_name: "Post", url: "/tasks/new" },
      { name: "My activity", short_name: "Activity", url: "/activity" },
    ],
  };
}
