"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusMessage } from "@/components/admin/status-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createRecruiter, listRecruiters, updateRecruiterLogo } from "@/services/recruiters";
import { uploadImage } from "@/services/cloudinary";
import { ServiceError } from "@/services/errors";
import type { Recruiter } from "@/services/types/db";

export default function AdminRecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    company_name: "",
    industry: "",
    website: "",
    contact_name: "",
    contact_email: "",
    first_visited_year: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      setRecruiters(await listRecruiters());
    } catch (e) {
      setStatus({
        type: "error",
        message: e instanceof ServiceError ? e.message : "Failed to load recruiters.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const recruiter = await createRecruiter({
        company_name: form.company_name,
        industry: form.industry || undefined,
        website: form.website || undefined,
        contact_name: form.contact_name || undefined,
        contact_email: form.contact_email || undefined,
        first_visited_year: form.first_visited_year
          ? Number(form.first_visited_year)
          : undefined,
      });

      if (logoFile) {
        const logoUrl = await uploadImage(logoFile);
        await updateRecruiterLogo(recruiter.id, logoUrl);
      }

      setForm({
        company_name: "",
        industry: "",
        website: "",
        contact_name: "",
        contact_email: "",
        first_visited_year: "",
      });
      setLogoFile(null);
      setStatus({ type: "success", message: "Recruiter added successfully." });
      await load();
    } catch (e) {
      setStatus({
        type: "error",
        message: e instanceof ServiceError ? e.message : "Failed to add recruiter.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Recruiters"
        description="Add companies that visit campus for placements."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add recruiter</CardTitle>
            <CardDescription>Stored in the `recruiter` table.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {status && <StatusMessage type={status.type} message={status.message} />}

              <div className="space-y-1.5">
                <Label htmlFor="company_name">Company name *</Label>
                <Input
                  id="company_name"
                  required
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contact_name">Contact name</Label>
                  <Input
                    id="contact_name"
                    value={form.contact_name}
                    onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact_email">Contact email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={form.contact_email}
                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="first_visited_year">First visited year</Label>
                <Input
                  id="first_visited_year"
                  type="number"
                  value={form.first_visited_year}
                  onChange={(e) => setForm({ ...form, first_visited_year: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="logo">Company logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Add recruiter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All recruiters</CardTitle>
            <CardDescription>{recruiters.length} companies</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : recruiters.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recruiters yet.</p>
            ) : (
              <ul className="divide-y">
                {recruiters.map((r) => (
                  <li key={r.id} className="flex gap-3 py-3 first:pt-0">
                    {r.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.logo_url}
                        alt={r.company_name}
                        className="size-10 rounded object-contain"
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded bg-muted text-xs font-bold">
                        {r.company_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{r.company_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.industry ?? "—"}
                        {r.contact_email ? ` · ${r.contact_email}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
