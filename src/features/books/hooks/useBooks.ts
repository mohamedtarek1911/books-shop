import { useQuery } from "@tanstack/react-query";
import { API_BOOKS } from "@/lib/api/endpoints";
import type { BookCard, Category } from "../types";

type UseBooksParams = {
  q?: string; // optional - only pass if provided
  page: number;
  sort: "asc" | "desc";
  limit?: number; // optional, default 10
  category?: Category | "";
  minPrice?: number;
  maxPrice?: number;
};
type BooksResponse = {
  data: BookCard[];
  total: number;
  page: number;
  limit: number;
};

export function useBooks(params: UseBooksParams) {
  const { q, page, sort, limit = 10, category, minPrice, maxPrice } = params;

  return useQuery({
    queryKey: [
      "books",
      q || "",
      page,
      sort,
      limit,
      category,
      minPrice,
      maxPrice,
    ],
    queryFn: async () => {
      // Build query string - only include q if provided
      const searchParams = new URLSearchParams();
      if (q && q.trim().length > 0) {
        searchParams.append("q", q.trim());
      }
      searchParams.append("page", page.toString());
      searchParams.append("sort", sort);
      searchParams.append("limit", limit.toString());
      if (category) {
        searchParams.append("category", category);
      }
      if (minPrice !== undefined && minPrice > 0) {
        searchParams.append("minPrice", minPrice.toString());
      }
      if (maxPrice !== undefined && maxPrice < Infinity) {
        searchParams.append("maxPrice", maxPrice.toString());
      }

      const res = await fetch(`${API_BOOKS}?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch books");
      return res.json() as Promise<BooksResponse>;
    },
  });
}
