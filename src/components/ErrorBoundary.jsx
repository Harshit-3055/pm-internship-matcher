"use client";

import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's an auth error
    if (error.message?.includes('Refresh Token') || 
        error.message?.includes('Invalid Refresh Token') ||
        error.message?.includes('refresh_token_not_found')) {
      // Don't show error boundary for auth errors, just log them
      console.log('Auth error caught by boundary:', error.message);
      return { hasError: false };
    }
    
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error('Error caught by boundary:', error, errorInfo);
    
    // If it's an auth error, clear the session
    if (error.message?.includes('Refresh Token') || 
        error.message?.includes('Invalid Refresh Token') ||
        error.message?.includes('refresh_token_not_found')) {
      // Clear auth session
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb-fomwkpkkmbffarpehprb-auth-token');
        window.location.href = '/';
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
            <p className="text-gray-600">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
