import { NextResponse } from "next/server";
import { OPEN_LIBRARY_SEARCH, OPEN_LIBRARY_COVER } from "@/lib/api/endpoints";
import type { BookCard, Category } from "@/features/books/types";

type OpenLibraryBook = {
  key: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  subject?: string[];
  edition_key?: string[];
};

function mockPrice(title: string) {
  // deterministic-ish mock price by title length
  return Math.max(5, (title.length % 40) + 5);
}

function mapCategory(subject: string | undefined): Category {
  if (!subject) return "Other";

  const lower = subject.toLowerCase();
  if (
    lower.includes("technology") ||
    lower.includes("computer") ||
    lower.includes("programming")
  ) {
    return "Technology";
  }
  if (lower.includes("science")) return "Science";
  if (lower.includes("history")) return "History";
  if (lower.includes("fantasy") || lower.includes("fiction")) return "Fantasy";
  if (lower.includes("biography") || lower.includes("biographical"))
    return "Biography";
  return "Other";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");
  const page = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "asc"; // asc|desc
  const limit = Number(searchParams.get("limit") || 10); // default 10
  const category = searchParams.get("category") as Category | null;
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || Infinity);

  // If no search query provided, return empty results
  if (!q || q.trim().length === 0) {
    return NextResponse.json({
      data: [],
      total: 0,
      page,
      limit,
    });
  }

  // Open Library requires at least 3 characters
  // If query is too short, return empty results
  if (q.trim().length < 3) {
    return NextResponse.json({
      data: [],
      total: 0,
      page,
      limit,
      message: "Search query must be at least 3 characters",
    });
  }

  // fetch from public Open Library
  const olRes = await fetch(OPEN_LIBRARY_SEARCH(q, page), {
    // cache policy for demo
    next: { revalidate: 60 },
  });

  if (!olRes.ok) {
    const errorText = await olRes.text();
    let errorMessage = "OpenLibrary error";

    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorMessage;
    } catch {
      // If not JSON, use the text or default message
      errorMessage = errorText || errorMessage;
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: olRes.status }
    );
  }

  const olJson = await olRes.json();

  // Open Library returns docs[]
  const data: BookCard[] = (olJson.docs || []).map((d: OpenLibraryBook) => {
    const coverId = d.cover_i;
    const workKey: string = d.key; // "/works/OL123W"
    const workId = workKey?.split("/")?.pop() || d.edition_key?.[0];

    return {
      id: workId,
      title: d.title ?? "Untitled",
      price: mockPrice(d.title ?? ""),
      thumbnail: coverId
        ? OPEN_LIBRARY_COVER(coverId, "M")
        : "https://placehold.co/300x400",
      author: d.author_name?.[0] ?? "Unknown",
      category: mapCategory(d.subject?.[0]),
      source: "shop" as const,
    };
  });

  // Apply category filter
  let filteredData = data;
  if (category) {
    filteredData = filteredData.filter((book) => book.category === category);
  }

  // Apply price range filter
  filteredData = filteredData.filter(
    (book) => book.price >= minPrice && book.price <= maxPrice
  );

  // sorting by title A-Z / Z-A
  filteredData.sort((a, b) =>
    sort === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  // Apply limit to data
  const limitedData = filteredData.slice(0, limit);

  // pagination info - use filtered count
  const total = filteredData.length;

  return NextResponse.json({
    data: limitedData,
    total,
    page,
    limit,
  });
}
