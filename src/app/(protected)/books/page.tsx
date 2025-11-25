"use client";

import { useState, useRef, useMemo } from "react";
import { useBooks } from "@/features/books/hooks/useBooks";
import { useCreateMyBook } from "@/features/books/hooks/useMyBooks";
import { useToast } from "@/components/ui/ToastProvider";
import { useI18n } from "@/lib/i18n/context";
import type {
  BookCard as BookCardType,
  Category,
} from "@/features/books/types";
import BookCard from "@/features/books/components/BookCard";
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

export default function BooksPage() {
  const [q, setQ] = useState(""); // debounced search query
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [category, setCategory] = useState<Category | "">("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const previousQ = useRef(q);
  const createMutation = useCreateMyBook();
  const { pushToast } = useToast();
  const { t } = useI18n();

  const handleSearchChange = (value: string) => {
    const hasSearchChanged = value !== previousQ.current;
    previousQ.current = value;

    setQ(value);

    // Only reset page if search actually changed
    if (hasSearchChanged) {
      setPage(1);
    }
  };

  // Use default search term if empty, otherwise use the search query
  const searchQuery = q.trim() || "programming";

  // Fetch all books to calculate max price (without filters for this calculation)
  const { data: allData } = useBooks({
    q: searchQuery,
    page: 1,
    sort: "asc",
    limit: 1000, // Get more data to calculate max price
  });

  const maxPrice = useMemo(() => {
    if (allData?.data) {
      return Math.max(...allData.data.map((b) => b.price), 100);
    }
    return 100;
  }, [allData]);

  const { data, isLoading, isError, error } = useBooks({
    q: searchQuery,
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

  const handleAddToMyBooks = async (book: BookCardType) => {
    // Check if book already exists in My Books by fetching all books
    try {
      const res = await fetch("/api/my-books?q=&page=1&sort=asc&limit=10");
      if (res.ok) {
        const myBooksData = await res.json();
        const existingBooks = myBooksData?.data || [];
        const isDuplicate = existingBooks.some(
          (b: BookCardType) =>
            b.title.toLowerCase().trim() === book.title.toLowerCase().trim() &&
            b.author.toLowerCase().trim() === book.author.toLowerCase().trim()
        );

        if (isDuplicate) {
          pushToast(t.books.alreadyAdded, "warning");
          return;
        }
      }
    } catch (err) {
      // If check fails, continue with adding (don't block user)
      console.error("Failed to check for duplicates:", err);
    }

    try {
      await createMutation.mutateAsync({
        title: book.title,
        author: book.author,
        description: "",
        price: book.price,
        coverImage: book.thumbnail,
        category: book.category,
      });
      pushToast(t.books.bookAdded, "success");
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : t.books.addFailed,
        "error"
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4">
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
              placeholder={t.books.searchPlaceholder}
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
                  <BookCard
                    key={b.id}
                    book={b}
                    showAddToMyBooks={true}
                    onAddToMyBooks={handleAddToMyBooks}
                  />
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
              {q.trim().length > 0 && q.trim().length < 3
                ? t.books.searchMinChars
                : t.books.noBooksFound}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
