import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[AdminErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-bg-main px-6">
          <div className="max-w-md rounded-3xl border border-border-subtle bg-sidebar-bg p-8 text-center shadow-2xl">
            <h1 className="text-2xl font-bold text-text-primary">Something went wrong.</h1>
            <p className="mt-3 text-sm text-text-secondary">
              The admin dashboard hit an unexpected error. Refresh and try again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
