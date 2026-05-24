import React from "react";

interface BadgeProps {
  variant?: "active" | "closed" | "upcoming" | "default" | "info" | "red";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200";
  
  const variantStyles = {
    default: "bg-gray-100 text-text-primary border border-gray-200",
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    closed: "bg-rose-50 text-rose-700 border border-rose-200",
    upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
    info: "bg-amber-50 text-amber-700 border border-amber-200",
    red: "bg-soft-red text-primary-red border border-red-200",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
