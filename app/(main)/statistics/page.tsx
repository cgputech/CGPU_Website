import type { Metadata } from "next";
import StatisticsView from "@/components/statistics-view";

export const metadata: Metadata = {
  title: "Placement Analytics & Metrics | CGPU SCTCE",
  description:
    "In-depth placement analytics, department performance breakdown, highest and average CTC metrics, and salary charts for Sree Chitra Thirunal College of Engineering (SCTCE), Trivandrum.",
  openGraph: {
    title: "Placement Analytics & Metrics | CGPU SCTCE",
    description:
      "Comprehensive placement statistics, department performance metrics, and CTC breakdown for SCTCE Trivandrum.",
    type: "website",
  },
};

export default function StatisticsPage() {
  return <StatisticsView />;
}
