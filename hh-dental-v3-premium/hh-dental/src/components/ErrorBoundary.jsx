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
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-shell py-24 text-center">
          <h1 className="text-3xl font-bold text-[#0F172A]">Something went wrong.</h1>
          <p className="mt-4 text-sm text-[#64748B]">
            We could not render this screen safely. Please refresh and try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
