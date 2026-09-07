"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedTextProps {
  text: string;
  badgeText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function AnimatedText({
  text,
  badgeText = "Wollo",
  icon,
  className = "",
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial off-screen / hidden states
    gsap.set(iconRef.current, { y: -20, opacity: 0 });
    gsap.set(textRef.current, { x: -60, opacity: 0, letterSpacing: "-0.05em" });
    gsap.set(badgeRef.current, { x: 50, opacity: 0 });

    // Intersection Observer to trigger GSAP animation on scroll
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timeline = gsap.timeline({
            defaults: { ease: "power4.out", duration: 1.1 },
          });

          timeline
            // 1. Text Masked Slide In & Reveal
            .to(
              textRef.current,
              {
                x: 0,
                opacity: 1,
                letterSpacing: "0em",
              },
              0
            )
            // 2. Yellow Badge Slides In from Opposite Direction
            .to(
              badgeRef.current,
              {
                x: 0,
                opacity: 1,
                duration: 0.9,
              },
              0.15
            )
            // 3. Envelope/Icon Drops Down with Soft Spring Overshoot
            .to(
              iconRef.current,
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.7)",
              },
              0.2
            );

          // Unobserve once animated so it doesn't re-trigger
          observer.unobserve(container);
        }
      },
      {
        threshold: 0.4, // Triggers when 40% of the element is visible
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-3 select-none ${className}`}
    >
      {/* Floating Top-Left Icon */}
      {icon && (
        <div
          ref={iconRef}
          className="absolute -top-7 left-0 z-10 text-indigo-500"
        >
          {icon}
        </div>
      )}

      {/* Masked Overflow Wrapper for Main Text */}
      <div className="overflow-hidden py-1 px-1">
        <h2
          ref={textRef}
          className="text-4xl md:text-[125px] font-extrabold text-slate-900 dark:text-white tracking-tight"
        >
          {text}
        </h2>
      </div>

      {/* Sliding Highlight Badge ("Wollo") */}
      {badgeText && (
        <div className="overflow-hidden py-1">
          <div
            ref={badgeRef}
            className="bg-amber-300 text-slate-950 font-black text-2xl md:text-4xl px-4 py-1 rounded-xl shadow-sm border border-amber-400"
          >
            {badgeText}
          </div>
        </div>
      )}
    </div>
  );
}