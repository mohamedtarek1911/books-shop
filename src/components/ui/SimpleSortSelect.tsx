"use client";

export default function SimpleSortSelect({
  value,
  onChange,
}: {
  value: "asc" | "desc";
  onChange: (v: "asc" | "desc") => void;
}) {
  return (
    <select
      className="rounded-lg border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      value={value}
      onChange={(e) => onChange(e.target.value as "asc" | "desc")}
    >
      <option value="asc">Title A-Z</option>
      <option value="desc">Title Z-A</option>
    </select>
  );
}
