"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRightIcon, CalendarCheckIcon, ClockIcon, GraduationCapIcon, WalletIcon } from "@/components/icons";

/**
 * The "Why Runna?" section: one segmented control switching between the two
 * sides of the marketplace. This is the only interactive part of the landing
 * page, so it's the only piece that ships as a client component — the rest of
 * the page stays server-rendered.
 */

const views = [
  {
    key: "post",
    label: "Post a Task",
    caption: "Your time, reclaimed.",
    benefits: [
      { title: "Ultimate Convenience", copy: "Skip the lines and save your time. From coffee runs to laundry pickups, let a fellow student handle it while you hit the books.", Icon: ClockIcon },
      { title: "Student-Only Trust", copy: "Our community is strictly verified students. Secure payments and campus-native runners mean peace of mind for every task.", Icon: GraduationCapIcon },
    ],
  },
  {
    key: "earn",
    label: "Earn Cash",
    caption: "Hustle on your terms.",
    benefits: [
      { title: "Work on Your Terms", copy: "Choose the tasks that fit your schedule. Between lecturers, on your way to lunch, or during a free hour; you decide when you hustle", Icon: CalendarCheckIcon },
      { title: "Instant Payouts", copy: "Get paid as soon as the task is confirmed. No waiting for weeks; your earnings are transferred directly to your campus account instantly", Icon: WalletIcon },
      { title: "Build Your Campus Rep", copy: "Earn ratings for every errand you run. Higher ratings unlock premium tasks and make you a top-tier Runner in the OAU community", Icon: WalletIcon },
    ],
  },
] as const;

function BenefitCard({ title, copy, Icon }: { title: string; copy: string; Icon: (props: { className?: string }) => React.ReactElement }) {
  return <article className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-runna-card">
    <Icon className="pointer-events-none absolute -right-4 -top-4 size-24 text-runna-ink opacity-5" />
    <div className="relative flex items-start gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-runna-coral/10 text-runna-coral">
        <Icon className="size-7" />
      </span>
      <div>
        <h3 className="font-heading text-xl font-semibold">{title}</h3>
        <p className="mt-1 leading-6 text-runna-muted">{copy}</p>
      </div>
    </div>
  </article>;
}

export function BenefitsTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  /** Arrow keys move between tabs, as expected of a tablist. */
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = views.length - 1;
    const next = event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActiveIndex(next);
    tabsRef.current[next]?.focus();
  }

  return <>
    <div role="tablist" aria-label="Runna benefits" className="mt-6 flex rounded-full border border-runna-outline bg-white p-1.5 shadow-runna-card">
      {views.map((view, index) => {
        const active = index === activeIndex;
        return <button
          key={view.key}
          ref={(element) => { tabsRef.current[index] = element; }}
          type="button"
          role="tab"
          id={`benefits-tab-${view.key}`}
          aria-selected={active}
          aria-controls={`benefits-panel-${view.key}`}
          tabIndex={active ? 0 : -1}
          onClick={() => setActiveIndex(index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={`flex-1 rounded-full py-3 text-sm font-semibold tracking-[0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral ${active ? "bg-runna-coral text-white shadow-runna-button" : "text-runna-muted hover:bg-runna-blue-soft hover:text-runna-ink"}`}
        >{view.label}</button>;
      })}
    </div>

    {views.map((view, index) => <div
      key={view.key}
      role="tabpanel"
      id={`benefits-panel-${view.key}`}
      aria-labelledby={`benefits-tab-${view.key}`}
      hidden={index !== activeIndex}
      className="mt-6 grid gap-4"
    >
      {view.benefits.map((benefit) => <BenefitCard key={benefit.title} {...benefit} />)}
      <div className="relative mt-2 h-32 overflow-hidden rounded-2xl shadow-runna-card">
        <Image src="/runna-campus.png" alt="" fill sizes="(min-width: 768px) 448px, 100vw" className="object-cover" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-runna-blue/80 to-transparent p-4">
          <span className="text-sm font-semibold tracking-[0.02em] text-white">{view.caption}</span>
        </div>
      </div>
    </div>)}

    <div className="relative mt-8 overflow-hidden rounded-2xl border border-runna-outline bg-runna-blue-soft p-7 text-center">
      <span aria-hidden="true" className="absolute inset-y-0 left-4 border-l-2 border-dashed border-runna-blue opacity-20" />
      <h3 className="font-heading text-2xl font-bold">Ready to Run?</h3>
      <p className="mt-1 leading-6 text-runna-muted">Join the campus hustle today. Thousands of students are already moving.</p>
      <Link
        href="/sign-up"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-runna-coral px-6 py-4 font-heading text-xl font-semibold text-white shadow-runna-button transition-transform hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-coral active:scale-[0.98]"
      >Get the App<ArrowRightIcon className="size-6" /></Link>
    </div>
  </>;
}
