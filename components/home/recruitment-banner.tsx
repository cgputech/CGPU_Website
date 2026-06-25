"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "../ui/badge";
import { listRecruiters } from "@/services/recruiters";
import { Recruiter } from "@/services/types/db";

interface CompanyIconProps {
  company: Recruiter;
}

const CompanyIcon = ({ company }: CompanyIconProps) => (
  <div className="flex w-40 shrink-0 flex-col items-center gap-3">
    <div className="relative h-24 w-32">
      {company.logo_url ? (
        <Image
          src={company.logo_url}
          alt={company.company_name}
          fill
          sizes="128px"
          className="object-contain"
          priority
        />
      ) : null}
    </div>

    <p className="text-center text-sm font-medium">
      {company.company_name}
    </p>
  </div>
);

async function fetchRelevantRecruiters() {
  const recruiters = await listRecruiters();

  const companies = [
    "Zoho",
    "Wipro",
    "Quest Global",
    "Oracle",
    "Mu-Sigma",
    "InApp",
    "EY",
  ];

  return recruiters.filter((r) => companies.includes(r.company_name));
}

function AnimatedRow({
  recruiters,
  reverse = false,
}: {
  recruiters: Recruiter[];
  reverse?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!rowRef.current) return;

    const resize = () => {
      setDistance(rowRef.current!.scrollWidth);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(rowRef.current);

    return () => observer.disconnect();
  }, [recruiters]);

  if (recruiters.length === 0) return null;

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex"
        animate={
          distance > 0
            ? { x: reverse ? [-distance, 0] : [0, -distance] }
            : undefined
        }
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {/* This is the element we measure — it must always mount */}
        <div ref={rowRef} className="flex shrink-0 items-center gap-12 md:gap-16 pr-12 md:pr-16">
          {recruiters.map((company) => (
            <CompanyIcon key={company.company_name} company={company} />
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-12 md:gap-16 pr-12 md:pr-16">
          {recruiters.map((company) => (
            <CompanyIcon
              key={`${company.company_name}-copy`}
              company={company}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function RecruitmentBanner() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);

  useEffect(() => {
    fetchRelevantRecruiters().then(setRecruiters);
  }, [recruiters]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mt-16 md:mt-24 pt-16 md:pt-24 border-t border-border-custom border-dashed"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-2">Recruiters</Badge>

        <h2 className="mb-12 md:mb-16 text-4xl font-bold">
          Trusted by{" "}
          <span className="italic text-destructive">100+</span>{" "}
          companies worldwide
        </h2>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-card to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-card to-transparent" />

          <div className="space-y-12 md:space-y-16">
            <AnimatedRow recruiters={recruiters} />
            <AnimatedRow recruiters={recruiters} reverse />
          </div>
        </div>

        <Link
          href="/recruiters"
          className="mt-14 md:mt-16 inline-flex items-center text-sm font-semibold text-primary-red hover:text-primary-red-hover transition-colors"
        >
          Explore Recruiter Directory
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}