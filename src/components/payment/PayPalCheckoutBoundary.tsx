import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

type Props = { children: ReactNode };

type State = { hasError: boolean; message: string };

/**
 * Keeps checkout usable if the PayPal SDK throws during render (e.g. React 18 Strict Mode
 * double-mount, invalid client id, or script load failures). The root ErrorBoundary would
 * otherwise replace the whole app with a generic screen.
 */
export class PayPalCheckoutBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || 'PayPal failed to load' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[PayPalCheckoutBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-left">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
            <div className="min-w-0 space-y-2">
              <p className="text-sm font-semibold text-red-900">PayPal could not start</p>
              <p className="text-xs text-red-800 break-words">{this.state.message}</p>
              <p className="text-xs text-red-800/90">
                Check <span className="font-mono">VITE_PAYPAL_CLIENT_ID</span>,{' '}
                <span className="font-mono">VITE_API_BASE_URL</span>, and that the Nest server is
                running. For hoodies you can use the PayPal payment link if configured.
              </p>
              <button
                type="button"
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-bold text-white hover:bg-gray-800"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
