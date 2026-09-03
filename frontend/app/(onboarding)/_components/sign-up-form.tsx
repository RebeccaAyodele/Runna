"use client";

import Link from "next/link";
import { useActionState } from "react";
import { GraduationCapIcon } from "@/components/icons";
import { emptyFormState } from "@/lib/validation";
import { signUpAction } from "../actions";
import { TextField } from "./field";
import { FormAlert } from "./form-alert";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, emptyFormState);

  return <form action={formAction} noValidate className="mt-7 flex flex-col gap-5">
    <FormAlert message={state.message} />
    <TextField
      id="signup-name"
      name="fullName"
      label="Full Name"
      placeholder="e.g. Adebayo Ogunlesi"
      autoComplete="name"
      defaultValue={state.values.fullName}
      error={state.fieldErrors.fullName}
    />
    <TextField
      id="signup-matric"
      name="matricNumber"
      label="Matric Number"
      placeholder="e.g. CSC/2019/001"
      autoComplete="off"
      defaultValue={state.values.matricNumber}
      error={state.fieldErrors.matricNumber}
    />
    <TextField
      id="signup-email"
      name="schoolEmail"
      label="School Email"
      type="email"
      placeholder="student@oauife.edu.ng"
      autoComplete="email"
      defaultValue={state.values.schoolEmail}
      error={state.fieldErrors.schoolEmail}
      icon={<GraduationCapIcon className="size-5" />}
    />
    <PasswordField id="signup-password" name="password" label="Password" autoComplete="new-password" error={state.fieldErrors.password} />
    <SubmitButton pendingLabel="Creating account…">Create Account</SubmitButton>
    <p className="text-center text-xs leading-5 text-runna-muted">
      By creating an account you agree to Runna&apos;s{" "}
      <Link href="/#faq" className="font-semibold text-runna-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue">community rules</Link>.
    </p>
  </form>;
}
