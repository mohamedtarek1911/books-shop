"use client";
import type { BookCard as Book } from "../types";
import ActionsMenu from "./ActionsMenu";

type BookCardProps = {
  book: Book;
  onAddToMyBooks?: (book: Book) => void;
  showAddToMyBooks?: boolean;
};

export default function BookCard({
  book,
  onAddToMyBooks,
  showAddToMyBooks = false,
}: BookCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <img
        src={book.thumbnail}
        alt={book.title}
        className="h-48 w-full rounded-xl object-cover"
      />
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-semibold line-clamp-1 text-card-foreground">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
          <p className="text-sm text-muted-foreground">{book.category}</p>
          <p className="mt-1 font-bold text-foreground">${book.price}</p>
        </div>
        <ActionsMenu
          id={book.id}
          source="shop"
          onAddToMyBooks={
            showAddToMyBooks && onAddToMyBooks
              ? () => onAddToMyBooks(book)
              : undefined
          }
        />
      </div>
    </div>
  );
}
