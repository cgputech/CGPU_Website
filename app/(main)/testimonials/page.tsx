"use client";

import { useEffect, useState } from "react";
import { cmsService, SuccessStory } from "@/services/cms";
import { Card } from "@/components/ui/old/Card";
import { Badge } from "@/components/ui/old/Badge";
import { Search, ChevronDown, CheckCircle2, Quote } from "lucide-react";
import { TestimonialCard } from "@/components/home/testimonial";

const data = [
  {
    name: "Abhiram A R",
    description:
      "The CGPU cell provided immense support throughout the placement season. The mock interviews and technical workshops were instrumental in helping me secure a position at my dream company. I'm truly grateful for the guidance and opportunities provided by the college.",
    videoUrl:
      "https://www.youtube.com/embed/tOwjEOt1zYU?controls=1&autoplay=1&mute=1&loop=1&modestbranding=1",
    youtubeId: "tOwjEOt1zYU",
    isYoutube: true,
  },
  {
    name: "Sarah Johnson",
    description:
      "The placement cell was incredibly helpful in preparing me for the technical rounds. I landed a dream job at a top tech firm!",
    videoUrl:
      "https://www.youtube.com/embed/tOwjEOt1zYU?controls=1&autoplay=1&mute=1&modestbranding=1",
    youtubeId: "tOwjEOt1zYU",
    isYoutube: true,
  },
  {
    name: "Michael Chen",
    description:
      "The training programs here are top-notch. I learned more in two months than I did in a whole year of self-study.",
    videoUrl:
      "https://www.youtube.com/embed/tOwjEOt1zYU?controls=1&autoplay=1&mute=1&modestbranding=1",
    youtubeId: "tOwjEOt1zYU",
    isYoutube: true,
  },
  {
    name: "Elena Rodriguez",
    description:
      "Great experience with the mock interviews. It really boosted my confidence for the actual placement rounds.",
    videoUrl:
      "https://www.youtube.com/embed/tOwjEOt1zYU?controls=1&autoplay=1&mute=1&modestbranding=1",
    youtubeId: "tOwjEOt1zYU",
    isYoutube: true,
  },
];

export default function TestimonialsPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<SuccessStory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await cmsService.getSuccessStories();
        setStories(list);
        setFilteredStories(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = stories;

    if (selectedYear !== "All") {
      result = result.filter((s) => s.year.toString() === selectedYear);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.studentName.toLowerCase().includes(term) ||
          s.companyName.toLowerCase().includes(term) ||
          s.role.toLowerCase().includes(term) ||
          s.department.toLowerCase().includes(term),
      );
    }

    setFilteredStories(result);
  }, [searchTerm, selectedYear, stories]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-24 py-12 -mt-[--navbar-height]">
      {/* Header */}
      <div className="border-b border-border-custom pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary text-center">
          Testimonials
        </h1>
        {/* <p className="text-sm text-text-secondary mt-1 text-center">
          Inspirational journeys and testimonials from our graduates who placed at top industrial and tech organizations.
        </p> */}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        {/* Search */}
        <div className="w-full sm:max-w-md relative">
          <label htmlFor="success-search" className="sr-only">
            Search success stories
          </label>
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
          <input
            id="success-search"
            type="text"
            placeholder="Search by student, company, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border-custom bg-card rounded-md text-sm text-text-primary focus:outline-none focus:border-primary-red transition-colors"
          />
        </div>

        {/* Year Select */}
        <div className="relative w-full sm:w-auto">
          <label htmlFor="batch-select" className="sr-only">
            Select Graduating Batch
          </label>
          <select
            id="batch-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-card border border-border-custom text-sm text-text-primary py-2 pl-4 pr-10 rounded-md font-bold cursor-pointer hover:border-primary-red focus:outline-none transition-colors"
          >
            <option value="All">All Batches</option>
            <option value="2025">Class of 2025</option>
            <option value="2024">Class of 2024</option>
            <option value="2023">Class of 2023</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Testimonials Grid */}
      {filteredStories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border-custom rounded-xl bg-card">
          <Quote className="h-10 w-10 text-text-secondary mb-3" />
          <span className="text-sm font-semibold text-text-secondary">
            No success stories match your search
          </span>
          <span className="text-xs text-text-secondary mt-1">
            Try broadening your search term or filtering by another year
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <TestimonialCard {...item} key={index} />
          ))}
        </div>
      )}

      {/* Inspirational Footer block */}
      <section className="bg-slate-50 border border-border-custom rounded-xl p-8 text-center max-w-3xl mx-auto mt-16 space-y-3">
        <h2 className="text-lg font-extrabold text-text-primary">
          Want to be featured next?
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xl mx-auto">
          Placement cells hold continuous preparation tracks. Coordinate with
          your student reps, attend mock assessment runs, and utilize resources
          to lock down premium career roles.
        </p>
      </section>
    </div>
  );
}
