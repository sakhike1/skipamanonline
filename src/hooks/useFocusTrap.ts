import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trap Tab inside `containerRef` while `active`, move focus to first focusable on open,
 * restore previous focus on cleanup. Optional Escape closes.
 */
export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onEscape?: () => void,
): void {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const root = containerRef.current;
    const getList = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
      );

    const focusables = getList();
    const previous = document.activeElement as HTMLElement | null;
    focusables[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const list = getList();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (list.length === 1) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previous && typeof previous.focus === 'function') {
        previous.focus();
      }
    };
  }, [active, containerRef, onEscape]);
}
