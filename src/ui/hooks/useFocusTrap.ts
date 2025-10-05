import { useEffect } from "react";

const focusableSelectorsArray = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  '*[tabindex]:not([tabindex="-1"])',
  '*[contenteditable="true"]',
];

const focusableSelectorsInline = focusableSelectorsArray.join(",");

// Utility: basic focus trap + restore focus on close
export const useFocusTrap = (
  active: boolean,
  containerRef: React.RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current!;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus first focusable or panel itself
    const focusFirst = () => {
      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectorsInline)
      );
      (nodes[0] || container).focus();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const nodes = Array.from(
          container.querySelectorAll<HTMLElement>(focusableSelectorsInline)
        );
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (activeEl === first || !container.contains(activeEl)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (activeEl === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    setTimeout(focusFirst, 0);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused) previouslyFocused.focus();
    };
  }, [active, containerRef]);
};
