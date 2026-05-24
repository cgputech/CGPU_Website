import Link from "next/link";
import { Compass, ArrowRight, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Animated warning node */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-soft-red text-primary-red">
          <Compass className="h-8 w-8 animate-spin-slow" />
        </div>

        {/* Text descriptions */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-primary-red uppercase tracking-widest block">
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Requested Page Not Found
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            The link you followed may be broken, or the placement campaign resource has been archived. Check with your student coordinators if you believe this is an error.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            Return to Homepage
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
          <Link
            href="/about#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-border-custom text-text-primary bg-card hover:bg-slate-50 text-xs font-semibold rounded transition-colors"
          >
            Report broken link
          </Link>
        </div>

        {/* Accredited footnote */}
        <div className="pt-8 border-t border-border-custom flex items-center justify-center space-x-2 text-[10px] text-text-secondary">
          <ShieldAlert className="h-3.5 w-3.5 text-primary-red" />
          <span>SCTCE Placement Wing Operations Cell</span>
        </div>

      </div>
    </div>
  );
}
