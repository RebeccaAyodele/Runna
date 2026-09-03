"use client";

import Link from "next/link";
import { useActionState } from "react";
import { GraduationCapIcon } from "@/components/icons";
import { emptyFormState } from "@/lib/validation";
import { signInAction } from "../actions";
import { TextField } from "./field";
import { FormAlert } from "./form-alert";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";

/**
 * `noValidate` hands validation to the Server Action so every message is worded
 * and styled the same way, instead of mixing in the browser's native bubbles.
 */
export function SignInForm() {
  const [state, formAction] = useActionState(signInAction, emptyFormState);

  return <form action={formAction} noValidate className="mt-7 flex flex-col gap-5">
    <FormAlert message={state.message} />
    <TextField
      id="signin-email"
      name="schoolEmail"
      label="School Email"
      type="email"
      placeholder="e.g. student@oauife.edu.ng"
      autoComplete="email"
      defaultValue={state.values.schoolEmail}
      error={state.fieldErrors.schoolEmail}
      icon={<GraduationCapIcon className="size-5" />}
    />
    <PasswordField id="signin-password" name="password" label="Password" autoComplete="current-password" error={state.fieldErrors.password} />
    <SubmitButton pendingLabel="Signing in…">Sign In</SubmitButton>
    <Link
      href="/forgot-password"
      className="mx-auto rounded-lg px-2 py-1 text-sm font-semibold text-runna-blue transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
    >Forgot Password?</Link>
  </form>;
}
