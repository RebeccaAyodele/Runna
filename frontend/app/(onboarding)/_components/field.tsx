/**
 * The onboarding forms use the same field primitives as the rest of the app.
 * They live in `/components/field.tsx` now that the task forms need them too;
 * this re-export keeps the existing `./field` imports working.
 */

export { FieldError, FieldShell, TextField, inputClassName, labelClassName } from "@/components/field";
