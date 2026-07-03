const fs = require('fs');
const file = 'services/drives.ts';
let content = fs.readFileSync(file, 'utf8');

content += `
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
`;

fs.writeFileSync(file, content);
