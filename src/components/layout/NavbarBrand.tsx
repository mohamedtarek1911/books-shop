"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function NavbarBrand() {
  const { t } = useI18n();
  return (
    <Link href="/books" className="text-lg font-bold text-foreground">
      {t.navbar.booksShop}
    </Link>
  );
}
