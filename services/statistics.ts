import { createClient } from "@/utils/supabase/client";
export type DeptStat = {
  dept: string;
  deptCode: string;
  placedCount: number;
  avgPackage: number;
};

export type SectorShare = {
  label: string;
  value: number;
};

// ─── Types ───────────────────────────────────────────────────────────────────

export type PlacementYearOption = {
  id: number;
  year: number;
};

export type TotalStudentsPlacedResult = {
  totalPlaced: number;
  totalEligible: number;
  totalOffers: number;
  placedPercentage: number;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function getClient() {
  return createClient();
}

// ─── 0. List available placement years (for the dropdown) ────────────────────

export async function listPlacementYearOptions(): Promise<PlacementYearOption[]> {
  const { data, error } = await getClient()
    .from("placement_year")
    .select("id, year")
    .order("year", { ascending: false });

  if (error) {
    console.error("[listPlacementYearOptions]", error.message);
    return [];
  }
  return data ?? [];
}

// ─── 1. Highest package for a year ───────────────────────────────────────────

export async function fetchHighestPackage(yearId: number): Promise<number | null> {
  // Prefer the pre-computed value on placement_year
  const { data, error } = await getClient()
    .from("placement_year")
    .select("highest_package")
    .eq("id", yearId)
    .single();

  if (error) {
    console.error("[fetchHighestPackage] placement_year:", error.message);
    return null;
  }

  if (data?.highest_package != null) return Number(data.highest_package);

  // Fallback: compute from recruiter_visit.max_package for that year
  const { data: visits, error: visitErr } = await getClient()
    .from("recruiter_visit")
    .select("max_package")
    .eq("placement_year_id", yearId)
    .order("max_package", { ascending: false })
    .limit(1)
    .single();

  if (visitErr) {
    console.error("[fetchHighestPackage] recruiter_visit:", visitErr.message);
    return null;
  }

  return visits?.max_package != null ? Number(visits.max_package) : null;
}

// ─── 2. Average package for a year ───────────────────────────────────────────

export async function fetchAveragePackage(yearId: number): Promise<number | null> {
  const { data, error } = await getClient()
    .from("placement_year")
    .select("avg_package")
    .eq("id", yearId)
    .single();

  if (error) {
    console.error("[fetchAveragePackage]", error.message);
    return null;
  }

  return data?.avg_package != null ? Number(data.avg_package) : null;
}

// ─── 3. Total students placed for a year ─────────────────────────────────────

export async function fetchTotalStudentsPlaced(
  yearId: number,
): Promise<TotalStudentsPlacedResult | null> {
  const { data, error } = await getClient()
    .from("placement_year")
    .select("total_students_eligible, placement_rate, total_offers")
    .eq("id", yearId)
    .single();

  if (error) {
    console.error("[fetchTotalStudentsPlaced]", error.message);
    return null;
  }
  if (!data) return null;

  const totalEligible = data.total_students_eligible ?? 0;
  const totalOffers = data.total_offers ?? 0;

  // placement_rate may be stored as fraction (0.942) or percent (94.2)
  let placedPercentage = 0;
  let totalPlaced = 0;
  if (data.placement_rate != null) {
    const raw = Number(data.placement_rate);
    placedPercentage = raw <= 1 ? parseFloat((raw * 100).toFixed(1)) : parseFloat(raw.toFixed(1));
    // Derive totalPlaced from placement_rate × totalEligible
    totalPlaced = raw <= 1
      ? Math.round(raw * totalEligible)
      : Math.round((raw / 100) * totalEligible);
  } else if (totalEligible > 0) {
    placedPercentage = 0;
  }

  return { totalPlaced, totalEligible, totalOffers, placedPercentage };
}

// ─── 4. Department-wise data for a year ──────────────────────────────────────

export async function fetchDepartmentsData(yearId: number): Promise<DeptStat[]> {
  const { data, error } = await getClient()
    .from("dept_year_stats")
    .select(
      `
      placed_count,
      avg_package,
      placement_rate,
      department:department!dept_year_stats_department_id_fkey1 (
        name,
        code
      )
    `,
    )
    .eq("placement_year_id", yearId);

  if (error) {
    console.error("[fetchDepartmentsData]", error.message);
    return [];
  }

  console.log(data);

  return (data ?? []).map((row) => {
    const dept = (row.department as unknown) as { name: string; code: string } | null;
    const placedCount = row.placed_count ?? 0;

    return {
      dept: dept?.name ?? "Unknown",
      deptCode: dept?.code ?? "",
      placedCount,
      avgPackage: Number(row.avg_package ?? 0),
    };
  });
}

// ─── 5. Sector-wise placed students for a year ───────────────────────────────

export async function fetchSectorWiseData(yearId: number): Promise<SectorShare[]> {
  // Count accepted offers per sector by joining offer → recruiter_visit → recruiter
  const { data, error } = await getClient()
    .from("offer")
    .select(
      `
      id,
      recruiter_visit:recruiter_visit!offer_recruiter_visit_id_fkey (
        placement_year_id,
        recruiter:recruiter!fk_rv_recruiter (
          industry
        )
      )
    `,
    )
    .eq("is_accepted", true);

  if (error) {
    console.error("[fetchSectorWiseData]", error.message);
    return [];
  }

  // Group offer count by recruiter industry/sector, filtered to the requested year
  const sectorMap: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    const visit = (row.recruiter_visit as unknown) as {
      placement_year_id: number | null;
      recruiter: { industry: string | null } | null;
    } | null;

    if (visit?.placement_year_id !== yearId) return;

    const sector = visit?.recruiter?.industry?.trim() || "Other";
    sectorMap[sector] = (sectorMap[sector] || 0) + 1;
  });

  return Object.entries(sectorMap)
    .filter(([, v]) => v > 0)
    .map(([label, value]) => ({ label, value }));
}
