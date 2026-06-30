"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type PosterData = {
  id: string;
  year: number;
  imageUrl: string;
};

export function GalleryClient({
  posters,
  availableYears,
}: {
  posters: PosterData[];
  availableYears: (number | "All")[];
}) {
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");

  const filteredPosters = posters.filter(
    (poster) => selectedYear === "All" || poster.year === selectedYear
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background py-16 md:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center md:mb-16">
          <Badge className="mb-4 px-4 py-1 shadow-sm">Gallery</Badge>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Placement <span className="text-primary-red italic">Posters</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Explore our collection of placement drives and recruitment success
            stories over the years.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {availableYears.map((year) => (
            <Button
              key={year}
              onClick={() => setSelectedYear(year)}
              variant={selectedYear === year ? "default" : "outline"}
              className={`rounded-full px-6 transition-all ${
                selectedYear === year
                  ? "bg-primary-red text-white hover:bg-primary-red/90"
                  : "bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {year}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosters.map((poster) => (
              <motion.div
                key={poster.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
              >
                <Card className="group flex flex-col overflow-hidden border-border/60 p-0 shadow-sm transition-all hover:shadow-xl dark:hover:shadow-primary/5">
                  <CardContent className="relative aspect-[3/2] w-full p-0 bg-white">
                    <Image
                      src={poster.imageUrl}
                      alt={`Placement poster ${poster.year}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Details displayed on hover */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Badge className="mb-2 bg-primary-red text-white">
                        Class of {poster.year}
                      </Badge>
                      <h3 className="text-xl font-bold text-white drop-shadow-md">
                        Placement Drive
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredPosters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-lg text-muted-foreground">
              No posters found for the selected year.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSelectedYear("All")}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
