"use client";

import { useI18n } from "@/lib/i18n/context";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { t } = useI18n();
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show only a limited number of pages around current page
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 3) {
      return [...pages.slice(0, 5), "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", ...pages.slice(totalPages - 5)];
    }

    return [
      1,
      "...",
      ...pages.slice(currentPage - 2, currentPage + 1),
      "...",
      totalPages,
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
      >
        {t.common.previous}
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`rounded-lg border border-border px-3 py-2 text-sm ${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-accent"
              }`}
            >
              {t.common.page} {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
      >
        {t.common.next}q
      </button>
    </div>
  );
}
