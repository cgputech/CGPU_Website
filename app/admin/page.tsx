"use client";

import Link from "next/link";
import { ShieldCheck, Lock, ExternalLink, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function AdminGatewayPage() {
  const strapiAdminUrl = process.env.NEXT_PUBLIC_STRAPI_URL 
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/admin`
    : "http://localhost:1337/admin";

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center px-4 bg-background">
      
      {/* Back CTA */}
      <Link href="/" className="inline-flex items-center text-xs font-bold text-text-secondary hover:text-text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Homepage
      </Link>

      <Card className="max-w-md w-full p-8 space-y-6 text-center shadow-lg" hoverEffect={false}>
        
        {/* Animated lock node */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-soft-red text-primary-red">
          <Lock className="h-8 w-8" />
        </div>

        {/* Text descriptions */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-primary-red uppercase tracking-widest block">
            Administrative Gateway
          </span>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Strapi Content Manager
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Welcome to the CGPU Outcomes Platform administrative portal. Access this gateway to publish placement statistics, manage recruiter directory, update student coordinator profiles, and download brochures.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <a
            href={strapiAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center px-5 py-3 bg-primary-red hover:bg-primary-red-hover text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
          >
            Authenticate via Strapi CMS
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </a>
        </div>

        {/* Audit footnote */}
        <div className="pt-6 border-t border-border-custom flex items-center justify-center space-x-2 text-[10px] text-text-secondary">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>SCTCE Placement Wing Operations Cell</span>
        </div>

      </Card>
    </div>
  );
}
