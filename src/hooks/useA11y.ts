import {
  useCallback,
  useEffect,
  useRef,
  type RefObject,
} from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean
): void {
  useEffect(() => {
    if (!active || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
      );

    const first = focusables()[0];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }
      const items = focusables();
      if (items.length === 0) {
        return;
      }
      const firstItem = items[0]!;
      const lastItem = items[items.length - 1]!;
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [active, containerRef]);
}

export function useOnEscape(handler: () => void, active: boolean): void {
  useEffect(() => {
    if (!active) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handler();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, handler]);
}

export function usePopoverPosition(
  anchorEl: HTMLElement | null | undefined,
  open: boolean,
  enabled: boolean
): { top: number; left: number } | null {
  const getPosition = useCallback(() => {
    if (!enabled || !anchorEl) {
      return null;
    }
    const rect = anchorEl.getBoundingClientRect();
    const pickerWidth = 300;
    const pickerHeight = 360;
    let top = rect.bottom + 8 + window.scrollY;
    let left = rect.left + window.scrollX;

    if (left + pickerWidth > window.scrollX + window.innerWidth) {
      left = Math.max(8, window.scrollX + window.innerWidth - pickerWidth - 8);
    }
    if (top + pickerHeight > window.scrollY + window.innerHeight) {
      top = rect.top + window.scrollY - pickerHeight - 8;
    }
    return { top, left };
  }, [anchorEl, enabled]);

  const positionRef = useRef(getPosition());

  useEffect(() => {
    if (!open || !enabled) {
      return;
    }
    const update = () => {
      positionRef.current = getPosition();
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, enabled, getPosition]);

  if (!open || !enabled) {
    return null;
  }
  return getPosition();
}
