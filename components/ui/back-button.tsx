"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <Link
      href="/"
      className="fixed top-5 left-5 z-50 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-3.5 py-2 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur-sm transition-all hover:border-zinc-300 hover:text-zinc-900 hover:shadow-md"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back
    </Link>
  );
}
