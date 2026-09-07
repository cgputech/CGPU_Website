"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Story Data ─────────────────────────────────────────────── */

interface StorySlide {
  /** Small category / chapter label above the main text */
  tag: string;
  /** The big headline — rendered dramatically */
  headline: string;
  /** A secondary line of copy beneath the headline */
  subtext: string;
}

const story: StorySlide[] = [
  {
    tag: "Chapter I",
    headline: "Where It All Begins",
    subtext:
      "Every year, hundreds of students walk through our doors — each carrying a dream of building something extraordinary.",
  },
  {
    tag: "Chapter II",
    headline: "The Forge",
    subtext:
      "Mock interviews. Resume workshops. Industry mentors. We don't just prepare students — we transform them into professionals the world needs.",
  },
  {
    tag: "Chapter III",
    headline: "The Stage Is Set",
    subtext:
      "Top recruiters from across the nation descend on campus — Amazon, TCS, Infosys, UST, and many more — seeking the next generation of talent.",
  },
  {
    tag: "Chapter IV",
    headline: "Records Rewritten",
    subtext:
      "Year after year, placement records are shattered. The highest packages climb. The number of offers multiply. The legacy grows.",
  },
  {
    tag: "Chapter V",
    headline: "This Is CGPU",
    subtext:
      "More than a placement cell. A launchpad for careers. A bridge between ambition and achievement.",
  },
];

/* ── Component ──────────────────────────────────────────────── */

export default function RecruitmentNumbers() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(".cin-slide");

      /* Master timeline pinned to the section */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${story.length * 1200}`,
          pin: true,
          scrub: 0.8,
        },
      });

      slides.forEach((slide, i) => {
        const tag = slide.querySelector(".cin-tag");
        const headline = slide.querySelector(".cin-headline");
        const subtext = slide.querySelector(".cin-subtext");
        const divider = slide.querySelector(".cin-divider");

        /* ── Entrance ────────────────────────────── */
        tl.fromTo(
          slide,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          i === 0 ? 0 : undefined
        );

        // Tag fades in first
        tl.fromTo(
          tag,
          { opacity: 0, y: 30, letterSpacing: "0.5em" },
          { opacity: 1, y: 0, letterSpacing: "0.35em", duration: 0.5 },
          "<"
        );

        // Headline scales up dramatically
        tl.fromTo(
          headline,
          { opacity: 0, scale: 0.7, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "<0.15"
        );

        // Divider line expands
        tl.fromTo(
          divider,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: "power2.out" },
          "<0.2"
        );

        // Subtext fades in last
        tl.fromTo(
          subtext,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.5 },
          "<0.2"
        );

        /* ── Hold for a beat ─────────────────────── */
        tl.to(slide, { opacity: 1, duration: 0.8 });

        /* ── Exit (except last slide) ────────────── */
        if (i !== slides.length - 1) {
          tl.to(
            [tag, headline, subtext, divider],
            { opacity: 0, y: -30, duration: 0.4, stagger: 0.05 }
          );
          tl.to(slide, { opacity: 0, duration: 0.2 });
        }
      });

      /* ── Floating lens‐flare orbs ─────────────── */
      gsap.utils.toArray<HTMLElement>(".cin-orb").forEach((orb, i) => {
        gsap.to(orb, {
          x: `random(-120, 120)`,
          y: `random(-80, 80)`,
          scale: `random(0.8, 1.4)`,
          opacity: `random(0.12, 0.35)`,
          duration: `random(6, 14)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 1.2,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-story"
      className="relative overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* ── Cinematic Letterbox Bars ──────────────── */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-30"
        style={{ height: "8vh", background: "#000" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30"
        style={{ height: "8vh", background: "#000" }}
        aria-hidden
      />

      {/* ── Film Grain Overlay ───────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-20"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          mixBlendMode: "overlay",
          opacity: 0.45,
        }}
      />

      {/* ── Ambient Glow Orbs (lens flare feel) ── */}
      {[
        { top: "15%", left: "10%", size: 320, color: "rgba(211,47,47,0.12)" },
        { top: "60%", right: "8%", size: 260, color: "rgba(255,193,7,0.10)" },
        { top: "35%", left: "55%", size: 400, color: "rgba(211,47,47,0.06)" },
        { top: "80%", left: "25%", size: 200, color: "rgba(255,255,255,0.05)" },
      ].map((orb, i) => (
        <div
          key={i}
          className="cin-orb pointer-events-none fixed z-10"
          aria-hidden
          style={{
            top: orb.top,
            left: orb.left,
            right: (orb as Record<string, unknown>).right as string | undefined,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      ))}

      {/* ── Story Stage ──────────────────────────── */}
      <div className="relative z-20 flex h-screen items-center justify-center">
        {story.map((slide, i) => (
          <div
            key={i}
            className="cin-slide absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0"
            style={{ willChange: "opacity, transform" }}
          >
            {/* Tag / Chapter */}
            <span
              className="cin-tag mb-6 block text-xs font-medium uppercase tracking-widest sm:text-sm"
              style={{ color: "#D32F2F", letterSpacing: "0.35em" }}
            >
              {slide.tag}
            </span>

            {/* Headline */}
            <h2
              className="cin-headline mx-auto max-w-4xl text-center font-bold leading-tight"
              style={{
                fontSize: "clamp(2rem, 6vw, 5.5rem)",
                color: "#fff",
                textShadow: "0 0 80px rgba(211,47,47,0.25), 0 2px 30px rgba(0,0,0,0.6)",
                lineHeight: 1.1,
              }}
            >
              {slide.headline}
            </h2>

            {/* Divider */}
            <div
              className="cin-divider mx-auto my-6 sm:my-8"
              style={{
                width: 80,
                height: 2,
                background: "linear-gradient(90deg, transparent, #D32F2F, transparent)",
                transformOrigin: "center",
              }}
            />

            {/* Subtext */}
            <p
              className="cin-subtext mx-auto max-w-2xl text-center text-base leading-relaxed sm:text-lg md:text-xl"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontWeight: 300,
                letterSpacing: "0.01em",
              }}
            >
              {slide.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* ── Scroll Cue (visible only at the start) ── */}
      <div
        className="pointer-events-none absolute bottom-16 left-1/2 z-30 -translate-x-1/2"
        style={{ animation: "cinPulse 2s ease-in-out infinite" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em" }}
          >
            Scroll
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="14"
              height="22"
              rx="7"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
            />
            <circle cx="8" cy="8" r="2" fill="rgba(211,47,47,0.8)">
              <animate
                attributeName="cy"
                values="8;16;8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      {/* ── Inline keyframes ─────────────────────── */}
      <style>{`
        @keyframes cinPulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) translateY(0); }
          50% { opacity: 1; transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </section>
  );
}
