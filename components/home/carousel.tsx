"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ── Placement Data ───────────────────────────────────────── */

const individualInfo = [
  {
    id: "1",
    title: "Akhileshwaran",
    subtitle: "Infosys",
    lpa: "16 LPA",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/w_500,h_600,c_fill,g_face,q_auto,f_auto/v1786192742/3_cp2riz.png",
    objectPosition: "center top",
  },
  {
    id: "2",
    title: "Rahul B S",
    subtitle: "Amazon",
    lpa: "34 LPA",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/v1788832365/Untitled_design_y9n1ct.jpg",
    objectPosition: "center top",
  },
  {
    id: "3",
    title: "Adithya S",
    subtitle: "Amazon",
    lpa: "34 LPA",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/v1788832689/Untitled_design_1_hszoso.jpg",
    objectPosition: "center top",
  },
  {
    id: "4",
    title: "Mohammad Sinan",
    subtitle: "Lokam.ai",
    lpa: "49 CTC",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/w_500,h_600,c_fill,g_face,q_auto,f_auto/v1786192747/6_eqmysk.png",
    objectPosition: "center top",
  },
  {
    id: "6",
    title: "Dev Bhagavan",
    subtitle: "CareStack",
    lpa: "8.5",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/w_500,h_600,c_fill,g_face,q_auto,f_auto/v1786192742/2_msml1y.png",
    objectPosition: "center top",
  },
  {
    id: "7",
    title: "Bharath B S",
    subtitle: "CareStack",
    lpa: "8.5 LPA",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/w_500,h_600,c_fill,g_face,q_auto,f_auto/v1786192721/1_fvjmzs.png",
    objectPosition: "center top",
  },
];

type PlacementItem = (typeof individualInfo)[0];

/* ── useInView: fires true once an element crosses the viewport ── */

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // fire once, don't re-trigger on scroll out
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/* ── Card ──────────────────────────────────────────────────── */

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 220, damping: 26 },
  },
};

const PlacementCard = memo(function PlacementCard({
  item,
  index,
  onSelect,
}: {
  item: PlacementItem;
  index: number;
  onSelect: (item: PlacementItem) => void;
}) {
  const layoutId = `placement-strip-${item.id}`;
  const [ref, inView] = useInView(0.15);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay: index * 0.08 }}
    >
      <motion.div
        layoutId={layoutId}
        layout="position"
        onClick={() => onSelect(item)}
        className="relative flex flex-col w-full h-[28vh] sm:h-[32vh] lg:h-[36vh] rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm"
      >
        <div className="relative flex-1 overflow-hidden bg-white">
          <motion.img
            layoutId={`img-${layoutId}`}
            src={item.url}
            alt={`Portrait of ${item.title}`}
            width={600}
            height={600}
            decoding="async"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover grayscale"
            style={{ objectPosition: item.objectPosition }}
          />
        </div>

        <div className="px-4 py-2.5 shadow-md">
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

/* ── Section ──────────────────────────────────────────────── */

export default function PlacementsSection() {
  const [selected, setSelected] = useState<PlacementItem | null>(null);
  const [buttonRef, buttonInView] = useInView(0.1);

  return (
    <section className="bg-white relative z-10 py-16 sm:py-24" id="placements">
      <div className="w-full flex flex-col items-center gap-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
          {individualInfo.map((item, index) => (
            <PlacementCard
              key={item.id}
              item={item}
              index={index}
              onSelect={setSelected}
            />
          ))}
        </div>

        <Link href="/placements" ref={buttonRef as any}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              buttonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover="hover"
            whileTap={{ scale: 0.96 }}
          >
            <Button
              variant="outline"
              className="group border border-black w-48 h-12 cursor-pointer rounded-3xl overflow-hidden"
            >
              <motion.span
                variants={{ hover: { x: -4 } }}
                transition={{
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 20,
                }}
              >
                More Placements
              </motion.span>
              <motion.span
                variants={{ hover: { x: 4 } }}
                transition={{
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 20,
                }}
                className="inline-flex"
              >
                <ArrowRight />
              </motion.span>
            </Button>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
