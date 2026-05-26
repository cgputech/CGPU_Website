import { createClient } from "@/utils/supabase/client";
import { assertNoError } from "@/services/errors";
import type { Department } from "@/services/types/db";

export async function listDepartments(): Promise<Department[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("department")
    .select("*")
    .order("name");

  assertNoError(error);
  return data ?? [];
}
