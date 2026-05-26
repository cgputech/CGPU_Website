import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CGPU SCTCE | Placement & Career Guidance Unit - Sree Chitra Thirunal College of Engineering",
  description: "The Career Guidance & Placement Unit (CGPU) of Sree Chitra Thirunal College of Engineering (SCTCE), Trivandrum, facilitates professional placements, internships, and skill training campaigns.",
  openGraph: {
    title: "CGPU SCTCE | Career Guidance & Placement Cell",
    description: "Connecting world-class recruiters with industry-ready engineering graduates from Sree Chitra Thirunal College of Engineering (SCTCE), Trivandrum.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col text-foreground">
        {children}
      </body>
    </html>
  );
}
