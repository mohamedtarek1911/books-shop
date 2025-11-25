"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateMyBook } from "@/features/books/hooks/useMyBooks";
import type { Category } from "@/features/books/types";

const categories: Category[] = [
  "Technology",
  "Science",
  "History",
  "Fantasy",
  "Biography",
  "Other",
];

export default function NewBookPage() {
  const router = useRouter();
  const createMutation = useCreateMyBook();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    coverImage: "",
    category: "Other" as Category,
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.author.trim()) {
      setError("Title and Author are required");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim() || undefined,
        price: Number(formData.price) || 0,
        coverImage: formData.coverImage.trim() || undefined,
        category: formData.category,
      });

      // Redirect to my-books after successful creation
      router.push("/my-books");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create book");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold text-foreground">Add New Book</h1>

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
            Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter book title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            Author <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter author name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter book description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Price <span className="text-destructive">*</span>
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
              Category
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
            Cover Image URL
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
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
