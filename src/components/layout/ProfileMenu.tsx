"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/api/db";
import { useI18n } from "@/lib/i18n/context";

export default function ProfileMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function handleNavigation(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-border bg-background px-2 py-1 text-xs sm:text-sm text-foreground hover:bg-accent truncate max-w-[120px] sm:max-w-none"
        title={`${user.name} · ${user.email}`}
      >
        <span className="hidden sm:inline">
          {user.name} · {user.email}
        </span>
        <span className="sm:hidden">{user.name.split(" ")[0]}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-border bg-popover shadow">
          <button
            onClick={() => handleNavigation("/profile")}
            className="block w-full px-3 py-2 text-left text-popover-foreground hover:bg-accent"
          >
            {t.navbar.myProfile}
          </button>
          <button
            onClick={() => handleNavigation("/profile/edit")}
            className="block w-full px-3 py-2 text-left text-popover-foreground hover:bg-accent"
          >
            {t.navbar.editProfile}
          </button>
          <button
            onClick={logout}
            className="block w-full px-3 py-2 text-left text-destructive hover:bg-accent"
          >
            {t.auth.logout}
          </button>
        </div>
      )}
    </div>
  );
}
