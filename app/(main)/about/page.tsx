import type { Metadata } from "next";
import AboutView from "@/components/about-view";

export const metadata: Metadata = {
  title: "About Us & Placement Team | CGPU SCTCE",
  description:
    "Meet the Placement Officer, Student Leads, and Executive Committee driving placement and career guidance initiatives at Sree Chitra Thirunal College of Engineering (SCTCE), Trivandrum.",
  openGraph: {
    title: "About Us & Placement Team | CGPU SCTCE",
    description:
      "Meet the faculty, student leads, tech, design, and executive teams at Career Guidance & Placement Unit, SCTCE Trivandrum.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutView />;
}
