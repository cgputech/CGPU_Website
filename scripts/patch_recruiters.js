const fs = require('fs');
const file = 'app/(admin)/admin/(dashboard)/recruiters/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Imports
content = content.replace(
  'import { createRecruiter, listRecruiters, updateRecruiterLogo } from "@/services/recruiters";',
  'import { createRecruiter, listRecruiters, updateRecruiterLogo, updateRecruiter, deleteRecruiter } from "@/services/recruiters";'
);

// State
content = content.replace(
  'const [logoFile, setLogoFile] = useState<File | null>(null);',
  'const [logoFile, setLogoFile] = useState<File | null>(null);\n  const [editId, setEditId] = useState<number | null>(null);'
);

// Form title
content = content.replace(
  '<CardTitle>Add recruiter</CardTitle>',
  '<CardTitle>{editId ? "Edit recruiter" : "Add recruiter"}</CardTitle>'
);
content = content.replace(
  '{saving ? "Saving…" : "Add recruiter"}',
  '{saving ? "Saving…" : editId ? "Update recruiter" : "Add recruiter"}'
);

// Handlers
content = content.replace(
  '  const handleSubmit = async (e: React.FormEvent) => {',
  `  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this recruiter?")) return;
    try {
      await deleteRecruiter(id);
      await load();
    } catch (e: any) {
      alert("Failed to delete: " + e.message);
    }
  };

  const handleEdit = (r: Recruiter) => {
    setEditId(r.id);
    setForm({
      company_name: r.company_name,
      industry: r.industry || "",
      website: r.website || "",
      contact_name: r.contact_name || "",
      contact_email: r.contact_email || "",
      first_visited_year: r.first_visited_year ? String(r.first_visited_year) : "",
    });
    setLogoFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {`
);

// Submit logic
content = content.replace(
  /const recruiter = await createRecruiter\(\{[\s\S]*?first_visited_year:[^\n]*\n[^\n]*\n\s*\}\);[\s\S]*?await updateRecruiterLogo\(recruiter\.id, logoUrl\);\n\s*\}/,
  `if (editId) {
        await updateRecruiter(editId, {
          company_name: form.company_name,
          industry: form.industry || undefined,
          website: form.website || undefined,
          contact_name: form.contact_name || undefined,
          contact_email: form.contact_email || undefined,
          first_visited_year: form.first_visited_year ? Number(form.first_visited_year) : undefined,
        });
        if (logoFile) {
          const logoUrl = await uploadImage(logoFile);
          await updateRecruiterLogo(editId, logoUrl);
        }
      } else {
        const recruiter = await createRecruiter({
          company_name: form.company_name,
          industry: form.industry || undefined,
          website: form.website || undefined,
          contact_name: form.contact_name || undefined,
          contact_email: form.contact_email || undefined,
          first_visited_year: form.first_visited_year ? Number(form.first_visited_year) : undefined,
        });
        if (logoFile) {
          const logoUrl = await uploadImage(logoFile);
          await updateRecruiterLogo(recruiter.id, logoUrl);
        }
      }`
);
content = content.replace(
  'setStatus({ type: "success", message: "Recruiter added successfully." });',
  'setStatus({ type: "success", message: editId ? "Recruiter updated successfully." : "Recruiter added successfully." });\n      setEditId(null);'
);

// Add cancel button
content = content.replace(
  '<Button type="submit" disabled={saving}>',
  `<div className="flex gap-2">{editId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditId(null);
                  setForm({
                    company_name: "", industry: "", website: "", contact_name: "", contact_email: "", first_visited_year: ""
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
  /                      <p className="text-xs text-muted-foreground">\n                        {r\.industry \?\? "—"}\n                        {r\.contact_email \? ` · \$\{r\.contact_email\}` : ""}\n                      <\/p>\n                    <\/div>/g,
  `                      <p className="text-xs text-muted-foreground">
                        {r.industry ?? "—"}
                        {r.contact_email ? \` · \${r.contact_email}\` : ""}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(r)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>Delete</Button>
                    </div>`
);

fs.writeFileSync(file, content);
