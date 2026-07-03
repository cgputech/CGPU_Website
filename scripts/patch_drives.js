const fs = require('fs');
const file = 'app/(admin)/admin/(dashboard)/drives/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Imports
content = content.replace(
  'import { createDrive, listDrives } from "@/services/drives";',
  'import { createDrive, listDrives, updateDrive, deleteDrive } from "@/services/drives";'
);

// State
content = content.replace(
  '  const [newYear, setNewYear] = useState("");',
  '  const [newYear, setNewYear] = useState("");\n  const [editId, setEditId] = useState<number | null>(null);'
);

// Form title
content = content.replace(
  '<CardTitle>Create drive</CardTitle>',
  '<CardTitle>{editId ? "Edit drive" : "Create drive"}</CardTitle>'
);
content = content.replace(
  '{saving ? "Saving…" : "Create drive"}',
  '{saving ? "Saving…" : editId ? "Update drive" : "Create drive"}'
);

// Handlers
content = content.replace(
  '  const handleSubmit = async (e: React.FormEvent) => {',
  `  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this drive?")) return;
    try {
      await deleteDrive(id);
      await load();
    } catch (e: any) {
      alert("Failed to delete: " + e.message);
    }
  };

  const handleEdit = (d: RecruiterVisitWithRelations) => {
    setEditId(d.id);
    setForm({
      recruiter_id: String(d.recruiter_id),
      placement_year_id: String(d.placement_year_id),
      visit_date: d.visit_date || "",
      min_package: d.min_package ? String(d.min_package) : "",
      max_package: d.max_package ? String(d.max_package) : "",
      total_offers: d.total_offers ? String(d.total_offers) : "",
      visit: d.visit || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {`
);

// Submit logic
content = content.replace(
  /await createDrive\(\{[\s\S]*?visit: form\.visit \? \(form\.visit as 'on_campus' \| 'off_campus'\) : undefined,\n\s*\}\);/,
  `if (editId) {
        await updateDrive(editId, {
          recruiter_id: Number(form.recruiter_id),
          placement_year_id: Number(form.placement_year_id),
          visit_date: form.visit_date || undefined,
          min_package: form.min_package ? Number(form.min_package) : undefined,
          max_package: form.max_package ? Number(form.max_package) : undefined,
          total_offers: form.total_offers ? Number(form.total_offers) : undefined,
          visit: form.visit ? (form.visit as 'on_campus' | 'off_campus') : undefined,
        });
      } else {
        await createDrive({
          recruiter_id: Number(form.recruiter_id),
          placement_year_id: Number(form.placement_year_id),
          visit_date: form.visit_date || undefined,
          min_package: form.min_package ? Number(form.min_package) : undefined,
          max_package: form.max_package ? Number(form.max_package) : undefined,
          total_offers: form.total_offers ? Number(form.total_offers) : undefined,
          visit: form.visit ? (form.visit as 'on_campus' | 'off_campus') : undefined,
        });
      }`
);
content = content.replace(
  'setStatus({ type: "success", message: "Placement drive created." });',
  'setStatus({ type: "success", message: editId ? "Placement drive updated." : "Placement drive created." });\n      setEditId(null);'
);

// Add cancel button
content = content.replace(
  '<Button type="submit" disabled={saving}>',
  `<div className="flex gap-2">{editId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditId(null);
                  setForm({
                    recruiter_id: "", placement_year_id: "", visit_date: "", min_package: "", max_package: "", total_offers: "", visit: ""
                  });
                }}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={saving}>`
);
content = content.replace(
  '</form>',
  '</div></form>'
);

// Add edit/delete buttons
content = content.replace(
  /                  <li key=\{d\.id\} className="py-3 first:pt-0">\n                    <p className="font-medium">\n                      \{d\.recruiter!\.company_name\}\{" "\}\n                      <span className="text-muted-foreground">\n                        · \{d\.placement_year!\.year\}\n                      <\/span>\n                    <\/p>\n                  <\/li>/g,
  `                  <li key={d.id} className="py-3 first:pt-0 flex justify-between items-center">
                    <p className="font-medium">
                      {d.recruiter!.company_name}{" "}
                      <span className="text-muted-foreground">
                        · {d.placement_year!.year}
                      </span>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(d)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(d.id)}>Delete</Button>
                    </div>
                  </li>`
);

fs.writeFileSync(file, content);
