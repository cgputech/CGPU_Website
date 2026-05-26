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
import { listDepartments } from "@/services/departments";
import { listDrives } from "@/services/drives";
import { createOffer, listOffers } from "@/services/offers";
import { createStudent, listStudents } from "@/services/students";
import { ServiceError } from "@/services/errors";
import type {
  Department,
  OfferWithRelations,
  RecruiterVisitWithRelations,
  StudentWithDepartment,
} from "@/services/types/db";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentWithDepartment[]>([]);
  const [offers, setOffers] = useState<OfferWithRelations[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [drives, setDrives] = useState<RecruiterVisitWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [studentForm, setStudentForm] = useState({
    roll_number: "",
    full_name: "",
    department_id: "",
    graduation_year: "",
    cgpa: "",
    email: "",
    linkedin: "",
    is_eligible: true,
  });

  const [offerForm, setOfferForm] = useState({
    student_id: "",
    recruiter_visit_id: "",
    package_lpa: "",
    role_title: "",
    offer_status: "offered",
    is_accepted: true,
    joining_date: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const [studentList, offerList, deptList, driveList] = await Promise.all([
        listStudents(),
        listOffers(),
        listDepartments(),
        listDrives(),
      ]);
      setStudents(studentList);
      setOffers(offerList);
      setDepartments(deptList);
      setDrives(driveList);
    } catch (e) {
      setStatus({
        type: "error",
        message: e instanceof ServiceError ? e.message : "Failed to load data.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const student = await createStudent({
        roll_number: studentForm.roll_number,
        full_name: studentForm.full_name,
        department_id: Number(studentForm.department_id),
        graduation_year: Number(studentForm.graduation_year),
        cgpa: studentForm.cgpa ? Number(studentForm.cgpa) : undefined,
        email: studentForm.email || undefined,
        linkedin: studentForm.linkedin || undefined,
        is_eligible: studentForm.is_eligible,
      });
      setStudentForm({
        roll_number: "",
        full_name: "",
        department_id: studentForm.department_id,
        graduation_year: studentForm.graduation_year,
        cgpa: "",
        email: "",
        linkedin: "",
        is_eligible: true,
      });
      setOfferForm((f) => ({ ...f, student_id: String(student.id) }));
      setStatus({ type: "success", message: "Student added." });
      await load();
    } catch (e) {
      setStatus({
        type: "error",
        message:
          e instanceof ServiceError ? e.message : "Failed to add student.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await createOffer({
        student_id: Number(offerForm.student_id),
        recruiter_visit_id: Number(offerForm.recruiter_visit_id),
        package_lpa: Number(offerForm.package_lpa),
        role_title: offerForm.role_title || undefined,
        offer_status: offerForm.offer_status,
        is_accepted: offerForm.is_accepted,
        joining_date: offerForm.joining_date || undefined,
      });
      setOfferForm({
        student_id: offerForm.student_id,
        recruiter_visit_id: "",
        package_lpa: "",
        role_title: "",
        offer_status: "offered",
        is_accepted: true,
        joining_date: "",
      });
      setStatus({
        type: "success",
        message: "Offer linked to recruiter drive.",
      });
      await load();
    } catch (e) {
      setStatus({
        type: "error",
        message:
          e instanceof ServiceError ? e.message : "Failed to create offer.",
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
        title="Students & Offers"
        description="Add students, then link each placement to a recruiter drive via an offer."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add student</CardTitle>
            <CardDescription>Stored in the `student` table.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStudentSubmit} className="flex flex-col gap-4">
              {status && (
                <StatusMessage type={status.type} message={status.message} />
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="roll_number">Roll number *</Label>
                  <Input
                    id="roll_number"
                    required
                    value={studentForm.roll_number}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        roll_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="full_name">Full name *</Label>
                  <Input
                    id="full_name"
                    required
                    value={studentForm.full_name}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        full_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="department_id">Department *</Label>
                  <select
                    id="department_id"
                    required
                    className={selectClass}
                    value={studentForm.department_id}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        department_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="graduation_year">Graduation year *</Label>
                  <Input
                    id="graduation_year"
                    type="number"
                    required
                    value={studentForm.graduation_year}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        graduation_year: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cgpa">CGPA</Label>
                  <Input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    value={studentForm.cgpa}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, cgpa: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={studentForm.email}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={studentForm.linkedin}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, linkedin: e.target.value })
                  }
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={studentForm.is_eligible}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      is_eligible: e.target.checked,
                    })
                  }
                />
                Eligible for placement
              </label>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Add student"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Link student to drive</CardTitle>
            <CardDescription>
              Creates an `offer` row for a recruiter visit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOfferSubmit} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="student_id">Student *</Label>
                <select
                  id="student_id"
                  required
                  className={selectClass}
                  value={offerForm.student_id}
                  onChange={(e) =>
                    setOfferForm({ ...offerForm, student_id: e.target.value })
                  }
                >
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.roll_number})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="recruiter_visit_id">Placement drive *</Label>
                <select
                  id="recruiter_visit_id"
                  required
                  className={selectClass}
                  value={offerForm.recruiter_visit_id}
                  onChange={(e) =>
                    setOfferForm({
                      ...offerForm,
                      recruiter_visit_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select drive</option>
                  {drives.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.recruiter.company_name} · {d.placement_year.year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="package_lpa">Package (LPA) *</Label>
                  <Input
                    id="package_lpa"
                    type="number"
                    step="0.01"
                    required
                    value={offerForm.package_lpa}
                    onChange={(e) =>
                      setOfferForm({
                        ...offerForm,
                        package_lpa: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role_title">Role title</Label>
                  <Input
                    id="role_title"
                    value={offerForm.role_title}
                    onChange={(e) =>
                      setOfferForm({
                        ...offerForm,
                        role_title: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="offer_status">Offer status</Label>
                  <Input
                    id="offer_status"
                    value={offerForm.offer_status}
                    onChange={(e) =>
                      setOfferForm({
                        ...offerForm,
                        offer_status: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="joining_date">Joining date</Label>
                  <Input
                    id="joining_date"
                    type="date"
                    value={offerForm.joining_date}
                    onChange={(e) =>
                      setOfferForm({
                        ...offerForm,
                        joining_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={offerForm.is_accepted}
                  onChange={(e) =>
                    setOfferForm({
                      ...offerForm,
                      is_accepted: e.target.checked,
                    })
                  }
                />
                Offer accepted
              </label>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Add offer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent offers</CardTitle>
          <CardDescription>
            Students placed per recruiter drive
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : offers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No offers yet.</p>
          ) : (
            <ul className="divide-y">
              {offers.slice(0, 20).map((o) => (
                <li key={o.id} className="py-3 first:pt-0">
                  <p className="font-medium">
                    {o.student.full_name}{" "}
                    <span className="text-muted-foreground">
                      → {o.recruiter_visit.recruiter.company_name}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {o.role_title ?? "—"} · {o.package_lpa} LPA ·{" "}
                    {o.student.department.code} · {o.offer_status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
