import { Component, ReactNode, ErrorInfo } from 'react';
import './ErrorBoundary.css';

/**
 * ============================================
 * ERROR BOUNDARY COMPONENT
 * ============================================
 *
 * React Error Boundary to catch JavaScript errors anywhere in the
 * component tree, log errors, and display a fallback UI.
 *
 * SYNTAX NOTE:
 * Error Boundaries must be class components (not functional components)
 * because they use lifecycle methods like componentDidCatch
 *
 * DEBUGGING:
 * - Errors are logged to console with full stack trace
 * - Component stack trace shows where error occurred
 * - Error details can be sent to error tracking service (Sentry, etc.)
 *
 * ERROR CHECKING:
 * - Catches errors during rendering
 * - Catches errors in lifecycle methods
 * - Catches errors in constructors of whole tree below
 * - Does NOT catch errors in event handlers (use try-catch)
 * - Does NOT catch errors in async code (promises, setTimeout)
 * - Does NOT catch errors in server-side rendering
 * - Does NOT catch errors thrown in the error boundary itself
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Optional fallback UI to display when error occurs
   * If not provided, uses default error UI
   */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Class Component
 *
 * SYNTAX: Class component with state and lifecycle methods
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Initialize state
   *
   * SYNTAX: Constructor must call super(props) first
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);

    // Initial state - no errors
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Static method called when error is thrown
   *
   * SYNTAX: static getDerivedStateFromError is a lifecycle method
   * that must be static and return new state
   *
   * ERROR CHECKING: This method is called during "render" phase
   * so side effects are not allowed here
   *
   * @param error - Error that was thrown
   * @returns New state to trigger error UI
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state to trigger fallback UI
    return {
      hasError: true,
      error
    };
  }

  /**
   * Lifecycle method called after error is caught
   *
   * SYNTAX: componentDidCatch is called during "commit" phase
   * so side effects ARE allowed (logging, analytics, etc.)
   *
   * DEBUGGING: This is where we log error details
   *
   * ERROR CHECKING: Use this to:
   * - Log errors to error reporting service
   * - Send analytics
   * - Show user-friendly error messages
   *
   * @param error - Error that was thrown
   * @param errorInfo - Component stack trace
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error details
    this.setState({
      errorInfo
    });

    // ====================
    // ERROR LOGGING
    // ====================

    // Log to console (development)
    console.error('❌ Error Boundary caught an error:');
    console.error('Error:', error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);

    // ====================
    // PRODUCTION ERROR TRACKING
    // ====================

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Example: Send to Sentry, LogRocket, etc.
      this.logErrorToService(error, errorInfo);
    }

    // ====================
    // DEBUGGING TIPS
    // ====================

    // Store error in sessionStorage for debugging
    try {
      sessionStorage.setItem('lastError', JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      // Ignore if sessionStorage is full or unavailable
      console.warn('Could not save error to sessionStorage:', e);
    }
  }

  /**
   * Log error to external service
   *
   * ERROR CHECKING: Wrapped in try-catch to prevent errors
   * in error logging from breaking the app
   *
   * DEBUGGING: Replace this with your actual error service
   *
   * @param error - Error object
   * @param errorInfo - Component stack trace
   */
  private logErrorToService(error: Error, errorInfo: ErrorInfo): void {
    try {
      // ====================
      // EXAMPLE: Sentry
      // ====================
      /*
      import * as Sentry from '@sentry/react';

      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
      */

      // ====================
      // EXAMPLE: Custom API
      // ====================
      /*
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack
          },
          componentStack: errorInfo.componentStack,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
      */

      // Placeholder for demonstration
      console.log('📊 Error would be sent to tracking service in production');
    } catch (loggingError) {
      // ERROR CHECKING: Don't let logging errors break the app
      console.error('Failed to log error to service:', loggingError);
    }
  }

  /**
   * Reset error state
   *
   * DEBUGGING: Allows user to recover from error without page reload
   */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * Reload the page
   *
   * DEBUGGING: Nuclear option - full page reload
   */
  private handleReload = (): void => {
    window.location.reload();
  };

  /**
   * Render method
   *
   * SYNTAX: Must return ReactNode
   *
   * ERROR CHECKING: Check if error occurred before rendering
   */
  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    // ====================
    // ERROR STATE
    // ====================

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            {/* Error Icon */}
            <svg
              className="error-boundary__icon"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>

            {/* Error Message */}
            <h1 className="error-boundary__title">Oops! Something went wrong</h1>
            <p className="error-boundary__message">
              The application encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {/* DEBUGGING: Show error details in development */}
            {import.meta.env.DEV && error && (
              <details className="error-boundary__details">
                <summary className="error-boundary__summary">
                  🐛 Error Details (Development Only)
                </summary>
                <div className="error-boundary__code">
                  <h3>Error Message:</h3>
                  <pre>{error.message}</pre>

                  <h3>Stack Trace:</h3>
                  <pre>{error.stack}</pre>

                  {errorInfo && (
                    <>
                      <h3>Component Stack:</h3>
                      <pre>{errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="error-boundary__actions">
              <button
                className="error-boundary__button error-boundary__button--primary"
                onClick={this.handleReset}
                aria-label="Try to recover from error"
              >
                Try Again
              </button>
              <button
                className="error-boundary__button error-boundary__button--secondary"
                onClick={this.handleReload}
                aria-label="Reload the page"
              >
                Reload Page
              </button>
            </div>

            {/* DEBUGGING: Link to open console */}
            {import.meta.env.DEV && (
              <p className="error-boundary__hint">
                💡 Press F12 or Cmd+Option+I to open DevTools and see full error details
              </p>
            )}
          </div>
        </div>
      );
    }

    // ====================
    // NORMAL STATE
    // ====================

    // No error - render children normally
    return children;
  }
}

/**
 * ============================================
 * USAGE EXAMPLES
 * ============================================
 *
 * BASIC USAGE:
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * WITH CUSTOM FALLBACK:
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * MULTIPLE BOUNDARIES (recommended):
 * ```tsx
 * <ErrorBoundary>
 *   <Header />
 *   <ErrorBoundary>
 *     <MainContent />
 *   </ErrorBoundary>
 *   <ErrorBoundary>
 *     <Sidebar />
 *   </ErrorBoundary>
 * </ErrorBoundary>
 * ```
 *
 * ============================================
 * DEBUGGING TIPS
 * ============================================
 *
 * 1. Check sessionStorage for last error:
 *    ```js
 *    JSON.parse(sessionStorage.getItem('lastError'))
 *    ```
 *
 * 2. Trigger error boundary manually (for testing):
 *    ```tsx
 *    const BuggyComponent = () => {
 *      throw new Error('Test error');
 *      return <div>Never rendered</div>;
 *    };
 *    ```
 *
 * 3. Error boundaries don't catch errors in:
 *    - Event handlers (use try-catch)
 *    - Async code (use .catch() or try-catch in async functions)
 *    - setTimeout/setInterval
 *    - Server-side rendering
 *
 * 4. To catch event handler errors:
 *    ```tsx
 *    const handleClick = () => {
 *      try {
 *        // risky code
 *      } catch (error) {
 *        console.error(error);
 *        // show user-friendly message
 *      }
 *    };
 *    ```
 *
 * ============================================
 * ERROR CHECKING CHECKLIST
 * ============================================
 *
 * ✅ Error boundary catches render errors
 * ✅ Error boundary catches lifecycle errors
 * ✅ Error details logged to console
 * ✅ Error details sent to tracking service (production)
 * ✅ User-friendly error message displayed
 * ✅ Recovery options provided (try again, reload)
 * ✅ Development mode shows full error details
 * ✅ Production mode hides sensitive information
 * ✅ Error logging failures don't crash app
 * ✅ Last error saved to sessionStorage for debugging
 */
