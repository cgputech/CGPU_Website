"use client";
import Loading from "@/app/loading";

import { useEffect, useState } from "react";
import {
  Search,
  Building,
  Award,
  ShieldCheck,
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { listRecruiters } from "@/services/recruiters";
import type { RecruiterWithStats } from "@/services/types/db";
import Image from "next/image";
import {
  CardFooter,
  CardHeader,
  Card,
  CardAction,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";

export default function RecruitersPage() {
  const [recruiters, setRecruiters] = useState<RecruiterWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const list = await listRecruiters();
        console.log(list)
        setRecruiters(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredRecruiters = recruiters.filter((company) => {
    const query = searchQuery.toLowerCase();
    return (
      company.company_name.toLowerCase().includes(query) ||
      (company.industry && company.industry.toLowerCase().includes(query))
    );
  });

  const sortedRecruiters = [...filteredRecruiters].sort((a, b) => {
    const aTotalPlaced =
      a.recruiter_visit?.reduce((acc, visit) => {
        const visitOffers =
          visit.recruiter_visit_department?.reduce(
            (sum, dept) => sum + (dept.offers_count || 0),
            0,
          ) || 0;
        return acc + visitOffers;
      }, 0) || 0;

    const bTotalPlaced =
      b.recruiter_visit?.reduce((acc, visit) => {
        const visitOffers =
          visit.recruiter_visit_department?.reduce(
            (sum, dept) => sum + (dept.offers_count || 0),
            0,
          ) || 0;
        return acc + visitOffers;
      }, 0) || 0;

    const aMaxPackage =
      a.recruiter_visit?.reduce(
        (max, visit) => Math.max(max, Number(visit.max_package) || 0),
        0,
      ) || 0;
    const bMaxPackage =
      b.recruiter_visit?.reduce(
        (max, visit) => Math.max(max, Number(visit.max_package) || 0),
        0,
      ) || 0;

    if (bMaxPackage !== aMaxPackage) {
      return bMaxPackage - aMaxPackage;
    }
    return bTotalPlaced - aTotalPlaced;
  });

  const totalPages = Math.ceil(sortedRecruiters.length / ITEMS_PER_PAGE);
  const paginatedRecruiters = sortedRecruiters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="border-b border-border-custom pb-6 mb-10 flex flex-col md:flex-row justify-center gap-4 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary text-center">
            Our Recruitment <span className="text-3xl md:text-5xl font-bold tracking-tight text-primary-red italic">Partners</span>
          </h1>
        </div>

        {/* Search */}
        {/* <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search companies or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border-custom rounded-lg bg-card text-xs text-text-primary focus:outline-none focus:border-primary-red transition-colors"
          />
        </div> */}
      </div>

      {/* Grid of Recruiter Cards */}
      {paginatedRecruiters.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRecruiters.map((company, index) => {
              const totalPlaced =
                company.recruiter_visit?.reduce((acc, visit) => {
                  const visitOffers =
                    visit.recruiter_visit_department?.reduce(
                      (sum, dept) => sum + (dept.offers_count || 0),
                      0,
                    ) || 0;
                  return acc + visitOffers;
                }, 0) || 0;
              const placedText =
                totalPlaced >= 10
                  ? `${Math.floor(totalPlaced / 10) * 10}+ Placed`
                  : totalPlaced > 0
                    ? `${totalPlaced} Placed`
                    : "0 Placed";
              const sinceYear = company.first_visited_year ?? 2023;
              const sinceText = `Since ${sinceYear}`;
              const maxPackages =
                company.recruiter_visit
                  ?.map((v) => v.max_package)
                  .filter(
                    (pkg): pkg is number => pkg !== null && pkg !== undefined,
                  ) ?? [];
              const maxLpaVal =
                maxPackages.length > 0
                  ? Math.max(...maxPackages.map(Number))
                  : 0;
              const lpaText =
                maxLpaVal > 0
                  ? `Up to ${maxLpaVal} LPA`
                  : "TBD";
              return (
                <Card
                  key={index}
                  className="mx-auto w-full max-w-sm overflow-hidden pt-0 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Logo Banner */}
                  <div className="flex h-40 items-center justify-center border-b bg-gradient-to-br from-muted/60 via-background to-muted/40 p-6">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={`${company.company_name} logo`}
                        className="max-h-20 max-w-[80%] object-contain"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary text-2xl font-bold uppercase text-primary-foreground">
                        {company.company_name.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <CardHeader className="flex flex-col items-center justify-center text-center pb-6 gap-3">
                    <CardTitle className="text-center font-bold text-lg text-text-primary">
                      {company.company_name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                      <Badge className="flex items-center gap-1.5 rounded-full bg-primary-red text-white px-3 py-1.5 text-xs font-semibold shadow-sm">
                        <Users className="h-4 w-4" />
                        <span>{placedText}</span>
                      </Badge>

                      <Badge className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-black px-3 py-1.5 text-xs font-semibold shadow-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{sinceText}</span>
                      </Badge>

                      <Badge className="flex items-center gap-1.5 rounded-full bg-white text-primary px-3 py-1.5 text-xs font-semibold shadow-sm">
                        <TrendingUp className="h-4 w-4" />
                        <span>{lpaText}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRecruiters.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border-custom rounded-2xl">
          <Building className="h-10 w-10 text-text-secondary mx-auto mb-3" />
          <h3 className="font-bold text-base text-text-primary">
            No recruiters match filters
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Try resetting the search query or sector filter.
          </p>
        </div>
      )}
    </div>
  );
}
