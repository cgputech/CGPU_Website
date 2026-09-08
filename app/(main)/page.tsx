"use client";

import AnimatedText from "@/components/AnimatedText";
import Navbar from "@/components/Navbar";
import PlacementAnalytics from "@/components/PlacementAnalytics";
import HeroSection from "@/components/hero";
import PlacementsSection from "@/components/home/carousel";
import RevealBox from "@/components/revealBox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, Mail } from "lucide-react";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { Recruiter } from "@/services/types/db";
import { listRecruiters } from "@/services/recruiters";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import TestimonialSection from "@/components/home/testimonial";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function fetchRelevantRecruiters() {
  const recruiters = await listRecruiters();

  const companies = [
    "Zoho",
    "Infosys",
    "CareStack",
    "InApp",
    "Amazon",
    "IBM",
    "Litmus7",
    "Trimble",
    "Wipro",
    "H&R Block",
  ];

  return recruiters.filter((r) => companies.includes(r.company_name));
}

interface CompanyIconProps {
  company: Recruiter;
  priority?: boolean;
}

const CompanyIcon = ({ company, priority = false }: CompanyIconProps) => {
  if (!company.logo_url) return null;

  return (
    <div className="relative h-20 w-32 md:h-28 md:w-48 transition-all duration-300">
      <Image
        src={company.logo_url}
        alt={company.company_name}
        fill
        sizes="(max-width: 768px) 128px, 192px"
        className="object-contain"
        priority={priority}
      />
    </div>
  );
};

/* ── Same container/card stagger shapes used in PlacementsSection ── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 220, damping: 26 },
  },
};

/* Reusable staggered heading used across sections */
const staggerHeadingVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const charVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

function StaggeredHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.h1
      className={
        className ??
        "text-[60px] sm:text-7xl md:text-9xl lg:text-[150px] font-light flex flex-wrap justify-center overflow-hidden w-full"
      }
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerHeadingVariants}
    >
      {text.split(" ").map((word, wordIdx) => (
        <span
          key={wordIdx}
          className="inline-block whitespace-nowrap mr-3 sm:mr-5 md:mr-8 lg:mr-10"
        >
          {word.split("").map((char, charIdx) => (
            <motion.span
              key={charIdx}
              variants={charVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

function RecruitersSection({
  recruiters,
  recruitersLoading,
}: {
  recruiters: Recruiter[];
  recruitersLoading: boolean;
}) {
  const rowOne = recruiters.slice(0, 5);
  const rowTwo = recruiters.slice(5, 10);

  return (
    <section className="relative z-10 bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {recruitersLoading ? (
        <p className="text-slate-400 text-sm text-center">
          Loading recruiters…
        </p>
      ) : recruiters.length === 0 ? (
        <p className="text-slate-400 text-sm text-center">
          No recruiters to show yet.
        </p>
      ) : (
        <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-6xl mx-auto items-center">
          {/* Mobile: unified grid so all 10 items pair up in grid-cols-2 */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 sm:hidden gap-x-4 gap-y-8 w-full place-items-center"
          >
            {recruiters.map((item, index) => (
              <motion.div key={item.id ?? index} variants={cardVariants}>
                <CompanyIcon company={item} priority={index < 4} />
              </motion.div>
            ))}
          </motion.div>

          {/* Desktop: row 1 */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="hidden sm:grid sm:grid-cols-5 gap-x-16 gap-y-10 w-full place-items-center"
          >
            {rowOne.map((item, index) => (
              <motion.div key={item.id ?? index} variants={cardVariants}>
                <CompanyIcon company={item} priority={true} />
              </motion.div>
            ))}
          </motion.div>

          {/* Desktop: row 2 — now a plain whileInView reveal instead of a scroll-progress pin */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="hidden sm:grid sm:grid-cols-5 gap-x-16 gap-y-10 w-full place-items-center"
          >
            {rowTwo.map((item, index) => (
              <motion.div key={item.id ?? index} variants={cardVariants}>
                <CompanyIcon company={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <motion.div
        className="flex justify-center mt-10 sm:mt-14"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Link href="/recruiters">
          <Button
            variant="outline"
            className="group border border-black w-56 h-12 cursor-pointer rounded-3xl hover:bg-transparent"
          >
            <span>See More Recruiters</span>
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}

/* ── About Section (pinned heading, description scrolls over it) ── */

function AboutSection() {
  return (
    <section className="relative h-auto sm:h-[170vh] bg-white">
      {/* Pinned heading — full screen only from sm: up, where sticky is active */}
      <div className="sticky top-0 h-screen flex justify-center items-center bg-white px-4 md:px-24 w-full py-16 sm:py-0 z-0">
        <motion.h1
          className="text-[50px] sm:text-7xl md:text-9xl lg:text-[150px] font-light flex flex-wrap justify-center overflow-hidden w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerHeadingVariants}
        >
          {"About Us".split(" ").map((word, wordIdx) => (
            <span
              key={wordIdx}
              className="inline-block whitespace-nowrap mr-3 sm:mr-5 md:mr-8 lg:mr-10"
            >
              {word.split("").map((char, charIdx) => (
                <motion.span
                  key={charIdx}
                  variants={charVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>
      </div>

      {/* Description — no forced min-height on mobile, just natural content + padding */}
      <section className="relative z-10 bg-white flex flex-col justify-center items-center px-4 md:px-24 py-16 sm:py-24 w-full sm:min-h-screen">
        <motion.div
          className="max-w-7xl flex flex-wrap justify-center text-left w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.03 } },
          }}
        >
          {"The Career Guidance and Placement Unit (CGPU) is dedicated to guiding our students towards successful career paths. We facilitate rigorous training, comprehensive skill development, and foster strong industry connections to ensure our graduates are industry-ready and equipped to excel in today's competitive professional landscape."
            .split(" ")
            .map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { y: "50%", opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: "spring" as const,
                      stiffness: 150,
                      damping: 20,
                    },
                  },
                }}
                className="inline-block text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-slate-800 mr-2 sm:mr-3 lg:mr-4 mb-2 sm:mb-3 lg:mb-4 leading-tight"
              >
                {word}
              </motion.span>
            ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/about">
            <Button
              variant="outline"
              className="group border border-black w-48 h-12 cursor-pointer rounded-3xl hover:bg-transparent"
            >
              <span>Our Team</span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </section>
  );
}

export default function Home() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [recruitersLoading, setRecruitersLoading] = useState(true);

  useEffect(() => {
    fetchRelevantRecruiters()
      .then((data) => setRecruiters(data))
      .catch((err) => console.error(err))
      .finally(() => setRecruitersLoading(false));
  }, []);

  const rowOne = recruiters.slice(0, 5);
  const rowTwo = recruiters.slice(5, 10);

  return (
    <div>
      <Navbar />
      <div id="home">
        <HeroSection />
      </div>

      <div id="about">
        {/* Full-screen Staggered Heading */}
        <AboutSection />
      </div>

      <div id="recruiters">
        {/* Full-screen Staggered Heading */}
        <div className="h-screen flex justify-center items-center bg-white px-4 md:px-24 w-full sticky top-0 z-0">
          <StaggeredHeading text="Recruiters" />
        </div>

        <RecruitersSection
          recruiters={recruiters}
          recruitersLoading={recruitersLoading}
        />
      </div>

      <div id="analytics">
        {/* Full-screen Staggered Heading */}
        <div className="h-screen flex justify-center items-center bg-white px-4 md:px-24 w-full sticky top-0 z-0">
          <StaggeredHeading text="Placement Analytics" />
        </div>

        <PlacementAnalytics />
      </div>

      <div id="placements">
        <div className="h-screen flex justify-center items-center gap-3 bg-white px-4 md:px-24 text-center sticky top-0">
          <motion.h1
            className="text-[50px] sm:text-7xl md:text-9xl lg:text-[150px] font-light flex flex-wrap justify-center overflow-hidden w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {"Top Placements".split(" ").map((word, wordIdx) => (
              <span
                key={wordIdx}
                className="inline-block whitespace-nowrap mx-2 sm:mx-3 md:mx-4 lg:mx-6"
              >
                {word.split("").map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    variants={{
                      hidden: { y: "100%", opacity: 0 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          type: "spring" as const,
                          stiffness: 200,
                          damping: 20,
                        },
                      },
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>
        </div>

        <PlacementsSection />
      </div>
      {/* <div id="testimonials">
        <div className="h-screen flex justify-start items-center gap-3 bg-white px-4 md:px-24 text-left w-full sticky top-0">
          <motion.h1
            className="text-5xl sm:text-7xl md:text-9xl lg:text-[150px] font-light flex flex-wrap justify-center overflow-hidden w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {"Testimonials".split(" ").map((word, wordIdx) => (
              <span
                key={wordIdx}
                className="inline-block whitespace-nowrap mr-3 sm:mr-5 md:mr-8 lg:mr-10"
              >
                {word.split("").map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    variants={{
                      hidden: { y: "100%", opacity: 0 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          type: "spring" as const,
                          stiffness: 200,
                          damping: 20,
                        },
                      },
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>
        </div>

        <TestimonialSection />
      </div> */}
      <div className="w-full bg-gray-100 py-12 px-4 md:px-24">
        <Card className="max-w-6xl mx-auto border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-0 flex flex-col md:flex-row justify-between">
            <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left p-6 sm:p-10 md:p-16 w-full md:w-1/2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6 text-black">
                Stay Connected
              </h2>
              <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-10 max-w-md">
                Follow us on Instagram and LinkedIn for the latest updates,
                placement stories, career guidance tips, and event
                announcements.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link
                  href="https://www.instagram.com/cgpu.sctce"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    variant="outline"
                    className="rounded-3xl gap-2 px-6 h-14 border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-black text-md cursor-pointer transition-colors w-full sm:w-auto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-[#E1306C]"
                      aria-hidden
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                    <span>Instagram</span>
                  </Button>
                </Link>
                <Link
                  href="https://www.linkedin.com/company/cgpu-sctce"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    variant="outline"
                    className="rounded-3xl gap-2 px-6 h-14 border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-black text-md cursor-pointer transition-colors w-full sm:w-auto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-[#0A66C2]"
                      aria-hidden
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>LinkedIn</span>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative min-h-[250px] sm:min-h-[300px] md:min-h-[450px]">
              <Image
                src="/vectorelements-sdwWlL_SJsA-unsplash.jpg"
                fill
                className="object-cover"
                alt="Connect with us on social media"
              />
            </div>
          </CardContent>
        </Card>
        <div className="mt-5">
          <Footer />
        </div>
      </div>
    </div>
  );
}
