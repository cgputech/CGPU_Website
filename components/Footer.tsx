import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border-custom text-text-primary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Institution Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/cgpulogo.png" 
                alt="SCTCE CGPU Logo" 
                className="h-12 w-auto object-contain bg-white p-0.5 border border-border-custom rounded shadow-xs" 
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-text-primary tracking-tight">
                  CGPU SCTCE
                </span>
                <span className="text-xs text-text-secondary">
                  Sree Chitra Thirunal College of Engineering
                </span>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Empowering students with industry-aligned skillsets and connecting global organizations with top-tier engineering talent.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-primary-red">
              <ShieldCheck className="h-4 w-4" />
              <span>NBA & NAAC Accredited Institution</span>
            </div>
          </div>



          {/* Students Info Column */}
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">
              For Students
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/drives" className="text-sm text-text-primary hover:text-primary-red transition-colors">
                  Active Drives & Internships
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-sm text-text-primary hover:text-primary-red transition-colors">
                  Training Schedules
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-sm text-text-primary hover:text-primary-red transition-colors">
                  Success Testimonials
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-text-primary hover:text-primary-red transition-colors">
                  Student Coordinators
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Contact Office
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2.5 mt-0.5 text-primary-red flex-shrink-0" />
                <span>SCTCE Campus, Pappanamcode, Thiruvananthapuram, Kerala, PIN: 695018</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2.5 text-primary-red flex-shrink-0" />
                <a href="mailto:placement@sctce.ac.in" className="hover:text-primary-red transition-colors">
                  placement@sctce.ac.in
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2.5 text-primary-red flex-shrink-0" />
                <span>+91-471-2490572</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-border-custom mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} CGPU Placement Cell. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="https://www.sctce.ac.in" target="_blank" rel="noreferrer" className="hover:text-primary-red flex items-center transition-colors">
              SCTCE Website
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <a href="#" className="hover:text-primary-red transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-red transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
