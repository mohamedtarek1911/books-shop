"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("admin@books.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || t.auth.invalidCredentials);
      return;
    }

    // success -> redirect to original page or books
    // Get redirect from URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect") || "/books";
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-background">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <h1 className="text-2xl font-semibold text-card-foreground">
          {t.auth.login}
        </h1>
        {error && <p className="text-destructive">{error}</p>}

        <div className="space-y-1">
          <label className="text-sm text-card-foreground">{t.auth.email}</label>
          <input
            className="w-full rounded-lg border border-input bg-background p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-card-foreground">
            {t.auth.password}
          </label>
          <input
            className="w-full rounded-lg border border-input bg-background p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>

        <button className="w-full rounded-lg bg-primary py-2 text-primary-foreground hover:opacity-90">
          {t.auth.login}
        </button>
      </form>
    </div>
  );
}
