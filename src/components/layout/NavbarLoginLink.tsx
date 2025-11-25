"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function NavbarLoginLink() {
  const { t } = useI18n();
  return (
    <Link href="/login" className="text-foreground hover:text-muted-foreground">
      {t.auth.login}
    </Link>
  );
}
