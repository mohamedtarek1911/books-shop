import { NextResponse } from "next/server";
import { OPEN_LIBRARY_WORK_DETAILS } from "@/lib/api/endpoints";
import { myBooks } from "@/lib/api/db";
import { getSession } from "@/lib/auth/session";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check if ID is from My Books (starts with "mb_")
  if (id.startsWith("mb_")) {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const book = myBooks.find((b) => b.id === id);
    if (!book) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Check if user owns the book
    if (book.authorId !== session.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Return book in a format compatible with the detail page
    return NextResponse.json({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      coverImage: book.coverImage,
      category: book.category,
      authorId: book.authorId,
      authorName: book.authorName,
      source: "my" as const,
    });
  }

  // Otherwise, fetch from Open Library
  const res = await fetch(OPEN_LIBRARY_WORK_DETAILS(id), {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const work = await res.json();
  return NextResponse.json(work);
}
