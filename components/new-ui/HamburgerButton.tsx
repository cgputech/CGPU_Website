"use client";

/**
 * HamburgerButton — icon-only toggle for mobile nav.
 * Sizing from docs/sizes.md §4 (icon-only button):
 *   - Hit area ≥ 44×44px → size-11 (2.75rem = 44px)
 *   - Icon: 20px (--icon-md)
 *   - Focus ring: 2px, 2px offset
 */

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface HamburgerButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function HamburgerButton({
  onClick,
  label = "Open navigation menu",
  className,
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={undefined} // Set by parent via aria-controls if needed
      className={cn(
        // Hit area ≥ 44×44px (§4, §11)
        "inline-flex size-11 items-center justify-center rounded-full",
        // Inside the dark pill → white-on-dark colours
        "text-white/60 transition-colors duration-150 hover:bg-white/10 hover:text-white",
        // Focus ring (§7) — white ring on dark pill bg
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]",
        className,
      )}
    >
      {/* Icon: 20px = --icon-md (§11) */}
      <Menu size={20} aria-hidden="true" />
    </button>
  );
}
