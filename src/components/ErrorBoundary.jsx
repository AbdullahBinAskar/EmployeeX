import { Component } from 'react';
import { colors } from '../theme.js';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, textAlign: 'center' }}>
          <AlertTriangle size={40} color={colors.orange} style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 8 }}>Something went wrong</div>
          <div style={{ fontSize: 13, color: colors.textDim, marginBottom: 20, maxWidth: 400 }}>
            {this.state.error?.message || 'An unexpected error occurred in this view.'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: colors.blue, color: '#fff', fontWeight: 600, fontSize: 13,
            }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
