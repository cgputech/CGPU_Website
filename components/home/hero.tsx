"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ContactDialog } from "./contact-dialog";
import { Badge } from "@/components/ui/badge";

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
    <div className="w-full px-4 pt-2 pb-4 sm:px-6 sm:pt-3 sm:pb-6 lg:px-8 lg:pt-4 lg:pb-8">
      <section className="relative flex min-h-[calc(100vh-8rem)] flex-col justify-center overflow-hidden rounded-3xl">
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-12 text-center md:gap-7">
          {/* Logo */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cgpu-header-logo.png"
              alt="CGPU SCTCE"
              className="mx-auto h-16 w-auto object-contain sm:h-20 md:h-24"
            />
          </motion.div>

          {/* Subtitle + Heading */}
          <div className="flex flex-col items-center gap-4">
            <motion.p
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-[10px] font-medium uppercase tracking-[0.28em] text-text-secondary md:text-sm"
            >
              Career Guidance & Placement Unit{" "}
              <span className="hidden md:inline">|</span>{" "}
              <span className="block md:inline">SCTCE</span>
            </motion.p>

            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <h1 className="font-sans text-4xl font-bold leading-none tracking-[-0.04em] text-text-primary sm:text-6xl md:text-7xl">
                Launch Your <span className="text-primary-red">Career</span>
              </h1>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { year: "2025", lpa: "34 LPA" },
              { year: "2026", lpa: "8.5 LPA" },
              { year: "2027", lpa: "49 LPA" },
            ].map(({ year, lpa }, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3 + i * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                <Badge
                  variant="outline"
                  className="
                relative
                flex items-center gap-2
                overflow-hidden
                rounded-full
                bg-background
                px-3 py-4

                before:absolute
                before:inset-[2px]
                before:rounded-full
                before:content-['']

                [&>*]:relative
                [&>*]:z-10
              "
                >
                  <span className="text-text-secondary">{year}</span>

                  <span className="h-3 w-px shrink-0 bg-border" />

                  <span className="font-semibold text-primary-red">{lpa}</span>
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="max-w-xl text-base font-normal leading-relaxed text-text-secondary sm:text-lg"
          >
            The official placement cell of{" "}
            <span className="font-medium text-text-primary">
              SCTCE, Trivandrum
            </span>{" "}
            — bridging top engineering talent with leading companies and setting
            students up for exceptional careers.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <ContactDialog>
              <button className="inline-flex items-center gap-2 rounded-full bg-primary-red px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-red-hover">
                Contact Us
                <ArrowRight className="size-4" />
              </button>
            </ContactDialog>

            <Link
              href="/statistics"
              className="inline-flex items-center gap-2 rounded-full border border-border-custom px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-muted/60"
            >
              Placement Statistics
              <ArrowUpRight className="size-4 text-text-secondary" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
