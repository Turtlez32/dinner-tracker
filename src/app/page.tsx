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

export default function Home() {
  const initialDinner = useMemo(() => {
    return dayOrder.reduce<DinnerState>((acc, day) => {
      acc[day] = "";
      return acc;
    }, {});
  }, []);

  const [dinners, setDinners] = useState<DinnerState>(initialDinner);
  const [drafts, setDrafts] = useState<DraftState>(initialDinner);
  const [highlightDay, setHighlightDay] = useState<string>("Friday");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const handleSubmit = (day: string) => {
    const nextValue = drafts[day]?.trim();
    setDinners((prev) => ({
      ...prev,
      [day]: nextValue
    }));
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
                          className="rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white transition hover:bg-clay/90"
                        >
                          Save dinner
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
