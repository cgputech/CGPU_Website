"use client";
import Loading from "@/app/loading";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Calendar, Award, Building2 } from "lucide-react";
import { listDrives } from "@/services/drives";
import type { RecruiterVisitWithRelations } from "@/services/types/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

export default function PlacementsPage() {
  const [drives, setDrives] = useState<RecruiterVisitWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const list = await listDrives();
        setDrives(list);
      } catch (err) {
        console.error("Failed to fetch drives", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Date TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const availableYears = [
    "All",
    ...Array.from(
      new Set(
        drives.map((d) => d.placement_year?.year.toString() || "Unknown"),
      ),
    ).sort((a, b) => b.localeCompare(a)),
  ];

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear]);

  const filteredDrives = drives.filter((drive) => {
    const driveYear = drive.placement_year?.year?.toString() || "Unknown";
    const matchesYear = selectedYear === "All" || driveYear === selectedYear;

    const searchTarget =
      `${drive.recruiter?.company_name || ""} ${drive.recruiter?.industry || ""}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());

    return matchesYear && matchesSearch;
  });

  const sortedDrives = [...filteredDrives].sort((a, b) => {
    const aPlacementCount =
      a.recruiter_visit_department?.reduce(
        (sum, d) => sum + (d.offers_count || 0),
        0
      ) || 0;
    const bPlacementCount =
      b.recruiter_visit_department?.reduce(
        (sum, d) => sum + (d.offers_count || 0),
        0
      ) || 0;
    
    const aMaxPackage = Number(a.max_package) || 0;
    const bMaxPackage = Number(b.max_package) || 0;

    if (bMaxPackage !== aMaxPackage) {
      return bMaxPackage - aMaxPackage;
    }
    return bPlacementCount - aPlacementCount;
  });

  const totalPages = Math.ceil(sortedDrives.length / ITEMS_PER_PAGE);
  const paginatedDrives = sortedDrives.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-8">
      {/* Header */}
      <div className="pb-6 mb-10 border-b border-border-custom flex flex-col md:flex-row items-center justify-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary text-center">
            Placement <span className="text-3xl md:text-5xl font-bold tracking-tight text-primary-red italic">Campaigns</span>
          </h1>
        </div>

        {/* <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border-custom rounded-lg bg-card text-xs text-text-primary focus:outline-none focus:border-primary-red transition-colors"
          />
        </div> */}
      </div>

      {/* Filter Row */}
      <div className="flex items-center space-x-1.5 mb-8 overflow-x-auto pb-2">
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer whitespace-nowrap ${
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
      {paginatedDrives.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedDrives.map((drive) => {
              const companyName =
                drive.recruiter?.company_name || "Unknown Company";
              const packageDisplay = drive.max_package
                ? `${drive.max_package} LPA`
                : "TBD";
              const placementCount =
                drive.recruiter_visit_department?.reduce(
                  (sum, d) => sum + (d.offers_count || 0),
                  0,
                ) || 0;
              const logoText = drive.recruiter?.logo_url
                ? ""
                : companyName.substring(0, 2);
              return (
                <Card key={drive.id} className="group overflow-hidden p-0">
                  <div className="relative flex h-40 items-center justify-center overflow-hidden border-b bg-gradient-to-br from-muted/60 via-background to-muted/40">
                    {drive.recruiter?.logo_url ? (
                      <>
                        <img
                          src={drive.recruiter.logo_url}
                          alt={companyName}
                          className="absolute inset-0 m-auto h-40 w-40 scale-[2.2] object-contain opacity-[0.04] blur-sm"
                        />
                        <img
                          src={drive.recruiter.logo_url}
                          alt={companyName}
                          className="relative max-h-20 max-w-[180px] object-contain"
                        />
                      </>
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-red text-3xl font-bold text-white">
                        {logoText}
                      </div>
                    )}
                    <Badge
                      variant="secondary"
                      className="absolute right-4 top-4 bg-background/80 backdrop-blur"
                    >
                      {drive.placement_year?.year ?? "Unknown"} Batch
                    </Badge>
                  </div>
                  <CardContent className="space-y-5 p-6 text-primary">
                    <div>
                      <CardTitle className="text-2xl font-bold tracking-tight">
                        {companyName}
                      </CardTitle>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 rounded-xl p-5 text-primary border-2">
                        <p className="text-4xl font-bold leading-none text-primary-red">
                          {placementCount}
                        </p>
                        <p className="mt-2 text-sm font-medium text-primary/90">
                          Student{placementCount !== 1 ? "s" : ""} Placed
                        </p>
                      </div>
                      <div className="rounded-xl border bg-white p-4">
                        <p className="text-xl font-bold text-primary">
                          {packageDisplay}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Highest package offered
                        </p>
                      </div>
                      <div className="rounded-xl border bg-white p-4">
                        <p className="text-xl font-bold">
                          {drive.average_package
                            ? `${drive.average_package} LPA`
                            : "—"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Average compensation
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  {/* <CardFooter className="flex items-center justify-between border-t bg-muted/20 p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(drive.visit_date)}
                    </div>
                    <Button asChild>
                      <Link href={`/placements/${drive.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter> */}
                </Card>
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredDrives.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border-custom rounded-2xl">
          <Award className="h-10 w-10 text-text-secondary mx-auto mb-3" />
          <h3 className="font-bold text-base text-text-primary">
            No campaigns match filters
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Try resetting the search query or year filter.
          </p>
        </div>
      )}
    </div>
  );
}