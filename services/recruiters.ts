import { createClient } from "@/utils/supabase/client";
import { assertNoError } from "@/services/errors";
import type { CreateRecruiterInput, Recruiter, RecruiterWithStats } from "@/services/types/db";

export async function listRecruiters(): Promise<RecruiterWithStats[]> {
  const supabase = createClient();
  const { data, error } = await supabase
  .from("recruiter")
  .select(`
    *,
    recruiter_visit (
      min_package,
      max_package,
      recruiter_visit_department!inner (
        offers_count
      )
    )
  `)
  .gt("recruiter_visit.recruiter_visit_department.offers_count", 0)
  .order("company_name");

  console.log(data);

  assertNoError(error);
  return (data ?? []) as RecruiterWithStats[];
}

export async function createRecruiter(
  input: CreateRecruiterInput,
): Promise<Recruiter> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiter")
    .insert({
      company_name: input.company_name.trim(),
      industry: input.industry?.trim() || null,
      website: input.website?.trim() || null,
      contact_name: input.contact_name?.trim() || null,
      contact_email: input.contact_email?.trim() || null,
      first_visited_year: input.first_visited_year ?? null,
      logo_url: input.logo_url?.trim() || null,
    })
    .select()
    .single();

  assertNoError(error);
  return data;
}

export async function updateRecruiterLogo(
  id: number,
  logoUrl: string,
): Promise<Recruiter> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiter")
    .update({ logo_url: logoUrl })
    .eq("id", id)
    .select()
    .single();

  assertNoError(error);
  return data;
}
export async function updateRecruiter(
  id: number,
  input: Partial<CreateRecruiterInput>,
): Promise<Recruiter> {
  const supabase = createClient();
  const updateData: any = {};
  if (input.company_name !== undefined) updateData.company_name = input.company_name.trim();
  if (input.industry !== undefined) updateData.industry = input.industry?.trim() || null;
  if (input.website !== undefined) updateData.website = input.website?.trim() || null;
  if (input.contact_name !== undefined) updateData.contact_name = input.contact_name?.trim() || null;
  if (input.contact_email !== undefined) updateData.contact_email = input.contact_email?.trim() || null;
  if (input.first_visited_year !== undefined) updateData.first_visited_year = input.first_visited_year ?? null;
  if (input.logo_url !== undefined) updateData.logo_url = input.logo_url?.trim() || null;

  const { data, error } = await supabase
    .from("recruiter")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  assertNoError(error);
  return data;
}

export async function deleteRecruiter(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("recruiter").delete().eq("id", id);
  assertNoError(error);
}
