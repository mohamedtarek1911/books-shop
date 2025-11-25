"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type Toast = {
  id: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
};

type ToastCtx = {
  pushToast: (message: string, type?: Toast["type"]) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2500);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "rounded-xl border px-4 py-2 text-sm shadow-lg bg-card border-border",
              t.type === "success" &&
                "border-green-500/50 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400",
              t.type === "error" &&
                "border-red-500/50 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400",
              t.type === "warning" &&
                "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400",
              t.type === "info" && "border-border bg-card text-card-foreground",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
