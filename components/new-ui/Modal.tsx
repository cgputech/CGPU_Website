"use client";

/**
 * Custom Modal / Dialog component adhering to docs/sizes.md:
 * - Modal radius: 16px (--radius-xl) (§7, §8)
 * - Modal padding: 24px (§8)
 * - Modal max-width: 480px / forms, 640px / content (§8)
 * - Focus management, escape key listener, backdrop click
 * - No dependency on shadcn/ui
 */

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Body */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        className={cn(
          "relative z-10 w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-2xl transition-all",
          "border border-border",
          className,
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          {title && (
            <h2 className="text-xl font-semibold text-text-primary leading-tight">
              {title}
            </h2>
          )}
          {/* Close button touch target >= 44x44px (§4, §11) */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex size-11 items-center justify-center rounded-full text-text-secondary hover:bg-black/5 hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
