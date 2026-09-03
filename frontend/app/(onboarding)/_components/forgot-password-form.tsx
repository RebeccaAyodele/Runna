"use client";

import { useActionState } from "react";
import { MailIcon } from "@/components/icons";
import { emptyFormState } from "@/lib/validation";
import { requestPasswordResetAction } from "../actions";
import { TextField } from "./field";
import { FormAlert } from "./form-alert";
import { SubmitButton } from "./submit-button";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordResetAction, emptyFormState);

  return <form action={formAction} noValidate className="mt-7 flex flex-col gap-5">
    <FormAlert message={state.message} />
    <FormAlert message={state.success} tone="success" />
    <TextField
      id="reset-email"
      name="schoolEmail"
      label="School Email"
      type="email"
      placeholder="student@oauife.edu.ng"
      autoComplete="email"
      defaultValue={state.values.schoolEmail}
      error={state.fieldErrors.schoolEmail}
      icon={<MailIcon className="size-5" />}
    />
    <SubmitButton pendingLabel="Sending…">Send Reset Link</SubmitButton>
  </form>;
}
