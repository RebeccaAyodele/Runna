"use client";

import { useId, useRef, useState } from "react";
import { AssignmentIcon } from "@/components/icons";
import type { Task } from "@/lib/api";
import { HistoryCard } from "./history-card";
import { EmptyState } from "./states";

/**
 * The Posted / Completed tabs from the profile design.
 *
 * Both lists arrive in the same API response, so switching is a client-side state
 * change rather than a second request — the alternative, tabs as links with a
 * query parameter, would round-trip to the server to show data already in the
 * page. It's a real tablist with arrow-key movement, because a row of buttons
 * that only responds to a pointer isn't navigation on a phone browser either.
 */

export type HistoryTab = {
  id: string;
  label: string;
  tasks: Task[];
  /** "posted" shows who ran it, "ran" shows who it was for. */
  perspective: "posted" | "ran";
  empty: { title: string; copy: string; action?: { label: string; href: string } };
};

export function HistoryTabs({ tabs }: { tabs: HistoryTab[] }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  if (!active) return null;

  function move(direction: 1 | -1) {
    const index = tabs.findIndex((tab) => tab.id === activeId);
    // Wraps, so the arrow keys never dead-end on the first or last tab.
    const next = tabs[(index + direction + tabs.length) % tabs.length];
    if (!next) return;
    setActiveId(next.id);
    tabRefs.current.get(next.id)?.focus();
  }

  return <>
    <div role="tablist" aria-label="Task history" className="flex border-b border-runna-outline-strong/40">
      {tabs.map((tab) => {
        const selected = tab.id === active.id;
        return <button
          key={tab.id}
          ref={(node) => {
            if (node) tabRefs.current.set(tab.id, node);
            else tabRefs.current.delete(tab.id);
          }}
          type="button"
          role="tab"
          id={`${baseId}-${tab.id}-tab`}
          aria-selected={selected}
          aria-controls={`${baseId}-${tab.id}-panel`}
          // Only the selected tab is in the tab order; the arrows move between
          // them from there, which is how a tablist is meant to behave.
          tabIndex={selected ? 0 : -1}
          onClick={() => setActiveId(tab.id)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
            if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
          }}
          className={`flex-1 border-b-2 pb-2.5 text-center text-sm font-semibold tracking-[0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runna-blue ${selected ? "border-runna-coral text-runna-ink" : "border-transparent text-runna-muted hover:text-runna-blue"}`}
        >
          {tab.label}
          {tab.tasks.length > 0 ? <span className="ml-1.5 text-runna-muted">{tab.tasks.length}</span> : null}
        </button>;
      })}
    </div>

    <div
      role="tabpanel"
      id={`${baseId}-${active.id}-panel`}
      aria-labelledby={`${baseId}-${active.id}-tab`}
      tabIndex={0}
      className="mt-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-runna-blue"
    >
      {active.tasks.length === 0 ? <EmptyState
        icon={<AssignmentIcon className="size-7" />}
        title={active.empty.title}
        copy={active.empty.copy}
        action={active.empty.action}
      /> : <ul className="flex flex-col gap-4">
        {active.tasks.map((task) => <li key={task.id}>
          <HistoryCard task={task} perspective={active.perspective} />
        </li>)}
      </ul>}
    </div>
  </>;
}
