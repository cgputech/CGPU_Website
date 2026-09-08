"use client";

import { motion } from "motion/react";
import { BackButton } from "@/components/ui/back-button";

/* ── Team data (only the three we display) ─────────────────── */

const FEATURED = [
  {
    id: "po",
    name: "Sreejith",
    role: "Placement Officer",
    email: "sreejith@sctce.ac.in",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1784010633/1000128137_1_nxahj8.jpg",
    objectPosition: "center 30%",
  },
  {
    id: "lead-1",
    name: "Sreenandan",
    role: "Student Lead",
    email: "imsreenandan@gmail.com",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394477/Sreenandan_S_R6A_krgknx.jpg",
    objectPosition: "center top",
  },
  {
    id: "lead-2",
    name: "Ashi",
    role: "Student Lead",
    email: "Ashi.juby.09@gmail.com",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394475/Ashi_AnnTJuby_esh4qj.jpg",
    objectPosition: "center top",
  },
];

const TOTAL_TEAM = 22; // total members including execom

/* ── Animation variants ─────────────────────────────────────── */

const headingContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const wordVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 180, damping: 22 },
  },
};

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 60, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 220, damping: 26 },
  },
};

const footerVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.6, duration: 0.6, ease: "easeOut" },
  },
};

/* ── Page ───────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-14 sm:pb-20 overflow-hidden">
      <BackButton />

      {/* ── Heading ──────────────────────────────────────────── */}
      <motion.div
        variants={headingContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-x-3 sm:gap-x-6 mb-4 sm:mb-8 mt-8"
        aria-label="Our Team"
      >
        {["Our", "Team"].map((word) => (
          <motion.span
            key={word}
            variants={wordVariant}
            className="md:text-[clamp(60px,12vw,100px)] text-[clamp(30px,12vw,50px)] font-light leading-none tracking-tight text-zinc-900 select-none"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
      
      {/* ── Cards ────────────────────────────────────────────── */}
      <motion.div
        variants={cardContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 w-full max-w-4xl"
      >
        {FEATURED.map((person) => (
          <motion.div
            key={person.id}
            variants={cardVariant}
            className="w-full aspect-[4/5] sm:aspect-auto sm:h-[32vh] sm:min-h-[240px] sm:max-h-[380px] first:xs:col-span-2 first:md:col-span-1"
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm">
              {/* Photo */}
              <img
                src={person.url}
                alt={`Portrait of ${person.name}`}
                width={500}
                height={600}
                decoding="async"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: person.objectPosition }}
              />

              {/* Floating info chip */}
              <div className="absolute inset-x-2.5 sm:inset-x-3 bottom-2.5 sm:bottom-3 rounded-xl bg-white px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-md">
                <p className="text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase text-primary-red mb-0.5">
                  {person.role}
                </p>
                <h3 className="text-sm font-semibold tracking-tight text-zinc-900 truncate">
                  {person.name}
                </h3>

                <a
                  href={`mailto:${person.email}`}
                  className="text-xs text-zinc-400 hover:text-primary-red transition-colors truncate block py-0.5 -my-0.5"
                >
                  {person.email}
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Footer note ──────────────────────────────────────── */}
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-8 sm:mt-12 text-base sm:text-xl text-black font-light text-center px-4"
      >
        And{" "}
        <span className="text-primary-red text-2xl sm:text-3xl">
          {TOTAL_TEAM - FEATURED.length}
        </span>{" "}
        dedicated people working behind the scenes — and many more to come.
      </motion.p>
    </div>
  );
}
