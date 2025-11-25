"use client";

import { useState, useEffect, useRef } from "react";

type SimpleSearchInputProps = {
  value?: string; // initial value (optional)
  onChange: (v: string) => void; // called with debounced value
  debounceMs?: number; // debounce delay in milliseconds
  placeholder?: string;
};

export default function SimpleSearchInput({
  value: initialValue = "",
  onChange,
  debounceMs = 500,
  placeholder = "Search by title...",
}: SimpleSearchInputProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const isMounted = useRef(false);
  const lastEmittedValue = useRef(initialValue);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Update internal value when prop changes
  useEffect(() => {
    if (initialValue !== inputValue) {
      setInputValue(initialValue);
      lastEmittedValue.current = initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  // Debounce the value and call onChange
  useEffect(() => {
    // Skip onChange on mount
    if (!isMounted.current) {
      isMounted.current = true;
      lastEmittedValue.current = inputValue;
      return;
    }

    // Skip if value hasn't actually changed
    if (inputValue === lastEmittedValue.current) {
      return;
    }

    const timer = setTimeout(() => {
      lastEmittedValue.current = inputValue;
      onChangeRef.current(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, debounceMs]);

  return (
    <input
      className="w-full rounded-lg border border-input bg-background p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      placeholder={placeholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
}
