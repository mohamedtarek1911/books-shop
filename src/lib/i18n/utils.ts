import type { Translations } from "./types";

/**
 * Helper function to get nested translation values
 * Usage: getNestedTranslation(t.common, "loading") => "Loading..."
 * Or: getNestedTranslation(t.books, "confirmDelete") => "Confirm Delete"
 */
export function getNestedTranslation(
  obj: Record<string, unknown>,
  path: string
): string {
  const keys = path.split(".");
  let result: unknown = obj;
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return path if not found
    }
  }
  return typeof result === "string" ? result : path;
}

/**
 * Helper to replace placeholders in translation strings
 * Usage: replacePlaceholders(t.form.minLength, { min: 2 }) => "Must be at least 2 characters"
 */
export function replacePlaceholders(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}
