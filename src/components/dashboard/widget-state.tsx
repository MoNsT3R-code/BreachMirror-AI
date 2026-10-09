import React from 'react';
import { AlertTriangle, LayoutGrid, RotateCcw } from 'lucide-react';

/** Placeholder shown while a lazy widget bundle loads. */
export const WidgetSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div role="status" aria-label="Loading widget" className="space-y-3">
    <div className="bm-skeleton h-24" />
    {Array.from({ length: rows - 1 }, (_, index) => (
      <div key={index} className="bm-skeleton h-5" style={{ width: `${92 - index * 14}%` }} />
    ))}
  </div>
);

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction }) => (
  <div className="bm-card bm-ds col-span-full flex flex-col items-center gap-3 px-6 py-12 text-center">
    <span className="grid h-12 w-12 place-items-center rounded-lg bg-sunken text-fg-3">
      <LayoutGrid className="h-6 w-6" aria-hidden="true" />
    </span>
    <h3 className="bm-h font-display text-lg font-semibold text-fg">{title}</h3>
    <p className="bm-p max-w-sm text-sm text-fg-3">{description}</p>
    {actionLabel && onAction && (
      <button type="button" className="bm-btn bm-btn-primary mt-1" onClick={onAction}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        {actionLabel}
      </button>
    )}
  </div>
);

interface BoundaryProps {
  title: string;
  children: React.ReactNode;
}

interface BoundaryState {
  failed: boolean;
}

/** Isolates a failing widget so the rest of the dashboard keeps working. */
export class WidgetErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error): void {
    console.error(`Widget "${this.props.title}" failed:`, error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="bm-ds flex flex-col items-start gap-3 rounded-md border border-line bg-crit-soft p-4">
        <p className="bm-p flex items-center gap-2 text-sm font-semibold text-crit">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          This widget could not be displayed.
        </p>
        <button type="button" className="bm-btn bm-btn-sm" onClick={() => this.setState({ failed: false })}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }
}
