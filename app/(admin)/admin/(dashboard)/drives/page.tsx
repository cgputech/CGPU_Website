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
import { createDrive, listDrives } from "@/services/drives";
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
    roles_offered: "",
    students_placed: "0",
    avg_package: "",
    highest_package: "",
    total_offers_made: "0",
  });
  const [newYear, setNewYear] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await createDrive({
        recruiter_id: Number(form.recruiter_id),
        placement_year_id: Number(form.placement_year_id),
        visit_date: form.visit_date || undefined,
        average_package: form.avg_package ? Number(form.avg_package) : undefined,
        max_package: form.highest_package
          ? Number(form.highest_package)
          : undefined,
      });
      setForm({
        recruiter_id: "",
        placement_year_id: form.placement_year_id,
        visit_date: "",
        roles_offered: "",
        students_placed: "0",
        avg_package: "",
        highest_package: "",
        total_offers_made: "0",
      });
      setStatus({ type: "success", message: "Placement drive created." });
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
            <CardTitle>Create drive</CardTitle>
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

              <div className="space-y-1.5">
                <Label htmlFor="roles_offered">Roles offered</Label>
                <Input
                  id="roles_offered"
                  placeholder="Software Engineer, GET, …"
                  value={form.roles_offered}
                  onChange={(e) =>
                    setForm({ ...form, roles_offered: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="students_placed">Students placed</Label>
                  <Input
                    id="students_placed"
                    type="number"
                    min={0}
                    value={form.students_placed}
                    onChange={(e) =>
                      setForm({ ...form, students_placed: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="total_offers_made">Total offers</Label>
                  <Input
                    id="total_offers_made"
                    type="number"
                    min={0}
                    value={form.total_offers_made}
                    onChange={(e) =>
                      setForm({ ...form, total_offers_made: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="avg_package">Avg package (LPA)</Label>
                  <Input
                    id="avg_package"
                    type="number"
                    step="0.01"
                    value={form.avg_package}
                    onChange={(e) =>
                      setForm({ ...form, avg_package: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="highest_package">Highest package (LPA)</Label>
                  <Input
                    id="highest_package"
                    type="number"
                    step="0.01"
                    value={form.highest_package}
                    onChange={(e) =>
                      setForm({ ...form, highest_package: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Create drive"}
              </Button>
            </form>
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
                  <li key={d.id} className="py-3 first:pt-0">
                    <p className="font-medium">
                      {d.recruiter!.company_name}{" "}
                      <span className="text-muted-foreground">
                        · {d.placement_year!.year}
                      </span>
                    </p>
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
