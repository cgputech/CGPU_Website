"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TestimonialCardProps {
  name?: string;
  role?: string;
  company?: string;
  /** URL to the uploaded video file */
  videoUrl?: string;
  /** Poster/thumbnail image shown before play */
  thumbnailUrl?: string;
  /** Short caption shown in the overlay (optional) */
  caption?: string;
  className?: string;
}

// ── Short-form Video Card ─────────────────────────────────────────────────────

export function TestimonialCard({
  name,
  role,
  company,
  videoUrl,
  thumbnailUrl,
  caption,
  className,
}: TestimonialCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md",
        "aspect-[9/16]",
        className,
      )}
    >
      {/* ── Video ── */}
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          onEnded={() => setPlaying(false)}
        />
      ) : thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={`${name} testimonial`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        /* Fallback gradient when no media */
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-700" />
      )}

      {/* ── Dark scrim ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* ── Play / Pause button ── */}
      {videoUrl && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center focus:outline-none"
          aria-label={
            playing
              ? `Pause ${name}'s testimonial`
              : `Play ${name}'s testimonial`
          }
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full",
                "bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg",
                "transition-all duration-200",
                playing
                  ? "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                  : "opacity-100 scale-100",
              )}
            >
              {playing ? (
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M6 19h4V5H6zm8-14v14h4V5z" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </span>
          </div>
        </button>
      )}

      {/* ── Bottom overlay info ── */}
      {/* <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10 pointer-events-none">
        {caption && (
          <p className="mb-2 text-xs text-white/70 leading-snug italic line-clamp-2">
            &ldquo;{caption}&rdquo;
          </p>
        )}
        {name && (
          <p className="text-sm font-bold text-white leading-tight">{name}</p>
        )}
        {(role || company) && (
          <p className="mt-0.5 text-xs text-white/60 truncate">
            {[role, company].filter(Boolean).join(" · ")}
          </p>
        )}
      </div> */}
    </div>
  );
}

// ── Testimonial data — add videoUrl/thumbnailUrl when ready ──────────────────

const testimonials: TestimonialCardProps[] = [
  {
    caption:
      "The mock interviews gave me the confidence I needed to crack my dream role.",
    videoUrl:
      "https://res.cloudinary.com/dlzy7vwio/video/upload/v1782396808/WhatsApp_Video_2026-06-24_at_8.10.12_PM_zqgms3.mp4", // ← replace with uploaded video URL
    thumbnailUrl: undefined, // ← replace with poster image
  },
  {
    caption:
      "The placement cell's support made all the difference in landing my first job.",
    videoUrl:
      "https://res.cloudinary.com/dlzy7vwio/video/upload/v1782396760/WhatsApp_Video_2026-06-24_at_8.10.12_PM_1_n8qtj9.mp4",
    thumbnailUrl: undefined,
  },
];

// ── Section ───────────────────────────────────────────────────────────────────

export default function TestimonialSection() {
  return (
    <section className="py-16 md:py-24 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
        <Badge variant="default">Testimonials</Badge>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center">
          Words from Those Who{" "}
          <span className="italic font-bold md:text-5xl text-3xl text-primary-red">
            lived it
          </span>
        </h2>

        {/*
          Bento — 2 equal portrait cards
          Desktop / tablet: side-by-side (max ~380px each, centred)
          Mobile: stacked full-width
        */}
        <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>

        {/* <Link href="/testimonials">
          <Button
            variant="link"
            className="mt-8 cursor-pointer text-primary-red hover:text-primary-red-hover font-semibold"
          >
            See More Testimonials
          </Button>
        </Link> */}
      </div>
    </section>
  );
}
