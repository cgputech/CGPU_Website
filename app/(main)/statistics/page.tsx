import type { Metadata } from "next";
import StatisticsView from "@/components/statistics-view";

export const metadata: Metadata = {
  title: "SCTCE Placement Statistics | Packages, Branch-wise & Trends",
  description:
    "SCTCE placement statistics for 2026, 2025, 2024 and 2023: highest package, branch-wise placement percentage, and year-over-year trends.",

  openGraph: {
    title: "SCTCE Placement Statistics 2026, 2025 & 2024 | CGPU SCTCE",
    description:
      "Recruitment statistics, salary packages, branch-wise placement rates, and YoY trends at Sree Chitra Thirunal College of Engineering (SCTCE), Trivandrum.",
    url: "/placements/statistics", 
    siteName: "CGPU SCTCE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SCTCE Placement Statistics | Packages, Branch-wise & Trends",
    description:
      "Packages, branch-wise placement rates and yearly trends at SCTCE Trivandrum.",
  },
};

export default function StatisticsPage() {
  return <StatisticsView />;
}
