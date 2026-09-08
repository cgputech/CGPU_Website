"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

/* ── Team data ──────────────────────────────────────────────── */

const PLACEMENT_OFFICER = {
  id: "po",
  name: "Sreejith",
  role: "Placement Officer",
  url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1784010633/1000128137_1_nxahj8.jpg",
  objectPosition: "center 30%",
};

const LEADS = [
  {
    id: "lead-1",
    name: "Sreenandan",
    role: "Student Lead",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394477/Sreenandan_S_R6A_krgknx.jpg",
    objectPosition: "center top",
  },
  {
    id: "lead-2",
    name: "Ashi",
    role: "Student Lead",
    url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394475/Ashi_AnnTJuby_esh4qj.jpg",
    objectPosition: "center top",
  },
];

interface ExecomMember {
  id: string;
  name: string;
  role: string;
  url: string;
  objectPosition?: string;
}

const EXECOM_TEAMS: { team: string; members: ExecomMember[] }[] = [
  {
    team: "Tech",
    members: [
      {
        id: "4",
        name: "Abhiram A P",
        role: "Tech Team",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394433/Abhiram_A_P_kcivip.jpg",
      },
      {
        id: "5",
        name: "Saran",
        role: "Tech Team",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394434/Saran_S_Kumar_R4C_b2atkd.jpg",
        objectPosition: "top 10%",
      },
    ],
  },
  {
    team: "Design",
    members: [
      {
        id: "6",
        name: "Adithyan",
        role: "Design Team",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394431/IMG_20240917_175443_1_3_gi1p13.jpg",
        objectPosition: "center 20%",
      },
      {
        id: "7",
        name: "Sanjay",
        role: "Design Team",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394433/SANJAY_K_S_T4B_if0e41.jpg",
        objectPosition: "top 10%",
      },
    ],
  },
  {
    team: "Instagram",
    members: [
      {
        id: "8",
        name: "Alna",
        role: "Instagram",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394472/Alna_Mariya_R6B_td5i0x.jpg",
        objectPosition: "top 10%",
      },
      {
        id: "9",
        name: "Anjali Pradeep",
        role: "Instagram",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394472/Anjali_Pradeep_B4_gf2snl.jpg",
        objectPosition: "top 10%",
      },
    ],
  },
  {
    team: "LinkedIn",
    members: [
      {
        id: "10",
        name: "Negha",
        role: "LinkedIn",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394474/Negha_R_R6A_zxuhor.jpg",
        objectPosition: "center 5%",
      },
      {
        id: "11",
        name: "Neha",
        role: "LinkedIn",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394485/Neha_Anish_R4B_chz7po.jpg",
        objectPosition: "top 10%",
      },
    ],
  },
  {
    team: "Content",
    members: [
      {
        id: "12",
        name: "Nakshatra",
        role: "Content",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394457/Nakshathra_S___T6B_rxmueh.jpg",
        objectPosition: "top 10%",
      },
      {
        id: "13",
        name: "Mahreen",
        role: "Content",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394438/MahreenZuraiq_R4B_lyplc2.jpg",
      },
    ],
  },
  {
    team: "Activity",
    members: [
      {
        id: "14",
        name: "Sabari",
        role: "Activity Coordinator",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394434/Sabari_nath_A_B6_fhewwb.heic",
        objectPosition: "center 25% top 20%",
      },
      {
        id: "15",
        name: "Kasinathan",
        role: "Activity Coordinator",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394435/Kasinathan_S_R4B_zzmkh7.jpg",
        objectPosition: "top 20%",
      },
    ],
  },
  {
    team: "POC",
    members: [
      {
        id: "16",
        name: "Ananthan",
        role: "POC",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394445/IMG-20260103-WA0076_jeq1k3.jpg",
        objectPosition: "center 20%",
      },
      {
        id: "17",
        name: "Riya",
        role: "POC",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394471/Riya_-_R6B_zizlsm.jpg",
      },
      {
        id: "18",
        name: "Aashwin",
        role: "POC",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1783009917/copy_of_aashwin_suresh_r6a_oi8kje.png",
        objectPosition: "center 2%",
      },
      {
        id: "19",
        name: "Green",
        role: "POC",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394444/Green_K_P_wlukb6.jpg",
        objectPosition: "center 10%",
      },
      {
        id: "20",
        name: "Saniya",
        role: "POC",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394441/Saniya_Paul_M_T4B_qljokn.jpg",
      },
      {
        id: "21",
        name: "Alin",
        role: "POC",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394440/Alin_Ninan_Jacob_R4A_bawtz7.jpg",
      },
      {
        id: "22",
        name: "Parthasarathy",
        role: "POC",
        url: "https://res.cloudinary.com/dlzy7vwio/image/upload/c_fill,g_face,w_500,h_600,q_auto,f_auto/v1782394439/Parthasarathy_esy2ql.png",
        objectPosition: "center 30%",
      },
    ],
  },
];

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
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 220, damping: 26 },
  },
};

/* ── Intersection Observer hook ─────────────────────────────── */

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ── Reusable photo card (same style as original) ───────────── */

interface MemberCardProps {
  name: string;
  role: string;
  url: string;
  objectPosition?: string;
  heightClass?: string;
}

function MemberCard({
  name,
  role,
  url,
  objectPosition = "center top",
  heightClass = "h-[34vh] min-h-[210px] max-h-[320px]",
}: MemberCardProps) {
  const firstName = name.split(" ")[0];

  return (
    <Card className="overflow-hidden rounded-2xl py-0 gap-0">
      <CardContent className={`relative w-full p-0 ${heightClass}`}>
        <img
          src={url}
          alt={`Portrait of ${name}`}
          width={500}
          height={600}
          decoding="async"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
        />
      </CardContent>
      <CardFooter className="justify-center py-3 bg-white">
        <p className="text-sm font-semibold text-zinc-900 leading-none tracking-tight">
          {firstName}
        </p>
      </CardFooter>
    </Card>
  );
}

/* ── Divider label between tiers ─────────────────────────────── */

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6 sm:mb-8 w-full">
      <span className="h-px flex-1 bg-zinc-200" />
      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 whitespace-nowrap">
        {label}
      </span>
      <span className="h-px flex-1 bg-zinc-200" />
    </div>
  );
}

/* ── Scroll-triggered staggered grid ────────────────────────── */

function StaggeredGrid({
  members,
  cols = 2,
}: {
  members: ExecomMember[];
  cols?: 2 | 3 | 4;
}) {
  const { ref, inView } = useInView(0.1);

  const gridCols =
    cols === 2
      ? "grid-cols-2"
      : cols === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  return (
    <motion.div
      ref={ref}
      variants={cardContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`grid ${gridCols} gap-4 sm:gap-5`}
    >
      {members.map((m) => (
        <motion.div key={m.id} variants={cardVariant}>
          <MemberCard
            name={m.name}
            role={m.role}
            url={m.url}
            objectPosition={m.objectPosition}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ── Team section: label + grid share one scroll trigger ─────── */

function TeamSection({
  team,
  members,
  cols,
}: {
  team: string;
  members: ExecomMember[];
  cols: 2 | 3 | 4;
}) {
  const { ref, inView } = useInView(0.1);

  const gridCols =
    cols === 2
      ? "grid-cols-2"
      : cols === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  return (
    <motion.div
      ref={ref}
      variants={cardContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.p
        variants={cardVariant}
        className="text-[10px] font-semibold tracking-[0.18em] uppercase text-zinc-400 mb-4"
      >
        {team}
      </motion.p>
      <div className={`grid ${gridCols} gap-4 sm:gap-5`}>
        {members.map((m) => (
          <motion.div key={m.id} variants={cardVariant}>
            <MemberCard
              name={m.name}
              role={m.role}
              url={m.url}
              objectPosition={m.objectPosition}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function AboutPage() {
  const { ref: leadsRef, inView: leadsInView } = useInView(0.1);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 overflow-hidden">
      <BackButton />

      {/* ── Page heading ───────────────────────────────────── */}
      <motion.div
        variants={headingContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-x-3 sm:gap-x-6 mb-10 sm:mb-14 mt-8 w-full"
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

      <div className="w-full max-w-4xl flex flex-col gap-14 sm:gap-18">
        {/* ── Tier 1 · Placement Officer ─────────────────── */}
        <section>
          <SectionLabel label="Faculty" />
          <motion.div
            variants={cardContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-xs mx-auto"
          >
            <motion.div variants={cardVariant}>
              <MemberCard
                name={PLACEMENT_OFFICER.name}
                role={PLACEMENT_OFFICER.role}
                url={PLACEMENT_OFFICER.url}
                objectPosition={PLACEMENT_OFFICER.objectPosition}
                heightClass="h-[52vh] min-h-[320px] max-h-[500px]"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ── Tier 2 · Student Leads ─────────────────────── */}
        <section>
          <SectionLabel label="Student Leads" />
          <motion.div
            ref={leadsRef}
            variants={cardContainer}
            initial="hidden"
            animate={leadsInView ? "visible" : "hidden"}
            className="grid grid-cols-2 gap-4 sm:gap-6"
          >
            {LEADS.map((lead) => (
              <motion.div key={lead.id} variants={cardVariant}>
                <MemberCard
                  name={lead.name}
                  role={lead.role}
                  url={lead.url}
                  objectPosition={lead.objectPosition}
                  heightClass="h-[42vh] min-h-[260px] max-h-[420px]"
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Tier 3 · Execom Teams ──────────────────────── */}
        <section>
          <SectionLabel label="Executive Committee" />
          <div className="flex flex-col gap-12 sm:gap-14">
            {EXECOM_TEAMS.map(({ team, members }) => {
              const cols: 2 | 3 | 4 =
                members.length <= 2 ? 2 : members.length === 3 ? 3 : 4;
              return (
                <TeamSection
                  key={team}
                  team={team}
                  members={members}
                  cols={cols}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
