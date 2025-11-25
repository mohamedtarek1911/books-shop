import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  // Handle root path - redirect based on auth status
  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/books", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const isAuthPage = pathname.startsWith("/login");
  const isProtected =
    pathname.startsWith("/books") ||
    pathname.startsWith("/my-books") ||
    pathname.startsWith("/profile");

  // If trying to access protected route without login -> redirect to login
  if (isProtected && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access login page while already logged in -> redirect to books
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/books", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/books/:path*",
    "/my-books/:path*",
    "/profile/:path*",
  ],
};
