# i18n Usage Guide

## Basic Usage

### In Client Components

```tsx
"use client";

import { useI18n } from "@/lib/i18n/context";

export default function MyComponent() {
  const { t, locale, dir } = useI18n();

  return (
    <div dir={dir}>
      <h1>{t.common.loading}</h1>
      <p>{t.books.title}</p>
      <button>{t.common.save}</button>
    </div>
  );
}
```

### Accessing Translations

The `useI18n` hook provides:

- `t`: Translation object with all translations
- `locale`: Current locale ("en" | "ar")
- `dir`: Text direction ("ltr" | "rtl")
- `setLocale`: Function to change locale

### Translation Structure

```typescript
t.common.loading; // "Loading..." / "جاري التحميل..."
t.books.title; // "Books" / "الكتب"
t.profile.myProfile; // "My Profile" / "ملفي الشخصي"
```

### Language Switcher

The `LanguageSwitcher` component is already added to the Navbar. Users can switch between English and Arabic.

### RTL Support

When Arabic is selected:

- `dir="rtl"` is automatically set on `<html>`
- CSS automatically adjusts for RTL layout
- Use `dir` from `useI18n()` hook in components if needed

### Default Language

English ("en") is the default language.
