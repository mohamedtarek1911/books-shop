"use client";

import { useI18n } from "@/lib/i18n/context";

export default function SimplePagination({
  page,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        className="rounded border border-border bg-background px-3 py-1 text-foreground disabled:opacity-50 hover:bg-accent"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {t.common.previous}
      </button>
      <span className="text-sm text-foreground">
        {t.common.page} {page} / {totalPages}
      </span>
      <button
        className="rounded border border-border bg-background px-3 py-1 text-foreground disabled:opacity-50 hover:bg-accent"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {t.common.next}
      </button>
    </div>
  );
}
