"use client";

import { useEffect, useState } from "react";
import { cmsService, YearStats, Recruiter } from "@/services/cms";
import { Card } from "@/components/ui/old/Card";
import InteractiveChart from "@/components/ui/old/InteractiveChart";
import { 
  TrendingUp, 
  DollarSign, 
  Building, 
  Percent, 
  Award,
  ChevronDown
} from "lucide-react";

export default function StatisticsPage() {
  const [allStats, setAllStats] = useState<YearStats[]>([]);
  const [selectedYearIndex, setSelectedYearIndex] = useState(0);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await cmsService.getStatistics();
        const recs = await cmsService.getRecruiters();
        setAllStats(stats);
        setRecruiters(recs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeStats = allStats[selectedYearIndex];

  // Prepare sector share data for donut chart
  const getSectorShareData = () => {
    if (!recruiters.length) return [];
    
    // Group recruiters by sector and sum their placements (mock placements: 30 for top, 10 for others)
    const sectorGroups: Record<string, number> = {};
    recruiters.forEach(rec => {
      const value = rec.topRecruiter ? 25 : 12;
      sectorGroups[rec.sector] = (sectorGroups[rec.sector] || 0) + value;
    });

    return Object.entries(sectorGroups).map(([label, value]) => ({
      label,
      value
    }));
  };

  // Prepare department performance data for bar chart
  const getDeptPerformanceData = () => {
    if (!activeStats) return [];
    return activeStats.departments.map(d => ({
      label: d.dept,
      value: d.avgPackage, // bar height represents avg package in LPA
      percentage: Math.round((d.placedCount / d.totalEligible) * 100) // shown in tooltip
    }));
  };

  if (loading || !activeStats) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-24 py-12 -mt-[--navbar-height]">
      
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border-custom pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Placement Analytics & Metrics
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Department-wise reports, package distribution statistics, and recruitment sectors.
          </p>
        </div>
        
        {/* Year Filter Dropdown */}
        <div className="relative inline-block text-left">
          <label htmlFor="year-select" className="sr-only">Select Placement Year</label>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Placement Year:</span>
            <div className="relative">
              <select
                id="year-select"
                value={selectedYearIndex}
                onChange={(e) => setSelectedYearIndex(Number(e.target.value))}
                className="appearance-none bg-card border border-border-custom text-sm text-text-primary py-2 pl-4 pr-10 rounded-md font-bold cursor-pointer hover:border-primary-red focus:outline-none transition-colors"
              >
                {allStats.map((stats, idx) => (
                  <option key={stats.year} value={idx}>
                    {stats.year} Campaign
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-text-secondary pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        
        <Card className="flex flex-col justify-between p-5" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Placed</span>
            <div className="p-1.5 bg-soft-red text-primary-red rounded">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-text-primary">{activeStats.totalOffers}</span>
            <span className="block text-[10px] text-text-secondary mt-1">Total offers received</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-5" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Success Rate</span>
            <div className="p-1.5 bg-soft-red text-primary-red rounded">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-primary-red">{activeStats.placedPercentage}%</span>
            <span className="block text-[10px] text-text-secondary mt-1">Of eligible students placed</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-5" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Highest Package</span>
            <div className="p-1.5 bg-soft-red text-primary-red rounded">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-text-primary">{activeStats.highestPackage} LPA</span>
            <span className="block text-[10px] text-text-secondary mt-1">Product technology sector</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-5" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Average Package</span>
            <div className="p-1.5 bg-soft-red text-primary-red rounded">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-text-primary">{activeStats.averagePackage} LPA</span>
            <span className="block text-[10px] text-text-secondary mt-1">Weighted batch average</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-5" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Companies</span>
            <div className="p-1.5 bg-soft-red text-primary-red rounded">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-text-primary">{activeStats.companiesVisited}</span>
            <span className="block text-[10px] text-text-secondary mt-1">Recruited during campaign</span>
          </div>
        </Card>

      </div>

      {/* Dashboard Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-base font-extrabold text-text-primary mb-4 flex items-center">
            <TrendingUp className="h-4.5 w-4.5 text-primary-red mr-2" />
            Average Package by Department (LPA)
          </h2>
          <InteractiveChart
            type="bar"
            data={getDeptPerformanceData()}
            yLabel="Average Salary (LPA)"
          />
        </div>

        <div>
          <h2 className="text-base font-extrabold text-text-primary mb-4 flex items-center">
            <Building className="h-4.5 w-4.5 text-primary-red mr-2" />
            Recruitment Distribution by Sector
          </h2>
          <InteractiveChart
            type="donut"
            data={getSectorShareData()}
          />
        </div>
      </div>

      {/* Detailed Department Placements Table */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-text-primary">
          Detailed Department Performance breakdown
        </h2>
        
        <div className="bg-card border border-border-custom rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-custom">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Engineering Department
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Eligible Students
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Placed Students
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Placement Record (%)
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Average Salary
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-border-custom">
                {activeStats.departments.map((dept) => {
                  const percent = Math.round((dept.placedCount / dept.totalEligible) * 100);
                  return (
                    <tr key={dept.dept} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-text-primary">
                        {dept.dept}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-secondary text-center">
                        {dept.totalEligible}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-text-primary text-center">
                        {dept.placedCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-sm font-extrabold text-primary-red">{percent}%</span>
                          {/* Progress indicator */}
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className="bg-primary-red h-full rounded-full" 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-text-primary text-right">
                        {dept.avgPackage.toFixed(2)} LPA
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
