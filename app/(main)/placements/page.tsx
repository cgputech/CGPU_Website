"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Calendar, Award } from "lucide-react";
import { cmsService, PlacementPoster } from "@/services/cms";
import { Card } from "@/components/ui/old/Card";
import { Badge } from "@/components/ui/old/Badge";

export default function PlacementsPage() {
  const [posters, setPosters] = useState<PlacementPoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const list = await cmsService.getPlacementPosters();
        setPosters(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosters();
  }, []);

  // Filter logic
  const filteredPosters = posters.filter((poster) => {
    const matchesYear = selectedYear === "All" || poster.year.toString() === selectedYear;
    const matchesSearch = 
      poster.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poster.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poster.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh] -mt-[--navbar-height]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-red"></div>
      </div>
    );
  }

  // Brand gradient generator for cards
  const getBrandGradient = (name: string) => {
    switch (name.toUpperCase()) {
      case "MICROSOFT": return "from-indigo-600 to-blue-800";
      case "GOOGLE": return "from-blue-600 to-indigo-800";
      case "NVIDIA": return "from-green-600 to-emerald-800";
      case "ORACLE": return "from-red-600 to-rose-800";
      default: return "from-slate-800 to-slate-900";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-24 py-12">
      
      {/* Header */}
      <div className="border-b border-border-custom pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Placement Campaigns Directory
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Explore verified placement posters, hiring highlights, and selected student lists.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border-custom rounded-lg bg-card text-xs text-text-primary focus:outline-none focus:border-primary-red transition-colors"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center space-x-1.5 mb-8 overflow-x-auto pb-2">
        {["All", "2025", "2024"].map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer ${
              selectedYear === year
                ? "bg-primary-red text-white border-primary-red shadow-xs"
                : "bg-card text-text-secondary border-border-custom hover:bg-slate-50"
            }`}
          >
            {year === "All" ? "All Batches" : `${year} Placements`}
          </button>
        ))}
      </div>

      {/* Grid of Poster Cards */}
      {filteredPosters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosters.map((poster) => (
            <Card key={poster.id} className="flex flex-col overflow-hidden p-0" hoverEffect={true}>
              {/* Aspect Ratio 4:5 Styled HTML Placeholder Poster Header */}
              <div className={`bg-gradient-to-br ${getBrandGradient(poster.companyName)} text-white p-6 aspect-[4/3] flex flex-col justify-between relative`}>
                <div className="flex justify-between items-start">
                  <Badge variant="red" className="bg-white/15 border-none text-white backdrop-blur-xs text-[9px] uppercase tracking-widest font-extrabold px-2.5">
                    {poster.companyLogo}
                  </Badge>
                  <span className="text-[10px] font-bold text-white/80">Batch of {poster.year}</span>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-black tracking-tight uppercase">{poster.companyName}</h3>
                  <p className="text-xs text-white/85 line-clamp-1">{poster.roleName}</p>
                </div>

                <div className="flex justify-between items-end border-t border-white/10 pt-3">
                  <div>
                    <span className="text-[8px] text-white/60 uppercase tracking-wider block">Placed Count</span>
                    <span className="text-lg font-bold text-white">{poster.placementCount} Students</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-white/60 uppercase tracking-wider block">Package Value</span>
                    <span className="text-lg font-extrabold text-white">{poster.packageValue}</span>
                  </div>
                </div>
              </div>

              {/* Poster Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-text-primary leading-snug">
                    {poster.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                    {poster.description}
                  </p>
                </div>

                {/* Footer Selection Call to Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[10px] text-text-secondary">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{poster.date}</span>
                  </div>
                  <Link
                    href={`/placements/${poster.slug}`}
                    className="inline-flex items-center text-xs font-bold text-primary-red hover:text-primary-red-hover"
                  >
                    View Selection List
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border-custom rounded-2xl">
          <Award className="h-10 w-10 text-text-secondary mx-auto mb-3" />
          <h3 className="font-bold text-base text-text-primary">No campaigns match filters</h3>
          <p className="text-xs text-text-secondary mt-1">Try resetting the search query or year filter.</p>
        </div>
      )}

    </div>
  );
}
