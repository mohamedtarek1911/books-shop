import { NextResponse } from "next/server";
import { myBooks } from "@/lib/api/db";
import { getSession } from "@/lib/auth/session";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const book = myBooks.find((b) => b.id === id);
  if (!book) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // Check if user owns the book
  if (book.authorId !== session.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(book);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const idx = myBooks.findIndex((b) => b.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (myBooks[idx].authorId !== session.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const payload = await req.json();
  myBooks[idx] = {
    ...myBooks[idx],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(myBooks[idx]);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const book = myBooks.find((b) => b.id === id);
  if (!book) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (book.authorId !== session.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const next = myBooks.filter((b) => b.id !== id);
  myBooks.length = 0;
  myBooks.push(...next);

  return NextResponse.json({ ok: true });
}
