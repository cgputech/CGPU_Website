import { createClient } from "@/utils/supabase/client";
import { assertNoError } from "@/services/errors";
import type { Asset, CreateAssetInput } from "@/services/types/db";

export async function listAssets(recruitmentId?: number): Promise<Asset[]> {
  const supabase = createClient();
  let query = supabase.from("assets").select("*").order("created_at", {
    ascending: false,
  });

  if (recruitmentId !== undefined) {
    query = query.eq("recruitment_id", recruitmentId);
  }

  const { data, error } = await query;
  assertNoError(error);
  return data ?? [];
}

export async function createAsset(input: CreateAssetInput): Promise<Asset> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("assets")
    .insert({
      placement_id: input.placement_id,
      asset_type: input.asset_type,
      image_url: input.image_url,
    })
    .select()
    .single();

  assertNoError(error);
  return data;
}

export async function deleteAsset(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("assets").delete().eq("id", id);
  assertNoError(error);
}
