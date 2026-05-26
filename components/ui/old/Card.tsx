import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ children, className = "", hoverEffect = true, ...props }: CardProps) {
  return (
    <div
      className={`bg-card border border-border-custom rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
        hoverEffect
          ? "hover:shadow-[0_8px_24px_rgba(211,47,47,0.04)] hover:-translate-y-0.5 transition-all duration-300"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
