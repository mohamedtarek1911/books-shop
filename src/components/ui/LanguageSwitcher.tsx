"use client";

import { useI18n } from "@/lib/i18n/context";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1">
      <button
        onClick={() => setLocale("en")}
        className={`px-2 py-1 text-sm font-medium transition-colors ${
          locale === "en"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <span className="text-muted-foreground">|</span>
      <button
        onClick={() => setLocale("ar")}
        className={`px-2 py-1 text-sm font-medium transition-colors ${
          locale === "ar"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        AR
      </button>
    </div>
  );
}
