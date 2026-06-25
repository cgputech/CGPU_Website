"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-2 sm:pt-3 lg:pt-4 w-full">
      <section className="relative overflow-hidden rounded-3xl min-h-[calc(100vh-8rem)] flex flex-col justify-center">
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-12 text-center w-full">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-8"
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

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mt-5 flex flex-col items-center"
          >
            <h1 className="font-sans text-[2.75rem] font-bold leading-none tracking-[-0.04em] text-text-primary sm:text-6xl md:text-7xl">
              Launch Your{" "}
              <span className="relative inline-block text-primary-red mx-auto">
                Career
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mt-6 max-w-lg text-base font-normal text-text-secondary sm:text-lg sm:leading-relaxed"
          >
            Expert guidance, industry connections, and proven pathways to help you
            secure your dream role and advance your professional future.
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
              Placement Statistics
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/statistics"
              className="inline-flex items-center gap-2 rounded-full border border-border-custom px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-muted/60"
            >
              Success Stories
              <ArrowUpRight className="size-4 text-text-secondary" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
