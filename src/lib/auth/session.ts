import { cookies } from "next/headers";

export async function getSession() {
  const store = await cookies();
  const raw = store.get("session")?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as { userId: string };
  } catch {
    return null;
  }
}
