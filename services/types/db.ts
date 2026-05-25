export type Department = {
  id: number;
  name: string;
  code: string;
  head_of_dept: string | null;
};

export type PlacementYear = {
  id: number;
  year: number;
  total_students_eligible: number;
  total_placed: number;
  placement_rate: number | null;
  avg_package: number | null;
  highest_package: number | null;
  median_package: number | null;
  total_offers: number;
};

export type Recruiter = {
  id: number;
  company_name: string;
  industry: string | null;
  website: string | null;
  contact_name: string | null;
  contact_email: string | null;
  first_visited_year: number | null;
  logo_url: string | null;
};

export type RecruiterVisit = {
  id: number;
  recruiter_id: number;
  placement_year_id: number;
  visit_date: string | null;
  roles_offered: string | null;
  students_placed: number;
  avg_package: number | null;
  highest_package: number | null;
  total_offers_made: number;
};

export type RecruiterVisitWithRelations = RecruiterVisit & {
  recruiter: Pick<Recruiter, "id" | "company_name" | "industry" | "logo_url">;
  placement_year: Pick<PlacementYear, "id" | "year">;
};

export type Student = {
  id: number;
  roll_number: string;
  full_name: string;
  department_id: number;
  graduation_year: number;
  cgpa: number | null;
  email: string | null;
  is_eligible: boolean;
  linkedin: string | null;
};

export type StudentWithDepartment = Student & {
  department: Pick<Department, "id" | "name" | "code">;
};

export type Offer = {
  id: number;
  student_id: number;
  recruiter_visit_id: number;
  package_lpa: number;
  role_title: string | null;
  offer_status: string;
  is_accepted: boolean;
  joining_date: string | null;
};

export type OfferWithRelations = Offer & {
  student: StudentWithDepartment;
  recruiter_visit: RecruiterVisit & {
    recruiter: Pick<Recruiter, "id" | "company_name">;
    placement_year: Pick<PlacementYear, "id" | "year">;
  };
};

export type Asset = {
  id: string;
  recruitment_id: number | null;
  asset_type: string;
  image_url: string;
  created_at: string;
};

export type CreateRecruiterInput = {
  company_name: string;
  industry?: string;
  website?: string;
  contact_name?: string;
  contact_email?: string;
  first_visited_year?: number;
  logo_url?: string;
};

export type CreatePlacementYearInput = {
  year: number;
  total_students_eligible?: number;
  total_placed?: number;
  total_offers?: number;
};

export type CreateDriveInput = {
  recruiter_id: number;
  placement_year_id: number;
  visit_date?: string;
  roles_offered?: string;
  students_placed?: number;
  avg_package?: number;
  highest_package?: number;
  total_offers_made?: number;
};

export type CreateStudentInput = {
  roll_number: string;
  full_name: string;
  department_id: number;
  graduation_year: number;
  cgpa?: number;
  email?: string;
  is_eligible?: boolean;
  linkedin?: string;
};

export type CreateOfferInput = {
  student_id: number;
  recruiter_visit_id: number;
  package_lpa: number;
  role_title?: string;
  offer_status?: string;
  is_accepted?: boolean;
  joining_date?: string;
};

export type CreateAssetInput = {
  recruitment_id: number;
  asset_type: string;
  image_url: string;
};
