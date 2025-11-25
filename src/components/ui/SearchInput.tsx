"use client";

import { useState, useEffect } from "react";

type SearchInputProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
};

export default function SearchInput({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
}: SearchInputProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs, onSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background px-4 py-2 pl-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <svg
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
