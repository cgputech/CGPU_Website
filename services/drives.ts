import { createClient } from "@/utils/supabase/client";
import { assertNoError } from "@/services/errors";
import type {
  CreateDriveInput,
  RecruiterVisit,
  RecruiterVisitWithRelations,
} from "@/services/types/db";

const driveSelect = `
  *,
  recruiter:recruiter!fk_rv_recruiter (
    id,
    company_name,
    industry,
    logo_url
  ),
  placement_year (
    id,
    year
  ),
  recruiter_visit_department (
    department_id,
    offers_count
  )
`;

export async function listDrives(): Promise<RecruiterVisitWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiter_visit")
    .select(driveSelect)
    .order("visit_date", { ascending: false });

  assertNoError(error);
  console.log(data)
  return (data ?? []) as RecruiterVisitWithRelations[];
}

export async function getDrive(
  id: number,
): Promise<RecruiterVisitWithRelations | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiter_visit")
    .select(driveSelect)
    .eq("id", id)
    .maybeSingle();

  assertNoError(error);
  return data as RecruiterVisitWithRelations | null;
}

export async function createDrive(
  input: CreateDriveInput,
): Promise<RecruiterVisit> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiter_visit")
    .insert({
      recruiter_id: input.recruiter_id,
      placement_year_id: input.placement_year_id,
      visit_date: input.visit_date || null,
      min_package: input.min_package ?? null,
      max_package: input.max_package ?? null,
      total_offers: input.total_offers ?? null,
      visit: input.visit ?? null,
    })
    .select()
    .single();

  assertNoError(error);

  // If per-department offer counts were provided, insert them
  // into recruiter_visit_department against the new visit id
  if (input.department_offers && input.department_offers.length > 0) {
    const rows = input.department_offers.map((d) => ({
      recruiter_visit_id: data.id,
      department_id: d.department_id,
      offers_count: d.offers_count,
    }));

    const { error: deptError } = await supabase
      .from("recruiter_visit_department")
      .insert(rows);

    assertNoError(deptError);
  }

  return data;
}
export async function updateDrive(
  id: number,
  input: Partial<CreateDriveInput>,
): Promise<RecruiterVisit> {
  const supabase = createClient();
  const updateData: any = {};
  if (input.recruiter_id !== undefined) updateData.recruiter_id = input.recruiter_id;
  if (input.placement_year_id !== undefined) updateData.placement_year_id = input.placement_year_id;
  if (input.visit_date !== undefined) updateData.visit_date = input.visit_date || null;
  if (input.min_package !== undefined) updateData.min_package = input.min_package ?? null;
  if (input.max_package !== undefined) updateData.max_package = input.max_package ?? null;
  if (input.total_offers !== undefined) updateData.total_offers = input.total_offers ?? null;
  if (input.visit !== undefined) updateData.visit = input.visit ?? null;

  const { data, error } = await supabase
    .from("recruiter_visit")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  assertNoError(error);

  if (input.department_offers) {
    await supabase.from("recruiter_visit_department").delete().eq("recruiter_visit_id", id);
    if (input.department_offers.length > 0) {
      const rows = input.department_offers.map((d) => ({
        recruiter_visit_id: id,
        department_id: d.department_id,
        offers_count: d.offers_count,
      }));
      const { error: deptError } = await supabase.from("recruiter_visit_department").insert(rows);
      assertNoError(deptError);
    }
  }

  return data;
}

export async function deleteDrive(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("recruiter_visit").delete().eq("id", id);
  assertNoError(error);
}
