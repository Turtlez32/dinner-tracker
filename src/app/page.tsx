"use client";

import { useEffect, useMemo, useState } from "react";

const dayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

type DinnerState = Record<string, string>;
type DraftState = Record<string, string>;
type SaveStatus = "idle" | "saving" | "saved" | "error";
type StatusState = Record<string, SaveStatus>;

/** Returns a map of day name -> ISO date (YYYY-MM-DD) for the current week (Mon–Sun). */
function getWeekDates(): Record<string, string> {
  const today = new Date();
  const dow = today.getDay(); // 0 = Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  return dayOrder.reduce<Record<string, string>>((acc, day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    acc[day] = d.toISOString().slice(0, 10);
    return acc;
  }, {});
}

export default function Home() {
  const weekDates = useMemo(() => getWeekDates(), []);

  const initialDinner = useMemo(() => {
    return dayOrder.reduce<DinnerState>((acc, day) => {
      acc[day] = "";
      return acc;
    }, {});
  }, []);

  const initialStatus = useMemo(() => {
    return dayOrder.reduce<StatusState>((acc, day) => {
      acc[day] = "idle";
      return acc;
    }, {});
  }, []);

  const [dinners, setDinners] = useState<DinnerState>(initialDinner);
  const [drafts, setDrafts] = useState<DraftState>(initialDinner);
  const [statuses, setStatuses] = useState<StatusState>(initialStatus);
  const [highlightDay, setHighlightDay] = useState<string>("Friday");
  const [isDark, setIsDark] = useState(false);

  // Load current week's saved dinners on mount
  useEffect(() => {
    const monday = weekDates["Monday"];
    fetch(`/api/dinner/week/${monday}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!Array.isArray(data)) return;
        const loaded: DinnerState = {};
        data.forEach(({ date, item }: { date: string; item: string | null }) => {
          const day = dayOrder.find((d) => weekDates[d] === date);
          if (day) loaded[day] = item ?? "";
        });
        setDinners((prev) => ({ ...prev, ...loaded }));
        setDrafts((prev) => ({ ...prev, ...loaded }));
      })
      .catch(() => {/* silently ignore on load */});
  }, [weekDates]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const handleSubmit = async (day: string) => {
    const item = drafts[day]?.trim();
    if (!item) return;

    setStatuses((prev) => ({ ...prev, [day]: "saving" }));

    try {
      const res = await fetch(`/api/dinner/${weekDates[day]}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item })
      });

      if (!res.ok) throw new Error("Failed to save");

      setDinners((prev) => ({ ...prev, [day]: item }));
      setStatuses((prev) => ({ ...prev, [day]: "saved" }));
      setTimeout(() => setStatuses((prev) => ({ ...prev, [day]: "idle" })), 2000);
    } catch {
      setStatuses((prev) => ({ ...prev, [day]: "error" }));
      setTimeout(() => setStatuses((prev) => ({ ...prev, [day]: "idle" })), 3000);
    }
  };

  return (
    <main className="min-h-screen px-6 pb-16 pt-12">
      <section className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[32px] bg-white/90 p-8 shadow-card backdrop-blur dark:bg-[#101821]/90">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-clay">
                Dinner Atlas
              </p>
              <button
                type="button"
                onClick={() => setIsDark((prev) => !prev)}
                className="rounded-full border border-dusk/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-dusk/70 transition hover:border-clay/40 hover:text-clay dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:border-clover/60 dark:hover:text-clover"
              >
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl dark:text-mist">
              Plan the week with a clear, calm dinner board.
            </h1>
            <p className="mt-4 text-base text-dusk/80 md:text-lg dark:text-mist/70">
              Keep the family looped in with a quick daily update. Add the dish, press
              save, and the plan stays visible for everyone.
            </p>
            <div className="mt-8 rounded-3xl border border-dusk/10 bg-mist/90 p-6 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-dusk/70 dark:text-mist/70">
                  Tonight&apos;s Highlight
                </p>
                <span className="rounded-full bg-clover/10 px-3 py-1 text-xs font-semibold text-clover dark:bg-clover/20">
                  Editable
                </span>
              </div>
              <p className="mt-4 font-display text-3xl text-ink dark:text-mist">
                {dinners[highlightDay] || "Add a dinner to spotlight the week"}
              </p>
              <p className="mt-2 text-sm text-dusk/70 dark:text-mist/70">
                {highlightDay} is set as the highlight card. Tap a day below to change it.
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/60 bg-gradient-to-br from-white/80 via-white/60 to-white/30 p-8 shadow-card dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/0">
            <h2 className="font-display text-2xl text-ink dark:text-mist">
              Weekly dinner inputs
            </h2>
            <p className="mt-2 text-sm text-dusk/70 dark:text-mist/70">
              One text field per day. Submit to update the saved dinner entry.
            </p>
            <div className="mt-6 grid gap-4">
              {dayOrder.map((day) => (
                <div
                  key={day}
                  className="rounded-2xl border border-dusk/10 bg-white/90 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-dusk/70 dark:text-mist/70">
                        {day}
                      </p>
                      <p className="mt-1 font-display text-xl text-ink dark:text-mist">
                        {dinners[day] || "No dinner set"}
                      </p>
                    </div>
                    <div className="flex w-full flex-1 flex-col gap-2 md:max-w-sm">
                      <input
                        value={drafts[day]}
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [day]: event.target.value
                          }))
                        }
                        placeholder={`Add ${day} dinner`}
                        className="w-full rounded-full border border-dusk/15 bg-white px-4 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-clay/60 focus:ring-2 focus:ring-clay/20 dark:border-white/15 dark:bg-white/10 dark:text-mist dark:placeholder:text-mist/50"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSubmit(day)}
                          disabled={statuses[day] === "saving"}
                          className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 ${
                            statuses[day] === "saved"
                              ? "bg-clover"
                              : statuses[day] === "error"
                              ? "bg-red-500"
                              : "bg-clay hover:bg-clay/90"
                          }`}
                        >
                          {statuses[day] === "saving"
                            ? "Saving..."
                            : statuses[day] === "saved"
                            ? "Saved"
                            : statuses[day] === "error"
                            ? "Failed"
                            : "Save dinner"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setHighlightDay(day)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            highlightDay === day
                              ? "border-clover/40 bg-clover/10 text-clover"
                              : "border-dusk/15 bg-white text-dusk/70 hover:border-clover/30 hover:text-clover dark:border-white/15 dark:bg-white/5 dark:text-mist/70 dark:hover:border-clover/40 dark:hover:text-clover"
                          }`}
                        >
                          {highlightDay === day ? "Highlight set" : "Make highlight"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
