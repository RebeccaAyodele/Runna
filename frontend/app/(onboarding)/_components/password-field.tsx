"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { FieldShell, inputClassName } from "./field";

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  error?: string;
};

export function PasswordField({ id, name, label, autoComplete, error }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return <FieldShell id={id} label={label} error={error}>
    <input
      id={id}
      name={name}
      type={visible ? "text" : "password"}
      placeholder="••••••••"
      autoComplete={autoComplete}
      required
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${inputClassName} pr-12`}
    />
    <button
      type="button"
      onClick={() => setVisible((current) => !current)}
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
      className="absolute inset-y-0 right-2 flex items-center rounded-md px-1.5 text-runna-muted transition-colors hover:text-runna-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
    >
      {visible ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
    </button>
  </FieldShell>;
}
