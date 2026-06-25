"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Globe, Building, ShieldCheck, Briefcase, Award } from "lucide-react";
import { cmsService, PlacementPoster } from "@/services/cms";
import { Card } from "@/components/ui/old/Card";
import { Badge } from "@/components/ui/old/Badge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PlacementDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [poster, setPoster] = useState<PlacementPoster | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const data = await cmsService.getPlacementPosterBySlug(slug);
        setPoster(data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoster();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-red"></div>
      </div>
    );
  }

  if (!poster) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 -mt-[4.25rem]">
        <h2 className="text-2xl font-extrabold text-text-primary">Campaign Not Found</h2>
        <p className="text-sm text-text-secondary">The placement campaign you requested does not exist or has been archived.</p>
        <Link href="/placements" className="inline-flex items-center text-xs font-bold text-primary-red hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Directory
        </Link>
      </div>
    );
  }

  // Brand gradient generator for cards
  const getBrandGradient = (name: string) => {
    switch (name.toUpperCase()) {
      case "MICROSOFT": return "from-indigo-600 to-blue-800";
      case "GOOGLE": return "from-blue-600 to-indigo-800";
      case "NVIDIA": return "from-green-600 to-emerald-800";
      case "ORACLE": return "from-red-600 to-rose-800";
      default: return "from-slate-800 to-slate-900";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-8">
      
      {/* Back CTA */}
      <Link href="/placements" className="inline-flex items-center text-xs font-bold text-text-secondary hover:text-text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Placements Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Poster & Company Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Aesthetic HTML Poster Placeholder (Aspect ratio 4:5) */}
          <div className={`w-full aspect-[4/5] bg-gradient-to-br ${getBrandGradient(poster.companyName)} text-white rounded-2xl shadow-xl flex flex-col justify-between p-8 relative overflow-hidden group`}>
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Header info */}
            <div className="flex justify-between items-start z-10">
              <span className="px-3 py-1 rounded bg-white/10 text-[10px] font-bold uppercase tracking-widest border border-white/15 backdrop-blur-xs">
                SCTCE Placement Wing
              </span>
              <Badge variant="red" className="bg-white/15 border-none text-white backdrop-blur-xs text-[10px]">
                {poster.year} Campaign
              </Badge>
            </div>

            {/* Middle Logo block */}
            <div className="space-y-4 my-auto z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-3xl font-black tracking-wider">
                {poster.companyLogo}
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-black tracking-tight uppercase leading-none">{poster.companyName}</h3>
                <p className="text-sm text-white/80">{poster.roleName}</p>
              </div>
            </div>

            {/* Bottom Metrics */}
            <div className="border-t border-white/10 pt-5 space-y-2 z-10">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-white/60 uppercase tracking-wider block">Total Recruits</span>
                  <span className="text-2xl font-bold text-white">{poster.placementCount} Students</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/60 uppercase tracking-wider block">Salary Package</span>
                  <span className="text-2xl font-black text-white">{poster.packageValue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Card */}
          {poster.companyDetails && (
            <Card className="p-6" hoverEffect={false}>
              <h3 className="font-extrabold text-sm text-text-primary mb-4 flex items-center">
                <Building className="h-4 w-4 text-primary-red mr-2" />
                About Recruiting Partner
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {poster.companyDetails.description}
              </p>
              
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Sector</span>
                  <span className="font-bold text-text-primary">{poster.companyDetails.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Website</span>
                  <a
                    href={poster.companyDetails.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary-red hover:underline flex items-center"
                  >
                    Visit Site
                    <Globe className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </Card>
          )}

        </div>

        {/* Right Column: Campaign Details & Selected Students List */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Overview details */}
          <Card className="p-6" hoverEffect={false}>
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-2">
              {poster.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="red">{poster.date}</Badge>
              <Badge variant="info">{poster.packageValue} Package</Badge>
              <Badge variant="active">{poster.placementCount} Placement Offers</Badge>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {poster.description}
            </p>
          </Card>

          {/* Student selection lists */}
          <Card className="p-6" hoverEffect={false}>
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-text-primary flex items-center">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 mr-2" />
                  Placement Select Log
                </h3>
                <span className="text-[10px] text-text-secondary mt-0.5 block">Verified by SCTCE CGPU Audit Board</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                Audited & Confirmed
              </span>
            </div>

            {/* Selection Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-text-secondary font-bold">
                    <th className="pb-3 w-8">#</th>
                    <th className="pb-3">Candidate Name</th>
                    <th className="pb-3">Department Branch</th>
                    <th className="pb-3">Offered Role</th>
                    <th className="pb-3 text-right">Package</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-text-primary">
                  {poster.highlights.map((student, index) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-semibold text-text-secondary">{index + 1}</td>
                      <td className="py-3 font-bold flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-soft-red text-[9px] font-extrabold text-primary-red flex items-center justify-center">
                          {student.studentName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span>{student.studentName}</span>
                      </td>
                      <td className="py-3 text-text-secondary">{student.department.split(" (")[0]}</td>
                      <td className="py-3 font-medium text-text-secondary">{student.role}</td>
                      <td className="py-3 text-right font-extrabold text-primary-red">{student.salaryPackage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
