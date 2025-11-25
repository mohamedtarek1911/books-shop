"use client";

export type SortOption = {
  value: string;
  label: string;
};

type SortSelectProps = {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

export default function SortSelect({
  options,
  value,
  onChange,
  label = "Sort by",
}: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <label className="text-sm text-muted-foreground whitespace-nowrap">
          {label}:
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
