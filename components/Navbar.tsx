"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Placements", href: "/placements" },
  { name: "Recruiters", href: "/recruiters" },
  { name: "Statistics", href: "/statistics" },
  { name: "About", href: "/about" },
];

const reportLink = { name: "Report", href: "/#reports" };

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

  const pillLinkClass = (active: boolean, accent = false) =>
    cn(
      "inline-flex h-9 w-max items-center justify-center !rounded-full px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      active
        ? "bg-primary-red text-white shadow-sm hover:bg-primary-red hover:text-white focus:bg-primary-red focus:text-white active:bg-primary-red active:text-white"
        : "text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground active:bg-muted active:text-foreground",
    );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full bg-white pointer-events-none h-[--navbar-height] py-3",
        "md:top-3 md:bg-transparent",
      )}
    >
      <div className="relative mx-auto flex max-w-4xl items-center justify-center px-5 py-3 sm:px-8 md:py-0 pointer-events-auto">
        {/* Mobile — shadcn Sheet + Button */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-5 size-9 rounded-full sm:left-8 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <SheetHeader className="border-b px-6 py-5 text-left">
              <SheetTitle>CGPU</SheetTitle>
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

        {/* Desktop — shadcn NavigationMenu pill */}
        <NavigationMenu
          viewport={false}
          className="hidden max-w-none md:flex"
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

            <NavigationMenuItem className="flex items-center">
              <Separator orientation="vertical" className="mx-1 h-5" />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={pillLinkClass(false, true)}
              >
                <Link href={reportLink.href}>{reportLink.name}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
