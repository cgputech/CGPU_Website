"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const placements = [
  {
    id: 1,
    company: "BOSCH",
    avgLpa: "8.5 LPA",
    studentsPlaced: 3,
    year: 2026,
    posterUrl: "/posters/bosch.png",
  },
  {
    id: 2,
    company: "TCS Digital",
    avgLpa: "7.0 LPA",
    studentsPlaced: 12,
    year: 2026,
    posterUrl: "/posters/bosch.png",
  },
  {
    id: 3,
    company: "Infosys",
    avgLpa: "6.5 LPA",
    studentsPlaced: 8,
    year: 2026,
    posterUrl: "/posters/bosch.png",
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
    const isNext =
      normalizedDiff === 1 ||
      normalizedDiff === -(totalCards - 1);

    const isPrev =
      normalizedDiff === -1 ||
      normalizedDiff === totalCards - 1;

    let zIndex = 1;
    let opacity = 0;
    let scale = 0.8;
    let translateX = 0;
    let rotate = 0;

    if (isActive) {
      zIndex = 30;
      opacity = 1;
      scale = 1;
    } else if (isNext) {
      zIndex = 20;
      opacity = 0.45;
      scale = 0.9;
      translateX = 110;
      rotate = 6;
    } else if (isPrev) {
      zIndex = 20;
      opacity = 0.45;
      scale = 0.9;
      translateX = -110;
      rotate = -6;
    }

    return {
      position: "absolute",
      inset: 0,
      zIndex,
      opacity,
      transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
      transition:
        "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
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
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <Badge className="mb-4 px-4 py-1">
            Achievements
          </Badge>

          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Our Campus{" "}
            <span className="text-primary-red italic">
              Placements
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Celebrating our students transitioning from
            academic excellence to professional success with
            leading global organizations.
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
            className="relative h-[620px] w-full max-w-[360px] cursor-grab active:cursor-grabbing md:h-[700px] md:max-w-[420px]"
          >
            {placements.map((placement, index) => (
              <div
                key={placement.id}
                style={getCardStyle(index)}
              >
                <Card className="flex h-full flex-col overflow-hidden border-border/60 py-0 shadow-2xl">
                  {/* Poster */}
                  <CardContent className="relative flex-1 p-0 bg-white">
                    <Image
                      src={placement.posterUrl}
                      alt={`${placement.company} placement poster`}
                      fill
                      priority={index === currentIndex}
                      className="object-cover"
                      sizes="(max-width: 768px) 360px, 420px"
                    />
                  </CardContent>

                  {/* Footer */}
                  <CardFooter className="border-t bg-card p-4">
                    <div className="w-full space-y-4 flex flex-col items-center">
                      <div className="text-center">
                        <h3 className="text-lg font-bold tracking-tight">
                          {placement.company}
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          Campus Recruitment Drive
                        </p>
                      </div>

                      <div className="flex flex-row gap-2">
                        <Badge className="bg-primary-red text-white px-3 py-2">
                          {placement.avgLpa}
                        </Badge>

                        <Badge
                          variant="default"
                          className="px-3 py-2"
                        >
                          {placement.studentsPlaced} placed
                        </Badge>

                        <Badge
                          variant="default"
                          className="px-3 py-2"
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
    </section>
  );
}
