import type { Metadata } from "next";
import RecruitersView from "@/components/recruiters-view";

export const metadata: Metadata = {
  title: "SCTCE Recruiters | Companies Visited & Recruitment History",
  description:
    "SCTCE recruiters from the first campus visit to today: companies visited over the years. By CGPU, Trivandrum.",
  alternates: {
    canonical: "/recruiters",
  },
  openGraph: {
    title: "SCTCE Recruiters | Companies Visiting SCTCE | CGPU SCTCE",
    description:
      "The recruitment journey at Sree Chitra Thirunal College of Engineering (SCTCE), Trivandrum: companies visited, repeat recruiters and yearly trends.",
    url: "/recruiters",
    siteName: "CGPU SCTCE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SCTCE Recruiters | Companies Visited & Recruitment History",
    description:
      "Companies that have visited SCTCE Trivandrum, from the first recruiter to today.",
  },
};

export default function RecruitersPage() {
  return <RecruitersView />;
}
