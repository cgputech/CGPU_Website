import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-transparent border-t border-transparent">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Brand */}
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image
                src="/icon.png"
                alt="CGPU SCTCE"
                width={32}
                height={32}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                    href="/placements"
                    className="hover:text-primary transition-colors"
                  >
                    Placements
                  </Link>
                </li>

                <li>
                  <Link 
                    href="/gallery"
                    className="hover:text-primary transition-colors"
                  >
                    Gallery
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
                    href="mailto:cgpu@sctce.ac.in"
                    className="hover:text-primary transition-colors"
                  >
                    cgpu@sctce.ac.in
                  </a>
                </li>

                <li className="flex gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+91 8943333543</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

