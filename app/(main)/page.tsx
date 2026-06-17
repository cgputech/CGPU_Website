"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
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
  ChevronLeft,
  ChevronRight,
  FileText,
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
import { Card } from "@/components/ui/old/Card";
import { Badge } from "@/components/ui/old/Badge";
import PlacementCarousel from "@/components/home/carousel";
import TestimonialSection from "@/components/home/testimonial";

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
      <section className="relative overflow-hidden border-b border-border-custom bg-background top-0">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--soft-red),transparent_70%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-custom to-transparent" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-28 md:py-36">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cgpu-header-logo.png"
              alt="CGPU SCTCE"
              className="mx-auto h-16 w-auto object-contain sm:h-20 md:h-24"
            />
          </motion.div>

          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-[11px] font-medium uppercase tracking-[0.28em] text-text-secondary"
          >
            Career Guidance & Placement Unit
          </motion.p>

          <motion.h1
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mt-5 font-sans text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.03em] text-text-primary sm:text-6xl md:text-7xl"
          >
            <span className="block sm:inline">CGPU</span>
            <span
              className="mx-2 hidden font-extralight text-text-secondary/30 sm:inline"
              aria-hidden
            >
              /
            </span>
            <span className="mt-1 block font-medium tracking-[-0.02em] text-text-primary sm:mt-0 sm:inline">
              SCTCE
            </span>
          </motion.h1>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mt-6 h-px w-12 bg-primary-red/60"
            aria-hidden
          />

          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mt-6 max-w-lg text-base font-normal leading-[1.75] text-text-secondary sm:text-lg sm:leading-relaxed"
          >
            Connecting industry-ready graduates with leading recruiters through
            placements, training, and career guidance at Sree Chitra Thirunal
            College of Engineering, Thiruvananthapuram.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/placements"
              className="inline-flex items-center gap-2 rounded-full bg-primary-red px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-red-hover"
            >
              View Placements
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/statistics"
              className="inline-flex items-center gap-2 rounded-full border border-border-custom px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-muted/60"
            >
              Statistics
              <ArrowUpRight className="size-4 text-text-secondary" />
            </Link>
          </motion.div>
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
      <PlacementCarousel />

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
      <TestimonialSection />

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
