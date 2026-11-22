import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if it's a module loading error
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      console.error('Module loading error detected. This might be due to:');
      console.error('1. Dev server needs restart');
      console.error('2. Network connectivity issues');
      console.error('3. Circular dependency');
      console.error('4. Syntax error in the module');
    }
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} onGoHome={this.handleGoHome} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
  onGoHome: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset, onGoHome }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Something went wrong</h2>
          <p className="text-gray-600">
            We're sorry, but something unexpected happened. Please try again.
          </p>
        </div>

        {error && (
          <details className="text-left bg-gray-100 rounded-lg p-4 text-sm">
            <summary className="font-semibold cursor-pointer mb-2">Error Details</summary>
            <pre className="text-xs overflow-auto mb-2">{error.toString()}</pre>
            {error.message.includes('Failed to fetch dynamically imported module') && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <p className="font-semibold text-yellow-800 mb-1">Module Loading Error</p>
                <p className="text-yellow-700">
                  Try refreshing the page or restarting the dev server. If the issue persists, 
                  check the browser console for more details.
                </p>
              </div>
            )}
          </details>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            <Home size={18} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;

