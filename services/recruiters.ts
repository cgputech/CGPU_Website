import { createClient } from "@/utils/supabase/client";
import { assertNoError } from "@/services/errors";
import type { CreateRecruiterInput, Recruiter } from "@/services/types/db";

export async function listRecruiters(): Promise<Recruiter[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiter")
    .select("*")
    .order("company_name");

  assertNoError(error);
  return data ?? [];
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
