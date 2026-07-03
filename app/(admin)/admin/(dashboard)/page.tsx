import Link from "next/link";
import { Building2, Calendar, ImageIcon, LayoutGrid, Users, Briefcase, ChevronRight, Activity } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { listRecruiters } from "@/services/recruiters";
import { listDrives } from "@/services/drives";
import { listPlacementYears } from "@/services/placement-years";

export default async function AdminDashboardPage() {
  // Fetch stats for the dashboard
  const [recruiters, drives, years] = await Promise.all([
    listRecruiters(),
    listDrives(),
    listPlacementYears(),
  ]);

  const totalRecruiters = recruiters.length;
  const totalDrives = drives.length;
  const totalOffers = drives.reduce((acc, drive) => {
    return acc + (drive.recruiter_visit_department?.reduce((sum, d) => sum + (d.offers_count || 0), 0) || 0);
  }, 0);

  const sections = [
    {
      href: "/admin/drives",
      title: "Placement Drives",
      description: "Manage recruiter visits and packages.",
      icon: Calendar,
      stat: `${totalDrives} Drives`,
    },
    {
      href: "/admin/recruiters",
      title: "Recruiters",
      description: "Add companies and upload logos.",
      icon: Building2,
      stat: `${totalRecruiters} Companies`,
    },
    {
      href: "/admin/dept-placements",
      title: "Dept Placements",
      description: "Matrix of offers per department.",
      icon: LayoutGrid,
      stat: `${totalOffers} Total Offers`,
    },
    {
      href: "/admin/posters",
      title: "Posters",
      description: "Manage placement campaign posters.",
      icon: ImageIcon,
      stat: "Manage Assets",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Manage placement data for the CGPU public website.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary-red/5 border-primary-red/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recruiters</CardTitle>
            <Building2 className="h-4 w-4 text-primary-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecruiters}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered companies
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Drives</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDrives}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {years.length} placement years
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOffers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tracked in dept-placements
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map(({ href, title, description, icon: Icon, stat }) => (
            <Link key={href} href={href} className="group outline-none">
              <Card className="h-full transition-all duration-200 hover:border-primary-red/40 hover:shadow-md focus:border-primary-red/40 focus:ring-2 focus:ring-primary-red/20">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold group-hover:text-primary-red transition-colors">{title}</CardTitle>
                    <CardDescription className="text-sm">{description}</CardDescription>
                  </div>
                  <div className="rounded-md bg-muted p-2 group-hover:bg-soft-red transition-colors">
                    <Icon className="size-5 text-muted-foreground group-hover:text-primary-red transition-colors" />
                  </div>
                </CardHeader>
                <CardFooter className="pt-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">{stat}</span>
                    <span className="flex items-center text-xs font-medium text-primary-red opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                      Manage <ChevronRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
