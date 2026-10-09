import React from 'react';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('BreachMirror UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="bm-ds grid min-h-screen place-items-center bg-bg p-6 text-fg">
        <div className="bm-card w-full max-w-md p-8 text-center">
          <h1 className="bm-h font-display text-xl font-semibold text-fg">Something went wrong</h1>
          <p className="bm-p mt-3 text-sm text-fg-3">BreachMirror hit an unexpected error while drawing this screen. Your account and saved progress are unaffected.</p>
          <button type="button" onClick={() => window.location.reload()} className="bm-btn bm-btn-primary mt-6">
            Reload
          </button>
        </div>
      </div>
    );
  }
}
