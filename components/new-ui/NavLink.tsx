"use client";

/**
 * NavLink — a single navigation anchor inside the pill.
 * Sizing from docs/sizes.md §9:
 *   - Nav link: min-height 44px touch / 40px pointer; padding-x 12–16px
 * Typography from §6:
 *   - UI label: 14px, weight 500
 * Focus from §7:
 *   - 2px ring, 2px offset, rounded-full to match pill shape
 */

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function NavLink({ href, children, isActive, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        // Base: pill-shaped, min 44px touch target via padding, font-size 14px
        "inline-flex min-h-[2.75rem] items-center justify-center rounded-full px-4 py-2",
        "text-sm font-medium leading-snug tracking-wide transition-colors duration-150",
        // Focus ring (§7: 2px ring, 2px offset, rounded-full)
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]",
        isActive
          ? // Active: white text, subtle white/15 fill
            "text-white bg-white/15"
          : // Inactive: muted white, hover to brighten
            "text-white/55 hover:text-white/90 hover:bg-white/8",
        className,
      )}
    >
      {children}
    </Link>
  );
}
