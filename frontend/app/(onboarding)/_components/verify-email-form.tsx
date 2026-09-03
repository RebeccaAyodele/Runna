"use client";

import { useActionState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { emptyFormState } from "@/lib/validation";
import { resendVerificationAction, verifyEmailAction } from "../actions";
import { FormAlert } from "./form-alert";
import { OtpField } from "./otp-field";
import { SubmitButton } from "./submit-button";

/**
 * Resending is a second action, so it needs its own `<form>` — forms can't
 * nest. Keeping it separate also gives it its own pending state, so hitting
 * "Resend code" doesn't make the verify button look busy.
 */
function ResendCodeForm({ schoolEmail }: { schoolEmail: string }) {
  const [state, formAction, pending] = useActionState(resendVerificationAction, emptyFormState);

  return <form action={formAction} className="mt-6 flex flex-col items-center gap-2">
    <input type="hidden" name="schoolEmail" value={schoolEmail} />
    <FormAlert message={state.message} />
    <FormAlert message={state.success} tone="success" />
    <p className="text-sm text-runna-muted">
      Didn&apos;t receive the email?{" "}
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="rounded-md font-semibold text-runna-blue transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
      >{pending ? "Sending…" : "Resend code"}</button>
    </p>
  </form>;
}

export function VerifyEmailForm({ schoolEmail }: { schoolEmail: string }) {
  const [state, formAction] = useActionState(verifyEmailAction, emptyFormState);

  return <>
    <form action={formAction} noValidate className="mt-8 flex flex-col gap-6">
      <FormAlert message={state.message} />
      <input type="hidden" name="schoolEmail" value={schoolEmail} />
      <OtpField name="code" error={state.fieldErrors.code} />
      <SubmitButton pendingLabel="Verifying…" icon={<ArrowRightIcon className="size-5" />}>Verify Email</SubmitButton>
    </form>
    <ResendCodeForm schoolEmail={schoolEmail} />
  </>;
}
