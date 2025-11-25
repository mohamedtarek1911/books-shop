export default function BookCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 w-full rounded-xl bg-muted" />

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          {/* Title skeleton */}
          <div className="h-5 w-3/4 rounded bg-muted" />
          {/* Author skeleton */}
          <div className="h-4 w-1/2 rounded bg-muted" />
          {/* Category skeleton */}
          <div className="h-4 w-1/3 rounded bg-muted" />
          {/* Price skeleton */}
          <div className="mt-1 h-5 w-1/4 rounded bg-muted" />
        </div>
        {/* Actions menu skeleton */}
        <div className="h-8 w-8 rounded border border-border bg-muted" />
      </div>
    </div>
  );
}
