"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Calendar,
  ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/services/auth/auth.client";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/drives", label: "Placement Drives", icon: Calendar },
  { href: "/admin/recruiters", label: "Recruiters", icon: Building2 },
  { href: "/admin/dept-placements", label: "Dept Placements", icon: LayoutGrid },
  { href: "/admin/posters", label: "Posters", icon: ImageIcon },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4 flex flex-row items-center gap-3 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-red text-white font-bold flex-shrink-0">
            CG
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sidebar-foreground truncate">CGPU Admin</span>
            <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60 truncate">Placement Management</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 mb-2 px-2">Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(({ href, label, icon: Icon }) => {
                  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={label} className={cn("transition-colors mb-1", active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "")}>
                        <Link href={href}>
                          <Icon className="size-4" />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
                <LogOut className="size-4" />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col min-h-screen bg-muted/20">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6 shadow-sm">
          <SidebarTrigger className="-ml-1" />
          <div className="font-medium text-sm text-muted-foreground flex items-center gap-2">
            <span className="hidden sm:inline">CGPU</span> Admin Portal
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
