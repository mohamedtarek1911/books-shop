"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Locale, Translations } from "./types";
import { translations, defaultLocale } from "./translations";

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Initialize locale from localStorage if available, otherwise use default
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("locale") as Locale | null;
      if (savedLocale && (savedLocale === "en" || savedLocale === "ar")) {
        return savedLocale;
      }
    }
    return defaultLocale;
  });

  // Update HTML attributes when locale changes or on mount
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translations[locale],
    dir: locale === "ar" ? "rtl" : "ltr",
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
