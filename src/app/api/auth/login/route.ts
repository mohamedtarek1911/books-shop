import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/api/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // static credentials
  if (email !== "admin@books.com" || password !== "admin123") {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const user = getUserByEmail(email)!;

  const res = NextResponse.json({ user });

  // httpOnly session cookie (server-side only)
  res.cookies.set("session", JSON.stringify({ userId: user.id }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
