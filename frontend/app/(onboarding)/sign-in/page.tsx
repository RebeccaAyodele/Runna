import type { Metadata } from "next";
import { ShieldCheckIcon } from "@/components/icons";
import { AuthCard } from "../_components/auth-card";
import { AuthTabs } from "../_components/auth-tabs";
import { SignInForm } from "../_components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Runna with your school email to post tasks or start earning on campus.",
};

export default function SignInPage() {
  return <div className="flex w-full max-w-md flex-col items-center">
    <AuthCard>
      <AuthTabs />
      <div className="mt-7">
        <h1 className="font-heading text-[32px] font-bold leading-[38px] tracking-[-0.01em]">Welcome Back</h1>
        <p className="mt-2 leading-6 text-runna-muted">Enter your school details to continue.</p>
      </div>
      <SignInForm />
    </AuthCard>
    <p className="mt-6 flex items-center gap-2 text-sm text-runna-muted opacity-60">
      <ShieldCheckIcon className="size-4" />
      Secure Campus Login
    </p>
  </div>;
}
