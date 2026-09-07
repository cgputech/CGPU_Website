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



export default function RecruitmentBanner() {
  const [row, setRow] = useState<Recruiter[]>([]);

  useEffect(() => {
    fetchRelevantRecruiters().then((data) => {
      setRow(data);
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
     className="border border-border-custom border-dashed flex flex-col items-center overflow-hidden h-screen"
    >
      <div className="grid grid-cols-3 gap-2">
        {row.map((item, idx) => (
            <div key={idx}>
              <CompanyIcon company={item}/>
            </div>
        ))}
      </div>
    </motion.div>
  );
}
