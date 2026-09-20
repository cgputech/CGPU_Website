import type { Metadata } from "next";
import AboutView from "@/components/about-view";


export const metadata: Metadata = {
  title: "SCTCE CGPU Team | Placement Coordinators & Members",
  description:
    "Meet the SCTCE CGPU team: faculty coordinators, student placement coordinators and members of the Career Guidance and Placement Unit, Trivandrum.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "SCTCE CGPU Team | Coordinators & Members | CGPU SCTCE",
    description:
      "The people behind placements at Sree Chitra Thirunal College of Engineering (SCTCE), Trivandrum: faculty coordinators, student coordinators and team members.",
    url: "/about",
    siteName: "CGPU SCTCE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SCTCE CGPU Team | Placement Coordinators & Members",
    description:
      "Meet the faculty and student team behind CGPU at SCTCE Trivandrum.",
  },
};

export default function AboutPage() {
  return <AboutView />;
}
