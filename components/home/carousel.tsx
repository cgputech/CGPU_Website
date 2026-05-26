"use client";

import { useState } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Building2,
  Users,
} from "lucide-react";
import Image from "next/image";

const placements = [
  {
    id: 1,
    company: "BOSCH",
    batch: "2026 Batch",
    placedCount: "3 Students Placed",
    students: "Arjun Sekhar, Aswin AS, Bharath MK",
    posterUrl: "/posters/bosch.png",
  },
  {
    id: 2,
    company: "TCS Digital",
    batch: "2026 Batch",
    placedCount: "12 Students Placed",
    students: "Anjali Nair, Rahul Krishnan, +10 others",
    posterUrl: "/posters/bosch.png",
  },
  {
    id: 3,
    company: "Infosys",
    batch: "2026 Batch",
    placedCount: "8 Students Placed",
    students: "Siddharth V, Meera Jasmine, +6 others",
    posterUrl: "/posters/bosch.png",
  },
];

export default function PlacementCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const nextPlacement = () =>
    setCurrentIndex((prev) => (prev + 1) % placements.length);
  const prevPlacement = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + placements.length) % placements.length,
    );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextPlacement() : prevPlacement();
  };

  const handleTouchStart = (e: React.TouchEvent) =>
    setStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? nextPlacement() : prevPlacement();
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const totalCards = placements.length;
    let normalizedDiff = diff;
    if (diff > totalCards / 2) normalizedDiff = diff - totalCards;
    else if (diff < -totalCards / 2) normalizedDiff = diff + totalCards;

    const isActive = normalizedDiff === 0;
    const isNext = normalizedDiff === 1 || normalizedDiff === -(totalCards - 1);
    const isPrev = normalizedDiff === -1 || normalizedDiff === totalCards - 1;

    let zIndex = 1,
      opacity = 0,
      scale = 0.8,
      translateX = 0,
      rotate = 0;

    if (isActive) {
      zIndex = 30;
      opacity = 1;
      scale = 1;
    } else if (isNext) {
      zIndex = 20;
      opacity = 0.4;
      scale = 0.9;
      translateX = 80;
      rotate = 6;
    } else if (isPrev) {
      zIndex = 20;
      opacity = 0.4;
      scale = 0.9;
      translateX = -80;
      rotate = -6;
    }

    // Desktop responsive offset modifications
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      if (isNext) translateX = 120;
      if (isPrev) translateX = -120;
    }

    return {
      position: "absolute" as const,
      zIndex,
      opacity,
      transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
      transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      pointerEvents: isActive
        ? "auto"
        : ("none" as React.CSSProperties["pointerEvents"]),
      filter: isActive ? "none" : "blur(3px)",
    };
  };

  return (
    <section
      id="placements"
      className="py-12 md:py-24 relative overflow-hidden bg-background"
    >
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header section */}
        <div className="text-center mb-12 md:mb-16 space-y-3">
          <Badge
            variant="outline"
            className="px-4 py-1 border-primary/20 text-primary bg-primary/5 backdrop-blur-sm"
          >
            CGPU Achievements
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Our Campus <span className="text-primary italic">Placements</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto font-medium">
            Celebrating our students transitioning from academic excellence to
            milestones with top tier global enterprises.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
          {/* Desktop Left Button */}
          <button
            onClick={prevPlacement}
            className="hidden md:flex group relative items-center justify-center w-14 h-14 rounded-2xl bg-card border border-border/50 hover:border-primary/50 shadow-sm transition-all duration-300 hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>

          {/* Core Deck Frame Viewport */}
          <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-[340px] sm:max-w-[400px] h-[520px] sm:h-[620px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {placements.map((placement, index) => (
              <div
                key={placement.id}
                style={getCardStyle(index)}
                className="w-full h-full"
              >
                <Card className="relative w-full h-full rounded-2xl overflow-hidden border border-border/60 shadow-2xl bg-white">
                  {/* Top Segment: Edge-to-Edge Poster pinned to the top without cropping */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-white">
                    <Image
                      src={placement.posterUrl}
                      alt={`${placement.company} Placement Poster`}
                      fill
                      priority={index === currentIndex}
                      className="object-contain object-top select-none pointer-events-none" // Changed to object-contain to stop the zoom/crop
                      sizes="(max-w-400px) 100vw, 400px"
                    />
                  </div>

                  {/* Bottom Segment: Absolute positioned overlay at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-between border-t border-border/40 bg-card/95 backdrop-blur-sm z-10">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-primary shrink-0" />
                          {placement.company}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="text-xs font-semibold px-2 py-0.5"
                        >
                          {placement.batch}
                        </Badge>
                      </div>

                      <CardDescription className="text-xs font-semibold text-primary flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        {placement.placedCount}
                      </CardDescription>

                      <p className="text-[11px] sm:text-xs text-muted-foreground font-medium line-clamp-1">
                        {placement.students}
                      </p>
                    </div>

                    <CardFooter className="p-0 mt-3 sm:mt-4">
                      <Button className="w-full text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
                        View Details
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Desktop Right Button */}
          <button
            onClick={nextPlacement}
            className="hidden md:flex group relative items-center justify-center w-14 h-14 rounded-2xl bg-card border border-border/50 hover:border-primary/50 shadow-sm transition-all duration-300 hover:scale-105"
          >
            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Mobile Action Controls Indicator */}
        <div className="flex items-center justify-center gap-4 mt-10 md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={prevPlacement}
            className="rounded-full w-9 h-9 border-border bg-card"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-1.5">
            {placements.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/20"}`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={nextPlacement}
            className="rounded-full w-9 h-9 border-border bg-card"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
