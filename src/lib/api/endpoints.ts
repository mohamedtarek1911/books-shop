// src/lib/api/endpoints.ts

/** =========================
 *  Public Open-Source API
 *  ========================= */
export const OPEN_LIBRARY_BASE = "https://openlibrary.org";
export const OPEN_LIBRARY_COVERS_BASE = "https://covers.openlibrary.org";

// LIST/SEARCH BOOKS (pagination via page)
export const OPEN_LIBRARY_SEARCH = (q: string, page = 1) =>
  `${OPEN_LIBRARY_BASE}/search.json?q=${encodeURIComponent(q)}&page=${page}`;
// docs: openlibrary search api supports q & page

// WORK/BOOK DETAILS by work OLID
export const OPEN_LIBRARY_WORK_DETAILS = (workId: string) =>
  `${OPEN_LIBRARY_BASE}/works/${workId}.json`;
// details lives under /works/{id}.json (Open Library JSON APIs)

// COVER IMAGE by cover id (S/M/L sizes)
export const OPEN_LIBRARY_COVER = (
  coverId: number,
  size: "S" | "M" | "L" = "M"
) => `${OPEN_LIBRARY_COVERS_BASE}/b/id/${coverId}-${size}.jpg`;
// covers api format

/** =========================
 *  Internal Next.js API (clean APIs for frontend)
 *  Base URL = same origin
 *  ========================= */

// Books Shop (public list proxy)
export const API_BOOKS = "/api/books"; // GET

// Book by id (details + update/delete if author)
export const API_BOOK_BY_ID = (id: string) => `/api/books/${id}`; // GET, PUT, DELETE

// My Books (only user authored)
export const API_MY_BOOKS = "/api/my-books"; // GET
