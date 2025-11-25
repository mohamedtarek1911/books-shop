import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById, users } from "@/lib/api/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json(); // {name,email}
  const user = getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // update only name/email
  user.name = payload.name ?? user.name;
  user.email = payload.email ?? user.email;

  // also update in users array (since mock ref)
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) users[idx] = user;

  return NextResponse.json(user);
}
