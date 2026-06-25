"use client";

import { useEffect, useState, useCallback } from "react";
import {
  listPlacementYearOptions,
  fetchHighestPackage,
  fetchAveragePackage,
  fetchTotalStudentsPlaced,
  fetchDepartmentsData,
  fetchSectorWiseData,
  type PlacementYearOption,
  type TotalStudentsPlacedResult,
  type DeptStat,
  type SectorShare,
} from "@/services/statistics";
import { Card } from "@/components/ui/old/Card";
import InteractiveChart from "@/components/ui/old/InteractiveChart";
import {
  TrendingUp,
  DollarSign,
  Building,
  Percent,
  Award,
  ChevronDown,
  Users,
} from "lucide-react";

// ─── Tiny skeleton pulse ──────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StatisticsPage() {
  // Year list (for dropdown)
  const [years, setYears] = useState<PlacementYearOption[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [yearsLoading, setYearsLoading] = useState(true);

  // Individual data slices
  const [highestPackage, setHighestPackage] = useState<number | null>(null);
  const [averagePackage, setAveragePackage] = useState<number | null>(null);
  const [totalStudents, setTotalStudents] = useState<TotalStudentsPlacedResult | null>(null);
  const [departments, setDepartments] = useState<DeptStat[]>([]);
  const [sectorData, setSectorData] = useState<SectorShare[]>([]);

  // Per-section loading flags
  const [kpiLoading, setKpiLoading] = useState(false);
  const [deptLoading, setDeptLoading] = useState(false);
  const [sectorLoading, setSectorLoading] = useState(false);

  // ── Load year list once ───────────────────────────────────────────────────
  useEffect(() => {
    listPlacementYearOptions().then((data) => {
      setYears(data);
      if (data.length > 0) setSelectedYearId(data[0].id);
      setYearsLoading(false);
    });
  }, []);

  // ── Fetch all data slices when year changes ───────────────────────────────
  const loadYearData = useCallback(async (yearId: number) => {
    // KPI cards — highest, average, total
    setKpiLoading(true);
    const [highest, average, totals] = await Promise.all([
      fetchHighestPackage(yearId),
      fetchAveragePackage(yearId),
      fetchTotalStudentsPlaced(yearId),
    ]);
    setHighestPackage(highest);
    setAveragePackage(average);
    setTotalStudents(totals);
    setKpiLoading(false);

    // Department table + bar chart
    setDeptLoading(true);
    fetchDepartmentsData(yearId).then((data) => {
      setDepartments(data);
      setDeptLoading(false);
    });

    // Sector donut chart
    setSectorLoading(true);
    fetchSectorWiseData(yearId).then((data) => {
      setSectorData(data);
      setSectorLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedYearId == null) return;
    loadYearData(selectedYearId);
  }, [selectedYearId, loadYearData]);

  // ── Bar chart data ────────────────────────────────────────────────────────
  const barChartData = departments.map((d) => ({
    label: d.deptCode || d.dept,
    value: d.avgPackage,
  }));

  // ── Guards ────────────────────────────────────────────────────────────────
  if (yearsLoading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-red" />
      </div>
    );
  }

  if (years.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-[70vh] gap-2">
        <p className="text-text-secondary text-sm">No placement data available yet.</p>
      </div>
    );
  }

  const selectedYear = years.find((y) => y.id === selectedYearId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-8">

      {/* ── Header + Year selector ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border-custom pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Placement Analytics &amp; Metrics
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Department-wise reports, package distribution statistics, and recruitment sectors.
          </p>
        </div>

        <div className="relative inline-block text-left">
          <label htmlFor="year-select" className="sr-only">Select Placement Year</label>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Placement Year:
            </span>
            <div className="relative">
              <select
                id="year-select"
                value={selectedYearId ?? ""}
                onChange={(e) => setSelectedYearId(Number(e.target.value))}
                className="appearance-none bg-card border border-border-custom text-sm text-text-primary py-2 pl-4 pr-10 rounded-md font-bold cursor-pointer hover:border-primary-red focus:outline-none transition-colors"
              >
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.year} Campaign
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-text-secondary pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

        {/* Total Placed */}
        {/* <Card className="flex flex-col justify-between p-5" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Placed</span>
            <div className="p-1.5 bg-soft-red text-primary-red rounded">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            {kpiLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <span className="text-2xl font-extrabold text-text-primary">
                  {totalStudents?.totalPlaced ?? "—"}
                </span>
                <span className="block text-[10px] text-text-secondary mt-1">
                  of {totalStudents?.totalEligible ?? "—"} eligible students
                </span>
              </>
            )}
          </div>
        </Card> */}

        {/* Success Rate */}
        {/* <Card className="flex flex-col justify-between p-5" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Success Rate</span>
            <div className="p-1.5 bg-soft-red text-primary-red rounded">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            {kpiLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <span className="text-2xl font-extrabold text-primary-red">
                  {totalStudents?.placedPercentage != null && totalStudents.placedPercentage > 0
                    ? `${totalStudents.placedPercentage}%`
                    : "—"}
                </span>
                <span className="block text-[10px] text-text-secondary mt-1">Of eligible students placed</span>
              </>
            )}
          </div>
        </Card> */}

        {/* Highest Package */}
        <Card className="flex flex-col justify-between p-5" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Highest Package</span>
            <div className="p-1.5 bg-soft-red text-primary-red rounded">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            {kpiLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <span className="text-2xl font-extrabold text-text-primary">
                  {highestPackage != null && highestPackage > 0 ? `${highestPackage} LPA` : "—"}
                </span>
                <span className="block text-[10px] text-text-secondary mt-1">Best offer this season</span>
              </>
            )}
          </div>
        </Card>

        {/* Average Package */}
        <Card className="flex flex-col justify-between p-5" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Average Package</span>
            <div className="p-1.5 bg-soft-red text-primary-red rounded">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            {kpiLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <span className="text-2xl font-extrabold text-text-primary">
                  {averagePackage != null && averagePackage > 0 ? `${averagePackage} LPA` : "—"}
                </span>
                <span className="block text-[10px] text-text-secondary mt-1">Weighted batch average</span>
              </>
            )}
          </div>
        </Card>

        {/* Total Offers */}
        <Card className="flex flex-col justify-between p-5" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Offers</span>
            <div className="p-1.5 bg-soft-red text-primary-red rounded">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            {kpiLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <span className="text-2xl font-extrabold text-text-primary">
                  {totalStudents?.totalOffers ?? "—"}
                </span>
                <span className="block text-[10px] text-text-secondary mt-1">Total offers received</span>
              </>
            )}
          </div>
        </Card>

      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

        {/* Bar chart — avg package by dept */}
        <div>
          <h2 className="text-base font-extrabold text-text-primary mb-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-primary-red mr-2" />
            Average Package by Department (LPA)
          </h2>
          {deptLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-red" />
            </div>
          ) : barChartData.length > 0 ? (
            <InteractiveChart type="bar" data={barChartData} yLabel="Average Salary (LPA)" />
          ) : (
            <div className="flex items-center justify-center h-48 text-text-secondary text-sm bg-card rounded-xl border border-border-custom">
              No department data for {selectedYear?.year ?? "this year"}.
            </div>
          )}
        </div>

        {/* Donut chart — sector wise */}
        <div>
          <h2 className="text-base font-extrabold text-text-primary mb-4 flex items-center">
            <Building className="h-4 w-4 text-primary-red mr-2" />
            Placement Distribution by Sector
          </h2>
          {sectorLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-red" />
            </div>
          ) : sectorData.length > 0 ? (
            <InteractiveChart type="donut" data={sectorData} />
          ) : (
            <div className="flex items-center justify-center h-48 text-text-secondary text-sm bg-card rounded-xl border border-border-custom">
              No sector data for {selectedYear?.year ?? "this year"}.
            </div>
          )}
        </div>

      </div>

      {/* ── Department Table ── */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-text-primary">
          Detailed Department Performance Breakdown
        </h2>

        {deptLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : departments.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-text-secondary text-sm bg-card rounded-xl border border-border-custom">
            No department data available for {selectedYear?.year ?? "this year"}.
          </div>
        ) : (
          <div className="bg-card border border-border-custom rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-custom">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Placed
                    </th>
                    {/* <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Placement %
                    </th> */}
                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Avg Package
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-custom">
                  {departments.map((dept) => {
                    return (
                      <tr key={`${dept.dept}-${dept.deptCode}`} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-text-primary">
                          {dept.dept}
                          {dept.deptCode && (
                            <span className="ml-1.5 text-xs font-normal text-text-secondary">({dept.deptCode})</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-text-primary text-center">
                          {dept.placedCount}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm font-extrabold text-primary-red">0%</span>
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                              <div className="bg-primary-red h-full rounded-full" style={{ width: `$0%` }} />
                            </div>
                          </div>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-text-primary text-right">
                          {dept.avgPackage > 0 ? `${dept.avgPackage.toFixed(2)} LPA` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
