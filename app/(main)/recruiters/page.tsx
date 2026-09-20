import type { Metadata } from "next";
import RecruitersView from "@/components/recruiters-view";

export const metadata: Metadata = {
  title: "Recruitment Partners & Corporate Recruiters | CGPU SCTCE",
  description:
    "Explore top recruiters, corporate partners, and hiring companies visiting Sree Chitra Thirunal College of Engineering (SCTCE), Trivandrum.",
  openGraph: {
    title: "Recruitment Partners | CGPU SCTCE",
    description:
      "Connecting top MNCs, engineering firms, and tech startups with SCTCE Trivandrum engineering graduates.",
    type: "website",
  },
};

export default function RecruitersPage() {
  return <RecruitersView />;
}
