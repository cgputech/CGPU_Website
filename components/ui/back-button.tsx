"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  return (
    <Button
      asChild
      variant="ghost"
      className="fixed top-4 left-4 sm:top-5 sm:left-5 z-50 text-sm font-medium text-black hover:text-zinc-900 px-2.5 py-1.5 h-auto bg-white border border-gray-200/50 shadow-sm rounded-2xl"
    >
      <Link href="/">
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Back
      </Link>
    </Button>
  );
}
