"use client";

/**
 * Navbar — layout reference: Screenshot from 2026-10-30 22-34-54.png
 *
 *   ┌──────────────────────────────────────────────────────┐
 *   │  [Logo]  About  Recruiters  Statistics  Placements   │  ← dark pill
 *   └──────────────────────────────────────────────────────┘
 *       white header background, pill is dark
 *
 * Sizing (docs/sizes.md):
 *   - App bar: 56px mobile / 64px desktop (§9)
 *   - Nav link: min-height 44px touch, padding-x 12–16px (§9)
 *   - Page margin: 16px / 24px / 32px (§10)
 *   - Container max-width: 1200px (§2)
 *
 * No shadcn/ui. All primitives from components/new-ui.
 */

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { NavPill } from "@/components/new-ui/NavPill";
import { NavLink } from "@/components/new-ui/NavLink";
import { NavCTA } from "@/components/new-ui/NavCTA";
import { MobileDrawer } from "@/components/new-ui/MobileDrawer";
import { HamburgerButton } from "@/components/new-ui/HamburgerButton";

/* ── Nav data ────────────────────────────────────────────── */

const NAV_LINKS = [
  { name: "About", href: "/about" },
  { name: "Recruiters", href: "/recruiters" },
  { name: "Statistics", href: "/statistics" },
  { name: "Placements", href: "/placements" },
] as const;

/* ── Component ───────────────────────────────────────────── */

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  /** Route-based active: exact match for "/" , startsWith for all others. */
  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname],
  );

  return (
    <>
      {/*
        Fixed header bar — background: pure black (same as hero).
        pt-4/pb-3 (16px/12px) gives breathing room from viewport top — §10 spacing tokens.
        min-h-14 (56px) mobile / md:min-h-16 (64px) desktop — §9 app bar.
        Total approx height: ~84px mobile / ~96px desktop → matches --navbar-height in globals.css.
      */}
      <header className="fixed inset-x-0 top-0 z-50 flex min-h-14 items-center bg-transparent px-4 pt-4 pb-3 md:min-h-16 md:px-6 md:pt-4 md:pb-4 lg:px-8">
        {/* Container — max 1200px centred — §10 */}
        <div className="mx-auto flex w-full max-w-[75rem] items-center justify-center">

          {/*
            NavPill spans full width on desktop, constrained on mobile.
            Logo sits inside the pill on the left — matching the reference layout.
            justify-between pushes links to center/right of logo.
          */}
          <NavPill className="w-full justify-between md:w-auto md:justify-start md:gap-4">

            {/* ── Logo (Home link) — left of pill ──── */}
            <Link
              href="/"
              aria-label="CGPU — home"
              className={[
                // Touch target: min 44×44px → p-2 (8px) adds enough area
                "flex shrink-0 items-center rounded-full p-2",
                "transition-opacity hover:opacity-80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]",
              ].join(" ")}
            >
              {/* max-h-8 = 32px — slightly larger logo inside taller pill */}
              <Image
                src="/CGPU-LOGO - light.png"
                width={100}
                height={100}
                alt="CGPU logo"
                className="h-auto w-auto max-h-8"
                priority
              />
            </Link>

            {/* ── Nav links — desktop only ─────────── */}
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  href={link.href}
                  isActive={isActive(link.href)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* ── Gallery CTA — desktop: inside pill right; mobile: in drawer ── */}
            <NavCTA href="/gallery" size="md" className="hidden md:inline-flex">
              Gallery
            </NavCTA>

            {/* ── Hamburger — mobile only ───────────── */}
            <HamburgerButton
              onClick={() => setMobileOpen(true)}
              className="md:hidden"
            />
          </NavPill>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS as unknown as { name: string; href: string }[]}
        isActive={isActive}
        cta={{ href: "/gallery", label: "Gallery" }}
      />
    </>
  );
}
