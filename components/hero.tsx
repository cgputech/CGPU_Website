'use client';

import { useState } from "react";
import Image from 'next/image';
import { Phone, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/new-ui/Button";
import { Modal } from "@/components/new-ui/Modal";
import { PillCTA } from "@/components/new-ui/PillCTA";
import { HeroStats } from "@/components/new-ui/HeroStats";

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
      type="button"
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
    </button>
  );
}

export default function HeroSection() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <section
      id="home"
      className="w-full min-h-svh flex flex-col pt-24 pb-8 min-[840px]:pb-12 bg-black text-white overflow-x-hidden"
    >
      {/* Container: left-aligned text below 600px, centered from 600px */}
      <div className="w-full max-w-[75rem] mx-auto flex-1 flex flex-col items-start text-left min-[600px]:items-center min-[600px]:text-center px-4 min-[600px]:px-6 min-[840px]:px-8">

        {/* Tagline group */}
        <div className="w-full flex-1 flex flex-col items-start min-[600px]:items-center justify-center gap-8 min-[600px]:gap-10 py-12 min-[840px]:py-16">

          {/* Heading + subtext */}
          <div className="flex flex-col items-start min-[600px]:items-center gap-4 min-[600px]:gap-6">
            <h1 className="text-[clamp(2.25rem,1rem+3.5vw,3rem)] font-light leading-[1.2] tracking-tight text-balance text-white">
              <span className="block">Every great career starts with a good introduction.</span>
              {/* Space between the two sentences: 8px → 12px */}
              <span className="block mt-2 min-[600px]:mt-3">We make it, you make the story.</span>
            </h1>
            <p className="max-w-[60ch] text-base min-[600px]:text-lg min-[840px]:text-xl leading-normal text-pretty text-white/80">
              CGPU, Sree Chitra Thirunal College of Engineering — connecting
              students with recruiters through year-round placement drives and
              career support.
            </p>
          </div>

          {/* Actions: right-aligned column below 600px, centered row from 600px */}
          <div className="w-full self-start flex flex-col items-start gap-5 min-[600px]:w-auto min-[600px]:self-auto min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-center">
            {/* First button: 240px */}
            <div className="w-60 max-w-full [&>*]:w-full min-[600px]:w-auto min-[600px]:[&>*]:w-auto">
              <Button
                size="lg"
                variant="primary"
                onClick={() => setIsContactOpen(true)}
                aria-haspopup="dialog"
              >
                Recruit With Us
              </Button>
            </div>

            {/* Second button: wider, 288px (min 288px in the row from 600px) */}
            <div className="w-72 max-w-full [&>*]:w-full min-[600px]:w-auto min-[600px]:min-w-72">
              <PillCTA
                href="https://sctce.ac.in"
                external
                variant="glass-dark"
                size="lg"
                logo={
                  <Image
                    src="/SCTCE_logo.png"
                    alt="SCTCE Logo"
                    width={265}
                    height={190}
                    className="h-6 w-auto object-contain brightness-0 invert"
                  />
                }
              >
                SCTCE Trivandrum
              </PillCTA>
            </div>
          </div>
        </div>

        {/* Stats: pinned to the bottom of the hero */}
        <HeroStats className="w-full mb-4" />
      </div>

      {/* Contact modal (outside the container so it can't affect the flex layout) */}
      <Modal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        title="Contact Us"
      >
        <div className="flex flex-col gap-4 text-left">
          {/* Phone row */}
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-3 min-[600px]:px-4 hover:bg-black/5 transition-colors">
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="flex min-w-0 flex-1 items-center gap-3 min-h-11 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 rounded-lg"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-red/10 text-primary-red">
                <Phone size={20} />
              </div>
              <div className="min-w-0 flex flex-col gap-1">
                <p className="text-xs leading-[1.4] text-text-secondary/60 font-medium uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-sm leading-normal font-semibold text-text-primary break-words">
                  {PHONE}
                </p>
              </div>
            </a>
            <CopyButton value={PHONE} />
          </div>

          {/* Email row */}
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-3 min-[600px]:px-4 hover:bg-black/5 transition-colors">
            <a
              href={`mailto:${EMAIL}`}
              className="flex min-w-0 flex-1 items-center gap-3 min-h-11 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 rounded-lg"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-red/10 text-primary-red">
                <Mail size={20} />
              </div>
              <div className="min-w-0 flex flex-col gap-1">
                <p className="text-xs leading-[1.4] text-text-secondary/60 font-medium uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm leading-normal font-semibold text-text-primary break-words">
                  {EMAIL}
                </p>
              </div>
            </a>
            <CopyButton value={EMAIL} />
          </div>
        </div>
      </Modal>
    </section>
  );
}