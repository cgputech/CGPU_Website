"use client";
import Loading from "@/app/loading";

import { useEffect, useState } from "react";
import { cmsService, TrainingActivity } from "@/services/cms";
import { Card } from "@/components/ui/old/Card";
import { Badge } from "@/components/ui/old/Badge";
import { Search, Calendar, User, Clock, CheckCircle } from "lucide-react";

export default function TrainingPage() {
  const [activities, setActivities] = useState<TrainingActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<TrainingActivity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await cmsService.getTrainingSessions();
        setActivities(list);
        setFilteredActivities(list);
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
    let result = activities;

    if (selectedCategory !== "All") {
      result = result.filter(a => a.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(term) ||
        a.description.toLowerCase().includes(term) ||
        a.trainer.toLowerCase().includes(term)
      );
    }

    setFilteredActivities(result);
  }, [searchTerm, selectedCategory, activities]);

  const categories = ["All", "Workshops", "Coding Sessions", "Industry Talks", "Hackathons", "Skill Development"];

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-8">
      
      {/* Header */}
      <div className="border-b border-border-custom pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Training & Professional Activities
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Explore structured bootcamps, continuous coding preparation, mock interviews, and industry hackathons.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10">
        
        {/* Search */}
        <div className="w-full lg:max-w-md relative">
          <label htmlFor="training-search" className="sr-only">Search training activities</label>
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
          <input
            id="training-search"
            type="text"
            placeholder="Search training programs or instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-custom bg-card rounded-md text-sm text-text-primary focus:outline-none focus:border-primary-red transition-colors"
          />
        </div>

        {/* Categories scroll menu */}
        <div className="w-full lg:w-auto overflow-x-auto flex space-x-2 pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary-red text-white shadow-sm"
                  : "bg-card border border-border-custom text-text-secondary hover:text-text-primary hover:border-text-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Activities Timeline */}
      {filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border-custom rounded-xl bg-card">
          <Calendar className="h-10 w-10 text-text-secondary mb-3" />
          <span className="text-sm font-semibold text-text-secondary">No matching activities found</span>
          <span className="text-xs text-text-secondary mt-1">Try resetting selected categories</span>
        </div>
      ) : (
        <div className="relative border-l border-border-custom ml-4 md:ml-32 space-y-12">
          {filteredActivities.map((act) => (
            <div key={act.id} className="relative pl-6 md:pl-8">
              
              {/* Date Box on left (for desktop only) */}
              <div className="hidden md:block absolute -left-36 top-1.5 w-28 text-right pr-4">
                <span className="block text-xs font-bold text-text-primary uppercase tracking-wide">
                  {act.date.split(" - ")[0]}
                </span>
                <span className="block text-[10px] text-text-secondary mt-0.5">
                  {act.date.includes(" - ") ? "Multi-Day" : "One-Day"}
                </span>
              </div>

              {/* Bullet Node */}
              <span className={`absolute -left-2.5 top-2.5 w-5 h-5 rounded-full border-4 border-card flex items-center justify-center ${
                act.status === "Upcoming" ? "bg-primary-red" : "bg-emerald-500"
              }`} />

              {/* Event Content Card */}
              <Card className="p-6">
                
                {/* Header metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant={act.status === "Upcoming" ? "red" : "active"}>
                      {act.status}
                    </Badge>
                    <Badge variant="default">{act.category}</Badge>
                  </div>
                  
                  {/* Mobile-only date display */}
                  <span className="text-xs font-semibold text-text-secondary md:hidden flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {act.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-extrabold text-text-primary mb-2">
                  {act.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  {act.description}
                </p>

                {/* Details Footer */}
                <div className="pt-4 border-t border-border-custom flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-text-secondary">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1.5 text-primary-red" />
                    <span>Trainer: <strong className="text-text-primary font-semibold">{act.trainer}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-primary-red" />
                    <span>Duration: <strong className="text-text-primary font-semibold">{act.duration}</strong></span>
                  </div>
                </div>

              </Card>

            </div>
          ))}
        </div>
      )}

      {/* Mandatory Training Alert */}
      <Card className="bg-soft-red/40 border border-red-200/50 p-6 max-w-3xl mx-auto mt-16 flex items-start space-x-4" hoverEffect={false}>
        <CheckCircle className="h-5 w-5 text-primary-red flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-text-primary mb-1">Mandatory Student Compliance</h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Attendance in pre-placement mock assessment panels, coding test series, and designated industry workshops is compiled for student eligibility mapping. Students with less than 85% compliance will not be forwarded to premium recruiter slots.
          </p>
        </div>
      </Card>

    </div>
  );
}
