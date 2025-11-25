import type { Translations } from "./types";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

export const translations: Record<"en" | "ar", Translations> = {
  en: en as Translations,
  ar: ar as Translations,
};

export const defaultLocale: "en" | "ar" = "en";
