import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-danger)' }}>
          <h2 style={{ fontWeight: 800 }}>Something went wrong</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0' }}>{this.state.error?.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: 'var(--gradient-primary)',
              color: '#fff',
              border: 'none',
              padding: '0.55rem 1.5rem',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              fontWeight: 700,
              boxShadow: 'var(--shadow-glow-accent)',
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
