import { NextResponse } from "next/server";
import { myBooks, genId, getUserById } from "@/lib/api/db";
import { getSession } from "@/lib/auth/session";
import type { Book } from "@/lib/api/db";
import type { BookCard, Category } from "@/features/books/types";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "asc";
  const limit = Number(searchParams.get("limit") || 10);
  const category = searchParams.get("category") as Category | null;
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || Infinity);

  // Filter by current user's books
  let filtered = myBooks.filter((b) => b.authorId === session.userId);

  // Search filter
  if (q.trim().length > 0) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (category) {
    filtered = filtered.filter((b) => b.category === category);
  }

  // Price range filter
  filtered = filtered.filter((b) => b.price >= minPrice && b.price <= maxPrice);

  // Sort
  filtered.sort((a, b) =>
    sort === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  // Pagination
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  // Convert Book to BookCard format
  const data: BookCard[] = paginated.map((book) => ({
    id: book.id,
    title: book.title,
    price: book.price,
    thumbnail: book.coverImage || "https://placehold.co/300x400",
    author: book.author,
    category: (book.category as BookCard["category"]) || "Other",
    source: "my" as const,
  }));

  return NextResponse.json({
    data,
    total,
    page,
    limit,
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const user = getUserById(session.userId);
  const newBook: Book = {
    id: genId(),
    title: payload.title,
    author: payload.author,
    description: payload.description || "",
    price: Number(payload.price) || 0,
    coverImage: payload.coverImage || payload.thumbnail,
    category: payload.category || "Other",
    authorId: session.userId,
    authorName: user?.name || "Unknown",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  myBooks.push(newBook);

  return NextResponse.json(newBook, { status: 201 });
}
