import type { Metadata } from "next";
import { ShieldCheckIcon } from "@/components/icons";
import { AuthCard } from "../_components/auth-card";
import { AuthTabs } from "../_components/auth-tabs";
import { SignUpForm } from "../_components/sign-up-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Verify your student email and join the Runna campus hustle — post tasks or earn cash between classes.",
};

export default function SignUpPage() {
  return <div className="flex w-full max-w-md flex-col items-center">
    <AuthCard>
      <AuthTabs />
      <div className="mt-7">
        <h1 className="font-heading text-[32px] font-bold leading-[38px] tracking-[-0.01em]">Join the Hustle</h1>
        <p className="mt-2 leading-6 text-runna-muted">Verify you&apos;re an OAU student to get started.</p>
      </div>
      <SignUpForm />
    </AuthCard>
    <p className="mt-6 flex items-center gap-2 text-sm text-runna-muted opacity-60">
      <ShieldCheckIcon className="size-4" />
      Students only. Always verified.
    </p>
  </div>;
}
