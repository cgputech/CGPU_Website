import Link from "next/link";
import { Building2, Calendar, GraduationCap, ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sections = [
  {
    href: "/admin/drives",
    title: "Placement Drives",
    description: "Create recruiter visits for each placement year.",
    icon: Calendar,
  },
  {
    href: "/admin/recruiters",
    title: "Recruiters",
    description: "Add companies and upload recruiter logos.",
    icon: Building2,
  },
  {
    href: "/admin/students",
    title: "Students & Offers",
    description: "Register students and link offers to drives.",
    icon: GraduationCap,
  },
  {
    href: "/admin/posters",
    title: "Posters",
    description: "Upload placement campaign posters to Cloudinary.",
    icon: ImageIcon,
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Manage placement data for the CGPU public website."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition hover:border-primary-red/40 hover:shadow-sm">
              <CardHeader>
                <div className="mb-2 inline-flex rounded-lg bg-soft-red p-2 text-primary-red">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary-red">
                  Open →
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
