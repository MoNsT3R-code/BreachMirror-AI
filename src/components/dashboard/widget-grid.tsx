import React, { Suspense, useCallback, useRef, useState } from 'react';
import { WidgetConfig } from '../../shared-types';
import { WidgetContainer } from '../common/widget-container';
import { EmptyState, WidgetErrorBoundary, WidgetSkeleton } from './widget-state';

interface WidgetGridProps {
  /** Every widget in saved order (hidden ones included). */
  widgets: WidgetConfig[];
  /** Widgets currently shown (visible and matching the active tab). */
  shown: WidgetConfig[];
  renderContent: (id: string) => React.ReactNode;
  onChange: (widgets: WidgetConfig[]) => void;
  onReset: () => void;
}

function withOrder(list: WidgetConfig[]): WidgetConfig[] {
  return list.map((widget, index) => ({ ...widget, order: index + 1 }));
}

/**
 * Two-column widget grid with drag-to-reorder (HTML5 drag on the handle),
 * keyboard reorder (arrow keys on the handle), touch move buttons, and
 * half/full resizing. Layout is reported through `onChange` for persistence.
 */
export const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets, shown, renderContent, onChange, onReset }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const touchOver = useRef<string | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const moveBefore = useCallback(
    (fromId: string, toId: string) => {
      if (fromId === toId) return;
      const from = widgets.findIndex(widget => widget.id === fromId);
      const to = widgets.findIndex(widget => widget.id === toId);
      if (from < 0 || to < 0) return;
      const next = [...widgets];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onChange(withOrder(next));
      setAnnouncement(`${moved.title} moved to position ${shown.findIndex(widget => widget.id === toId) + 1} of ${shown.length}.`);
    },
    [widgets, shown, onChange],
  );

  const moveByStep = (id: string, direction: -1 | 1) => {
    const position = shown.findIndex(widget => widget.id === id);
    const neighbor = shown[position + direction];
    if (neighbor) moveBefore(id, neighbor.id);
  };

  const patch = (id: string, change: Partial<WidgetConfig>) => {
    onChange(widgets.map(widget => (widget.id === id ? { ...widget, ...change } : widget)));
  };

  if (shown.length === 0) {
    return (
      <div ref={gridRef} className="grid grid-cols-1">
        <EmptyState
          title="No widgets in this view"
          description="Every widget for this section is hidden. Restore the default layout, or choose which widgets to show from Customize layout."
          actionLabel="Restore default layout"
          onAction={onReset}
        />
      </div>
    );
  }

  return (
    <>
      <div ref={gridRef} className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2" aria-label="Dashboard widgets">
        {shown.map((widget, index) => (
          <WidgetContainer
            key={widget.id}
            id={widget.id}
            index={index}
            title={widget.title}
            subtitle={widget.subtitle}
            category={widget.category}
            width={widget.width}
            closable={widget.closable}
            isFirst={index === 0}
            isLast={index === shown.length - 1}
            isDragging={dragId === widget.id}
            isDropTarget={overId === widget.id && dragId !== widget.id}
            gridRef={gridRef}
            onToggleWidth={() => patch(widget.id, { width: widget.width === 'full' ? 'half' : 'full' })}
            onSetWidth={width => widget.width !== width && patch(widget.id, { width })}
            onHide={() => patch(widget.id, { visible: false })}
            onMove={direction => moveByStep(widget.id, direction)}
            onDragStart={(event, card) => {
              setDragId(widget.id);
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', widget.id);
              if (card) event.dataTransfer.setDragImage(card, 24, 24);
            }}
            onDragEnd={() => {
              setDragId(null);
              setOverId(null);
            }}
            onDragOverCard={event => {
              if (!dragId) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
              if (overId !== widget.id) setOverId(widget.id);
            }}
            onTouchDragStart={() => setDragId(widget.id)}
            onTouchDragOver={id => {
              touchOver.current = id;
              setOverId(id);
            }}
            onTouchDragEnd={commit => {
              if (commit && touchOver.current) moveBefore(widget.id, touchOver.current);
              touchOver.current = null;
              setDragId(null);
              setOverId(null);
            }}
            onDropOnCard={event => {
              event.preventDefault();
              if (dragId) moveBefore(dragId, widget.id);
              setDragId(null);
              setOverId(null);
            }}
          >
            <WidgetErrorBoundary title={widget.title}>
              <Suspense fallback={<WidgetSkeleton />}>{renderContent(widget.id)}</Suspense>
            </WidgetErrorBoundary>
          </WidgetContainer>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </>
  );
};
