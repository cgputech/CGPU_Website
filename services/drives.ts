import { createClient } from "@/utils/supabase/client";
import { assertNoError } from "@/services/errors";
import type {
  CreateDriveInput,
  RecruiterVisit,
  RecruiterVisitWithRelations,
} from "@/services/types/db";

const driveSelect = `
  *,
  recruiter ( id, company_name, industry, logo_url ),
  placement_year ( id, year )
`;

export async function listDrives(): Promise<RecruiterVisitWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiter_visit")
    .select(driveSelect)
    .order("visit_date", { ascending: false });

  assertNoError(error);
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
      roles_offered: input.roles_offered?.trim() || null,
      students_placed: input.students_placed ?? 0,
      avg_package: input.avg_package ?? null,
      highest_package: input.highest_package ?? null,
      total_offers_made: input.total_offers_made ?? 0,
    })
    .select()
    .single();

  assertNoError(error);
  return data;
}
