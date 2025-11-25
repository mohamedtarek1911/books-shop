"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { API_BOOK_BY_ID, OPEN_LIBRARY_COVER } from "@/lib/api/endpoints";
import { useDeleteMyBook } from "@/features/books/hooks/useMyBooks";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/components/ui/ToastProvider";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { t, dir } = useI18n();
  const { pushToast } = useToast();
  const [id, setId] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
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

  // Check if ID is from My Books (starts with "mb_")
  const isMyBook = id.startsWith("mb_");

  // Fetch book data
  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const baseUrl = window.location.origin;
      const res = await fetch(`${baseUrl}${API_BOOK_BY_ID(id)}`);
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error(
            "Forbidden: You don't have permission to access this book"
          );
        }
        if (res.status === 404) {
          throw new Error(t.books.bookNotFound);
        }
        throw new Error(t.books.failedToLoad);
      }
      return res.json();
    },
    enabled: !!id,
  });

  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (showConfirm && modalRef.current) {
        const modalContent = modalRef.current.querySelector(
          "[data-modal-content]"
        );
        if (
          target === modalRef.current ||
          (modalContent &&
            !modalContent.contains(target) &&
            modalRef.current.contains(target))
        ) {
          setShowConfirm(false);
        }
      }
    }

    if (showConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfirm]);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      pushToast(t.books.bookDeleted, "success");
      setShowConfirm(false);
      router.push("/my-books");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t.books.deleteFailed;
      pushToast(errorMessage, "error");
      setShowConfirm(false);
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
          href={isMyBook ? "/my-books" : "/books"}
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          {isMyBook ? t.books.backToMyBooks : t.books.backToBooks}
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
          href={isMyBook ? "/my-books" : "/books"}
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          {isMyBook ? t.books.backToMyBooks : t.books.backToBooks}
        </Link>
      </div>
    );
  }

  // Handle My Books format
  if (isMyBook && book.source === "my") {
    const title = book.title || t.books.untitled;
    const description = book.description || t.books.noDescription;
    const author = book.author || t.books.unknown;
    const category = book.category;
    const price = book.price;
    const coverImage = book.coverImage;

    return (
      <>
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
                src={coverImage || "https://placehold.co/500x700"}
                alt={title}
                className="w-full rounded-2xl border border-border object-cover"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-card-foreground">
                  {title}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t.books.author}: {author}
                </p>
                {category && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.books.category}: {category}
                  </p>
                )}
                {price && (
                  <p className="mt-2 text-lg font-bold text-foreground">
                    ${price}
                  </p>
                )}
              </div>

              {description && (
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {t.books.description}:
                  </p>
                  <p className="mt-2 leading-7 text-card-foreground">
                    {description}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Link
                  href={`/books/${book.id}/edit`}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  {t.common.edit}
                </Link>

                <button
                  onClick={handleDeleteClick}
                  disabled={deleteMutation.isPending}
                  className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {t.common.delete}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Modal */}
        {showConfirm && (
          <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <div
              data-modal-content
              className="rounded-xl border border-border bg-card p-6 shadow-lg max-w-sm w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {t.books.confirmDelete}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t.books.confirmDeleteMessage}
              </p>
              <div
                className={`flex gap-3 ${
                  dir === "rtl" ? "justify-start" : "justify-end"
                }`}
              >
                <button
                  onClick={() => setShowConfirm(false)}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {deleteMutation.isPending
                    ? t.books.deleting
                    : t.common.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Handle Shop (Open Library) format
  const title = book.title ?? t.books.untitled;
  const description =
    book.description?.value || book.description || t.books.noDescription;
  const authors =
    book.authors
      ?.map((a: { author?: { key: string }; key?: string }) => {
        const authorKey = a.author?.key || a.key;
        return authorKey?.split("/")?.pop() || t.books.unknown;
      })
      .join(", ") || t.books.unknown;
  const coverId = book.covers?.[0];
  const subjects = book.subjects || [];

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      <Link
        href="/books"
        className="inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        {t.books.backToBooks}
      </Link>

      <div className="grid gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-3">
        <div>
          <img
            src={
              coverId
                ? OPEN_LIBRARY_COVER(coverId, "L")
                : "https://placehold.co/500x700"
            }
            alt={title}
            className="w-full rounded-2xl border border-border object-cover"
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.books.author}: {authors}
            </p>
          </div>

          {subjects.length > 0 && (
            <div>
              <p className="text-sm font-medium text-card-foreground">
                {t.books.categories}:
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {subjects.slice(0, 5).map((subject: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-card-foreground">
              {t.books.description}:
            </p>
            <p className="mt-2 leading-7 text-card-foreground">{description}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            {t.books.shopBookInfo}
          </div>
        </div>
      </div>
    </div>
  );
}
