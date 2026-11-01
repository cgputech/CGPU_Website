"use client";

/**
 * HeroStats: live placement counter for the 2026–27 batch.
 * Heading with pulsing live dot, then four stats in ONE horizontal row
 * at every width (mobile and desktop). Tight spacing, thin dividers.
 */

import { useEffect, useState } from "react";
import { fetchPlacementYearSummary } from "@/services/statistics";
import { cn } from "@/lib/utils";

const LIVE_YEAR_ID = 5;

interface LiveStats {
  offers: number;
  recruiters: number;
  visits: number;
  months: number;
}

const DEFAULT_STATS: LiveStats = {
  offers: 40,
  recruiters: 9,
  visits: 9,
  months: 3,
};

interface HeroStatsProps {
  className?: string;
}

export function HeroStats({ className }: HeroStatsProps) {
  const [stats, setStats] = useState<LiveStats>(DEFAULT_STATS);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const summary = await fetchPlacementYearSummary(LIVE_YEAR_ID);
        if (isMounted && summary) {
          setStats((prev) => ({
            ...prev,
            offers: summary.totalOffers,
            recruiters: summary.totalRecruiters,
            visits: summary.totalVisits,
          }));
        }
      } catch (err) {
        console.error("[HeroStats] Error loading live stats:", err);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const items = [
    { value: stats.offers, label: "Offers" },
    { value: stats.recruiters, label: "Recruiters" },
    { value: stats.visits, label: "Visits" },
    { value: stats.months, label: "Months Left" },
  ];

  return (
    <section
      aria-labelledby="hero-stats-heading"
      className={cn(
        "w-full max-w-4xl mx-auto rounded-2xl select-none",
        "bg-black text-white border border-white/15",
        "flex flex-col gap-3 min-[600px]:gap-4",
        "p-3 min-[600px]:p-4 min-[840px]:p-6",
        className,
      )}
    >
      {/* Heading with pulsing live dot */}
      <div className="flex items-center justify-center gap-2">
        <span className="relative flex size-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-red-500" />
        </span>
        <h2
          id="hero-stats-heading"
          className="text-xs min-[600px]:text-sm leading-normal font-medium uppercase tracking-widest text-white/80"
        >
          Live Placement Stats
        </h2>
      </div>

      {/* One horizontal row of four at every width */}
      <div className="grid grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "min-w-0 flex flex-col items-center justify-start gap-1 px-1 text-center",
              "min-[840px]:px-4",
              "[&:not(:first-child)]:border-l [&:not(:first-child)]:border-white/15",
            )}
          >
            <span className="text-3xl min-[600px]:text-4xl min-[840px]:text-5xl leading-[1.2] font-medium tabular-nums text-white">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-xs leading-[1.4] font-normal text-white/60 min-[600px]:uppercase min-[600px]:tracking-widest">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}