"use client";

import { useEffect, useState } from "react";
import { cmsService, SuccessStory } from "@/services/cms";
import { Card } from "@/components/ui/old/Card";
import { Badge } from "@/components/ui/old/Badge";
import { Search, ChevronDown, CheckCircle2, Quote } from "lucide-react";

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
      result = result.filter(s => s.year.toString() === selectedYear);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.studentName.toLowerCase().includes(term) ||
        s.companyName.toLowerCase().includes(term) ||
        s.role.toLowerCase().includes(term) ||
        s.department.toLowerCase().includes(term)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="border-b border-border-custom pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Student Success Stories
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Inspirational journeys and testimonials from our graduates who placed at top industrial and tech organizations.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="w-full sm:max-w-md relative">
          <label htmlFor="success-search" className="sr-only">Search success stories</label>
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
          <label htmlFor="batch-select" className="sr-only">Select Graduating Batch</label>
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
          <span className="text-sm font-semibold text-text-secondary">No success stories match your search</span>
          <span className="text-xs text-text-secondary mt-1">Try broadening your search term or filtering by another year</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <Card key={story.id} className="flex flex-col justify-between p-6">
              
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-soft-red flex items-center justify-center font-extrabold text-sm text-primary-red">
                      {story.studentName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-text-primary">{story.studentName}</h3>
                      <p className="text-[10px] text-text-secondary">{story.department} • Batch {story.year}</p>
                    </div>
                  </div>
                  <Badge variant="red">{story.salaryPackage}</Badge>
                </div>

                {/* Quote Icon */}
                <div className="text-soft-red h-4">
                  <Quote className="h-6 w-6 -scale-x-100 opacity-60 fill-soft-red" />
                </div>

                {/* Testimonial body */}
                <p className="text-xs text-text-secondary leading-relaxed italic pl-1">
                  "{story.testimonial}"
                </p>
              </div>

              {/* Footer Placement Verification */}
              <div className="pt-5 border-t border-border-custom mt-6 flex items-center justify-between">
                <span className="font-extrabold text-xs text-text-primary uppercase tracking-wider flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1.5" />
                  Placed: {story.companyName}
                </span>
                
                <a
                  href={story.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 text-[10px] font-bold transition-colors"
                >
                  <svg className="h-3 w-3 mr-1 fill-blue-600 text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Profile
                </a>
              </div>

            </Card>
          ))}
        </div>
      )}

      {/* Inspirational Footer block */}
      <section className="bg-slate-50 border border-border-custom rounded-xl p-8 text-center max-w-3xl mx-auto mt-16 space-y-3">
        <h2 className="text-lg font-extrabold text-text-primary">Want to be featured next?</h2>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xl mx-auto">
          Placement cells hold continuous preparation tracks. Coordinate with your student reps, attend mock assessment runs, and utilize resources to lock down premium career roles.
        </p>
      </section>

    </div>
  );
}
