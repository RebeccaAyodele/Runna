import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MailIcon } from "@/components/icons";
import { validateSchoolEmail } from "@/lib/validation";
import { AuthCard } from "../_components/auth-card";
import { VerifyEmailForm } from "../_components/verify-email-form";

export const metadata: Metadata = {
  title: "Check your mail",
  description: "Enter the 6-digit code we sent to your student email to finish setting up your Runna account.",
};

export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const { email } = await searchParams;
  const schoolEmail = (typeof email === "string" ? email : "").trim().toLowerCase();

  // The code is tied to an address, so there's nothing to verify without one.
  // Sending them back to sign-up beats rendering a form that can only fail.
  if (validateSchoolEmail(schoolEmail) !== null) redirect("/sign-up");

  return <AuthCard>
    <div className="flex flex-col items-center text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-runna-blue-soft text-runna-blue">
        <MailIcon className="size-9" />
      </span>
      <h1 className="mt-6 font-heading text-[40px] font-extrabold leading-[48px] tracking-[-0.02em]">Check your mail</h1>
      <p className="mt-3 text-lg leading-7 text-runna-muted">
        We&apos;ve sent a 6-digit verification code to{" "}
        <span className="font-semibold text-runna-ink">{schoolEmail}</span>. Enter it below to verify your account.
      </p>
    </div>
    <VerifyEmailForm schoolEmail={schoolEmail} />
  </AuthCard>;
}
