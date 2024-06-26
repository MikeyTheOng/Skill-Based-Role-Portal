import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Handle the error, log it, or perform any necessary actions
    // You can also set this.state.hasError to true if you want to render an error UI
  }

  render() {
    if (this.state.hasError) {
      // Render a fallback UI when an error occurs
      return <div>Error occurred. Please try again later.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
