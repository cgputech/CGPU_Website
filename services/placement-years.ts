import { createClient } from "@/utils/supabase/client";
import { assertNoError } from "@/services/errors";
import type {
  CreatePlacementYearInput,
  PlacementYear,
} from "@/services/types/db";

export async function listPlacementYears(): Promise<PlacementYear[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("placement_year")
    .select("*")
    .order("year", { ascending: false });

  assertNoError(error);
  return data ?? [];
}

export async function createPlacementYear(
  input: CreatePlacementYearInput,
): Promise<PlacementYear> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("placement_year")
    .insert({
      year: input.year,
      total_students_eligible: input.total_students_eligible ?? 0,
      total_placed: input.total_placed ?? 0,
      total_offers: input.total_offers ?? 0,
    })
    .select()
    .single();

  assertNoError(error);
  return data;
}
