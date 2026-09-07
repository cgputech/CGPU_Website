"use client";

import { memo, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ── Placement Data ───────────────────────────────────────── */

const individualInfo = [
  {
    id: "1",
    title: "Akhileshwaran",
    subtitle: "Infosys",
    lpa: "4.5 LPA",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/w_500,h_600,c_fill,g_face,q_auto,f_auto/v1786192742/3_cp2riz.png",
  },
  {
    id: "2",
    title: "Camilla Wilson",
    subtitle: "Zoho",
    lpa: "5 LPA",
    url: "https://i.pravatar.cc/500?img=47",
  },
  {
    id: "3",
    title: "Olive Nacelle",
    subtitle: "TCS Digital",
    lpa: "6.5 LPA",
    url: "https://i.pravatar.cc/500?img=32",
  },
  {
    id: "4",
    title: "Mohammad Sinan",
    subtitle: "Lokam.ai",
    lpa: "6 LPA",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/w_500,h_600,c_fill,g_face,q_auto,f_auto/v1786192747/6_eqmysk.png",
  },
  {
    id: "5",
    title: "Jessica Dobrev",
    subtitle: "Wipro",
    lpa: "5.5 LPA",
    url: "https://i.pravatar.cc/500?img=44",
  },
  {
    id: "6",
    title: "Dev Bhagavan",
    subtitle: "CareStack",
    lpa: "7.2 LPA",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/w_500,h_600,c_fill,g_face,q_auto,f_auto/v1786192742/2_msml1y.png",
  },
  {
    id: "7",
    title: "Bharath B S",
    subtitle: "CareStack",
    lpa: "7.2 LPA",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/w_500,h_600,c_fill,g_face,q_auto,f_auto/v1786192721/1_fvjmzs.png",
  },
  {
    id: "8",
    title: "Sasha Kim",
    subtitle: "Accenture",
    lpa: "8 LPA",
    url: "https://i.pravatar.cc/500?img=52",
  },
];

type PlacementItem = (typeof individualInfo)[0];

/* ── useInView: fires true/false as an element crosses the viewport ── */

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/* ── Expandable Profile Modal ─────────────────────────────── */

function ProfileModal({
  item,
  onClose,
  suffix = "",
}: {
  item: PlacementItem;
  onClose: () => void;
  suffix?: string;
}) {
  const layoutId = `placement-strip-${item.id}${suffix}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90"
      />

      <motion.div
        layoutId={layoutId}
        className="relative w-full max-w-5xl h-[85vh] bg-black rounded-2xl overflow-hidden z-10 flex flex-col md:flex-row border border-white/10 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
          aria-label="Close profile"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="relative h-[45%] w-full shrink-0 overflow-hidden md:h-full md:w-[45%]">
          <motion.img
            layoutId={`img-${layoutId}`}
            src={item.url}
            alt={`Portrait of ${item.title}`}
            width={500}
            height={600}
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/40" />
        </div>

        <div className="p-8 sm:p-10 w-full md:flex-1 flex flex-col justify-center overflow-y-auto">
          <motion.p
            layoutId={`company-${layoutId}`}
            className="text-primary-red text-xs font-semibold tracking-widest uppercase mb-3"
          >
            {item.subtitle}
          </motion.p>
          <motion.h3
            layoutId={`name-${layoutId}`}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6 pb-6 border-b border-white/10"
          >
            {item.title}
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-5 text-sm text-white/70 leading-relaxed grow"
          >
            <p>
              Congratulations to{" "}
              <strong className="text-white">{item.title}</strong> for securing
              a position at{" "}
              <strong className="text-white">{item.subtitle}</strong>! This
              achievement is a testament to their dedication, hard work, and
              technical expertise developed during their time at our
              institution.
            </p>

            <div>
              <h4 className="text-white font-semibold tracking-tight mb-1">
                Company
              </h4>
              <p className="text-white/50">{item.subtitle}</p>
            </div>

            <div>
              <h4 className="text-white font-semibold tracking-tight mb-1">
                Package
              </h4>
              <p className="text-white/50">{item.lpa}</p>
            </div>

            <div>
              <h4 className="text-white font-semibold tracking-tight mb-1">
                Achievement
              </h4>
              <p className="text-white/50">
                Successfully cleared all rounds of the recruitment process and
                received a confirmed offer from {item.subtitle}.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Card ──────────────────────────────────────────────────── */

const PlacementCard = memo(function PlacementCard({
  item,
  onSelect,
  suffix = "",
}: {
  item: PlacementItem;
  onSelect: (item: PlacementItem, suffix?: string) => void;
  suffix?: string;
}) {
  const layoutId = `placement-strip-${item.id}${suffix}`;

  return (
    // layoutId lives on its own node so the shared-element transition into the
    // modal never fights with the hover scale animation on the inner layer.
    <motion.div
      layoutId={layoutId}
      layout="position"
      className="w-full h-[28vh] sm:h-[32vh] lg:h-[36vh] min-h-[160px] max-h-[320px]"
    >
      <motion.div
        onClick={() => onSelect(item, suffix)}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring" as const, stiffness: 260, damping: 22 }}
        className="relative h-full w-full overflow-hidden rounded-2xl cursor-pointer bg-zinc-100 shadow-sm"
      >
        <motion.img
          layoutId={`img-${layoutId}`}
          src={item.url}
          alt={`Portrait of ${item.title}`}
          width={500}
          height={600}
          decoding="async"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top grayscale"
        />

        {/* Floating name/company/LPA chip, overlapping the bottom edge of the photo */}
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white px-4 py-2.5 shadow-md">
          <motion.h3
            layoutId={`name-${layoutId}`}
            layout="position"
            className="text-sm font-semibold tracking-tight text-zinc-900 truncate"
          >
            {item.title}
          </motion.h3>
          <motion.p
            layoutId={`company-${layoutId}`}
            layout="position"
            className="text-xs text-zinc-500 truncate"
          >
            {item.subtitle} · {item.lpa}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
});

/* ── Full-screen group with scroll-based stagger ────────────────── */

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

export default function PlacementsSection() {
  const [selected, setSelected] = useState<PlacementItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showRow2, setShowRow2] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Trigger the discrete animation when scroll crosses 20%
    setShowRow2(latest > 0.2);
  });

  useEffect(() => {
    if (scrollYProgress.get() > 0.2) {
      setShowRow2(true);
    }
  }, [scrollYProgress]);

  const groupOne = individualInfo.slice(0, 4);
  const groupTwo = individualInfo.slice(4, 8);

  return (
    <section ref={containerRef} className="bg-white h-auto sm:h-[200vh] relative z-10 py-10 sm:py-0" id="placements">
      <div className="static sm:sticky top-0 h-auto sm:h-screen w-full flex flex-col items-center justify-center gap-8 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 sm:overflow-hidden">
        <div className="flex flex-col gap-8 sm:gap-6 w-full max-w-6xl items-center">
          {/* First Group triggers normally as it comes into view */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full"
          >
            {groupOne.map((item) => (
              <motion.div key={item.id} variants={cardVariants}>
                <PlacementCard item={item} onSelect={setSelected} suffix="-top" />
              </motion.div>
            ))}
          </motion.div>

          {/* Second Group (Mobile): Uses whileInView as they scroll normally */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "50px" }}
            className="grid grid-cols-2 sm:hidden gap-4 w-full"
          >
            {groupTwo.map((item) => (
              <motion.div key={item.id} variants={cardVariants}>
                <PlacementCard item={item} onSelect={setSelected} suffix="-mobile" />
              </motion.div>
            ))}
          </motion.div>

          {/* Second Group (Desktop): Uses scroll progress state because it is sticky */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={showRow2 ? "visible" : "hidden"}
            className="hidden sm:grid sm:grid-cols-4 gap-6 w-full"
          >
            {groupTwo.map((item) => (
              <motion.div key={item.id} variants={cardVariants}>
                <PlacementCard item={item} onSelect={setSelected} suffix="-desktop" />
              </motion.div>
            ))}
          </motion.div>
          <Link href="/placements" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showRow2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover="hover"
              whileTap={{ scale: 0.96 }}
              style={{ pointerEvents: showRow2 ? "auto" : "none" }}
            >
              <Button
                variant="outline"
                className="group border border-black w-48 h-12 cursor-pointer rounded-3xl overflow-hidden"
              >
                <motion.span
                  variants={{ hover: { x: -4 } }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                >
                  More Placements
                </motion.span>
                <motion.span
                  variants={{ hover: { x: 4 } }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                  className="inline-flex"
                >
                  <ArrowRight />
                </motion.span>
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
