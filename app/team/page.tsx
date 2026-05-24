"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, ShieldCheck, Users } from "lucide-react";
import { cmsService, TeamMember } from "@/services/cms";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const list = await cmsService.getTeamMembers();
        setTeam(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const facultyMembers = team.filter((m) => m.category === "Faculty");
  const studentMembers = team.filter((m) => m.category === "Student Representative");

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="border-b border-border-custom pb-6 mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Placement Coordination Board
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Get in touch with the official CGPU faculty coordinators and student representatives of SCTCE.
        </p>
      </div>

      {/* Faculty Placement Coordinators */}
      <div className="space-y-6 mb-16">
        <div className="flex items-center space-x-2 pb-2 border-b border-border-custom">
          <ShieldCheck className="h-5 w-5 text-primary-red" />
          <h2 className="text-xl font-extrabold text-text-primary">Faculty Leadership</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facultyMembers.map((member) => (
            <Card key={member.id} className="flex flex-col justify-between" hoverEffect={true}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-soft-red flex items-center justify-center font-extrabold text-base text-primary-red">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-text-primary">{member.name}</h3>
                    <span className="text-[10px] text-text-secondary font-semibold uppercase">{member.role}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 space-y-2 text-xs text-text-secondary">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary-red" />
                  <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
                </div>
                {member.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary-red" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Student Representatives */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 pb-2 border-b border-border-custom">
          <Users className="h-5 w-5 text-primary-red" />
          <h2 className="text-xl font-extrabold text-text-primary">Student Coordination Committee</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studentMembers.map((member) => (
            <Card key={member.id} className="flex flex-col justify-between" hoverEffect={true}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-soft-red flex items-center justify-center font-extrabold text-base text-primary-red">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-text-primary">{member.name}</h3>
                    <span className="text-[10px] text-text-secondary font-semibold uppercase">{member.role}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 space-y-2 text-xs text-text-secondary">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary-red" />
                  <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
                </div>
                {member.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary-red" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
