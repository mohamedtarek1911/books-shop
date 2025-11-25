export type User = {
  id: string;
  name: string;
  email: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage?: string;
  category?: string;
  authorId: string; // owner/author of the book
  authorName?: string; // author's name (for display)
  createdAt?: string;
  updatedAt?: string;
};

// Mock database - static data
export const users: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@books.com",
  },
];

export function getUserByEmail(email: string): User | null {
  return users.find((u) => u.email === email) || null;
}

export function getUserById(id: string): User | null {
  return users.find((u) => u.id === id) || null;
}

// === My Books (User-owned) ===
export const myBooks: Book[] = [];

// Helper to generate unique IDs
export function genId(prefix = "mb") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
