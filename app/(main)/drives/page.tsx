"use client";
import Loading from "@/app/loading";

import { useEffect, useState } from "react";
import { cmsService, PlacementDrive } from "@/services/cms";
import { Card } from "@/components/ui/old/Card";
import { Badge } from "@/components/ui/old/Badge";
import { Search, Calendar, Award, UserCheck, AlertCircle, ArrowUpRight } from "lucide-react";

export default function DrivesPage() {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [filteredDrives, setFilteredDrives] = useState<PlacementDrive[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [activeModalDrive, setActiveModalDrive] = useState<PlacementDrive | null>(null);
  const [appliedDrives, setAppliedDrives] = useState<string[]>([]);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await cmsService.getDrives();
        setDrives(list);
        setFilteredDrives(list);
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
    let result = drives;

    if (selectedStatus !== "All") {
      result = result.filter(d => d.status === selectedStatus);
    }

    if (selectedType !== "All") {
      result = result.filter(d => d.type === selectedType);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(d => 
        d.companyName.toLowerCase().includes(term) ||
        d.role.toLowerCase().includes(term) ||
        d.eligibility.toLowerCase().includes(term)
      );
    }

    setFilteredDrives(result);
  }, [searchTerm, selectedStatus, selectedType, drives]);

  const handleApply = (driveId: string) => {
    setAppliedSuccess(true);
    setAppliedDrives([...appliedDrives, driveId]);
    setTimeout(() => {
      setAppliedSuccess(false);
      setActiveModalDrive(null);
    }, 2000);
  };

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
          Active Recruitment Drives & Internships
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Apply to seasonal campus hiring rounds, view eligibility rules, and monitor application timelines.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
        
        {/* Search */}
        <div className="w-full lg:max-w-md relative">
          <label htmlFor="drive-search" className="sr-only">Search drives</label>
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
          <input
            id="drive-search"
            type="text"
            placeholder="Search company, job role, or eligibility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-custom bg-card rounded-md text-sm text-text-primary focus:outline-none focus:border-primary-red transition-colors"
          />
        </div>

        {/* Multi Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Status filter */}
          <div className="relative flex items-center space-x-2">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider hidden sm:inline">Status:</span>
            <label htmlFor="status-select" className="sr-only">Filter by status</label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-card border border-border-custom text-xs text-text-primary py-2 px-4 pr-8 rounded font-semibold cursor-pointer hover:border-primary-red focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Upcoming">Upcoming Only</option>
              <option value="Closed">Closed Only</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="relative flex items-center space-x-2">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider hidden sm:inline">Type:</span>
            <label htmlFor="type-select" className="sr-only">Filter by opportunity type</label>
            <select
              id="type-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-card border border-border-custom text-xs text-text-primary py-2 px-4 pr-8 rounded font-semibold cursor-pointer hover:border-primary-red focus:outline-none"
            >
              <option value="All">All Formats</option>
              <option value="Full-Time">Full-Time Jobs</option>
              <option value="Internship">Internship Offers</option>
              <option value="Dual Offer">Dual Offers</option>
            </select>
          </div>

        </div>

      </div>

      {/* Drives Grid */}
      {filteredDrives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border-custom rounded-xl bg-card">
          <AlertCircle className="h-10 w-10 text-text-secondary mb-3" />
          <span className="text-sm font-semibold text-text-secondary">No active drives match your selections</span>
          <span className="text-xs text-text-secondary mt-1">Try resetting selected filters</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredDrives.map((drive) => {
            const isApplied = appliedDrives.includes(drive.id);
            const statusMap: Record<string, "active" | "closed" | "upcoming"> = {
              Active: "active",
              Closed: "closed",
              Upcoming: "upcoming"
            };

            return (
              <Card key={drive.id} className="flex flex-col justify-between p-6">
                
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded bg-soft-red flex items-center justify-center font-extrabold text-xs text-primary-red">
                        {drive.companyName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-text-primary">{drive.companyName}</h3>
                        <Badge variant="default" className="mt-0.5">{drive.type}</Badge>
                      </div>
                    </div>
                    
                    <Badge variant={statusMap[drive.status]}>
                      {drive.status}
                    </Badge>
                  </div>

                  {/* Role and Salary */}
                  <div>
                    <h4 className="text-base font-extrabold text-text-primary mb-1">
                      {drive.role}
                    </h4>
                    <span className="text-xs font-bold text-primary-red">
                      Salary Package: {drive.salary}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {drive.description}
                  </p>

                  {/* Eligibility list */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-start space-x-2 text-xs">
                      <UserCheck className="h-4 w-4 text-primary-red flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-text-primary block">Academic Eligibility</span>
                        <span className="text-text-secondary">{drive.eligibility}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-xs">
                      <Calendar className="h-4 w-4 text-primary-red flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-text-primary block">Registration Deadline</span>
                        <span className="text-text-secondary">{drive.deadline}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Application CTA */}
                <div className="pt-6 border-t border-border-custom mt-6 flex justify-end">
                  {drive.status === "Closed" ? (
                    <button
                      disabled
                      className="px-4 py-2 border border-border-custom text-xs font-semibold rounded text-text-secondary bg-slate-50 cursor-not-allowed"
                    >
                      Applications Closed
                    </button>
                  ) : isApplied ? (
                    <button
                      disabled
                      className="px-4 py-2 border border-emerald-200 text-xs font-semibold rounded text-emerald-700 bg-emerald-50 cursor-not-allowed"
                    >
                      Applied Successfully
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveModalDrive(drive)}
                      className="px-4 py-2 bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer flex items-center"
                    >
                      Apply / View Details
                      <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Slide Over for Applying to Drive */}
      {activeModalDrive && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-card border border-border-custom rounded-xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in duration-300">
            
            {/* Header info */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-soft-red flex items-center justify-center font-extrabold text-sm text-primary-red">
                  {activeModalDrive.companyName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-text-primary">{activeModalDrive.companyName}</h3>
                  <span className="text-xs text-text-secondary">{activeModalDrive.type}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalDrive(null)}
                className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-soft-red cursor-pointer"
                aria-label="Close details"
              >
                ✖
              </button>
            </div>

            {/* Description details */}
            <div className="space-y-4 text-xs text-text-secondary leading-relaxed mb-6">
              <div>
                <h4 className="font-bold text-text-primary uppercase tracking-wider mb-1.5">Job Designation</h4>
                <p className="text-sm font-semibold text-text-primary">{activeModalDrive.role}</p>
              </div>
              <div>
                <h4 className="font-bold text-text-primary uppercase tracking-wider mb-1.5">Remuneration Package</h4>
                <p className="text-sm font-bold text-primary-red">{activeModalDrive.salary}</p>
              </div>
              <div>
                <h4 className="font-bold text-text-primary uppercase tracking-wider mb-1.5">Detailed Description</h4>
                <p>{activeModalDrive.description}</p>
              </div>
              <div>
                <h4 className="font-bold text-text-primary uppercase tracking-wider mb-1.5">Academic Prerequisites</h4>
                <p className="text-text-primary font-medium">{activeModalDrive.eligibility}</p>
              </div>
              <div>
                <h4 className="font-bold text-text-primary uppercase tracking-wider mb-1.5">Important Dates</h4>
                <div className="flex space-x-4 mt-1">
                  <span><strong>Deadline:</strong> {activeModalDrive.deadline}</span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
              <button
                onClick={() => setActiveModalDrive(null)}
                className="px-4 py-2 border border-border-custom rounded text-xs font-semibold text-text-secondary hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              
              {appliedSuccess ? (
                <button
                  disabled
                  className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded cursor-not-allowed"
                >
                  Submitting...
                </button>
              ) : (
                <button
                  onClick={() => handleApply(activeModalDrive.id)}
                  className="px-5 py-2 bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
                >
                  Confirm Application
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Drive Warnings Box */}
      <Card className="bg-slate-50 border border-border-custom p-6 max-w-3xl mx-auto flex items-start space-x-4" hoverEffect={false}>
        <Award className="h-5 w-5 text-primary-red flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-text-primary mb-1">Dual Offer & Acceptance Policies</h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Students are subject to the SCTCE placement cell code. Accepting a core/product sector offer blocks further applications to core jobs, unless the subsequent opportunity falls into the "Super Dream" tier (exceeding 20 LPA and at least 1.5x the first package).
          </p>
        </div>
      </Card>

    </div>
  );
}
