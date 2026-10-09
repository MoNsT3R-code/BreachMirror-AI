import React from 'react';
import { ChevronDown, ChevronUp, EyeOff, GripVertical, Maximize2, Minimize2 } from 'lucide-react';

export type WidgetCategory = 'telemetry' | 'playbook' | 'analytics' | 'simulator';

const CATEGORY_LABEL: Record<WidgetCategory, string> = {
  telemetry: 'Telemetry',
  playbook: 'Playbook',
  analytics: 'Analytics',
  simulator: 'Simulator',
};

interface WidgetContainerProps {
  id: string;
  title: string;
  subtitle?: string;
  category: WidgetCategory;
  width: 'full' | 'half';
  children: React.ReactNode;
  closable?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  isDropTarget?: boolean;
  isDragging?: boolean;
  index?: number;
  onToggleWidth: () => void;
  onSetWidth: (width: 'full' | 'half') => void;
  onHide?: () => void;
  onMove: (direction: -1 | 1) => void;
  onDragStart: (event: React.DragEvent<HTMLButtonElement>, card: HTMLElement | null) => void;
  onDragEnd: () => void;
  onDragOverCard: (event: React.DragEvent<HTMLElement>) => void;
  onDropOnCard: (event: React.DragEvent<HTMLElement>) => void;
  /** Touch/pen drag: called with the widget id under the finger, then on release. */
  onTouchDragStart: () => void;
  onTouchDragOver: (widgetId: string | null) => void;
  onTouchDragEnd: (commit: boolean) => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
}

/** Dashboard card chrome: reorder handle, resize grip, hide. Content is supplied by the caller. */
export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  id,
  title,
  subtitle,
  category,
  width,
  children,
  closable = true,
  isFirst,
  isLast,
  isDropTarget,
  isDragging,
  index = 0,
  onToggleWidth,
  onSetWidth,
  onHide,
  onMove,
  onDragStart,
  onDragEnd,
  onDragOverCard,
  onDropOnCard,
  onTouchDragStart,
  onTouchDragOver,
  onTouchDragEnd,
  gridRef,
}) => {
  const cardRef = React.useRef<HTMLElement>(null);
  const lastPointerType = React.useRef<string>('mouse');
  const isFull = width === 'full';

  const startTouchDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') return;
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    onTouchDragStart();
    const move = (moveEvent: PointerEvent) => {
      const under = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest('section[id^="widget-"]');
      onTouchDragOver(under ? under.id.replace('widget-', '') : null);
      if (moveEvent.clientY < 90) window.scrollBy(0, -14);
      else if (moveEvent.clientY > window.innerHeight - 90) window.scrollBy(0, 14);
    };
    const stop = (endEvent: PointerEvent) => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', stop);
      handle.removeEventListener('pointercancel', stop);
      onTouchDragEnd(endEvent.type === 'pointerup');
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);
  };

  const startResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const move = (moveEvent: PointerEvent) => {
      const grid = gridRef.current?.getBoundingClientRect();
      if (!grid) return;
      const ratio = (moveEvent.clientX - grid.left) / grid.width;
      if (ratio > 0.72) onSetWidth('full');
      else if (ratio < 0.58) onSetWidth('half');
    };
    const stop = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', stop);
      handle.removeEventListener('pointercancel', stop);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);
  };

  const handleKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      onMove(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      onMove(1);
    }
  };

  return (
    <section
      ref={cardRef}
      id={`widget-${id}`}
      aria-labelledby={`widget-title-${id}`}
      onDragOver={onDragOverCard}
      onDrop={onDropOnCard}
      style={{ '--bm-i': Math.min(index, 8) } as React.CSSProperties}
      className={`bm-card bm-rise relative flex min-w-0 flex-col transition-[box-shadow,opacity] duration-200 ${isFull ? 'lg:col-span-2' : ''} ${
        isDropTarget ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <header className="bm-ds flex items-start justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="bm-eyebrow">{CATEGORY_LABEL[category]}</p>
          <h3 id={`widget-title-${id}`} className="bm-h truncate font-display text-base font-semibold text-fg">{title}</h3>
          {subtitle && <p className="bm-p mt-0.5 line-clamp-1 text-xs text-fg-3">{subtitle}</p>}
        </div>
        <div className="-mr-1.5 flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            className="bm-btn bm-btn-ghost bm-btn-sm hidden pointer-coarse:inline-flex"
            aria-label={`Move ${title} up`}
            disabled={isFirst}
            onClick={() => onMove(-1)}
          >
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="bm-btn bm-btn-ghost bm-btn-sm hidden pointer-coarse:inline-flex"
            aria-label={`Move ${title} down`}
            disabled={isLast}
            onClick={() => onMove(1)}
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            draggable
            className="bm-btn bm-btn-ghost bm-btn-sm cursor-grab touch-none active:cursor-grabbing"
            aria-label={`Reorder ${title}. Drag, or use the up and down arrow keys.`}
            title="Drag to reorder (or use the arrow keys)"
            onPointerDown={event => {
              lastPointerType.current = event.pointerType;
              startTouchDrag(event);
            }}
            onDragStart={event => {
              if (lastPointerType.current !== 'mouse') {
                event.preventDefault();
                return;
              }
              onDragStart(event, cardRef.current);
            }}
            onDragEnd={onDragEnd}
            onKeyDown={handleKey}
          >
            <GripVertical className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="bm-btn bm-btn-ghost bm-btn-sm hidden lg:inline-flex"
            aria-label={isFull ? `Make ${title} half width` : `Make ${title} full width`}
            aria-pressed={isFull}
            title={isFull ? 'Half width' : 'Full width'}
            onClick={onToggleWidth}
          >
            {isFull ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
          </button>
          {closable && onHide && (
            <button type="button" className="bm-btn bm-btn-ghost bm-btn-sm" aria-label={`Hide ${title}`} title="Hide widget" onClick={onHide}>
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      <div className="min-w-0 flex-1 p-4 sm:p-5">{children}</div>

      <button
        type="button"
        aria-label={`Resize ${title}. Use left and right arrow keys, or drag.`}
        className="absolute bottom-1 right-1 hidden h-6 w-6 cursor-ew-resize touch-none place-items-center rounded text-fg-3 hover:bg-sunken hover:text-fg lg:grid"
        onPointerDown={startResize}
        onKeyDown={event => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            onSetWidth('full');
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            onSetWidth('half');
          }
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M9 1 L1 9 M9 5 L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </section>
  );
};
