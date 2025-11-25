"use client";

import { useI18n } from "@/lib/i18n/context";
import type { Category } from "@/features/books/types";

type BookFiltersProps = {
  category: Category | "";
  priceRange: { min: number; max: number };
  onCategoryChange: (category: Category | "") => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  availableCategories: Category[];
  maxPrice: number;
};

export default function BookFilters({
  category,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  availableCategories,
  maxPrice,
}: BookFiltersProps) {
  const { t, dir } = useI18n();

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-card-foreground">
        {t.common.filter}
      </h3>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          {t.books.category}
        </label>
        <select
          value={category}
          onChange={(e) =>
            onCategoryChange((e.target.value || "") as Category | "")
          }
          className={`w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
            dir === "rtl" ? "text-right" : "text-left"
          }`}
        >
          <option value="">
            {t.common.filter} - {t.books.category}
          </option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          {t.books.priceRange || "Price Range"}
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            max={maxPrice}
            value={priceRange.min || ""}
            onChange={(e) =>
              onPriceRangeChange({
                min: Number(e.target.value) || 0,
                max: priceRange.max,
              })
            }
            placeholder="Min"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            min="0"
            max={maxPrice}
            value={priceRange.max || ""}
            onChange={(e) =>
              onPriceRangeChange({
                min: priceRange.min,
                max: Number(e.target.value) || maxPrice,
              })
            }
            placeholder="Max"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {(category || priceRange.min > 0 || priceRange.max < maxPrice) && (
        <button
          onClick={() => {
            onCategoryChange("");
            onPriceRangeChange({ min: 0, max: maxPrice });
          }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-accent"
        >
          {t.common.clearFilters || "Clear Filters"}
        </button>
      )}
    </div>
  );
}
