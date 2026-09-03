import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "../_components/auth-card";
import { ForgotPasswordForm } from "../_components/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Send a password reset link to your Runna student email.",
};

export default function ForgotPasswordPage() {
  return <AuthCard>
    <h1 className="font-heading text-[32px] font-bold leading-[38px] tracking-[-0.01em]">Forgot Password?</h1>
    <p className="mt-2 leading-6 text-runna-muted">
      Enter the school email on your account and we&apos;ll send you a link to set a new password.
    </p>
    <ForgotPasswordForm />
    <p className="mt-6 text-center text-sm text-runna-muted">
      Remembered it?{" "}
      <Link href="/sign-in" className="font-semibold text-runna-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue">Sign in</Link>
    </p>
  </AuthCard>;
}
