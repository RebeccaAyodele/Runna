"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";

export function BackButton() {
  const router = useRouter();
  return <button
    type="button"
    onClick={() => router.back()}
    aria-label="Go back"
    className="rounded-full p-2 text-runna-blue transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue"
  >
    <ArrowLeftIcon className="size-6" />
  </button>;
}
