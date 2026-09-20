import PlacementsPage from "./placement-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placement Drives | CGPU SCTCE",
  description:
    "Explore recruitment statistics, salary packages, department placement rates, YoY trends, sector splits, and drive records at Sree Chitra Thirunal College of Engineering (SCTCE), Trivandrum.",
  openGraph: {
    title: "Placement Statistics & Campaigns | CGPU SCTCE",
    description:
      "Explore recruitment statistics, batch packages, branch placement percentages, YoY trends, and recruiter drives at SCTCE Trivandrum.",
    type: "website",
  },
};

export default function Placements() {
  return <PlacementsPage />
}