import React from "react";

// Last line of defence for the public site. Without this, any render-time throw
// leaves an empty #root — a blank white page with no hint of what broke, which
// is indistinguishable from "the site is down" for a visitor.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#F2F0EC",
          color: "#1A1A1A",
          fontFamily:
            "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#1B4F8A",
              marginBottom: "0.75rem",
            }}
          >
            Something went wrong
          </h1>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.8 }}>
            We hit an unexpected error while loading this page. Please refresh
            to try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1.5rem",
              padding: "0.7rem 1.6rem",
              borderRadius: "9999px",
              border: "none",
              background: "#F5A623",
              color: "#1A1A1A",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
