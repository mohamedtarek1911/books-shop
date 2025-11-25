import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBooksStore } from "@/store/useBooksStore";
import type { BookCard, Category } from "../types";

type MyBooksResponse = {
  data: BookCard[];
  total: number;
  page: number;
  limit: number;
};

type BookFormValues = {
  title: string;
  author: string;
  description?: string;
  price: number;
  coverImage?: string;
  category?: string;
};

export function useMyBooks(params: {
  q: string;
  page: number;
  sort: "asc" | "desc";
  category?: Category | "";
  minPrice?: number;
  maxPrice?: number;
}) {
  const { q, page, sort, category, minPrice, maxPrice } = params;
  const setCount = useBooksStore((state) => state.setCount);

  return useQuery({
    queryKey: ["my-books", q, page, sort, category, minPrice, maxPrice],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("q", q);
      searchParams.append("page", page.toString());
      searchParams.append("sort", sort);
      if (category) {
        searchParams.append("category", category);
      }
      if (minPrice !== undefined && minPrice > 0) {
        searchParams.append("minPrice", minPrice.toString());
      }
      if (maxPrice !== undefined && maxPrice < Infinity) {
        searchParams.append("maxPrice", maxPrice.toString());
      }

      const res = await fetch(`/api/my-books?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch my books");
      const data = (await res.json()) as MyBooksResponse;
      // Update store with total count
      setCount(data.total);
      return data;
    },
  });
}

export function useCreateMyBook() {
  const qc = useQueryClient();
  const incrementCount = useBooksStore((state) => state.incrementCount);
  return useMutation({
    mutationFn: async (body: BookFormValues) => {
      const res = await fetch("/api/my-books", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Create failed");
      }
      return res.json();
    },
    onSuccess: () => {
      // Increment count and trigger shake
      incrementCount();
      // Invalidate all my-books queries to refresh the list
      qc.invalidateQueries({ queryKey: ["my-books"] });
      // Also invalidate any individual book queries
      qc.invalidateQueries({ queryKey: ["my-book"] });
    },
  });
}

export function useUpdateMyBook(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<BookFormValues>) => {
      const encodedId = encodeURIComponent(id);
      const res = await fetch(`/api/my-books/${encodedId}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Update failed" }));
        throw new Error(error.message || "Update failed");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate both the list and the individual book query
      qc.invalidateQueries({ queryKey: ["my-books"] });
      qc.invalidateQueries({ queryKey: ["my-book", id] });
    },
  });
}

export function useMyBook(id: string) {
  return useQuery({
    queryKey: ["my-book", id],
    queryFn: async () => {
      const encodedId = encodeURIComponent(id);
      const res = await fetch(`/api/my-books/${encodedId}`);

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error(
            "Forbidden: You don't have permission to access this book"
          );
        }
        if (res.status === 404) {
          throw new Error("Book not found");
        }
        throw new Error("Failed to fetch book");
      }

      return res.json();
    },
    enabled: !!id,
  });
}

export function useDeleteMyBook() {
  const qc = useQueryClient();
  const decrementCount = useBooksStore((state) => state.decrementCount);
  return useMutation({
    mutationFn: async (id: string) => {
      // Ensure ID is properly encoded in the URL
      const encodedId = encodeURIComponent(id);
      const res = await fetch(`/api/my-books/${encodedId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Delete failed" }));
        throw new Error(error.message || "Delete failed");
      }

      return res.json();
    },
    onSuccess: () => {
      // Decrement count
      decrementCount();
      qc.invalidateQueries({ queryKey: ["my-books"] });
    },
  });
}
