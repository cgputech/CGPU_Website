"use client";

import { useEffect, useState } from "react";
import { cmsService, PlacementReport } from "@/services/cms";
import { Card } from "@/components/ui/old/Card";
import { Badge } from "@/components/ui/old/Badge";
import { Search, FileText, Download, AlertCircle } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState<PlacementReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<PlacementReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await cmsService.getReports();
        setReports(list);
        setFilteredReports(list);
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
    if (searchTerm.trim() === "") {
      setFilteredReports(reports);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredReports(
        reports.filter(
          (r) =>
            r.title.toLowerCase().includes(term) ||
            r.year.includes(term) ||
            r.description.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, reports]);

  const handleDownload = (reportTitle: string) => {
    alert(`Starting download for: ${reportTitle} (Mock PDF file)`);
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-24 py-12">
      
      {/* Header */}
      <div className="border-b border-border-custom pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Placement Brochures & Annual Reports
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Access official publications detailing graduation placement success records, recruiter data, and student demographics.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative mb-8">
        <label htmlFor="report-search" className="sr-only">Search reports by year or title</label>
        <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
        <input
          id="report-search"
          type="text"
          placeholder="Search reports by campaign year or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-border-custom bg-card rounded-md text-sm text-text-primary focus:outline-none focus:border-primary-red transition-colors"
        />
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border-custom rounded-xl bg-card">
          <FileText className="h-10 w-10 text-text-secondary mb-3" />
          <span className="text-sm font-semibold text-text-secondary">No placement reports found</span>
          <span className="text-xs text-text-secondary mt-1">Try searching with a different calendar year</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredReports.map((report) => (
            <Card key={report.id} className="flex flex-col justify-between p-6">
              
              <div className="space-y-4">
                {/* PDF Icon & Year Tag */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-soft-red text-primary-red rounded-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <Badge variant="red">Campaign {report.year}</Badge>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-extrabold text-base text-text-primary mb-2">
                    {report.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* Download trigger */}
              <div className="pt-6 border-t border-border-custom mt-6 flex items-center justify-between">
                <span className="text-[10px] text-text-secondary font-semibold uppercase">
                  PDF Format • {report.fileSize}
                </span>
                
                <button
                  onClick={() => handleDownload(report.title)}
                  className="inline-flex items-center px-4 py-2 bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download Report
                </button>
              </div>

            </Card>
          ))}
        </div>
      )}

      {/* Data Accuracy Disclaimer Card */}
      <Card className="bg-slate-50 border border-border-custom p-6 max-w-3xl mx-auto flex items-start space-x-4" hoverEffect={false}>
        <AlertCircle className="h-5 w-5 text-primary-red flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-text-primary mb-1">Official Data Verification</h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            The stats and outcomes compiled in these brochures represent audited reports verified against corporate placement contracts and individual appointment letters. Copies of all audit materials are held confidentially at the CGPU administrative office.
          </p>
        </div>
      </Card>

    </div>
  );
}
