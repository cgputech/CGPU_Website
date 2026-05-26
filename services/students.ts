import { createClient } from "@/utils/supabase/client";
import { assertNoError } from "@/services/errors";
import type {
  CreateStudentInput,
  Student,
  StudentWithDepartment,
} from "@/services/types/db";

const studentSelect = `
  *,
  department ( id, name, code )
`;

export async function listStudents(): Promise<StudentWithDepartment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("student")
    .select(studentSelect)
    .order("full_name");

  assertNoError(error);
  return (data ?? []) as StudentWithDepartment[];
}

export async function listStudentsByDrive(
  recruiterVisitId: number,
): Promise<StudentWithDepartment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("offer")
    .select(`student (${studentSelect})`)
    .eq("recruiter_visit_id", recruiterVisitId);

  assertNoError(error);

  const students = (data ?? [])
    .map((row) => {
      const student = row.student;
      if (!student || Array.isArray(student)) return null;
      return student as StudentWithDepartment;
    })
    .filter((s): s is StudentWithDepartment => s !== null);

  const unique = new Map(students.map((s) => [s.id, s]));
  return Array.from(unique.values());
}

export async function createStudent(
  input: CreateStudentInput,
): Promise<Student> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("student")
    .insert({
      roll_number: input.roll_number.trim(),
      full_name: input.full_name.trim(),
      department_id: input.department_id,
      graduation_year: input.graduation_year,
      cgpa: input.cgpa ?? null,
      email: input.email?.trim() || null,
      is_eligible: input.is_eligible ?? true,
      linkedin: input.linkedin?.trim() || null,
    })
    .select()
    .single();

  assertNoError(error);
  return data;
}
