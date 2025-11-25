"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteMyBook } from "@/features/books/hooks/useMyBooks";
import { useToast } from "@/components/ui/ToastProvider";
import { useI18n } from "@/lib/i18n/context";

type ActionsMenuProps = {
  id: string;
  source: "shop" | "my";
  onAddToMyBooks?: () => void;
};

export default function ActionsMenu({
  id,
  source,
  onAddToMyBooks,
}: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const deleteMutation = useDeleteMyBook();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const { t, dir } = useI18n();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // If menu is open, check if click is outside menu
      if (open && menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }

      // If modal is open, only close if clicking the backdrop (not the modal content)
      if (showConfirm && modalRef.current) {
        const modalContent = modalRef.current.querySelector(
          "[data-modal-content]"
        );
        // Close if: click is directly on backdrop OR click is inside backdrop but outside content
        if (
          target === modalRef.current ||
          (modalContent &&
            !modalContent.contains(target) &&
            modalRef.current.contains(target))
        ) {
          setShowConfirm(false);
        }
      }
    }

    if (open || showConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, showConfirm]);

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(id);
      pushToast(t.books.bookDeleted, "success");
      setOpen(false);
      setShowConfirm(false);
    } catch (err) {
      // Check if it's a "Not found" error - likely means server was restarted
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage === "Not found") {
        pushToast(t.books.bookNotFound, "warning");
        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ["my-books"] });
      } else {
        pushToast(errorMessage, "error");
      }
      setShowConfirm(false);
    }
  }

  function onDeleteClick() {
    setOpen(false);
    setShowConfirm(true);
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
        >
          ⋮
        </button>

        {open && (
          <div
            className={`absolute z-10 mt-2 w-36 rounded-xl border border-border bg-popover shadow-lg ${
              dir === "rtl" ? "left-0" : "right-0"
            }`}
          >
            <button
              onClick={() => {
                setOpen(false);
                router.push(`/books/${id}`);
              }}
              className={`block w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent ${
                dir === "rtl" ? "text-right" : "text-left"
              }`}
            >
              {t.common.view}
            </button>

            {source === "my" && (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push(`/books/${id}/edit`);
                  }}
                  className={`block w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t.common.edit}
                </button>

                <button
                  disabled={deleteMutation.isPending}
                  onClick={onDeleteClick}
                  className={`block w-full px-3 py-2 text-sm text-destructive hover:bg-accent disabled:opacity-50 ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t.common.delete}
                </button>
              </>
            )}

            {source === "shop" && onAddToMyBooks && (
              <button
                onClick={() => {
                  setOpen(false);
                  onAddToMyBooks();
                }}
                className={`block w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent ${
                  dir === "rtl" ? "text-right" : "text-left"
                }`}
              >
                {t.books.addToMyBooks}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            data-modal-content
            className="rounded-xl border border-border bg-card p-6 shadow-lg max-w-sm w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {t.books.confirmDelete}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t.books.confirmDeleteMessage}
            </p>
            <div
              className={`flex gap-3 ${
                dir === "rtl" ? "justify-start" : "justify-end"
              }`}
            >
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50"
              >
                {deleteMutation.isPending ? t.books.deleting : t.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
