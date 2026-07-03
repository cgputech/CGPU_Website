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
import { createDrive, listDrives, updateDrive, deleteDrive } from "@/services/drives";
import { listRecruiters } from "@/services/recruiters";
import {
  createPlacementYear,
  listPlacementYears,
} from "@/services/placement-years";
import { ServiceError } from "@/services/errors";
import type { PlacementYear, Recruiter } from "@/services/types/db";
import type { RecruiterVisitWithRelations } from "@/services/types/db";

export default function AdminDrivesPage() {
  const [drives, setDrives] = useState<RecruiterVisitWithRelations[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [years, setYears] = useState<PlacementYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [form, setForm] = useState({
    recruiter_id: "",
    placement_year_id: "",
    visit_date: "",
    min_package: "",
    max_package: "",
    total_offers: "",
    visit: "",
  });
  const [newYear, setNewYear] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [driveList, recruiterList, yearList] = await Promise.all([
        listDrives(),
        listRecruiters(),
        listPlacementYears(),
      ]);
      setDrives(driveList);
      setRecruiters(recruiterList);
      setYears(yearList);
    } catch (e) {
      setStatus({
        type: "error",
        message:
          e instanceof ServiceError ? e.message : "Failed to load drives.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddYear = async () => {
    if (!newYear) return;
    setSaving(true);
    setStatus(null);
    try {
      const year = await createPlacementYear({ year: Number(newYear) });
      setYears((prev) => [year, ...prev].sort((a, b) => b.year - a.year));
      setForm((f) => ({ ...f, placement_year_id: String(year.id) }));
      setNewYear("");
      setStatus({ type: "success", message: `Placement year ${year.year} added.` });
    } catch (e) {
      setStatus({
        type: "error",
        message:
          e instanceof ServiceError ? e.message : "Failed to add placement year.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      if (editId) {
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
      }
      setForm({
        recruiter_id: "",
        placement_year_id: form.placement_year_id,
        visit_date: "",
        min_package: "",
        max_package: "",
        total_offers: "",
        visit: "",
      });
      setStatus({ type: "success", message: editId ? "Placement drive updated." : "Placement drive created." });
      setEditId(null);
      await load();
    } catch (e) {
      setStatus({
        type: "error",
        message:
          e instanceof ServiceError ? e.message : "Failed to create drive.",
      });
    } finally {
      setSaving(false);
    }
  };

  const selectClass =
    "flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <div>
      <PageHeader
        title="Placement Drives"
        description="Each drive is a recruiter visit for a placement year (recruiter_visit table)."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editId ? "Edit drive" : "Create drive"}</CardTitle>
            <CardDescription>
              Link a recruiter to a placement year with visit details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {status && (
                <StatusMessage type={status.type} message={status.message} />
              )}

              <div className="space-y-1.5">
                <Label htmlFor="recruiter_id">Recruiter *</Label>
                <select
                  id="recruiter_id"
                  required
                  className={selectClass}
                  value={form.recruiter_id}
                  onChange={(e) =>
                    setForm({ ...form, recruiter_id: e.target.value })
                  }
                >
                  <option value="">Select recruiter</option>
                  {recruiters.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.company_name}
                    </option>
                  ))}
                </select>
                {recruiters.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add recruiters first.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="placement_year_id">Placement year *</Label>
                <select
                  id="placement_year_id"
                  required
                  className={selectClass}
                  value={form.placement_year_id}
                  onChange={(e) =>
                    setForm({ ...form, placement_year_id: e.target.value })
                  }
                >
                  <option value="">Select year</option>
                  {years.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="e.g. 2026"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving || !newYear}
                  onClick={handleAddYear}
                >
                  Add year
                </Button>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="visit_date">Visit date</Label>
                <Input
                  id="visit_date"
                  type="date"
                  value={form.visit_date}
                  onChange={(e) =>
                    setForm({ ...form, visit_date: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="min_package">Min package (LPA)</Label>
                  <Input
                    id="min_package"
                    type="number"
                    step="0.01"
                    min={0}
                    value={form.min_package}
                    onChange={(e) =>
                      setForm({ ...form, min_package: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="max_package">Max package (LPA)</Label>
                  <Input
                    id="max_package"
                    type="number"
                    step="0.01"
                    min={0}
                    value={form.max_package}
                    onChange={(e) =>
                      setForm({ ...form, max_package: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="total_offers">Total offers</Label>
                  <Input
                    id="total_offers"
                    type="number"
                    min={0}
                    value={form.total_offers}
                    onChange={(e) =>
                      setForm({ ...form, total_offers: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="visit">Visit type</Label>
                  <select
                    id="visit"
                    className={selectClass}
                    value={form.visit}
                    onChange={(e) =>
                      setForm({ ...form, visit: e.target.value })
                    }
                  >
                    <option value="">Select type</option>
                    <option value="on_campus">On Campus</option>
                    <option value="off_campus">Off Campus</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">{editId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditId(null);
                  setForm({
                    recruiter_id: "", placement_year_id: "", visit_date: "", min_package: "", max_package: "", total_offers: "", visit: ""
                  });
                }}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : editId ? "Update drive" : "Create drive"}
              </Button>
            </div></form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All drives</CardTitle>
            <CardDescription>{drives.length} recruiter visits</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : drives.length === 0 ? (
              <p className="text-sm text-muted-foreground">No drives yet.</p>
            ) : (
              <ul className="divide-y">
                {drives.map((d) => (
                  <li key={d.id} className="py-3 first:pt-0 flex justify-between items-center">
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