"use client";

/**
 * Custom reusable Button component adhering to docs/sizes.md:
 * - min-height: sm (32px), md (40px, default), lg (48px)
 * - Touch hit area >= 44x44px
 * - Space & padding use tokens
 * - Focus ring: 2px, 2px offset
 * - No layout shift on hover/focus/active
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium leading-snug cursor-pointer select-none transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",

          // Size steps (sizes.md §4)
          size === "sm" &&
            "min-h-[2rem] px-3 py-1 text-sm rounded-full min-w-[4rem]",
          size === "md" &&
            "min-h-[2.5rem] px-4 py-2 text-base rounded-full min-w-[4rem]",
          size === "lg" &&
            "min-h-[3rem] px-6 py-3 text-base rounded-full min-w-[4rem]",
          size === "icon" &&
            "size-11 p-0 rounded-full flex items-center justify-center shrink-0", // min 44x44px touch target (§4, §11)

          // Variants
          variant === "primary" &&
            "bg-primary-red text-white hover:bg-primary-red-hover active:bg-primary-red-dark border border-transparent shadow-sm",
          variant === "secondary" &&
            "bg-black text-white hover:bg-black/90 active:bg-black/80 border border-transparent",
          variant === "outline" &&
            "border border-border bg-white text-text-primary hover:bg-muted active:bg-muted/80",
          variant === "ghost" &&
            "border border-transparent text-text-secondary hover:bg-black/5 active:bg-black/10",

          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
