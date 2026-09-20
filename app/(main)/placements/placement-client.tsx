"use client";
import Loading from "@/app/loading";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Calendar, Award, Building2 } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
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
import { Pagination } from "@/components/ui/pagination";

/** First placement year included in the summaries. */
const FIRST_PLACEMENT_YEAR = 2023;
/** The placement season currently in progress. Change this when a new season starts. */
const CURRENT_PLACEMENT_YEAR = 2027;
/** Route of the statistics page (target of the CTA). Adjust if your route differs. */
const STATISTICS_HREF = "/placements/statistics";

type YearSummary = {
  year: number;
  companies: number;
  offers: number;
  highestPackage: number;
};

const getOffers = (drive: RecruiterVisitWithRelations) =>
  drive.recruiter_visit_department?.reduce(
    (sum, d) => sum + (d.offers_count || 0),
    0,
  ) || 0;

const getCompanyKey = (drive: RecruiterVisitWithRelations) =>
  (drive.recruiter?.company_name ?? "").trim().toLowerCase();

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

export default function PlacementsPage() {
  const [drives, setDrives] = useState<RecruiterVisitWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

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

  // Summary numbers for the intro text and the per-year subtexts.
  // "Companies visited" counts every distinct company with a drive from
  // FIRST_PLACEMENT_YEAR onwards, whether or not offers were made.
  const { totalCompanies, yearSummaries } = useMemo(() => {
    const allCompanies = new Set<string>();
    const perYear = new Map<
      number,
      { companies: Set<string>; offers: number; highestPackage: number }
    >();

    for (const drive of drives) {
      const year = Number(drive.placement_year?.year);
      if (!Number.isFinite(year) || year < FIRST_PLACEMENT_YEAR) continue;

      const key = getCompanyKey(drive);
      if (key) allCompanies.add(key);

      const entry = perYear.get(year) ?? {
        companies: new Set<string>(),
        offers: 0,
        highestPackage: 0,
      };
      if (key) entry.companies.add(key);
      entry.offers += getOffers(drive);
      entry.highestPackage = Math.max(
        entry.highestPackage,
        Number(drive.max_package) || 0,
      );
      perYear.set(year, entry);
    }

    const summaries: YearSummary[] = Array.from(perYear.entries())
      .map(([year, e]) => ({
        year,
        companies: e.companies.size,
        offers: e.offers,
        highestPackage: e.highestPackage,
      }))
      .sort((a, b) => b.year - a.year);

    return { totalCompanies: allCompanies.size, yearSummaries: summaries };
  }, [drives]);

  const currentYearSummary = yearSummaries.find(
    (s) => s.year === CURRENT_PLACEMENT_YEAR,
  );

  const visibleSummaries =
    selectedYear === "All"
      ? yearSummaries
      : yearSummaries.filter((s) => String(s.year) === selectedYear);

  const filteredDrives = drives.filter((drive) => {
    // Cards are only shown for drives with at least one offer.
    if (getOffers(drive) === 0) return false;

    const driveYear = drive.placement_year?.year?.toString() || "Unknown";
    const matchesYear = selectedYear === "All" || driveYear === selectedYear;

    const searchTarget =
      `${drive.recruiter?.company_name || ""} ${drive.recruiter?.industry || ""}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());

    return matchesYear && matchesSearch;
  });

  const sortedDrives = [...filteredDrives].sort((a, b) => {
    const aMaxPackage = Number(a.max_package) || 0;
    const bMaxPackage = Number(b.max_package) || 0;

    if (bMaxPackage !== aMaxPackage) {
      return bMaxPackage - aMaxPackage;
    }
    return getOffers(b) - getOffers(a);
  });

  const totalPages = Math.ceil(sortedDrives.length / ITEMS_PER_PAGE);
  const paginatedDrives = sortedDrives.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto pt-20 md:pt-24 pb-8 md:pb-12">
      <BackButton />

      {/* Header */}
      <header className="pb-8 mb-10 md:mb-12 border-b border-border-custom flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-text-primary whitespace-nowrap">
            Company-wise{" "}
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-primary-red italic">
              Placements
            </span>
          </h1>

          <p className="mt-5 md:mt-6 text-sm md:text-base text-text-secondary">
            Since {FIRST_PLACEMENT_YEAR},{" "}
            <strong className="font-semibold text-text-primary">
              {pluralize(totalCompanies, "company", "companies")}
            </strong>{" "}
            have visited SCTCE for campus recruitment.
          </p>
        </div>

        <Link
          href="/statistics"
          className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-text-secondary hover:text-primary-red transition-colors duration-200 shrink-0"
        >
          Detailed Statistics
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Filter Row */}
      <div
        role="group"
        aria-label="Filter by placement year"
        className="flex items-center space-x-1.5 mb-6 overflow-x-auto pb-2"
      >
        {availableYears.map((year) => (
          <button
            key={year}
            type="button"
            aria-pressed={selectedYear === year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer whitespace-nowrap ${
              selectedYear === year
                ? "bg-primary-red text-white border-primary-red shadow-xs"
                : "bg-card text-text-secondary border-border-custom hover:bg-slate-50"
            }`}
          >
            {year === "All" ? "All Batches" : `${year} Placements`}
            {year === String(CURRENT_PLACEMENT_YEAR) && (
              <span
                aria-hidden="true"
                className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse"
              />
            )}
          </button>
        ))}
      </div>

      {/* Year-wise summaries: single sentence on "All Batches", one-year detail when filtered */}
      {visibleSummaries.length > 0 && (
        <section
          aria-label="SCTCE placement summary by year"
          aria-live="polite"
          className="mb-8"
        >
          {selectedYear === "All" ? (
            (() => {
              const totalOffers = yearSummaries.reduce(
                (sum, s) => sum + s.offers,
                0,
              );
              const years = yearSummaries.map((s) => s.year).sort((a, b) => a - b);
              const yearRange =
                years.length > 1
                  ? `${years[0]}–${years[years.length - 1]}`
                  : String(years[0] ?? "");
              return (
                <p className="rounded-lg border border-border-custom bg-white px-4 py-3 text-sm leading-relaxed text-text-secondary">
                  Across{" "}
                  <strong className="font-semibold text-text-primary">
                    {yearRange}
                  </strong>
                  ,{" "}
                  <strong className="font-semibold text-text-primary">
                    {pluralize(totalCompanies, "company", "companies")}
                  </strong>{" "}
                  have visited SCTCE, making{" "}
                  <strong className="font-semibold text-text-primary">
                    {pluralize(totalOffers, "offer")}
                  </strong>{" "}
                  in total.
                </p>
              );
            })()
          ) : (
            <ul className="space-y-2">
              {visibleSummaries.map((s) => {
                const isCurrent = s.year === CURRENT_PLACEMENT_YEAR;
                const packageText =
                  s.highestPackage > 0 ? `${s.highestPackage} LPA` : null;

                if (isCurrent) {
                  return (
                    <li
                      key={s.year}
                      className="rounded-lg border border-primary-red/30 bg-white px-4 py-3 text-sm leading-relaxed text-text-secondary"
                    >
                      <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary-red px-2 py-0.5 text-xs font-semibold text-white">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                        Live
                      </span>
                      <br />
                      <strong className="font-semibold text-text-primary">
                        {s.year} placements
                      </strong>{" "}
                      — {pluralize(s.offers, "offer")} from{" "}
                      {pluralize(s.companies, "company", "companies")}
                      {packageText ? `, highest ${packageText}` : ""}.
                    </li>
                  );
                }

                return (
                  <li
                    key={s.year}
                    className="rounded-lg border border-border-custom bg-white px-4 py-3 text-sm leading-relaxed text-text-secondary"
                  >
                    <strong className="font-semibold text-text-primary">
                      {s.year} placements
                    </strong>{" "}
                    — {pluralize(s.offers, "offer")} from{" "}
                    {pluralize(s.companies, "company", "companies")}
                    {packageText ? `, highest package ${packageText}` : ""}.
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* Grid of Poster Cards */}
      {paginatedDrives.length > 0 ? (
        <div>
          <h2 className="sr-only">Companies that recruited from SCTCE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {paginatedDrives.map((drive) => {
              const companyName =
                drive.recruiter?.company_name || "Unknown Company";
              const packageDisplay = drive.max_package
                ? `${drive.max_package} LPA`
                : "TBD";
              const placementCount = getOffers(drive);
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
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 m-auto h-40 w-40 scale-[2.2] object-contain opacity-[0.04] blur-sm"
                        />
                        <img
                          src={drive.recruiter.logo_url}
                          alt={`${companyName} logo, recruiter at SCTCE`}
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
                  <CardContent className="space-y-4 md:space-y-5 p-4 md:p-6 text-primary">
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
                        {companyName}
                      </CardTitle>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 rounded-xl p-4 md:p-5 text-primary border-2">
                        <p className="text-3xl md:text-4xl font-bold leading-none text-primary-red">
                          {placementCount}
                        </p>
                        <p className="mt-2 text-sm font-medium text-primary/90">
                          Student{placementCount !== 1 ? "s" : ""} Placed
                        </p>
                      </div>
                      <div className="rounded-xl border bg-white p-3 md:p-4">
                        <p className="text-lg md:text-xl font-bold text-primary">
                          {packageDisplay}
                        </p>
                        <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                          Highest package offered
                        </p>
                      </div>
                      <div className="rounded-xl border bg-white p-3 md:p-4">
                        <p className="text-lg md:text-xl font-bold capitalize">
                          {drive.visit ? drive.visit.replace("_", " ") : "—"}
                        </p>
                        <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                          Visit Type
                        </p>
                      </div>
                    </div>
                  </CardContent>
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
          <h2 className="font-bold text-base text-text-primary">
            No company placements found
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Try selecting a different placement year.
          </p>
        </div>
      )}
    </div>
  );
}
