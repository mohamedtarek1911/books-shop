"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMyBooks } from "@/features/books/hooks/useMyBooks";
import { useI18n } from "@/lib/i18n/context";
import type { Category } from "@/features/books/types";
import MyBookCard from "@/features/books/components/MyBookCard";
import BooksGridSkeleton from "@/features/books/components/BooksGridSkeleton";
import SimpleSearchInput from "@/components/ui/SimpleSearchInput";
import SimpleSortSelect from "@/components/ui/SimpleSortSelect";
import SimplePagination from "@/components/ui/SimplePagination";
import BookFilters from "@/components/ui/BookFilters";

const categories: Category[] = [
  "Technology",
  "Science",
  "History",
  "Fantasy",
  "Biography",
  "Other",
];

export default function MyBooksPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [q, setQ] = useState(""); // debounced search query
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [category, setCategory] = useState<Category | "">("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const previousQ = useRef(q);

  const handleSearchChange = (value: string) => {
    const hasSearchChanged = value !== previousQ.current;
    previousQ.current = value;

    setQ(value);

    // Only reset page if search actually changed
    if (hasSearchChanged) {
      setPage(1);
    }
  };

  // Fetch all books to calculate max price
  const { data: allData } = useMyBooks({
    q: "",
    page: 1,
    sort: "asc",
  });

  const maxPrice = useMemo(() => {
    if (allData?.data) {
      return Math.max(...allData.data.map((b) => b.price), 1000);
    }
    return 1000;
  }, [allData]);

  const { data, isLoading, isError, error } = useMyBooks({
    q,
    page,
    sort,
    category: category || undefined,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
  });

  // Reset page when filters change
  const handleCategoryChange = (newCategory: Category | "") => {
    setCategory(newCategory);
    setPage(1);
  };

  const handlePriceRangeChange = (newRange: { min: number; max: number }) => {
    setPriceRange(newRange);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {t.books.myBooks}
        </h1>
        <button
          onClick={() => router.push("/books/new")}
          className="rounded-lg border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + {t.books.addNewBook}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <BookFilters
            category={category}
            priceRange={priceRange}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={handlePriceRangeChange}
            availableCategories={categories}
            maxPrice={maxPrice}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SimpleSearchInput
              placeholder={t.books.searchMyBooks}
              value={q}
              onChange={handleSearchChange}
            />
            <SimpleSortSelect value={sort} onChange={setSort} />
          </div>

          {isError && (
            <div className="p-6 text-center text-destructive">
              {String(error)}
            </div>
          )}

          {isLoading ? (
            <BooksGridSkeleton count={8} />
          ) : data && data.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((b) => (
                  <MyBookCard key={b.id} book={b} />
                ))}
              </div>

              <SimplePagination
                page={data.page}
                total={data.total}
                limit={data.limit}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              {q.trim().length > 0
                ? t.books.noBooksFound
                : t.books.youHaventAdded}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
