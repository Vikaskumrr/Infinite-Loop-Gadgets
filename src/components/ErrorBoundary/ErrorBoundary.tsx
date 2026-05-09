import React from 'react';
import './ErrorBoundary.scss';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="app-fallback" role="alert">
          <span className="state-kicker">Unexpected issue</span>
          <h1>Something went wrong.</h1>
          <p>Refresh the page to reload the storefront. If the issue continues, try again later.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
