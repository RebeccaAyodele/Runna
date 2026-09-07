/**
 * Form field primitives shared by onboarding and the app.
 *
 * No `"use client"` here on purpose — these render on the server, and the
 * interactive fields (password reveal, OTP, image picker) import the styles
 * from this module rather than redefining them.
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
  /** Sits between the label and the control — the "what should they show you?" line. */
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

export function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  return <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className={labelClassName}>{label}</label>
    {hint ? <p id={`${id}-hint`} className="text-sm leading-5 text-runna-slate">{hint}</p> : null}
    <div className="group relative">{children}</div>
    <FieldError id={`${id}-error`} message={error} />
  </div>;
}

/** `aria-describedby` has to name both the hint and the error when both exist. */
function describedBy(id: string, hint: string | undefined, error: string | undefined): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email";
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  /** Decorative trailing glyph; it tints to Signal Blue while the field has focus. */
  icon?: React.ReactNode;
};

export function TextField({ id, name, label, type = "text", hint, placeholder, autoComplete, defaultValue, error, required = true, maxLength, icon }: TextFieldProps) {
  return <FieldShell id={id} label={label} hint={hint} error={error}>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      defaultValue={defaultValue}
      required={required}
      maxLength={maxLength}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, hint, error)}
      className={`${inputClassName} ${icon ? "pr-11" : ""}`}
    />
    {icon ? <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-runna-muted transition-colors group-focus-within:text-runna-blue">{icon}</span> : null}
  </FieldShell>;
}

type TextAreaFieldProps = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
};

export function TextAreaField({ id, name, label, hint, placeholder, defaultValue, error, required = true, rows = 4, maxLength }: TextAreaFieldProps) {
  return <FieldShell id={id} label={label} hint={hint} error={error}>
    <textarea
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      defaultValue={defaultValue}
      required={required}
      maxLength={maxLength}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, hint, error)}
      className={`${inputClassName} resize-none`}
    />
  </FieldShell>;
}

type PriceFieldProps = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  error?: string;
};

/**
 * Money input. The ₦ is a decorative prefix rather than part of the value, so
 * what gets submitted is a plain number the backend can parse without stripping
 * a currency symbol first.
 */
export function PriceField({ id, name, label, hint, defaultValue, error }: PriceFieldProps) {
  return <FieldShell id={id} label={label} hint={hint} error={error}>
    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-heading text-lg font-extrabold text-runna-coral">₦</span>
    <input
      id={id}
      name={name}
      type="number"
      inputMode="numeric"
      min={0}
      step={50}
      placeholder="0"
      defaultValue={defaultValue}
      required
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, hint, error)}
      className={`${inputClassName} pl-10`}
    />
  </FieldShell>;
}
