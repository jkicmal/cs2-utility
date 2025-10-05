import { useEffect } from "react";

// Utility: lock/unlock scroll on the <html> element
export const useScrollLock = (active: boolean) => {
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.overflow;
    if (active) el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, [active]);
};
