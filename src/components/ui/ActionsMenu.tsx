"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";

type ActionsMenuProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
};

export default function ActionsMenu({
  onEdit,
  onDelete,
  onView,
}: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, dir } = useI18n();

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
        aria-label="Actions menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute z-10 mt-1 w-40 rounded-lg border border-border bg-popover shadow-lg ${
            dir === "rtl" ? "left-0" : "right-0"
          }`}
        >
          {onView && (
            <button
              onClick={() => {
                setOpen(false);
                onView();
              }}
              className={`block w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent ${
                dir === "rtl" ? "text-right" : "text-left"
              }`}
            >
              {t.common.view}
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className={`block w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent ${
                dir === "rtl" ? "text-right" : "text-left"
              }`}
            >
              {t.common.edit}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className={`block w-full px-4 py-2 text-sm text-destructive hover:bg-accent ${
                dir === "rtl" ? "text-right" : "text-left"
              }`}
            >
              {t.common.delete}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
