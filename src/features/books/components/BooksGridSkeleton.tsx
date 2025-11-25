import BookCardSkeleton from "./BookCardSkeleton";

type BooksGridSkeletonProps = {
  count?: number;
};

export default function BooksGridSkeleton({
  count = 8,
}: BooksGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
}
