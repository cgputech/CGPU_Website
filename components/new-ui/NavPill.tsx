"use client";

/**
 * NavPill — dark pill-shaped navigation container.
 *
 * Sizing (docs/sizes.md):
 *   - Border radius: full (§7 pills/avatars)
 *   - Inner padding: py-1.5 px-2 → keeps pill tight around contents
 *   - Border: 1px (§7 default)
 */

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface NavPillProps {
  children: ReactNode;
  className?: string;
}

export function NavPill({ children, className }: NavPillProps) {
  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        // Dark pill, 1px border (§7), backdrop blur for depth
        "flex items-center rounded-full border border-white/10 bg-[#111111]",
        // Inner spacing: px-3 (12px = --space-3), py-2 (8px = --space-2)
        "px-3 py-2",
        // Subtle shadow for lift
        "shadow-md shadow-black/20",
        className,
      )}
    >
      {children}
    </nav>
  );
}
