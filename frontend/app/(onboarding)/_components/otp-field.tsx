"use client";

import { useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from "react";
import { VERIFICATION_CODE_LENGTH } from "@/lib/validation";
import { FieldError } from "./field";

const positions = Array.from({ length: VERIFICATION_CODE_LENGTH }, (_, index) => index);

/**
 * Six single-character boxes that behave like one field: typing advances,
 * backspace on an empty box steps back, and pasting a code fills the rest.
 * The joined value rides along in a hidden input so the Server Action just
 * reads `formData.get(name)`.
 */
export function OtpField({ name, error }: { name: string; error?: string }) {
  const [digits, setDigits] = useState<string[]>(() => Array<string>(VERIFICATION_CODE_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  function focusAt(index: number) {
    inputsRef.current[Math.min(Math.max(index, 0), VERIFICATION_CODE_LENGTH - 1)]?.focus();
  }

  function replaceDigit(index: number, value: string) {
    setDigits((current) => current.map((digit, position) => (position === index ? value : digit)));
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const digit = event.target.value.replace(/\D/g, "").slice(-1);
    replaceDigit(index, digit);
    if (digit) focusAt(index + 1);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && digits[index] === "" && index > 0) {
      event.preventDefault();
      replaceDigit(index - 1, "");
      focusAt(index - 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length === 0) return;
    event.preventDefault();
    setDigits((current) => current.map((digit, position) => {
      const offset = position - index;
      return offset >= 0 && offset < pasted.length ? pasted[offset] : digit;
    }));
    focusAt(index + pasted.length);
  }

  return <fieldset className="flex flex-col gap-2" aria-describedby={error ? `${name}-error` : undefined}>
    <legend className="sr-only">Verification code</legend>
    <input type="hidden" name={name} value={digits.join("")} />
    <div className="flex justify-between gap-2">
      {positions.map((index) => <input
        key={index}
        ref={(element) => { inputsRef.current[index] = element; }}
        value={digits[index]}
        onChange={(event) => handleChange(index, event)}
        onKeyDown={(event) => handleKeyDown(index, event)}
        onPaste={(event) => handlePaste(index, event)}
        onFocus={(event) => event.target.select()}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        autoComplete={index === 0 ? "one-time-code" : "off"}
        autoFocus={index === 0}
        aria-label={`Digit ${index + 1}`}
        aria-invalid={error ? true : undefined}
        className="h-14 w-full rounded-lg border border-runna-outline bg-white text-center font-heading text-2xl font-bold text-runna-ink caret-runna-blue shadow-sm transition-all focus:border-runna-blue focus:shadow-runna-focus focus:outline-none focus:ring-2 focus:ring-runna-blue/30 aria-[invalid=true]:border-runna-danger"
      />)}
    </div>
    <FieldError id={`${name}-error`} message={error} />
  </fieldset>;
}
