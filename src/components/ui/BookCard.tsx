import Link from "next/link";
import type { Book } from "@/lib/api/db";
import ActionsMenu from "./ActionsMenu";

type BookCardProps = {
  book: Book;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function BookCard({
  book,
  showActions = false,
  onEdit,
  onDelete,
}: BookCardProps) {
  return (
    <div className="group relative rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      {showActions && (
        <div className="absolute right-2 top-2">
          <ActionsMenu
            onEdit={() => onEdit?.(book.id)}
            onDelete={() => onDelete?.(book.id)}
          />
        </div>
      )}

      <Link href={`/books/${book.id}`} className="block">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="mb-3 h-48 w-full rounded-lg object-cover"
          />
        ) : (
          <div className="mb-3 flex h-48 w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
            No Image
          </div>
        )}

        <h3 className="mb-1 text-lg font-semibold line-clamp-1 text-card-foreground">
          {book.title}
        </h3>
        <p className="mb-2 text-sm text-muted-foreground">{book.author}</p>

        {book.description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {book.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            ${book.price.toFixed(2)}
          </span>
          {book.category && (
            <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              {book.category} tata
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
