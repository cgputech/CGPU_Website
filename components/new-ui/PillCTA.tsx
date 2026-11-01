"use client";

/**
 * PillCTA — pill-shaped secondary call-to-action link/button.
 * Adheres strictly to docs/sizes.md:
 * - Sizing steps (§4):
 *     md: min-h-[2.5rem] (40px, desktop default), px-4 (16px), py-2 (8px), text-sm (14px)
 *     lg: min-h-[3rem] (48px, hero CTA), px-6 (24px), py-3 (12px), text-base (16px)
 * - Touch hit area >= 44x44px (§4)
 * - Multiples of 4px spacing (§1, §2)
 * - Radius: rounded-full (§7)
 * - Focus ring: 2px width, 2px offset (§7)
 * - No layout shift on hover/active/focus (§1)
 */

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PillCTAProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  logo?: React.ReactNode;
  children: React.ReactNode;
  external?: boolean;
  showArrow?: boolean;
  variant?: "glass" | "glass-dark" | "outline" | "outline-dark" | "secondary";
  size?: "md" | "lg";
  className?: string;
}

export function PillCTA({
  href,
  logo,
  children,
  external = false,
  showArrow = true,
  variant = "glass-dark",
  size = "lg",
  className,
  ...props
}: PillCTAProps) {
  const isExternal =
    external || href.startsWith("http://") || href.startsWith("https://");

  const isDark = variant === "glass-dark" || variant === "outline-dark";

  const classes = cn(
    "group inline-flex items-center justify-center rounded-full font-medium leading-snug cursor-pointer select-none transition-all duration-150",
    isDark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2",

    // Sizing (docs/sizes.md §4)
    size === "md" && "min-h-[2.5rem] px-4 py-2 gap-2 text-sm",
    size === "lg" && "min-h-[3rem] px-6 py-3 gap-3 text-base",

    // Variants
    variant === "glass" &&
      "border border-black/15 bg-white/40 backdrop-blur-md text-text-primary shadow-xs hover:bg-white/70 hover:border-black/25 active:bg-white/80",
    variant === "glass-dark" &&
      "border border-white/20 bg-white/10 backdrop-blur-md text-white shadow-xs hover:bg-white/20 hover:border-white/35 active:bg-white/25",
    variant === "outline" &&
      "border border-black/20 bg-transparent text-text-primary hover:bg-black/5 hover:border-black/30 active:bg-black/10",
    variant === "outline-dark" &&
      "border border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50 active:bg-white/15",
    variant === "secondary" &&
      "border border-transparent bg-black/5 text-text-primary hover:bg-black/10 active:bg-black/15",

    className,
  );

  const iconSize = size === "lg" ? 18 : 16;

  const content = (
    <>
      {logo && (
        <span className="flex shrink-0 items-center justify-center">
          {logo}
        </span>
      )}
      <span>{children}</span>
      {showArrow && (
        <ArrowUpRight
          size={iconSize}
          aria-hidden="true"
          className={cn(
            "transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            isDark ? "text-white/80" : "text-text-secondary/60",
          )}
        />
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}
