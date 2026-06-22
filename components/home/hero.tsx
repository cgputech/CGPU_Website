import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  TrendingUp,
  Briefcase,
  Award,
} from "lucide-react";
import Link from "next/link";

type BranchStatProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  side: "left" | "right";
  className?: string;
};

function BranchStat({
  icon: Icon,
  label,
  value,
  side,
  className,
}: BranchStatProps) {
  const isRight = side === "right";

  const badge = (
    <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-border-custom bg-background/80 backdrop-blur-sm">
      <Icon className="size-3.5 text-primary-red" />
    </span>
  );

  const text = (
    <div
      className={`flex flex-col ${isRight ? "items-end text-right" : "items-start text-left"}`}
    >
      <span className="text-[11px] font-medium text-text-secondary">
        {label}
      </span>
      <span className="text-xs font-semibold text-text-primary">{value}</span>
    </div>
  );

  const branch = isRight ? (
    <svg width="56" height="36" viewBox="0 0 56 36" fill="none" className="text-border-custom">
      <path d="M0 4C26 4 26 32 56 32" stroke="currentColor" strokeWidth="1" />
    </svg>
  ) : (
    <svg width="56" height="36" viewBox="0 0 56 36" fill="none" className="text-border-custom">
      <path d="M56 4C30 4 30 32 0 32" stroke="currentColor" strokeWidth="1" />
    </svg>
  );

  return (
    <div className={`absolute hidden items-center gap-2.5 lg:flex ${className ?? ""}`}>
      {isRight ? (
        <>
          {text}
          {badge}
          {branch}
        </>
      ) : (
        <>
          {branch}
          {badge}
          {text}
        </>
      )}
    </div>
  );
}

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
    <section className="relative overflow-hidden border-b border-border-custom bg-background rounded-xl mx-10 mt-5">
      {/* Soft, neutral backdrop — your background color with a faint red tint, not a full red wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 45% at 50% 0%, var(--soft-red) 0%, transparent 70%), radial-gradient(35% 35% at 90% 100%, var(--soft-red) 0%, transparent 70%), var(--background)",
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-custom to-transparent" />

      {/* Branch-style decorative stats, restored on the light surface */}
      <BranchStat icon={Users} label="Students Placed" value="320+" side="left" className="left-10 top-16" />
      <BranchStat icon={TrendingUp} label="Avg. Package" value="6.2 LPA" side="right" className="right-8 top-24" />
      <BranchStat icon={Briefcase} label="Recruiters" value="150+" side="left" className="left-6 bottom-24" />
      <BranchStat icon={Award} label="Highest Package" value="42 LPA" side="right" className="right-10 bottom-16" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-28 md:py-36">
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mt-5 font-sans text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.03em] text-text-primary sm:text-6xl md:text-7xl"
        >
          Building Careers, One Placement at a Time
        </motion.h1>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mt-6 h-px w-12 bg-primary-red/60"
          aria-hidden
        />

        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mt-6 max-w-lg text-base font-normal leading-[1.75] text-text-secondary sm:text-lg sm:leading-relaxed"
        >
          Connecting graduates from Sree Chitra Thirunal College of Engineering
          with leading recruiters nationwide.
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
            View Placements
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/statistics"
            className="inline-flex items-center gap-2 rounded-full border border-border-custom px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-muted/60"
          >
            Statistics
            <ArrowUpRight className="size-4 text-text-secondary" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}