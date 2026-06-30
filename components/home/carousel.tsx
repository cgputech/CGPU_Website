"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

const placements = [
  {
    id: 1,
    company: "Popular Vehicles and Services",
    avgLpa: "2.52 LPA",
    studentsPlaced: 33,
    year: 2026,
    posterUrl:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782801552/uploads/akru9v9rxmflde8d2rzp.jpg",
  },
  {
    id: 2,
    company: "Equifax",
    avgLpa: "5.8 LPA",
    studentsPlaced: 10,
    year: 2026,
    posterUrl:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782801632/uploads/bebn8iohvzebn7tpilzv.jpg",
  },
  {
    id: 3,
    company: "Amura Health",
    avgLpa: "4 LPA",
    studentsPlaced: 4,
    year: 2026,
    posterUrl:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782807651/uploads/robouqivxytatejtqrux.jpg",
  },
];

export default function PlacementCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const nextPlacement = () => {
    setCurrentIndex((prev) => (prev + 1) % placements.length);
  };

  const prevPlacement = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + placements.length) % placements.length,
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setIsDragging(false);

    const diff = startX - e.clientX;

    if (Math.abs(diff) > 50) {
      diff > 0 ? nextPlacement() : prevPlacement();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 40) {
      diff > 0 ? nextPlacement() : prevPlacement();
    }
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const totalCards = placements.length;
    const diff = index - currentIndex;

    let normalizedDiff = diff;

    if (diff > totalCards / 2) {
      normalizedDiff = diff - totalCards;
    } else if (diff < -totalCards / 2) {
      normalizedDiff = diff + totalCards;
    }

    const isActive = normalizedDiff === 0;
    const isNext = normalizedDiff === 1 || normalizedDiff === -(totalCards - 1);

    const isPrev = normalizedDiff === -1 || normalizedDiff === totalCards - 1;

    let zIndex = 1;
    let opacity = 0;
    let scale = 0.8;
    let translateX = "0%";
    let rotate = 0;

    if (isActive) {
      zIndex = 30;
      opacity = 1;
      scale = 1;
    } else if (isNext) {
      zIndex = 20;
      opacity = 0.45;
      scale = 0.9;
      translateX = "15%";
      rotate = 6;
    } else if (isPrev) {
      zIndex = 20;
      opacity = 0.45;
      scale = 0.9;
      translateX = "-15%";
      rotate = -6;
    }

    return {
      position: "absolute",
      inset: 0,
      zIndex,
      opacity,
      transform: `translateX(${translateX}) scale(${scale}) rotate(${rotate}deg)`,
      transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      pointerEvents: isActive ? "auto" : "none",
      filter: isActive ? "none" : "blur(2px)",
    };
  };

  return (
    <section
      id="placements"
      className="relative overflow-hidden bg-background py-16 md:py-20"
    >
      <div className="absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/2 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <Badge className="mb-4 px-4 py-1">Achievements</Badge>

          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Our Campus{" "}
            <span className="text-primary-red italic">Placements</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Celebrating our students transitioning from academic excellence to
            professional success with leading global organizations.
          </p>
        </div>

        {/* Carousel */}
        <div className="flex justify-center">
          <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-[90vw] cursor-grab active:cursor-grabbing md:max-w-[600px]"
          >
            {/* Hidden placeholder to dynamically size the container based on the card's real height */}
            <div
              className="invisible pointer-events-none opacity-0"
              aria-hidden="true"
            >
              <Card className="flex flex-col overflow-hidden border-border/60 py-0">
                <CardContent className="relative aspect-[3/2] w-full p-0" />
                <CardFooter className="border-t bg-card p-3 md:p-4">
                  <div className="w-full space-y-2 md:space-y-4 flex flex-col items-center">
                    <div className="text-center">
                      <h3 className="text-base font-bold tracking-tight md:text-lg">
                        Placeholder
                      </h3>
                      <p className="text-[10px] text-muted-foreground md:text-xs">
                        Placeholder
                      </p>
                    </div>
                    <div className="flex flex-row gap-1 md:gap-2">
                      <Badge className="px-2 py-1 md:px-3 md:py-2">Badge</Badge>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            {placements.map((placement, index) => (
              <div key={placement.id} style={getCardStyle(index)}>
                <Card className="flex h-full flex-col overflow-hidden border-border/60 py-0 shadow-2xl">
                  {/* Poster */}
                  <CardContent className="relative flex-none aspect-[3/2] w-full p-0 bg-white">
                    <Image
                      src={placement.posterUrl}
                      alt={`${placement.company} placement poster`}
                      fill
                      priority={index === currentIndex}
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 600px"
                    />
                  </CardContent>

                  {/* Footer */}
                  <CardFooter className="border-t bg-card p-3 md:p-4">
                    <div className="w-full space-y-2 md:space-y-4 flex flex-col items-center">
                      <div className="text-center">
                        <h3 className="text-base font-bold tracking-tight md:text-lg">
                          {placement.company}
                        </h3>

                        <p className="text-[10px] text-muted-foreground md:text-xs">
                          Campus Recruitment Drive
                        </p>
                      </div>

                      <div className="flex flex-row gap-1 md:gap-2">
                        <Badge className="bg-primary-red px-2 py-1 text-[10px] text-white md:px-3 md:py-2 md:text-xs">
                          {placement.avgLpa}
                        </Badge>

                        <Badge
                          variant="default"
                          className="px-2 py-1 text-[10px] md:px-3 md:py-2 md:text-xs"
                        >
                          {placement.studentsPlaced} placed
                        </Badge>

                        <Badge
                          variant="default"
                          className="px-2 py-1 text-[10px] md:px-3 md:py-2 md:text-xs"
                        >
                          {placement.year}
                        </Badge>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevPlacement}
            className="h-10 w-10 rounded-full border"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            {placements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={
                  index === currentIndex
                    ? "h-2 w-8 rounded-full bg-primary-red transition-all"
                    : "h-2 w-2 rounded-full bg-muted-foreground/30 transition-all"
                }
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextPlacement}
            className="h-10 w-10 rounded-full border"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <Link
          href="/gallery"
          className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
        >
          Explore Gallery
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
