"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Placements", href: "/placements" },
    { name: "Recruiters", href: "/recruiters" },
    { name: "Statistics", href: "/statistics" },
    { name: "About", href: "/about" },
  ];
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-sm border-b border-border-custom"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Top Academic Red Accent Strip */}
      <div className="h-1 w-full bg-primary-red" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/cgpulogo.png" 
              alt="SCTCE CGPU Logo" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-text-primary flex items-center">
                CGPU
                <span className="ml-1.5 px-2 py-0.5 text-[10px] font-semibold bg-soft-red text-primary-red rounded">
                  SCTCE
                </span>
              </span>
              <span className="text-[9px] text-text-secondary font-medium tracking-wide">
                Sree Chitra Thirunal College of Engineering
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links & CTA */}
          <div className="hidden xl:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? "text-primary-red"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-red rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/#reports"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-semibold rounded-md shadow-sm text-white bg-primary-red hover:bg-primary-red-hover transition-colors"
            >
              Placement Report
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-soft-red focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-card border-b border-border-custom">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-soft-red text-primary-red font-semibold"
                      : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="px-3 py-2">
              <Link
                href="/#reports"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-primary-red hover:bg-primary-red-hover transition-colors"
              >
                Placement Report
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
