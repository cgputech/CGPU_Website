"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Image from 'next/image';
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Placements", href: "/placements" },
  { name: "Recruiters", href: "/recruiters" },
  { name: "Statistics", href: "/statistics" },
  { name: "About", href: "/about" },
];

const reportLink = { name: "Report", href: "/#reports" };

/**
 * Icon — a rounded badge with an abstract upward-arrow mark (growth /
 * placement). No lettering here on purpose: the wordmark below carries
 * the name, so the icon stays a clean, standalone symbol that still
 * reads at favicon size.
 */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="CGPU"
      className={cn("size-9 shrink-0", className)}
    >
      <rect width="40" height="40" rx="11" className="fill-primary-red" />
      <path
        d="M12 25 L20 14 L28 25 M20 14 V9"
        className="stroke-white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Wordmark — "CGPU" drawn entirely as vector strokes, not a <text>
 * element, so it never depends on a system font being installed and
 * always renders identically everywhere. Monoline geometric letterforms
 * to match the weight of the icon mark above.
 */
function LogoWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 132 32"
      role="img"
      aria-label="CGPU"
      className={cn("h-7 w-auto shrink-0 stroke-primary-red", className)}
      fill="none"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* C */}
      <path d="M20.5 8 A11 11 0 1 1 20.5 24" />
      {/* G */}
      <g transform="translate(34,0)">
        <path d="M20.5 8 A11 11 0 1 1 20.5 24" />
        <path d="M22 16 H13 V22" />
      </g>
      {/* P */}
      <g transform="translate(68,0)">
        <path d="M6 28 V6 H16 A7 7 0 0 1 16 20 H6" />
      </g>
      {/* U */}
      <g transform="translate(100,0)">
        <path d="M6 6 V20 A8 8 0 0 0 22 20 V6" />
      </g>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const pillLinkClass = (active: boolean) =>
    cn(
      "inline-flex h-9 w-max items-center justify-center !rounded-full px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      active
        ? "bg-primary-red text-white shadow-sm hover:bg-primary-red hover:text-white focus:bg-primary-red focus:text-white active:bg-primary-red active:text-white"
        : "text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground active:bg-muted active:text-foreground",
    );

  return (
    <header
      className={cn(
        "top-0 left-0 right-0 z-50 w-full bg-white py-3",
        "md:top-3 md:bg-transparent",
        scrolled && "shadow-sm md:shadow-none",
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 sm:px-8">
        {/* Left: mobile trigger + logo, grouped so they share one consistent gap */}
        <div className="flex min-w-0 items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 rounded-full md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
              <SheetHeader className="border-b px-6 py-5 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <LogoMark className="size-7" />
                  <LogoWordmark className="h-5" />
                </SheetTitle>
                <p className="text-xs text-muted-foreground">Navigation</p>
              </SheetHeader>

              <nav
                className="flex flex-1 flex-col gap-1 px-4 py-4"
                aria-label="Mobile navigation"
              >
                {navLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="ghost"
                    className={cn(
                      "h-10 w-full justify-start rounded-full px-4 text-sm font-medium",
                      isActive(link.href) &&
                        "bg-soft-red text-primary-red hover:bg-soft-red hover:text-primary-red",
                    )}
                    asChild
                  >
                    <Link href={link.href}>{link.name}</Link>
                  </Button>
                ))}
              </nav>

              <div className="border-t px-4 py-5">
                <Button
                  className="w-full bg-primary-red hover:bg-primary-red-hover"
                  asChild
                >
                  <Link href={reportLink.href}>Placement Report</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Image src="/cgpu-logo.png" alt="cgpu-logo" />
          </Link>
        </div>

        {/* Center: desktop nav pill */}
        <NavigationMenu
          viewport={false}
          className="hidden md:flex"
          aria-label="Main navigation"
        >
          <NavigationMenuList className="gap-1 rounded-full border border-border bg-background/90 p-1.5 shadow-sm backdrop-blur-md">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.name}>
                <NavigationMenuLink
                  asChild
                  className={pillLinkClass(isActive(link.href))}
                >
                  <Link href={link.href}>{link.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right: report CTA — desktop only, the mobile sheet already has its own */}
        <Button
          className="hidden h-9 shrink-0 rounded-full bg-primary-red px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-red-hover hover:text-white md:inline-flex"
          asChild
        >
          <Link href={reportLink.href}>{reportLink.name}</Link>
        </Button>
      </div>
    </header>
  );
}