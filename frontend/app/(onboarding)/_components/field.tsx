/**
 * Field primitives shared by every onboarding form. No `"use client"` here so
 * these render on the server; the interactive fields import the styles from
 * this module.
 */

export const labelClassName = "text-sm font-semibold tracking-[0.02em] text-runna-ink";

export const inputClassName = "w-full rounded-lg border border-runna-outline bg-white px-4 py-3 text-runna-ink shadow-sm transition-colors placeholder:text-runna-muted focus:border-runna-blue focus:outline-none focus:ring-2 focus:ring-runna-blue/20 aria-[invalid=true]:border-runna-danger aria-[invalid=true]:focus:ring-runna-danger/20";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className="text-sm text-runna-danger">{message}</p>;
}

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function FieldShell({ id, label, error, children }: FieldShellProps) {
  return <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className={labelClassName}>{label}</label>
    <div className="group relative">{children}</div>
    <FieldError id={`${id}-error`} message={error} />
  </div>;
}

type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email";
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
  /** Decorative trailing glyph; it tints to Signal Blue while the field has focus. */
  icon?: React.ReactNode;
};

export function TextField({ id, name, label, type = "text", placeholder, autoComplete, defaultValue, error, required = true, icon }: TextFieldProps) {
  return <FieldShell id={id} label={label} error={error}>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      defaultValue={defaultValue}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${inputClassName} ${icon ? "pr-11" : ""}`}
    />
    {icon ? <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-runna-muted transition-colors group-focus-within:text-runna-blue">{icon}</span> : null}
  </FieldShell>;
}
