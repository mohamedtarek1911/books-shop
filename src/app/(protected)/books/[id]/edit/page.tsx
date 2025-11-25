"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMyBook, useUpdateMyBook } from "@/features/books/hooks/useMyBooks";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/components/ui/ToastProvider";
import type { Category } from "@/features/books/types";

const categories: Category[] = [
  "Technology",
  "Science",
  "History",
  "Fantasy",
  "Biography",
  "Other",
];

export default function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const { pushToast } = useToast();
  const [id, setId] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    coverImage: "",
    category: "Other" as Category,
  });
  const [error, setError] = useState("");
  const formInitializedRef = useRef(false);

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

  const { data: book, isLoading, isError, error: fetchError } = useMyBook(id);
  const updateMutation = useUpdateMyBook(id);

  // Populate form when book data is loaded (only once per book ID)
  useEffect(() => {
    if (book && !formInitializedRef.current) {
      const formDataToSet = {
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        price: book.price?.toString() || "",
        coverImage: book.coverImage || "",
        category: (book.category as Category) || "Other",
      };
      // Use setTimeout to defer setState and avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setFormData(formDataToSet);
        formInitializedRef.current = true;
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [book]);

  // Reset initialization flag when ID changes (user navigates to different book)
  useEffect(() => {
    formInitializedRef.current = false;
  }, [id]);

  // Handle 403 error - redirect back
  useEffect(() => {
    if (isError && fetchError instanceof Error) {
      if (fetchError.message.includes("Forbidden")) {
        pushToast(t.books.noPermissionToEdit, "error");
        router.back();
      }
    }
  }, [isError, fetchError, router, t, pushToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.author.trim()) {
      setError(t.books.titleRequired);
      return;
    }

    try {
      await updateMutation.mutateAsync({
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim() || undefined,
        price: Number(formData.price) || 0,
        coverImage: formData.coverImage.trim() || undefined,
        category: formData.category,
      });

      // Redirect to my-books after successful update
      router.push("/my-books");
    } catch (err) {
      if (err instanceof Error && err.message.includes("Forbidden")) {
        pushToast(t.books.noPermissionToEdit, "error");
        router.back();
      } else {
        setError(err instanceof Error ? err.message : t.books.failedToUpdate);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div className="p-6 text-center text-foreground">
          {t.books.loadingBook}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div className="rounded-lg bg-destructive/10 p-6 text-center text-destructive">
          {fetchError instanceof Error
            ? fetchError.message
            : t.books.failedToLoad}
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div className="p-6 text-center text-muted-foreground">
          {t.books.bookNotFound}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold text-foreground">{t.books.editBook}</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border border-border bg-card p-6"
      >
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            {t.books.title} <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={t.books.enterBookTitle}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            {t.books.author} <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={t.books.enterAuthorName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            {t.books.description}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={t.books.enterBookDescription}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              {t.books.price} <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              {t.books.category}
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Category,
                })
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            {t.books.coverImageUrl}
          </label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) =>
              setFormData({ ...formData, coverImage: e.target.value })
            }
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-foreground hover:bg-accent"
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {updateMutation.isPending ? t.books.updating : t.books.updateBook}
          </button>
        </div>
      </form>
    </div>
  );
}
