"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ANALYTICS_PERIODS, type AnalyticsPeriodId } from "@/lib/admin/analytics-period";

type PeriodSelectProps = {
  value: AnalyticsPeriodId;
  onChange: (value: AnalyticsPeriodId) => void;
  disabled?: boolean;
};

export function PeriodSelect({ value, onChange, disabled }: PeriodSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = ANALYTICS_PERIODS.find((p) => p.id === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-w-[220px]">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
        Time period
      </span>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-slate-900 to-slate-950 px-4 py-3 text-left text-sm font-medium text-white shadow-[0_0_24px_rgba(34,211,238,0.08)] transition hover:border-cyan-400/45 hover:shadow-[0_0_28px_rgba(34,211,238,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
            <CalendarIcon />
          </span>
          <span>{selected?.label ?? "Select period"}</span>
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Time period"
          className="premium-scrollbar absolute right-0 z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-white/10 bg-slate-950/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-md"
        >
          {ANALYTICS_PERIODS.map((period) => {
            const isSelected = period.id === value;
            return (
              <li key={period.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(period.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "bg-cyan-400/15 font-semibold text-cyan-100"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{period.label}</span>
                  {isSelected && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                      Active
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-5 w-5 shrink-0 text-cyan-300/80 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" d="M6 3v2M14 3v2M4 7h12M5 5h10a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
    </svg>
  );
}
