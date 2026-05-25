"use client";

import { useEffect, useState } from "react";
import { Search, Building, Award, ShieldCheck, Briefcase } from "lucide-react";
import { cmsService, Recruiter } from "@/services/cms";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function RecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const list = await cmsService.getRecruiters();
        setRecruiters(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, []);

  // Unique sectors
  const sectors = ["All", "IT & Software", "Core Engineering", "Finance & Banking", "Consulting & Analytics"];

  // Filter logic
  const filteredRecruiters = recruiters.filter((company) => {
    const matchesSector = selectedSector === "All" || company.sector === selectedSector;
    const matchesSearch = 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.rolesOffered.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSector && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-red"></div>
      </div>
    );
  }

  // Brand color mapping for recruiter logo cards (color transition)
  const getBrandColors = (name: string) => {
    switch (name.toUpperCase()) {
      case "GOOGLE": return "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200";
      case "MICROSOFT": return "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200";
      case "NVIDIA": return "hover:bg-green-50 hover:text-green-600 hover:border-green-200";
      case "AMAZON": return "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200";
      case "DELOITTE": return "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200";
      case "GOLDMAN SACHS": return "hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200";
      case "TATA MOTORS": return "hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200";
      case "L&T CONSTRUCTION": return "hover:bg-amber-100/50 hover:text-amber-800 hover:border-amber-300";
      case "JP MORGAN CHASE": return "hover:bg-blue-100/50 hover:text-blue-900 hover:border-blue-300";
      default: return "hover:bg-red-50 hover:text-primary-red hover:border-red-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="border-b border-border-custom pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Our Recruitment Partners
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Browse our global industry allies and corporate recruitment networks at SCTCE.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search companies or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border-custom rounded-lg bg-card text-xs text-text-primary focus:outline-none focus:border-primary-red transition-colors"
          />
        </div>
      </div>

      {/* Sector Filters */}
      <div className="flex items-center space-x-1.5 mb-8 overflow-x-auto pb-2">
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSector(sec)}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 whitespace-nowrap cursor-pointer ${
              selectedSector === sec
                ? "bg-primary-red text-white border-primary-red shadow-xs"
                : "bg-card text-text-secondary border-border-custom hover:bg-slate-50"
            }`}
          >
            {sec === "All" ? "All Sectors" : sec}
          </button>
        ))}
      </div>

      {/* Grid of Recruiter Cards */}
      {filteredRecruiters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecruiters.map((company) => (
            <Card 
              key={company.id} 
              className={`p-6 border border-border-custom bg-card flex flex-col justify-between space-y-6 transition-all duration-300 group ${getBrandColors(company.name)}`}
              hoverEffect={true}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Logo Emblem Placeholder */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black tracking-widest text-text-secondary border border-slate-200/50 group-hover:bg-white group-hover:border-inherit transition-all duration-300">
                      {company.logo}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-text-primary group-hover:text-inherit">
                        {company.name}
                      </h3>
                      <span className="text-[10px] text-text-secondary mt-0.5 block group-hover:text-inherit">
                        {company.sector}
                      </span>
                    </div>
                  </div>
                  
                  {company.topRecruiter && (
                    <Badge variant="red" className="group-hover:bg-white/20 group-hover:text-inherit">
                      Top Recruiter
                    </Badge>
                  )}
                </div>

                {/* Offer Packages info */}
                <div className="space-y-1 pt-2">
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block group-hover:text-inherit">
                    Average Package Range
                  </span>
                  <span className="text-sm font-extrabold text-primary-red group-hover:text-inherit">
                    {company.packageRange}
                  </span>
                </div>

                {/* Roles Offered list */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block group-hover:text-inherit">
                    Key Roles Offered
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {company.rolesOffered.map((role, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-text-secondary rounded text-[9px] font-semibold border border-slate-200/20 group-hover:bg-white/20 group-hover:text-inherit group-hover:border-transparent transition-all duration-300"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verified Badge footnote */}
              <div className="pt-4 border-t border-slate-100/50 group-hover:border-white/10 flex items-center justify-between text-[10px] text-text-secondary group-hover:text-inherit transition-all duration-300">
                <span className="flex items-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 mr-1 group-hover:text-inherit" />
                  Verified Hiring Partner
                </span>
                <span className="font-bold flex items-center">
                  <Briefcase className="h-3 w-3 mr-1" />
                  MOU Active
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border-custom rounded-2xl">
          <Building className="h-10 w-10 text-text-secondary mx-auto mb-3" />
          <h3 className="font-bold text-base text-text-primary">No recruiters match filters</h3>
          <p className="text-xs text-text-secondary mt-1">Try resetting the search query or sector filter.</p>
        </div>
      )}

    </div>
  );
}
