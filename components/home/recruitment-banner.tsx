"use client";

import { cmsService, Recruiter } from "@/services/cms";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { motion } from "framer-motion";

interface CompanyIconProps {
  company: Recruiter;
}

const CompanyIcon = ({ company }: CompanyIconProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-32">
        <Image
          src="https://placehold.co/400"
          alt={`${company.name} logo`}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      <p className="text-center text-sm font-medium">{company.name}</p>
    </div>
  );
};

export default function RecruitmentBanner() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);

  useEffect(() => {
    cmsService.getRecruiters().then((data) => setRecruiters(data));
  }, [recruiters]);

  const Rows = () => {
    return recruiters.map((item, index) => {
      return <CompanyIcon company={item} key={index} />;
    });
  };

  const AnimatedRow = ({direction}: { direction: boolean }) => {
    return (
      <div>
        <motion.div
          className="flex w-max"
          animate={{ x: direction ? ["0%", "-50%"] : ['-50%', '0%' ]}}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          <div className="flex shrink-0 gap-6 mx-2">
            <Rows />
          </div>

          <div className="flex shrink-0 gap-6 mx-2">
            <Rows />
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <section className="border-b border-border-custom bg-white py-16 md:py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Badge className="mb-1">Recruiters</Badge>

        <div className="mb-6 flex flex-wrap items-baseline justify-center gap-2 font-bold">
          <span className="text-3xl text-foreground md:text-5xl">
            Trusted by
          </span>

          <span className="leading-none tracking-tight text-3xl md:text-5xl font-extrabold italic text-destructive">
            100+
          </span>

          <span className="text-3xl md:text-5xl">companies worldwide</span>
        </div>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-white to-transparent" />

          {/* Right Fade */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-white to-transparent" />
          <div className="flex flex-col gap-8">
            <AnimatedRow direction={true}/>
            <AnimatedRow direction={false}/>
          </div>
        </div>

        <div className="mt-8">
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
  );
}
