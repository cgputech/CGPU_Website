"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Mail, Users } from "lucide-react";

type TeamTier = "po" | "lead" | "execom";

type TeamMemberExt = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar: string;
  tier: TeamTier;
  team?: string;
  /** CSS object-position override. Defaults to "top" (good for portrait headshots). */
  avatarPosition?: string;
};

const TEAM_DATA: TeamMemberExt[] = [
  {
    id: "1",
    name: "Sreejith",
    role: "Placement Officer",
    email: "sreejith@sctce.ac.in",
    avatar: "https://res.cloudinary.com/dlzy7vwio/image/upload/v1784010633/1000128137_1_nxahj8.jpg",
    avatarPosition: "center 30%",
    tier: "po",
  },
  {
    id: "2",
    name: "Sreenandan",
    role: "Student Lead",
    email: "imsreenandan@gmail.com",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394477/Sreenandan_S_R6A_krgknx.jpg",
    tier: "lead",
  },
  {
    id: "3",
    name: "Ashi",
    role: "Student Lead",
    email: "Ashi.juby.09@gmail.com",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394475/Ashi_AnnTJuby_esh4qj.jpg",
    tier: "lead",
  },
  {
    id: "4",
    name: "Abhiram A P",
    role: "Tech Team",
    email: "abhiram@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394433/Abhiram_A_P_kcivip.jpg",
    tier: "execom",
    team: "Tech",
    avatarPosition: "center 30%"
  },
  {
    id: "5",
    name: "Saran",
    role: "Tech Team",
    email: "saran@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394434/Saran_S_Kumar_R4C_b2atkd.jpg",
    tier: "execom",
    team: "Tech",
  },
  {
    id: "6",
    name: "Adithyan",
    role: "Design Team",
    email: "adithyan@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394431/IMG_20240917_175443_1_3_gi1p13.jpg",
    tier: "execom",
    team: "Design",
    avatarPosition: "top 20%",
  },
  {
    id: "7",
    name: "Sanjay",
    role: "Design Team",
    email: "sanjay@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394433/SANJAY_K_S_T4B_if0e41.jpg",
    tier: "execom",
    team: "Design",
  },
  {
    id: "8",
    name: "Alna",
    role: "Instagram",
    email: "alna@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394472/Alna_Mariya_R6B_td5i0x.jpg",
    tier: "execom",
    team: "Instagram",
  },
  {
    id: "9",
    name: "Anjali Pradeep",
    role: "Instagram",
    email: "anjali@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394472/Anjali_Pradeep_B4_gf2snl.jpg",
    tier: "execom",
    team: "Instagram",
  },
  {
    id: "10",
    name: "Negha",
    role: "LinkedIn",
    email: "negha@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394474/Negha_R_R6A_zxuhor.jpg",
    tier: "execom",
    team: "LinkedIn",
    avatarPosition: "center 5%",
  },
  {
    id: "11",
    name: "Neha",
    role: "LinkedIn",
    email: "neha@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394485/Neha_Anish_R4B_chz7po.jpg",
    tier: "execom",
    team: "LinkedIn",
  },
  {
    id: "12",
    name: "Nakshatra",
    role: "Content",
    email: "nakshatra@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394457/Nakshathra_S___T6B_rxmueh.jpg",
    tier: "execom",
    team: "Content",
  },
  {
    id: "13",
    name: "Mahreen",
    role: "Content",
    email: "mahreen@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394438/MahreenZuraiq_R4B_lyplc2.jpg",
    tier: "execom",
    team: "Content",
  },
  {
    id: "14",
    name: "Sabari",
    role: "Activity Coordinator",
    email: "sabari@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394434/Sabari_nath_A_B6_fhewwb.heic",
    tier: "execom",
    team: "Activity",
    avatarPosition: "top 25%",
  },
  {
    id: "15",
    name: "Kasinathan",
    role: "Activity Coordinator",
    email: "kasinathan@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394435/Kasinathan_S_R4B_zzmkh7.jpg",
    tier: "execom",
    team: "Activity",
  },
  {
    id: "16",
    name: "Ananthan",
    role: "POC",
    email: "ananthan@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394445/IMG-20260103-WA0076_jeq1k3.jpg",
    tier: "execom",
    team: "POC",
    avatarPosition: "top 20%",
  },
  {
    id: "17",
    name: "Riya",
    role: "POC",
    email: "riya@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394471/Riya_-_R6B_zizlsm.jpg",
    tier: "execom",
    team: "POC",
  },
  {
    id: "18",
    name: "Aashwin",
    role: "POC",
    email: "aashwin@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1783009917/copy_of_aashwin_suresh_r6a_oi8kje.png",
    tier: "execom",
    team: "POC",
    avatarPosition: "center 2%",
  },
  {
    id: "19",
    name: "Green",
    role: "POC",
    email: "green@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394444/Green_K_P_wlukb6.jpg",
    tier: "execom",
    team: "POC",
    avatarPosition: "center 10%"
  },
  {
    id: "20",
    name: "Saniya",
    role: "POC",
    email: "saniya@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394441/Saniya_Paul_M_T4B_qljokn.jpg",
    tier: "execom",
    team: "POC",
  },
  {
    id: "21",
    name: "Alin",
    role: "POC",
    email: "alin@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394440/Alin_Ninan_Jacob_R4A_bawtz7.jpg",
    tier: "execom",
    team: "POC",
  },
  {
    id: "22",
    name: "Parthasarathy",
    role: "POC",
    email: "parthasarathy@sctce.ac.in",
    avatar:
      "https://res.cloudinary.com/dlzy7vwio/image/upload/v1782394439/Parthasarathy_esy2ql.png",
    tier: "execom",
    team: "POC",
    avatarPosition: "center 30%"
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("");
}

/** Resizes the image on Cloudinary without cropping; CSS handles the rest. */
function cloudinaryThumb(url: string, size: number = 200): string {
  if (!url.startsWith("https://res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/c_scale,q_auto,f_auto,w_${size}/`);
}

/** Returns the CSS object-position for an avatar (defaults to "top"). */
function avatarPos(member: TeamMemberExt): string {
  return member.avatarPosition ?? "center";
}

// ── Bento: Placement Officer card ─────────────────────────────────────────────

function POBentoCard({ member }: { member: TeamMemberExt }) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center text-center rounded-2xl p-6",
        "bg-gradient-to-br from-primary-red/8 via-white to-primary-red/4",
        "border border-primary-red/20 shadow-sm h-full",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        "min-h-[200px]"
      )}
    >
      {/* Subtle accent blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary-red/6 blur-2xl"
      />

      <span className="mb-3 inline-block rounded-full bg-primary-red/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-red">
        Placement Officer
      </span>

      <Avatar className="h-20 w-20 ring-2 ring-white shadow border border-primary-red/20">
        <AvatarImage
          src={member.avatar}
          alt={member.name}
          loading="lazy"
          className="object-cover"
          style={{ objectPosition: avatarPos(member) }}
        />
        <AvatarFallback className="bg-primary-red/10 text-primary-red font-bold text-xl">
          {initials(member.name)}
        </AvatarFallback>
      </Avatar>

      <div className="mt-3 space-y-0.5">
        <h3 className="text-base font-bold text-slate-900 leading-tight">
          {member.name}
        </h3>
        <p className="text-xs font-medium text-primary-red">{member.role}</p>
      </div>

      <a
        href={`mailto:${member.email}`}
        className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary-red transition-colors"
      >
        <Mail className="h-3 w-3 shrink-0" />
        <span className="truncate">{member.email}</span>
      </a>
    </div>
  );
}

// ── Bento: Leadership card ────────────────────────────────────────────────────

function LeadershipBentoCard({ members }: { members: TeamMemberExt[] }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl p-6 border border-slate-200 bg-white shadow-sm h-full",
        "transition-all duration-200 hover:shadow-md",
        "min-h-[200px]"
      )}
    >
      <span className="mb-4 inline-block self-start rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        Student Leadership
      </span>

      <div className="flex flex-col gap-4 flex-1 justify-center">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3 group">
            <Avatar className="h-12 w-12 shrink-0 ring-1 ring-slate-200 shadow-sm transition-all duration-200 group-hover:ring-primary-red/50">
              <AvatarImage
                src={member.avatar}
                alt={member.name}
                loading="lazy"
                className="object-cover"
                style={{ objectPosition: avatarPos(member) }}
              />
              <AvatarFallback className="bg-primary-red/10 text-primary-red font-bold text-sm">
                {initials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 leading-tight truncate">
                {member.name}
              </p>
              <p className="text-xs font-medium text-primary-red">
                {member.role}
              </p>
              <a
                href={`mailto:${member.email}`}
                className="mt-0.5 flex items-center gap-1 text-xs text-slate-400 hover:text-primary-red transition-colors"
              >
                <Mail className="h-2.5 w-2.5 shrink-0" />
                <span className="truncate">{member.email}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Execom Avatar Cell (hover reveals card overlay) ───────────────────────────

function ExecomAvatarCell({ member }: { member: TeamMemberExt }) {
  return (
    <div className="group relative flex flex-col items-center">
      {/* Avatar bubble */}
      <div
        className={cn(
          "relative rounded-full border-2 border-white ring-1 ring-slate-200",
          "shadow-sm transition-all duration-200",
          "group-hover:ring-primary-red group-hover:ring-2 group-hover:shadow-md group-hover:-translate-y-0.5"
        )}
      >
        <Avatar className="h-14 w-14">
          <AvatarImage
            src={cloudinaryThumb(member.avatar, 160)}
            alt={member.name}
            loading="lazy"
            className="object-cover"
            style={{ objectPosition: avatarPos(member) }}
          />
          <AvatarFallback className="bg-primary-red/10 text-primary-red font-bold text-sm">
            {initials(member.name)}
          </AvatarFallback>
        </Avatar>

        {/* Team badge dot */}
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-primary-red"
          aria-hidden
        />
      </div>

      {/* Hover card — floats above, centered on avatar */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-20",
          "w-44 rounded-2xl border border-slate-200 bg-white shadow-xl p-4",
          "flex flex-col items-center text-center",
          "opacity-0 scale-95 translate-y-1",
          "transition-all duration-200 ease-out",
          "group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
        )}
      >
        {/* Arrow */}
        <span
          className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 h-2.5 w-2.5 rotate-45 border-b border-r border-slate-200 bg-white"
          aria-hidden
        />

        <Avatar className="h-12 w-12 border border-slate-100 shadow">
          <AvatarImage
            src={cloudinaryThumb(member.avatar, 96)}
            alt={member.name}
            loading="lazy"
            className="object-cover"
            style={{ objectPosition: avatarPos(member) }}
          />
          <AvatarFallback className="bg-primary-red/10 text-primary-red font-bold text-xs">
            {initials(member.name)}
          </AvatarFallback>
        </Avatar>

        <p className="mt-2.5 text-sm font-bold text-slate-900 leading-tight">
          {member.name}
        </p>
        <p className="mt-0.5 text-xs font-medium text-primary-red">
          {member.role}
        </p>
        {member.team && (
          <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
            {member.team}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const placementOfficer = TEAM_DATA.find((m) => m.tier === "po");
  const leadership = TEAM_DATA.filter((m) => m.tier === "lead");
  const execomMembers = TEAM_DATA.filter((m) => m.tier === "execom");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 mb-10 pb-6 border-b border-slate-100">
        <Users className="h-5 w-5 text-primary-red" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          Our Team
        </h2>
      </div>

      {/* ── Intro blurb + contact buttons ────────────────────────────────── */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          The Career Guidance &amp; Placement Unit of SCTCE bridges students with
          leading industries, providing end-to-end placement support, training,
          and career development resources.{" "}
          <span className="text-slate-800 font-medium">
            Reach out to us on social media for the latest opportunities.
          </span>
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/cgpu-sctce"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold",
              "bg-[#0A66C2] text-white shadow-sm",
              "hover:bg-[#004182] transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]/70"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/cgpu.sctce"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold",
              "bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white shadow-sm",
              "hover:opacity-90 transition-opacity duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1306C]/70"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
            Instagram
          </a>
        </div>
      </div>

      {/* ── Bento Grid ───────────────────────────────────────────────────── */}
      {/*
        Layout (sm+):
          [ PO (col-span-1) ] [ Leadership (col-span-2) ]
          [          Execom (col-span-3)                ]
        Mobile: all cells stack full-width
      */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Row 1, col 1 — Placement Officer */}
        {placementOfficer && (
          <div className="sm:col-span-1">
            <POBentoCard member={placementOfficer} />
          </div>
        )}

        {/* Row 1, col 2-3 — Leadership */}
        {leadership.length > 0 && (
          <div className="sm:col-span-2">
            <LeadershipBentoCard members={leadership} />
          </div>
        )}

        {/* Row 2 — Execom (full-width bento cell) */}
        {execomMembers.length > 0 && (
          <div className="sm:col-span-3 rounded-2xl p-6 border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Execom
                </span>
                <h3 className="mt-1.5 text-base font-bold text-slate-900">
                  Executive Committee
                </h3>
              </div>
              <span className="text-xs text-slate-400 shrink-0">
                {execomMembers.length} members
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 gap-x-4 gap-y-8">
              {execomMembers.map((member) => (
                <ExecomAvatarCell key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}