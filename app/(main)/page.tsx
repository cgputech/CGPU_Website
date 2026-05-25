"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Award, 
  Briefcase, 
  ArrowRight, 
  GraduationCap, 
  Bell, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Download,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText,
  Building
} from "lucide-react";
import { 
  cmsService, 
  YearStats, 
  Recruiter, 
  SuccessStory, 
  Announcement, 
  PlacementPoster, 
  PlacementReport 
} from "@/services/cms";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function Home() {
  const [stats, setStats] = useState<YearStats | null>(null);
  const [allStats, setAllStats] = useState<YearStats[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [posters, setPosters] = useState<PlacementPoster[]>([]);
  const [reports, setReports] = useState<PlacementReport[]>([]);
  const [loading, setLoading] = useState(true);

  // States for interactive components
  const [activePosterIndex, setActivePosterIndex] = useState(0);
  const [reportYearFilter, setReportYearFilter] = useState<string>("All");
  
  // Autoplay for poster carousel
  const carouselTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsList = await cmsService.getStatistics();
        const recruitersList = await cmsService.getRecruiters();
        const storiesList = await cmsService.getSuccessStories();
        const announcementsList = await cmsService.getAnnouncements();
        const postersList = await cmsService.getPlacementPosters();
        const reportsList = await cmsService.getReports();

        setAllStats(statsList);
        setStats(statsList[0]); // Current year (2025)
        setRecruiters(recruitersList);
        setStories(storiesList);
        setAnnouncements(announcementsList);
        setPosters(postersList);
        setReports(reportsList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Autoplay effect for placement posters
  useEffect(() => {
    if (posters.length === 0) return;
    
    const startTimer = () => {
      carouselTimer.current = setInterval(() => {
        setActivePosterIndex((prevIndex) => (prevIndex + 1) % posters.length);
      }, 5000);
    };

    startTimer();
    return () => {
      if (carouselTimer.current) clearInterval(carouselTimer.current);
    };
  }, [posters]);

  const handlePrevPoster = () => {
    if (carouselTimer.current) clearInterval(carouselTimer.current);
    setActivePosterIndex((prevIndex) => (prevIndex - 1 + posters.length) % posters.length);
  };

  const handleNextPoster = () => {
    if (carouselTimer.current) clearInterval(carouselTimer.current);
    setActivePosterIndex((prevIndex) => (prevIndex + 1) % posters.length);
  };

  // Filtered reports
  const filteredReports = reportYearFilter === "All"
    ? reports
    : reports.filter(r => r.year === reportYearFilter);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  } as const;

  const stagger = {
    animate: { transition: { staggerChildren: 0.1 } }
  } as const;

  // Custom counter animation hook simulation
  const [offersCount, setOffersCount] = useState(0);
  const [recruitersCount, setRecruitersCount] = useState(0);
  const [rateCount, setRateCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    const duration = 1500;
    const steps = 60;
    const intervalTime = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setOffersCount(Math.min(Math.round((1200 / steps) * step), 1200));
      setRecruitersCount(Math.min(Math.round((300 / steps) * step), 300));
      setRateCount(Math.min(Math.round((92 / steps) * step), 92));
      
      if (step >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-red"></div>
        <span className="mt-4 text-xs font-semibold text-text-secondary tracking-wider uppercase">
          Loading Outcomes Platform...
        </span>
      </div>
    );
  }

  // Brand color mapping for recruiter logos (simulation of color transition)
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
    <div className="relative overflow-hidden bg-background">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-32 border-b border-border-custom bg-white overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="inline-flex items-center space-x-2 px-3 py-1 bg-soft-red border border-red-200/50 rounded-full"
              >
                <Award className="h-4 w-4 text-primary-red" />
                <span className="text-xs font-semibold text-primary-red uppercase tracking-wider">
                  Accredited Tier-1 Engineering Outcomes
                </span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.1]"
              >
                Fueling Innovation by Connecting{" "}
                <span className="text-primary-red relative inline-block">
                  Top-Tier Talent
                  <span className="absolute bottom-2 left-0 w-full h-2 bg-soft-red -z-10" />
                </span>{" "}
                With Global Leaders.
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed"
              >
                The Placement & Career Guidance Unit (CGPU) of SCTCE facilitates premium hiring drives, industry-backed training campaigns, and internships to accelerate engineering success.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link
                  href="/statistics"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-md shadow-sm text-white bg-primary-red hover:bg-primary-red-hover transition-colors"
                >
                  Placement Statistics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/recruiters"
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-border-custom text-sm font-semibold rounded-md text-text-primary bg-card hover:bg-slate-50 transition-colors"
                >
                  Top Recruiters
                  <ArrowUpRight className="ml-2 h-4 w-4 text-text-secondary" />
                </Link>
              </motion.div>
            </div>

            {/* Right Visual Floating Card Stack */}
            <div className="lg:col-span-5 relative h-[380px] w-full flex items-center justify-center select-none">
              
              {/* Card 1: Google Placement Success */}
              <motion.div
                drag
                dragConstraints={{ left: -120, right: 120, top: -120, bottom: 120 }}
                dragElastic={0.15}
                whileDrag={{ scale: 1.05, cursor: "grabbing", boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  y: [-10, 10, -10],
                  scale: 1,
                  transition: { 
                    y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                    opacity: { duration: 0.6 }
                  } 
                }}
                className="absolute top-0 right-4 w-72 bg-white border border-border-custom rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] z-20 cursor-grab active:cursor-grabbing touch-none animate-none"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active Drive Success</span>
                  </div>
                  <Badge variant="red">42.5 LPA</Badge>
                </div>
                <h4 className="font-extrabold text-sm text-text-primary mb-1">Google Selection Campaign</h4>
                <p className="text-[11px] text-text-secondary mb-3">4 Associate Software Engineers secured international standard packages.</p>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold border border-white">LI</span>
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold border border-white">DS</span>
                  </div>
                  <span className="text-[9px] text-text-secondary font-medium">Verified by SCTCE CGPU Coordinator</span>
                </div>
              </motion.div>

              {/* Card 2: Recruiter Metrics */}
              <motion.div
                drag
                dragConstraints={{ left: -120, right: 120, top: -120, bottom: 120 }}
                dragElastic={0.15}
                whileDrag={{ scale: 1.05, cursor: "grabbing", boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  y: [10, -10, 10],
                  scale: 1,
                  transition: { 
                    y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                    opacity: { duration: 0.8 }
                  } 
                }}
                className="absolute bottom-4 left-4 w-64 bg-white border border-border-custom rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] z-10 cursor-grab active:cursor-grabbing touch-none animate-none"
              >
                <div className="flex items-center space-x-2.5 mb-3">
                  <div className="p-2 bg-soft-red rounded-lg text-primary-red">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-text-primary">Recruiting Core</h5>
                    <span className="text-[9px] text-text-secondary">Fortune 500 Network</span>
                  </div>
                </div>
                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Active Partners</span>
                    <span className="font-bold text-text-primary">300+ Companies</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Average Package</span>
                    <span className="font-bold text-primary-red">8.4 LPA</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Mini Stat Indicator */}
              <motion.div
                drag
                dragConstraints={{ left: -120, right: 120, top: -120, bottom: 120 }}
                dragElastic={0.15}
                whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: [0, 15, 0],
                  transition: { 
                    x: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                    opacity: { duration: 0.7 }
                  } 
                }}
                className="absolute top-1/2 left-8 -translate-y-1/2 bg-primary-red text-white rounded-xl py-2 px-3.5 shadow-md flex items-center space-x-2 z-30 cursor-grab active:cursor-grabbing touch-none animate-none"
              >
                <Sparkles className="h-4 w-4 animate-spin-slow" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase">94.2% Placed</span>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. PLACEMENT STATISTICS METRIC STRIP */}
      <section className="py-12 border-b border-border-custom bg-card relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y-0 divide-x-0 sm:divide-x sm:divide-border-custom"
          >
            {/* Stat item */}
            <motion.div variants={fadeInUp} className="text-center px-4 flex flex-col justify-center">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-red tracking-tight">
                {offersCount}+
              </span>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-2 block">
                Offers Secured
              </span>
              <span className="text-[11px] text-text-secondary mt-0.5 block">
                Across Engineering Branches
              </span>
            </motion.div>

            {/* Stat item */}
            <motion.div variants={fadeInUp} className="text-center px-4 pt-6 sm:pt-0 flex flex-col justify-center">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
                {recruitersCount}+
              </span>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-2 block">
                Top Recruiters
              </span>
              <span className="text-[11px] text-text-secondary mt-0.5 block">
                Corporate & Tech Alliances
              </span>
            </motion.div>

            {/* Stat item */}
            <motion.div variants={fadeInUp} className="text-center px-4 pt-6 lg:pt-0 flex flex-col justify-center">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
                45 LPA
              </span>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-2 block">
                Highest Package
              </span>
              <span className="text-[11px] text-text-secondary mt-0.5 block">
                Secured at Tier-1 MNC
              </span>
            </motion.div>

            {/* Stat item */}
            <motion.div variants={fadeInUp} className="text-center px-4 pt-6 lg:pt-0 flex flex-col justify-center">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
                {rateCount}%
              </span>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-2 block">
                Placement Rate
              </span>
              <span className="text-[11px] text-text-secondary mt-0.5 block">
                For Eligible Candidates
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. RECENT PLACEMENT POSTERS CAROUSEL */}
      <section className="py-16 md:py-24 border-b border-border-custom bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary-red uppercase tracking-widest block">Outcomes In Action</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
                Recent Placement Success Campaigns
              </h2>
              <p className="text-sm text-text-secondary">
                Explore recruitment highlights of major corporate drives featuring student select lists.
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button 
                onClick={handlePrevPoster}
                className="p-2 border border-border-custom rounded-lg hover:bg-slate-50 transition-colors text-text-secondary hover:text-text-primary cursor-pointer"
                aria-label="Previous Poster"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={handleNextPoster}
                className="p-2 border border-border-custom rounded-lg hover:bg-slate-50 transition-colors text-text-secondary hover:text-text-primary cursor-pointer"
                aria-label="Next Poster"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* JSON-LD Schema for AI and Google Search SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "Sree Chitra Thirunal College of Engineering (SCTCE) - CGPU Placement Cell",
                "url": "https://www.sctce.ac.in",
                "logo": "https://www.sctce.ac.in/logo.png",
                "sameAs": [
                  "https://linkedin.com/school/sree-chitra-thirunal-college-of-engineering"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+91-471-2490572",
                  "contactType": "Placement Office",
                  "email": "placement@sctce.ac.in",
                  "areaServed": "IN"
                },
                "award": "NBA & NAAC Accredited Tier-1 Engineering Outcomes",
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "INR",
                  "highPrice": "4500000",
                  "lowPrice": "500000",
                  "offerCount": "1200"
                }
              })
            }}
          />

          {/* Active Poster Display (Aesthetic HTML Placeholder Poster Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Poster Card Left Placeholder (Aspect ratio 4:5 representation) */}
            <div className="lg:col-span-5 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activePosterIndex}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-[340px] aspect-[4/5] relative rounded-2xl overflow-hidden shadow-xl border border-border-custom group"
                >
                  {posters[activePosterIndex]?.posterImage ? (
                    <img 
                      src={posters[activePosterIndex].posterImage} 
                      alt={posters[activePosterIndex].title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 p-6 flex flex-col justify-between text-white">
                      {/* Poster Header */}
                      <div className="flex justify-between items-start z-10">
                        <span className="px-3 py-1 rounded bg-white/10 text-[9px] font-bold uppercase tracking-widest border border-white/15 backdrop-blur-xs">
                          SCTCE Campus Placement
                        </span>
                        <Badge variant="red" className="bg-primary-red/80 border-none text-white">
                          {posters[activePosterIndex]?.year} Drive
                        </Badge>
                      </div>

                      {/* Company Showcase */}
                      <div className="space-y-4 my-auto z-10">
                        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-black tracking-widest border border-white/20">
                          {posters[activePosterIndex]?.companyLogo}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black tracking-tight">{posters[activePosterIndex]?.companyName.toUpperCase()}</h3>
                          <p className="text-xs text-slate-300 font-medium">{posters[activePosterIndex]?.roleName}</p>
                        </div>
                      </div>

                      {/* Highlights Summary */}
                      <div className="border-t border-white/10 pt-4 space-y-3 z-10">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Placement Offers</span>
                            <span className="text-2xl font-bold text-white">{posters[activePosterIndex]?.placementCount} Offers</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Highest Package</span>
                            <span className="text-2xl font-extrabold text-primary-red">{posters[activePosterIndex]?.packageValue}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>


            {/* Poster Details and Students Grid Right */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePosterIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                      {posters[activePosterIndex]?.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                      {posters[activePosterIndex]?.description}
                    </p>
                  </div>

                  {/* Student Highlight Listing */}
                  <div>
                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">
                      Selected Candidates Spotlight
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {posters[activePosterIndex]?.highlights.slice(0, 4).map((student) => (
                        <div 
                          key={student.id} 
                          className="flex items-center space-x-3 p-3 bg-card border border-border-custom rounded-xl"
                        >
                          <div className="w-8 h-8 rounded-full bg-soft-red flex items-center justify-center text-[11px] font-extrabold text-primary-red">
                            {student.studentName.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-text-primary block leading-none">{student.studentName}</span>
                            <span className="text-[10px] text-text-secondary mt-0.5 block">{student.department.split(" (")[0]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA link */}
                  <div className="pt-4 flex items-center space-x-4">
                    <Link
                      href={`/placements/${posters[activePosterIndex]?.slug}`}
                      className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-primary-red hover:bg-primary-red-hover rounded shadow-xs transition-colors"
                    >
                      View Details & Complete Selection List
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                    <span className="text-xs text-text-secondary">
                      {posters[activePosterIndex]?.highlights.length} total students selected in this batch.
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* 4. RECRUITERS SECTION */}
      <section className="py-16 md:py-24 border-b border-border-custom bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-primary-red uppercase tracking-widest block">Recruitment Alliances</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
              Industry Leaders Trust SCTCE Graduates
            </h2>
            <p className="text-sm text-text-secondary">
              Graduating engineering students secure placements across core and software technical domains.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recruiters.map((company) => (
              <div
                key={company.id}
                className={`p-5 border border-border-custom rounded-xl bg-card shadow-[0_1px_4px_rgba(0,0,0,0.01)] transition-all duration-300 flex flex-col justify-center items-center h-28 group ${getBrandColors(company.name)}`}
              >
                <span className="text-lg font-black tracking-widest text-text-secondary group-hover:text-inherit transition-colors">
                  {company.logo}
                </span>
                <span className="font-bold text-xs mt-2 block text-text-primary group-hover:text-inherit">
                  {company.name}
                </span>
                <span className="text-[9px] font-medium text-text-secondary mt-1 block group-hover:text-inherit">
                  {company.sector}
                </span>
              </div>
            ))}
          </div>

          <div>
            <Link
              href="/recruiters"
              className="inline-flex items-center text-xs font-bold text-primary-red hover:text-primary-red-hover"
            >
              Explore Recruiter Directory
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. LATEST PLACEMENTS FEED (ticker) */}
      <section className="py-8 bg-slate-900 border-b border-slate-800 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

        <div className="relative flex overflow-x-hidden">
          <div className="animate-scroll flex items-center space-x-12 py-2">
            {[
              "Rahul placed at Oracle – 18.0 LPA",
              "Ananya placed at NVIDIA – 36.0 LPA",
              "Vivek placed at TCS Digital – 9.0 LPA",
              "Lorem Ipsum A placed at Microsoft – 45.0 LPA",
              "Lorem Ipsum B placed at Google – 42.5 LPA",
              "Dolor Sit A placed at JP Morgan Chase – 14.0 LPA",
              "Amet Consectetur placed at Tata Motors – 10.8 LPA"
            ].concat([
              "Rahul placed at Oracle – 18.0 LPA",
              "Ananya placed at NVIDIA – 36.0 LPA",
              "Vivek placed at TCS Digital – 9.0 LPA",
              "Lorem Ipsum A placed at Microsoft – 45.0 LPA",
              "Lorem Ipsum B placed at Google – 42.5 LPA",
              "Dolor Sit A placed at JP Morgan Chase – 14.0 LPA",
              "Amet Consectetur placed at Tata Motors – 10.8 LPA"
            ]).map((text, index) => (
              <div
                key={`${text}-${index}`}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-300 tracking-wider whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 bg-primary-red rounded-full"></span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STUDENT SUCCESS STORIES */}
      <section className="py-16 md:py-24 border-b border-border-custom bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-xl mb-12 space-y-2">
            <span className="text-xs font-bold text-primary-red uppercase tracking-widest block">Success Stories</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
              Voices of Achievements
            </h2>
            <p className="text-sm text-text-secondary">
              Read how engineering students transformed academic preparation into competitive industry offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stories.slice(0, 4).map((story) => (
              <Card key={story.id} className="h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-full bg-soft-red flex items-center justify-center font-extrabold text-xs text-primary-red">
                        {story.studentName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-text-primary leading-tight">{story.studentName}</h4>
                        <span className="text-[9px] text-text-secondary block mt-0.5">{story.department.split(" (")[0]}</span>
                      </div>
                    </div>
                    <Badge variant="red" className="text-[10px]">{story.salaryPackage}</Badge>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed italic">
                    "{story.testimonial}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-text-primary flex items-center uppercase tracking-wider">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-1" />
                    Placed: {story.companyName}
                  </span>
                  <a
                    href={story.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] font-bold text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    LinkedIn
                    <ArrowUpRight className="ml-0.5 h-2.5 w-2.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* 7. TRAINING & ECOSYSTEM SECTION */}
      <section className="py-16 md:py-24 border-b border-border-custom bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-xl mb-12 space-y-2">
            <span className="text-xs font-bold text-primary-red uppercase tracking-widest block">Preparation Culture</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
              Our Training Ecosystem
            </h2>
            <p className="text-sm text-text-secondary">
              We focus on coding competencies, hardware design labs, workshops, and student-run clubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="flex items-start space-x-4">
              <div className="p-3 bg-soft-red text-primary-red rounded-xl flex-shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-text-primary mb-1">Pre-Placement Coding Tracks</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Rigorous algorithms bootcamps, mock interviews, and assessment channels to match top technical expectations.
                </p>
              </div>
            </Card>

            <Card className="flex items-start space-x-4">
              <div className="p-3 bg-soft-red text-primary-red rounded-xl flex-shrink-0">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-text-primary mb-1">Core Industrial Internships</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Practical research internships with leaders in semiconductor (Nvidia), production, and hardware designing sectors.
                </p>
              </div>
            </Card>

            <Card className="flex items-start space-x-4">
              <div className="p-3 bg-soft-red text-primary-red rounded-xl flex-shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-text-primary mb-1">IEEE & Technical Activities</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Active association networks, 36-hour prototyping hackathons, and design chapters driven by student engineers.
                </p>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* 8. ANALYTICS PREVIEW */}
      <section className="py-16 md:py-24 border-b border-border-custom bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold text-primary-red uppercase tracking-widest block">Data Transparency</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary leading-tight">
                Audited Placement Trends
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Analyze salary distributions, hiring outcomes, and recruiting records tracked continuously. Look at detailed breakdowns across our engineering streams.
              </p>
              <div className="pt-2">
                <Link
                  href="/statistics"
                  className="inline-flex items-center text-xs font-bold text-primary-red hover:text-primary-red-hover"
                >
                  View Full Statistics →
                </Link>
              </div>
            </div>

            {/* Mini SVG hiring trend chart */}
            <div className="lg:col-span-7 bg-background border border-border-custom rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider">Average Package Growth</h4>
                  <span className="text-[10px] text-text-secondary">Audited B.Tech outcomes</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  +12.6% YoY
                </span>
              </div>
              
              {/* Mini SVG Chart layout */}
              <div className="h-44 w-full flex items-end justify-between px-6 pt-4 border-b border-slate-200 relative">
                {/* Y-axis gridlines */}
                <div className="absolute left-0 right-0 top-1/4 border-t border-slate-100 border-dashed"></div>
                <div className="absolute left-0 right-0 top-2/4 border-t border-slate-100 border-dashed"></div>
                <div className="absolute left-0 right-0 top-3/4 border-t border-slate-100 border-dashed"></div>

                {/* 2023 Bar */}
                <div className="flex flex-col items-center w-16 group z-10">
                  <div className="w-12 bg-primary-red/10 group-hover:bg-primary-red/20 border border-primary-red/20 rounded-t h-28 flex flex-col justify-end transition-all duration-300">
                    <span className="text-[9px] font-bold text-primary-red text-center mb-1">7.2 LPA</span>
                  </div>
                  <span className="text-[10px] text-text-secondary mt-2 font-semibold">2023</span>
                </div>

                {/* 2024 Bar */}
                <div className="flex flex-col items-center w-16 group z-10">
                  <div className="w-12 bg-primary-red/20 group-hover:bg-primary-red/30 border border-primary-red/35 rounded-t h-32 flex flex-col justify-end transition-all duration-300">
                    <span className="text-[9px] font-bold text-primary-red text-center mb-1">7.9 LPA</span>
                  </div>
                  <span className="text-[10px] text-text-secondary mt-2 font-semibold">2024</span>
                </div>

                {/* 2025 Bar */}
                <div className="flex flex-col items-center w-16 group z-10">
                  <div className="w-12 bg-primary-red group-hover:bg-primary-red-hover rounded-t h-36 flex flex-col justify-end transition-all duration-300">
                    <span className="text-[9px] font-bold text-white text-center mb-1">8.4 LPA</span>
                  </div>
                  <span className="text-[10px] text-text-primary mt-2 font-bold">2025</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. REPORTS SECTION */}
      <section id="reports" className="py-16 md:py-24 border-b border-border-custom bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary-red uppercase tracking-widest block">Transparency Reports</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
                Annual Placement Brochures
              </h2>
              <p className="text-sm text-text-secondary">
                Download verified placement metrics audit briefs compiled for each academic year.
              </p>
            </div>
            
            {/* Year Filters */}
            <div className="flex items-center space-x-1.5 mt-4 md:mt-0">
              {["All", "2025", "2024", "2023"].map((y) => (
                <button
                  key={y}
                  onClick={() => setReportYearFilter(y)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer ${
                    reportYearFilter === y
                      ? "bg-primary-red text-white border-primary-red shadow-xs"
                      : "bg-card text-text-secondary border-border-custom hover:bg-slate-50"
                  }`}
                >
                  {y === "All" ? "All Years" : `${y} Brochure`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="flex flex-col justify-between" hoverEffect={false}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-soft-red text-primary-red rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <Badge variant="red">{report.year} Batch</Badge>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-text-primary mb-1">{report.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{report.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-text-secondary font-medium">PDF File Size: {report.fileSize}</span>
                  <a
                    href={report.downloadUrl}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-primary-red hover:text-primary-red-hover"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download PDF
                  </a>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* 10. CALL TO ACTION NOTICE PANEL (Replacement of CTA strip) */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-xl font-extrabold text-text-primary flex items-center">
                <Bell className="h-5 w-5 text-primary-red mr-2" />
                Latest Announcements
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ongoing guidelines, scheduling alerts, and registration deadlines broadcasted by the SCTCE CGPU cell.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {announcements.map((item) => (
                <div key={item.id} className="p-4 border border-border-custom bg-card rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] text-text-secondary font-bold">{item.date}</span>
                      <Badge variant={item.important ? "red" : "default"} className="text-[9px] px-1.5 py-0.25">
                        {item.category}
                      </Badge>
                    </div>
                    <h4 className="font-extrabold text-xs text-text-primary mb-1">{item.title}</h4>
                    <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
