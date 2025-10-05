import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useScrollLock } from "../hooks/useScrollLock";

export type FullPageDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  /** Close when clicking the dark backdrop (default true) */
  closeOnOverlay?: boolean;
  /** Close when pressing Escape (default true) */
  closeOnEsc?: boolean;
};

export function FullPageDialog({
  open,
  onClose,
  title,
  children,
  closeOnOverlay = true,
  closeOnEsc = true,
}: FullPageDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useFocusTrap(open, panelRef);

  // Close on ESC
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, onClose]);

  const onOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!closeOnOverlay) return;
      // Close only when clicking the overlay/padding outside the panel
      if (e.target === e.currentTarget) onClose();
    },
    [closeOnOverlay, onClose]
  );

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" aria-hidden={false}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* Overlay that centers the panel; padding creates visible backdrop margins */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={onOverlayClick}
        className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
      >
        <div
          ref={panelRef}
          className="w-full max-h-[85vh] flex flex-col rounded-2xl bg-white text-gray-900
                     shadow-xl ring-1 ring-black/10 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-white/10
                     motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out
                     data-[state=open]:translate-y-0 data-[state=closed]:translate-y-2"
          data-state="open"
        >
          {/* Header */}
          <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-white/80 px-4 py-3 backdrop-blur dark:bg-zinc-900/80">
            <h2 className="text-lg font-semibold truncate">{title}</h2>
            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Close dialog"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          {/* Scrollable content area inside the bounded panel */}
          <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
