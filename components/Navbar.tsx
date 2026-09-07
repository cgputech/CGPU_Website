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
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Recruiters", href: "#recruiters"},
  { name: "Statistics", href: "#analytics" },
  { name: "Placements", href: "#placements" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
      
      const sections = navLinks
        .filter(link => link.href.startsWith("#"))
        .map(link => link.href.substring(1));
        
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold based on your navbar height + some buffer
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("#")) {
      return activeSection === href.substring(1);
    }
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

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
        "fixed top-0 left-0 z-50 w-full flex h-[--navbar-height] items-center justify-center px-4 md:px-0 py-3 md:py-4 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md" : "bg-white"
      )}
    >
      <div className="relative flex w-full items-center justify-start md:justify-center border-b border-border/40 md:border-none pb-3 md:pb-0">
        {/* Mobile — shadcn Sheet + Button */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <SheetHeader className="border-b px-6 py-5 flex flex-row items-center justify-between text-left">
              <SheetTitle>CGPU</SheetTitle>
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
          </SheetContent>
        </Sheet>

        {/* Desktop & Logo wrapper */}
        <div className="flex flex-1 ml-4 md:ml-0 justify-between items-center md:flex-none md:w-3/4">
          <div className="flex items-center">
            <h1 className="text-2xl text-center font-light font-stretch-75%">CGPU</h1>
          </div>
          <NavigationMenu
            viewport={false}
            className="hidden max-w-none md:flex"
            aria-label="Main navigation"
          >
            <NavigationMenuList className="gap-1 rounded-full border border-border bg-white  p-1.5 shadow-sm backdrop-blur-md">
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
          <Button asChild variant="outline" className="w-24 h-12  hover:bg-transparent text-md">
            <Link href="/gallery">Gallery</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
