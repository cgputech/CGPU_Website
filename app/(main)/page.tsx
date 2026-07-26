"use client";
import Loading from "@/app/loading";

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
import RecruitmentBanner from "@/components/home/recruitment-banner";
import Hero from "@/components/home/hero";
import RecruitmentNumbers from "@/components/home/recruitment-numbers";

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


  return (
    <div className="relative overflow-hidden">
      <Hero />
      <RecruitmentNumbers />
      <RecruitmentBanner />
      <PlacementCarousel />
      <TestimonialSection />
    </div>
  );
}
