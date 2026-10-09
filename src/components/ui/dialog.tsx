import React, { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useModalBehavior } from './modal-behavior';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** "top" anchors the panel near the top (command palette). */
  placement?: 'center' | 'top';
  /** Hide the visual header but keep the accessible name. */
  hideHeader?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const SIZE: Record<NonNullable<DialogProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

/**
 * Accessible modal dialog: role="dialog", labelled, focus trapped, Escape and
 * backdrop to close, background made inert, scroll locked, focus restored.
 */
export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  placement = 'center',
  hideHeader = false,
  initialFocusRef,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  useModalBehavior(open, panelRef, onClose, initialFocusRef);

  if (!open) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[80] flex justify-center px-3 sm:px-6 ${placement === 'top' ? 'items-start pt-[12vh]' : 'items-center py-6'}`}
    >
      {/* The scrim is a sibling (not an ancestor) of the panel so the panel's glass can blur the page behind it. */}
      <div
        className="absolute inset-0"
        onMouseDown={onClose}
        aria-hidden="true"
        style={{ background: 'var(--bm-scrim)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={`bm-pop bm-ds bm-glass-strong relative z-10 flex max-h-full w-full ${SIZE[size]} flex-col overflow-hidden rounded-xl text-fg`}
      >
        <header className={hideHeader ? 'sr-only' : 'flex items-start justify-between gap-4 border-b border-line px-5 py-4'}>
          <div className="min-w-0">
            <h2 id={titleId} className="bm-h font-display text-lg font-semibold text-fg">{title}</h2>
            {description && <p id={descId} className="bm-p mt-0.5 text-sm text-fg-3">{description}</p>}
          </div>
          {!hideHeader && (
            <button type="button" className="bm-btn bm-btn-ghost bm-btn-icon -mr-2 -mt-1 shrink-0" onClick={onClose} aria-label={`Close ${title}`}>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && <footer className="border-t border-line bg-sunken/60 px-5 py-3">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
};
