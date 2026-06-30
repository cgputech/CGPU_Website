import { createClient } from "@/utils/supabase/client";
import { assertNoError } from "@/services/errors";
import type { RecruiterVisitDepartment } from "@/services/types/db";

/**
 * Fetch all recruiter_visit_department rows for a given placement year.
 * Joins through recruiter_visit to filter by placement_year_id.
 */
export async function listDeptPlacementsByYear(
  placementYearId: number,
): Promise<RecruiterVisitDepartment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiter_visit_department")
    .select(
      `
      id,
      recruiter_visit_id,
      department_id,
      offers_count,
      recruiter_visit!inner (
        placement_year_id
      )
    `,
    )
    .eq("recruiter_visit.placement_year_id", placementYearId);

  assertNoError(error);
  return (data ?? []) as unknown as RecruiterVisitDepartment[];
}

/**
 * Upsert a single recruiter_visit_department row using Supabase's native
 * upsert with onConflict so it is one atomic operation.
 *
 * Requires a UNIQUE constraint on (recruiter_visit_id, department_id).
 * If your DB does not have that constraint yet, run:
 *   ALTER TABLE recruiter_visit_department
 *     ADD CONSTRAINT rvd_visit_dept_unique UNIQUE (recruiter_visit_id, department_id);
 */
export async function upsertDeptPlacement(input: {
  recruiter_visit_id: number;
  department_id: number;
  offers_count: number;
}): Promise<RecruiterVisitDepartment> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("recruiter_visit_department")
    .upsert(
      {
        recruiter_visit_id: input.recruiter_visit_id,
        department_id: input.department_id,
        offers_count: input.offers_count,
      },
      { onConflict: "recruiter_visit_id,department_id" },
    )
    .select();

  assertNoError(error);

  // .select() returns an array; take the first (and only) row.
  const row = (data ?? [])[0];
  if (!row) {
    throw new Error(
      "upsertDeptPlacement: insert returned no rows. " +
        "Check that a UNIQUE constraint exists on (recruiter_visit_id, department_id).",
    );
  }
  return row as RecruiterVisitDepartment;
}

/**
 * Delete a recruiter_visit_department row.
 */
export async function deleteDeptPlacement(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("recruiter_visit_department")
    .delete()
    .eq("id", id);
  assertNoError(error);
}
