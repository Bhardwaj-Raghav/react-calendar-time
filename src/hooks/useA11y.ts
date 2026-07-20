import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const POPOVER_GAP = 8;
const POPOVER_PADDING = 8;
const DEFAULT_PICKER_WIDTH = 300;
const DEFAULT_PICKER_HEIGHT = 360;

/** Avoid SSR warnings: useLayoutEffect is a no-op on the server. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
    first?.focus({ preventScroll: true });

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
        lastItem.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus({ preventScroll: true });
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
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

/**
 * Dismisses when pointerdown happens outside the floating element and the
 * optional anchor (e.g. the input that opens a popover).
 */
export function useOnClickOutside(
  handler: () => void,
  active: boolean,
  floatingRef: RefObject<HTMLElement | null>,
  anchorEl?: HTMLElement | null
): void {
  useEffect(() => {
    if (!active) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (floatingRef.current?.contains(target)) {
        return;
      }
      if (anchorEl?.contains(target)) {
        return;
      }
      handler();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [active, handler, floatingRef, anchorEl]);
}

function computePopoverPosition(
  anchorEl: HTMLElement,
  pickerWidth: number,
  pickerHeight: number
): { top: number; left: number } {
  const rect = anchorEl.getBoundingClientRect();
  let top = rect.bottom + POPOVER_GAP;
  let left = rect.left;

  if (left + pickerWidth > window.innerWidth - POPOVER_PADDING) {
    left = Math.max(
      POPOVER_PADDING,
      window.innerWidth - pickerWidth - POPOVER_PADDING
    );
  }
  if (left < POPOVER_PADDING) {
    left = POPOVER_PADDING;
  }

  if (top + pickerHeight > window.innerHeight - POPOVER_PADDING) {
    const above = rect.top - pickerHeight - POPOVER_GAP;
    if (above >= POPOVER_PADDING) {
      top = above;
    } else {
      top = Math.max(
        POPOVER_PADDING,
        window.innerHeight - pickerHeight - POPOVER_PADDING
      );
    }
  }

  return { top, left };
}

/**
 * Positions a popover with `position: fixed` viewport coordinates.
 * Recomputes on scroll/resize and when the floating element size changes.
 */
export function usePopoverPosition(
  anchorEl: HTMLElement | null | undefined,
  open: boolean,
  enabled: boolean,
  floatingRef: RefObject<HTMLElement | null>
): { top: number; left: number } | null {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );

  const update = useCallback(() => {
    if (!enabled || !open || !anchorEl) {
      setPosition(null);
      return;
    }
    const floating = floatingRef.current;
    const width = floating?.offsetWidth || DEFAULT_PICKER_WIDTH;
    const height = floating?.offsetHeight || DEFAULT_PICKER_HEIGHT;
    setPosition(computePopoverPosition(anchorEl, width, height));
  }, [anchorEl, enabled, open, floatingRef]);

  useIsomorphicLayoutEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    if (!open || !enabled) {
      return;
    }

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    const floating = floatingRef.current;
    let observer: ResizeObserver | undefined;
    if (floating && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => update());
      observer.observe(floating);
    }

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      observer?.disconnect();
    };
  }, [open, enabled, update, floatingRef]);

  if (!open || !enabled) {
    return null;
  }
  return position;
}
