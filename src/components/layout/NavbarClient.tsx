"use client";

import Link from "next/link";
import { useBooksStore } from "@/store/useBooksStore";
import { useEffect } from "react";
import { useMyBooks } from "@/features/books/hooks/useMyBooks";
import { useI18n } from "@/lib/i18n/context";

export default function NavbarClient() {
  const { count, shouldShake, setCount } = useBooksStore();
  const { t } = useI18n();

  // Fetch initial count - only fetch if we're in a protected route (where QueryProvider exists)
  const { data } = useMyBooks({ q: "", page: 1, sort: "asc" });

  useEffect(() => {
    if (data?.total !== undefined) {
      setCount(data.total);
    }
  }, [data?.total, setCount]);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Link
        href="/books"
        className="text-sm sm:text-base text-foreground hover:text-muted-foreground"
      >
        {t.books.title}
      </Link>
      <Link
        href="/my-books"
        className={`relative inline-block text-sm sm:text-base text-foreground hover:text-muted-foreground ${
          shouldShake ? "shake" : ""
        }`}
      >
        {t.books.myBooks}
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </div>
  );
}
