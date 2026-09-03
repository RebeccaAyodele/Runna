/** Form-level feedback. `role="alert"` so a screen reader announces it on submit. */
export function FormAlert({ message, tone = "error" }: { message: string | null; tone?: "error" | "success" }) {
  if (!message) return null;
  const toneClassName = tone === "error"
    ? "border-runna-danger/25 bg-runna-danger/5 text-runna-danger"
    : "border-runna-success/25 bg-runna-success/5 text-runna-success";
  return <p role="alert" className={`rounded-lg border px-4 py-3 text-sm font-medium ${toneClassName}`}>{message}</p>;
}
