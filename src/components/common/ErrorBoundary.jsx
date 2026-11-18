import React from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[NOVABANK ErrorBoundary Caught Error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#070d17] flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-xl w-full bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-fintech-lg text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Financial Service Interruption
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              An unexpected runtime error occurred within the secure banking workspace. Your session data and funds remain completely secure and unaffected.
            </p>

            {this.state.error && (
              <div className="mb-6 text-left bg-slate-100 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-rose-600 dark:text-rose-400 overflow-x-auto max-h-36">
                <p className="font-semibold">{this.state.error.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={this.handleReset}
                icon={RotateCcw}
                className="w-full sm:w-auto"
              >
                Reload Platform
              </Button>

              <Button
                variant="outline"
                onClick={this.handleGoHome}
                icon={Home}
                className="w-full sm:w-auto"
              >
                Return to Dashboard
              </Button>
            </div>

            <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
              NOVABANK Platform Architecture • Security Incident Ref: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
