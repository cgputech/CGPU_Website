import PlacementsPage from "./placement-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SCTCE Company-wise Placements | Students Hired & Packages",
  description:
    "Company-wise placements at SCTCE: companies that recruited, number of students hired and package offered for 2026, 2025, 2024 and 2023. By CGPU, Trivandrum.",
  alternates: {
    canonical: "/placements",
  },
  openGraph: {
    title: "SCTCE Company-wise Placements | CGPU SCTCE",
    description:
      "See which companies recruited from SCTCE, how many students they hired and the package offered.",
    url: "/placements",
    siteName: "CGPU SCTCE",
    type: "website",
  },
};
export default function Placements() {
  return <PlacementsPage />;
}