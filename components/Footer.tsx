import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Brand */}
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <img
                src="/cgpulogo.png"
                alt="CGPU SCTCE"
                className="h-10 w-10 object-contain"
              />

              <div>
                <h3 className="font-semibold tracking-tight">
                  CGPU SCTCE
                </h3>
                <p className="text-sm text-muted-foreground">
                  Career Guidance & Placement Unit
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Connecting students with opportunities through
              campus recruitment, internships, and industry
              engagement.
            </p>
          </div>

          {/* Links + Contact */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-4 text-sm font-medium">
                Quick Links
              </h4>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href="/team"
                    className="hover:text-primary transition-colors"
                  >
                    Team
                  </Link>
                </li>

                <li>
                  <Link
                    href="/testimonials"
                    className="hover:text-primary transition-colors"
                  >
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium">
                Contact
              </h4>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Thiruvananthapuram, Kerala</span>
                </li>

                <li className="flex gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href="mailto:placement@sctce.ac.in"
                    className="hover:text-primary"
                  >
                    placement@sctce.ac.in
                  </a>
                </li>

                <li className="flex gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+91 471 2490572</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} CGPU SCTCE.
            All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://www.sctce.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary"
            >
              SCTCE
              <ExternalLink className="h-3 w-3" />
            </a>

            <Link
              href="/privacy"
              className="hover:text-primary"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="hover:text-primary"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

