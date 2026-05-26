import { createClient } from "@/utils/supabase/client";
import { assertNoError } from "@/services/errors";
import type {
  CreateOfferInput,
  Offer,
  OfferWithRelations,
} from "@/services/types/db";

const offerSelect = `
  *,
  student (
    *,
    department ( id, name, code )
  ),
  recruiter_visit (
    *,
    recruiter ( id, company_name ),
    placement_year ( id, year )
  )
`;

export async function listOffers(): Promise<OfferWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("offer")
    .select(offerSelect)
    .order("id", { ascending: false });

  assertNoError(error);
  return (data ?? []) as OfferWithRelations[];
}

export async function listOffersByDrive(
  recruiterVisitId: number,
): Promise<OfferWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("offer")
    .select(offerSelect)
    .eq("recruiter_visit_id", recruiterVisitId)
    .order("id", { ascending: false });

  assertNoError(error);
  return (data ?? []) as OfferWithRelations[];
}

export async function createOffer(input: CreateOfferInput): Promise<Offer> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("offer")
    .insert({
      student_id: input.student_id,
      recruiter_visit_id: input.recruiter_visit_id,
      package_lpa: input.package_lpa,
      role_title: input.role_title?.trim() || null,
      offer_status: input.offer_status ?? "offered",
      is_accepted: input.is_accepted ?? true,
      joining_date: input.joining_date || null,
    })
    .select()
    .single();

  assertNoError(error);
  return data;
}
