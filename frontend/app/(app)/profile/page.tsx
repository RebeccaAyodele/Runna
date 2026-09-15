import { GraduationCapIcon, MailIcon } from "@/components/icons";
import { getPublicProfile } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { AppHeader } from "@/app/(app)/_components/app-header";
import { HistoryTabs } from "@/app/(app)/_components/history-tabs";
import { ProfileIdentity } from "@/app/(app)/_components/profile-identity";
import { SignOutButton } from "@/app/(app)/_components/sign-out-button";

export const metadata = { title: "Your profile · Runna" };

/**
 * Your own profile.
 *
 * Read through the same public-profile endpoint as anyone else's, so the rating
 * and the task history can't disagree between the two screens. The extras here
 * are the things only you should see: the matric number and school email the
 * account was verified with, and the way out.
 */
export default async function ProfilePage() {
  const { token, user: session } = await requireUser();
  const profile = await getPublicProfile(token, session.id);

  return <>
    <AppHeader title="Profile" />

    <main className="mx-auto w-full max-w-[480px] flex-1 px-5 py-6 md:max-w-3xl md:px-8 md:py-10">
      <ProfileIdentity user={profile.user} ratingsCount={profile.ratingsCount} />

      <div className="mt-6">
        <HistoryTabs tabs={[
          {
            id: "posted",
            label: "Posted",
            tasks: profile.posted,
            perspective: "posted",
            empty: {
              title: "Nothing posted yet",
              copy: "Post an errand and someone nearby can pick it up in minutes.",
              action: { label: "Post a task", href: "/tasks/new" },
            },
          },
          {
            id: "completed",
            label: "Completed",
            tasks: profile.completed,
            perspective: "ran",
            empty: {
              title: "No runs yet",
              copy: "Claim a task from the feed and it'll show up here once it's confirmed.",
              action: { label: "Find a task", href: "/explore" },
            },
          },
        ]} />
      </div>

      <section className="mt-10">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-runna-muted">Account</h3>
        {/* Straight off the session, not editable here — both fields are what the
            account was verified against, and changing either is a re-verification
            the backend owns. */}
        <dl className="mt-3 flex flex-col gap-3 rounded-2xl border border-runna-outline bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-runna-blue-mist text-runna-blue">
              <MailIcon className="size-4" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs text-runna-muted">School email</dt>
              <dd className="truncate text-sm font-medium text-runna-ink">{session.schoolEmail}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-runna-blue-mist text-runna-blue">
              <GraduationCapIcon className="size-4" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs text-runna-muted">Matric number</dt>
              <dd className="truncate text-sm font-medium text-runna-ink">{session.matricNumber}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-4">
          <SignOutButton />
        </div>
      </section>
    </main>
  </>;
}
