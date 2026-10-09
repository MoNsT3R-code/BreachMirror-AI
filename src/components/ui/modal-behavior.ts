import { RefObject, useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Open modals, topmost last. Only the topmost one traps focus and handles Escape. */
const stack: symbol[] = [];

function applyRootState(): void {
  const root = document.getElementById('root');
  if (!root) return;
  if (stack.length > 0) root.setAttribute('inert', '');
  else root.removeAttribute('inert');
  document.body.style.overflow = stack.length > 0 ? 'hidden' : '';
}

/**
 * Shared modal behaviour: focus trap, Escape to close, inert background,
 * scroll lock and focus restoration. Works with stacked modals.
 * The modal must render outside #root (a portal) so the background can be inert.
 */
export function useModalBehavior(open: boolean, containerRef: RefObject<HTMLElement | null>, onClose: () => void, initialFocusRef?: RefObject<HTMLElement | null>): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const id = Symbol('modal');
    const previouslyFocused = document.activeElement as HTMLElement | null;
    stack.push(id);
    applyRootState();

    const container = containerRef.current;
    const focusables = () => Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(el => el.offsetParent !== null);
    (initialFocusRef?.current ?? focusables()[0] ?? container)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !container?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      const position = stack.indexOf(id);
      if (position >= 0) stack.splice(position, 1);
      applyRootState();
      if (stack.length === 0) previouslyFocused?.focus?.();
    };
  }, [open, containerRef, initialFocusRef]);
}
