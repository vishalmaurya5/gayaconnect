import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error('UI Error:', error); }
  render() {
    if (this.state.hasError) {
      return <div className="p-6 text-center text-red-600">Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}
