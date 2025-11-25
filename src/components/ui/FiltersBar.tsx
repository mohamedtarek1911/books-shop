"use client";

import { useState } from "react";
import SearchInput from "./SearchInput";
import SortSelect, { type SortOption } from "./SortSelect";

export type FilterOption = {
  value: string;
  label: string;
};

type FiltersBarProps = {
  onSearch: (query: string) => void;
  onSort: (value: string) => void;
  sortOptions: SortOption[];
  sortValue: string;
  filterOptions?: FilterOption[];
  onFilter?: (value: string) => void;
  filterValue?: string;
  searchPlaceholder?: string;
};

export default function FiltersBar({
  onSearch,
  onSort,
  sortOptions,
  sortValue,
  filterOptions,
  onFilter,
  filterValue,
  searchPlaceholder = "Search books...",
}: FiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <SearchInput onSearch={onSearch} placeholder={searchPlaceholder} />
        </div>

        <div className="flex items-center gap-4">
          {filterOptions && onFilter && (
            <div className="hidden md:block">
              <select
                value={filterValue || ""}
                onChange={(e) => onFilter(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Categories</option>
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <SortSelect
            options={sortOptions}
            value={sortValue}
            onChange={onSort}
          />

          {filterOptions && onFilter && (
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="md:hidden rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-accent"
            >
              Filters
            </button>
          )}
        </div>
      </div>

      {showFilters && filterOptions && onFilter && (
        <div className="md:hidden border-t border-border pt-4">
          <label className="mb-2 block text-sm text-muted-foreground">
            Category
          </label>
          <select
            value={filterValue || ""}
            onChange={(e) => onFilter(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Categories</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
