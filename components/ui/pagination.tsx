"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust start/end to keep total number of items consistent
      let adjustedStart = start;
      let adjustedEnd = end;
      if (currentPage <= 3) {
        adjustedEnd = 4;
      } else if (currentPage >= totalPages - 2) {
        adjustedStart = totalPages - 3;
      }

      for (let i = adjustedStart; i <= adjustedEnd; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-custom pt-6 mt-8">
      {/* Information text */}
      <div className="text-xs text-text-secondary">
        Showing <span className="font-bold text-text-primary">{startItem}</span> to{" "}
        <span className="font-bold text-text-primary">{endItem}</span> of{" "}
        <span className="font-bold text-text-primary">{totalItems}</span> results
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border-custom bg-card px-2.5 py-1.5 text-xs font-semibold text-text-secondary transition-all hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4 mr-0.5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex h-8 w-8 items-center justify-center text-xs text-text-secondary select-none"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? "bg-primary-red text-white border-primary-red shadow-xs hover:bg-primary-red-hover"
                  : "bg-card text-text-secondary border-border-custom hover:bg-slate-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border-custom bg-card px-2.5 py-1.5 text-xs font-semibold text-text-secondary transition-all hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
