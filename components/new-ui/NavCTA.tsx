"use client";

/**
 * NavCTA — call-to-action pill button for the navbar.
 *
 * Sizes (docs/sizes.md §4):
 *   md (default, inside pill):
 *     min-height 40px (--control-md), px-4 (16px), py-2 (8px), text-base 16px
 *   lg (standalone / drawer):
 *     min-height 48px (--control-lg), px-6 (24px), py-3 (12px), text-base 16px
 *
 * Touch target: ≥ 44×44px — md satisfies via min-h-[2.5rem] + px-4; lg exceeds it.
 * Icon: 16px inside pill (--icon-sm), 20px standalone (--icon-md).
 */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavCTAProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  size?: "md" | "lg";
  onClick?: () => void;
}

export function NavCTA({
  href,
  children,
  className,
  external = false,
  size = "md",
  onClick,
}: NavCTAProps) {
  const classes = cn(
    // Shared: pill, white bg, dark text
    "inline-flex items-center justify-center gap-2 rounded-full",
    "font-medium leading-snug bg-white text-[#0d0d0d]",
    "transition-colors duration-150 hover:bg-white/90 active:bg-white/80",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]",
    // Size variants
    size === "md"
      ? // md: min-h 40px (--control-md), px-4 (--space-4), py-2 (--space-2)
        "min-h-[2.5rem] px-4 py-2 text-sm"
      : // lg: min-h 48px (--control-lg), px-6 (--space-6), py-3 (--space-3)
        "min-h-[3rem] px-6 py-3 text-base",
    className,
  );

  const iconSize = size === "md" ? 16 : 20;
  const icon = <ArrowUpRight size={iconSize} aria-hidden="true" strokeWidth={2} />;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
      {icon}
    </Link>
  );
}
