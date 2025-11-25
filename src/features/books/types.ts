export type Category =
  | "Technology"
  | "Science"
  | "History"
  | "Fantasy"
  | "Biography"
  | "Other";

export type BookSource = "shop" | "my";

export type BookCard = {
  id: string; // workId (OLID) or my book ID
  title: string;
  price: number; // mock price
  thumbnail: string; // cover url
  author: string;
  category: Category;
  source: BookSource;
};
