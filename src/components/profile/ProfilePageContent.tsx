"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import type { User } from "@/lib/api/db";

export default function ProfilePageContent({ user }: { user: User }) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4">
      <h1 className="text-2xl font-semibold text-foreground">
        {t.profile.myProfile}
      </h1>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{t.profile.name}</p>
          <p className="font-medium text-card-foreground">{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{t.profile.email}</p>
          <p className="font-medium text-card-foreground">{user.email}</p>
        </div>
      </div>

      <Link
        href="/profile/edit"
        className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        {t.profile.editProfile}
      </Link>
    </div>
  );
}
