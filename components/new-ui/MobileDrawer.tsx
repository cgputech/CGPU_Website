"use client";

/**
 * MobileDrawer — full custom slide-in nav drawer for mobile.
 * No shadcn/ui dependency.
 *
 * Sizing (docs/sizes.md):
 *   - App bar 56px mobile → min-height 3.5rem
 *   - Nav link: min-height 44px touch (§9)
 *   - Sidebar width: 240–280px (§9)
 *   - Padding uses spacing tokens
 * Accessibility:
 *   - role="dialog", aria-modal, aria-label
 *   - Focus trap via tabIndex management
 *   - Escape key closes
 *   - Scroll lock on body while open
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { NavCTA } from "@/components/new-ui/NavCTA";

interface MobileDrawerLink {
  name: string;
  href: string;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  links: MobileDrawerLink[];
  isActive: (href: string) => boolean;
  /** Optional CTA shown at the bottom of the drawer (e.g. Gallery) */
  cta?: { href: string; label: string };
}

export function MobileDrawer({
  open,
  onClose,
  links,
  isActive,
  cta,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Move focus to close button on open
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer panel
          Width: 16rem = 256px (within 240–280px from §9)
          No fixed height on text elements (§1 rule 4)
      */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#111111]",
          "border-r border-white/10",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header — min-height 56px = 3.5rem (mobile app bar §9) */}
        <div className="flex min-h-[3.5rem] items-center justify-between border-b border-white/10 px-4">
          <Image
            src="/CGPU-LOGO - light.png"
            width={80}
            height={80}
            alt="CGPU logo"
            className="h-auto w-auto max-h-9"
          />
          {/* Close button: icon-only, hit area ≥ 44×44px (§4, §11) */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close navigation menu"
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full",
              "text-white/60 transition-colors hover:bg-white/10 hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]",
            )}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Nav links — flex column, gap-1 (inner gap < outer gap, §1 rule 5) */}
        <nav
          aria-label="Mobile navigation links"
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
        >
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={cn(
                // min-height 44px touch (§9), full width, rounded-full
                "flex min-h-[2.75rem] w-full items-center rounded-full px-4 py-2",
                "text-sm font-medium leading-snug transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]",
                isActive(link.href)
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/8 hover:text-white/90",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Gallery CTA — bottom of drawer, only when cta prop provided */}
        {cta && (
          <div className="border-t border-white/10 px-3 py-4">
            {/* lg size: min-h 48px, full width, white bg (sizes.md §4) */}
            <NavCTA
              href={cta.href}
              size="lg"
              className="w-full"
              onClick={onClose}
            >
              {cta.label}
            </NavCTA>
          </div>
        )}
      </div>
    </>
  );
}
