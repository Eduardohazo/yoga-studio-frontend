import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('Error:', error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 max-w-md w-full text-center">
          <h1 className="font-serif text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-6">Please refresh the page and try again.</p>
          <button onClick={() => window.location.reload()}
            className="btn-primary px-8 py-2">Refresh Page</button>
        </div>
      </div>
    );
  }
}
export default ErrorBoundary;
