import type { Metadata } from "next";
import { listAssets } from "@/services/assets";
import { listPlacementYears } from "@/services/placement-years";
import { GalleryClient, type PosterData } from "./gallery-client";

export const revalidate = 3600; // Optionally cache for 1 hour, or remove for dynamic

export const metadata: Metadata = {
  title: "Placement Gallery & Posters | CGPU SCTCE",
  description:
    "Explore placement drive posters, recruitment success stories, and campaign highlights over the years at Sree Chitra Thirunal College of Engineering (SCTCE), Trivandrum.",
  openGraph: {
    title: "Placement Gallery & Posters | CGPU SCTCE",
    description:
      "Collection of placement drives, recruitment posters, and student achievements at SCTCE Trivandrum.",
    type: "website",
  },
};

export default async function GalleryPage() {
  // Fetch assets and placement years in parallel
  const [allAssets, placementYears] = await Promise.all([
    listAssets(),
    listPlacementYears(),
  ]);

  // Filter only posters
  const posterAssets = allAssets.filter((a) => a.asset_type === "poster");

  // Map assets to poster data
  const posters: PosterData[] = posterAssets.map((asset) => {
    // placement_id maps to placement_year_id in this context
    const yearRecord = placementYears.find((y) => y.id === asset.placement_id);
    return {
      id: asset.id,
      year: yearRecord ? yearRecord.year : 0, // Fallback if year not found
      imageUrl: asset.image_url,
    };
  });

  // Extract unique available years, sort descending, and add "All" at the front
  const yearsSet = new Set(posters.map((p) => p.year).filter((y) => y !== 0));
  const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
  const availableYears: (number | "All")[] = ["All", ...sortedYears];

  return (
    <GalleryClient posters={posters} availableYears={availableYears} />
  );
}
