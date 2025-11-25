"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMyBook, useDeleteMyBook } from "@/features/books/hooks/useMyBooks";
import { useQuery } from "@tanstack/react-query";
import { API_BOOK_BY_ID } from "@/lib/api/endpoints";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/components/ui/ToastProvider";

export default function MyBookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const { pushToast } = useToast();
  const [id, setId] = useState<string>("");
  const deleteMutation = useDeleteMyBook();

  // Get id from params
  useEffect(() => {
    let isMounted = true;
    params.then((p) => {
      if (isMounted) {
        setId(p.id);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [params]);

  // Check if ID is from My Books (starts with "mb_") or from Shop (starts with "OL")
  const isMyBookId = id.startsWith("mb_");
  const isShopBookId = id.startsWith("OL");

  // Try to fetch from my-books first (only if ID looks like a my-books ID or we're not sure)
  const {
    data: myBook,
    isLoading: isLoadingMyBook,
    isError: isErrorMyBook,
    error: errorMyBook,
  } = useMyBook(id);

  // Fallback: try to fetch from books API if:
  // 1. ID is from Shop (starts with "OL"), OR
  // 2. my-books failed with 404 and ID doesn't look like a my-books ID
  const shouldFetchShopBook =
    !!id &&
    !isLoadingMyBook &&
    (isShopBookId ||
      (isErrorMyBook &&
        !isMyBookId &&
        errorMyBook instanceof Error &&
        (errorMyBook.message.includes("Not found") ||
          errorMyBook.message.includes("Failed to fetch"))));

  const {
    data: shopBook,
    isLoading: isLoadingShopBook,
    isError: isErrorShopBook,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      // Get base URL for fetch
      const baseUrl = window.location.origin;
      const res = await fetch(`${baseUrl}${API_BOOK_BY_ID(id)}`);
      if (!res.ok) throw new Error("Book not found");
      return res.json();
    },
    enabled: shouldFetchShopBook, // Only fetch if my-books failed with 404 or ID is from Shop
  });

  const book = myBook || shopBook;
  const isLoading =
    isLoadingMyBook || (shouldFetchShopBook && isLoadingShopBook);
  const isError =
    (isErrorMyBook && !shouldFetchShopBook) ||
    (shouldFetchShopBook && isErrorShopBook);
  const error = errorMyBook;
  const isFromShop = !!shopBook && !myBook; // Book is from shop, not my-books

  const handleDelete = async () => {
    if (!confirm(t.books.confirmDeleteBook)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      router.push("/my-books");
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : t.books.failedToDelete,
        "error"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <div className="p-6 text-center text-foreground">
          {t.books.loadingBook}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <div className="rounded-lg bg-destructive/10 p-6 text-center text-destructive">
          {error instanceof Error ? error.message : t.books.failedToLoad}
        </div>
        <Link
          href="/my-books"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          {t.books.backToMyBooks}
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <div className="p-6 text-center text-muted-foreground">
          {t.books.bookNotFound}
        </div>
        <Link
          href="/my-books"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          {t.books.backToMyBooks}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      <Link
        href="/my-books"
        className="inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        {t.books.backToMyBooks}
      </Link>

      <div className="grid gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-3">
        <div>
          <img
            src={
              book.coverImage ||
              (shopBook?.covers?.[0]
                ? `https://covers.openlibrary.org/b/id/${shopBook.covers[0]}-L.jpg`
                : "https://placehold.co/500x700")
            }
            alt={book.title || shopBook?.title}
            className="w-full rounded-2xl border border-border object-cover"
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">
              {book.title || shopBook?.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.books.authorLabel}{" "}
              {book.author ||
                shopBook?.authors
                  ?.map((a: { author?: { key: string }; key?: string }) => {
                    const authorKey = a.author?.key || a.key;
                    return authorKey?.split("/")?.pop() || t.books.unknown;
                  })
                  .join(", ") ||
                t.books.unknown}
            </p>
            {book.category && (
              <p className="mt-1 text-sm text-muted-foreground">
                {t.books.categoryLabel} {book.category}
              </p>
            )}
            {book.price && (
              <p className="mt-2 text-lg font-bold text-foreground">
                ${book.price}
              </p>
            )}
          </div>

          {(book.description ||
            shopBook?.description?.value ||
            shopBook?.description) && (
            <div>
              <p className="text-sm font-medium text-card-foreground">
                {t.books.description}:
              </p>
              <p className="mt-2 leading-7 text-card-foreground">
                {book.description ||
                  shopBook?.description?.value ||
                  shopBook?.description ||
                  t.books.noDescription}
              </p>
            </div>
          )}

          {isFromShop ? (
            <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
              {t.books.shopBookEditInfo}
            </div>
          ) : (
            <div className="flex gap-3 pt-4">
              <Link
                href={`/books/${book.id}/edit`}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                {t.common.edit}
              </Link>

              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50"
              >
                {deleteMutation.isPending ? t.books.deleting : t.common.delete}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
