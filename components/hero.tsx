'use client';

import { listRecruiters } from "@/services/recruiters";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { Recruiter } from "@/services/types/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phone, Mail, Copy, Check } from "lucide-react";

interface CompanyIconProps {
  company: Recruiter;
}

const CompanyIcon = ({ company }: CompanyIconProps) => (
  <div className="relative h-16 w-28 grayscale hover:grayscale-0 transition-all duration-300">
    {company.logo_url ? (
      <Image
        src={company.logo_url}
        alt={company.company_name}
        fill
        sizes="112px"
        className="object-contain"
        priority
      />
    ) : null}
  </div>
);

async function fetchRelevantRecruiters() {
  const recruiters = await listRecruiters();
  const companies = ["Zoho", "Infosys", "CareStack", "InApp", "Amazon", "IBM", "Litmus7"];
  return recruiters.filter((r) => companies.includes(r.company_name));
}

const PHONE = "+91 98765 43210";
const EMAIL = "cgpu@sctce.ac.in";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
    </button>
  );
}

export default function HeroSection() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);

  useEffect(() => {
    fetchRelevantRecruiters()
      .then((data) => setRecruiters(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section
      className="w-full h-screen flex flex-col justify-center pt-20 pb-10"
      id="home"
    >
      <div className="flex flex-col gap-4 items-center justify-center max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight text-black">
          The Leading Campus Placement Program
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 max-w-3xl text-center">
          CGPU, Sree Chitra Thirunal College of Engineering — connecting
          students with recruiters through year-round placement drives and
          career support.
        </p>
        <div className="flex justify-center mt-2">
          {/* CTA 1 — Contact Us dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-48 h-12 px-3 py-4 bg-primary-red hover:bg-primary-red text-white hover:text-white text-md rounded-3xl"
                variant="outline"
              >
                Contact Us
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-light">Contact Us</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-3 mt-2">
                {/* Phone row */}
                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <a
                    href={`tel:${PHONE.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    <Phone size={18} className="text-gray-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Phone</p>
                      <p className="text-sm font-medium text-gray-800">{PHONE}</p>
                    </div>
                  </a>
                  <CopyButton value={PHONE} />
                </div>

                {/* Email row */}
                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    <Mail size={18} className="text-gray-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                      <p className="text-sm font-medium text-gray-800">{EMAIL}</p>
                    </div>
                  </a>
                  <CopyButton value={EMAIL} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}