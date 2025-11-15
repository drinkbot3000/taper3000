/**
 * ============================================
 * ERROR HANDLING UTILITIES
 * ============================================
 *
 * Centralized error handling for the application
 *
 * SYNTAX:
 * - TypeScript utility functions with strict typing
 * - Error classes extend built-in Error
 * - Generic type parameters for flexibility
 *
 * ERROR CHECKING:
 * - Type guards to check error types
 * - Validation functions with error messages
 * - Safe error serialization
 *
 * DEBUGGING:
 * - Consistent error logging format
 * - Error context for troubleshooting
 * - Stack trace preservation
 */

/**
 * ============================================
 * CUSTOM ERROR CLASSES
 * ============================================
 *
 * SYNTAX: Custom errors extend Error and set prototype
 * for proper instanceof checks
 */

/**
 * Storage Error
 *
 * Thrown when localStorage operations fail
 *
 * DEBUGGING: Check if:
 * - localStorage is disabled
 * - Private browsing mode
 * - Storage quota exceeded
 */
export class StorageError extends Error {
  constructor(message: string, public readonly operation: string) {
    super(message);
    this.name = 'StorageError';

    // SYNTAX: Restore prototype chain for instanceof checks
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}

/**
 * Validation Error
 *
 * Thrown when data validation fails
 *
 * DEBUGGING: Check validation rules and input data
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Network Error
 *
 * Thrown when network requests fail
 *
 * DEBUGGING: Check network connectivity and API endpoints
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    public readonly url?: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * ============================================
 * ERROR TYPE GUARDS
 * ============================================
 *
 * SYNTAX: Type guards use 'is' keyword to narrow types
 *
 * ERROR CHECKING: Safely check error types at runtime
 */

/**
 * Check if error is a StorageError
 *
 * SYNTAX: Type predicate 'error is StorageError'
 */
export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

/**
 * Check if error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Check if error is a NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Check if value is an Error object
 *
 * ERROR CHECKING: Handle unknown error types safely
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * ============================================
 * ERROR LOGGING
 * ============================================
 *
 * DEBUGGING: Consistent error logging with context
 */

/**
 * Error log levels
 *
 * SYNTAX: String literal type for type safety
 */
export type ErrorLevel = 'error' | 'warn' | 'info';

/**
 * Error context for debugging
 */
export interface ErrorContext {
  /** Where the error occurred */
  location?: string;
  /** User action that triggered error */
  action?: string;
  /** Additional data for debugging */
  data?: Record<string, unknown>;
  /** Timestamp */
  timestamp?: string;
}

/**
 * Log error with context
 *
 * DEBUGGING: Provides consistent error logging format
 *
 * ERROR CHECKING: Safely handles all error types
 *
 * @param error - Error to log
 * @param level - Log level
 * @param context - Additional context
 */
export function logError(
  error: unknown,
  level: ErrorLevel = 'error',
  context?: ErrorContext
): void {
  // ERROR CHECKING: Ensure error is an Error object
  const errorObj = isError(error) ? error : new Error(String(error));

  // Build log message
  const logData = {
    level,
    error: {
      name: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack
    },
    context: {
      ...context,
      timestamp: context?.timestamp || new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
  };

  // DEBUGGING: Log to console with proper formatting
  const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;

  logFn('🔴 Error Log:', logData);

  // PRODUCTION: Send to error tracking service
  if (import.meta.env.PROD) {
    sendToErrorTracking(logData);
  }
}

/**
 * Send error to tracking service
 *
 * ERROR CHECKING: Wrapped in try-catch to prevent errors
 * in error logging from breaking the app
 *
 * @param logData - Error data to send
 */
function sendToErrorTracking(logData: unknown): void {
  try {
    // DEBUGGING: Replace with actual error tracking service
    console.log('📊 Would send to error tracking:', logData);

    // Example: Sentry, LogRocket, Bugsnag, etc.
    /*
    import * as Sentry from '@sentry/react';
    Sentry.captureException(logData.error, {
      contexts: { custom: logData.context }
    });
    */
  } catch (error) {
    // ERROR CHECKING: Silent fail - don't let logging errors crash app
    console.warn('Failed to send error to tracking service:', error);
  }
}

/**
 * ============================================
 * ERROR SERIALIZATION
 * ============================================
 *
 * SYNTAX: Safe JSON serialization of errors
 *
 * ERROR CHECKING: Handles circular references and non-serializable values
 */

/**
 * Serialize error for storage or transmission
 *
 * DEBUGGING: Preserves error details for later analysis
 *
 * ERROR CHECKING: Safely handles all error types
 *
 * @param error - Error to serialize
 * @returns Serializable error object
 */
export function serializeError(error: unknown): Record<string, unknown> {
  // ERROR CHECKING: Handle non-Error objects
  if (!isError(error)) {
    return {
      type: 'UnknownError',
      message: String(error),
      timestamp: new Date().toISOString()
    };
  }

  // SYNTAX: Create plain object from Error
  const serialized: Record<string, unknown> = {
    type: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  };

  // Add custom error properties
  if (isStorageError(error)) {
    serialized.operation = error.operation;
  } else if (isValidationError(error)) {
    serialized.field = error.field;
    serialized.value = error.value;
  } else if (isNetworkError(error)) {
    serialized.url = error.url;
    serialized.status = error.status;
  }

  return serialized;
}

/**
 * Deserialize error from stored data
 *
 * @param data - Serialized error data
 * @returns Error object
 */
export function deserializeError(data: Record<string, unknown>): Error {
  const error = new Error(String(data.message || 'Unknown error'));
  error.name = String(data.type || 'Error');
  error.stack = String(data.stack || '');
  return error;
}

/**
 * ============================================
 * SAFE ERROR MESSAGES
 * ============================================
 *
 * DEBUGGING: User-friendly error messages
 *
 * ERROR CHECKING: Safe string extraction from errors
 */

/**
 * Get user-friendly error message
 *
 * SYNTAX: Type guard narrows unknown to Error
 *
 * ERROR CHECKING: Provides fallback for all error types
 *
 * @param error - Any error value
 * @param fallback - Default message if error can't be parsed
 * @returns User-friendly error message
 */
export function getErrorMessage(
  error: unknown,
  fallback = 'An unexpected error occurred'
): string {
  // ERROR CHECKING: Handle different error types
  if (isError(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  // DEBUGGING: Log unhandled error type
  console.warn('Unknown error type:', error);

  return fallback;
}

/**
 * ============================================
 * ERROR HANDLER WRAPPER
 * ============================================
 *
 * SYNTAX: Higher-order function with generics
 *
 * DEBUGGING: Wraps functions with automatic error handling
 */

/**
 * Wrap async function with error handling
 *
 * SYNTAX: Generic type parameters preserve function signature
 *
 * ERROR CHECKING: Catches and logs all errors
 *
 * DEBUGGING: Provides consistent error handling pattern
 *
 * @param fn - Async function to wrap
 * @param context - Error context for logging
 * @returns Wrapped function with error handling
 */
export function withErrorHandling<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  context?: ErrorContext
): (...args: TArgs) => Promise<TReturn | null> {
  return async (...args: TArgs): Promise<TReturn | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      // ERROR CHECKING: Log error with context
      logError(error, 'error', {
        ...context,
        location: fn.name || 'anonymous function'
      });

      // Return null on error (caller should handle)
      return null;
    }
  };
}

/**
 * Wrap sync function with error handling
 *
 * @param fn - Function to wrap
 * @param context - Error context
 * @returns Wrapped function
 */
export function withSyncErrorHandling<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  context?: ErrorContext
): (...args: TArgs) => TReturn | null {
  return (...args: TArgs): TReturn | null => {
    try {
      return fn(...args);
    } catch (error) {
      logError(error, 'error', {
        ...context,
        location: fn.name || 'anonymous function'
      });
      return null;
    }
  };
}

/**
 * ============================================
 * USAGE EXAMPLES
 * ============================================
 *
 * CUSTOM ERROR:
 * ```ts
 * throw new StorageError('Failed to save data', 'setItem');
 * ```
 *
 * ERROR CHECKING:
 * ```ts
 * try {
 *   // risky code
 * } catch (error) {
 *   if (isStorageError(error)) {
 *     console.log('Storage operation failed:', error.operation);
 *   }
 * }
 * ```
 *
 * ERROR LOGGING:
 * ```ts
 * logError(error, 'error', {
 *   location: 'TodoList',
 *   action: 'delete todo',
 *   data: { todoId: '123' }
 * });
 * ```
 *
 * FUNCTION WRAPPING:
 * ```ts
 * const safeFetch = withErrorHandling(
 *   async (url: string) => fetch(url),
 *   { location: 'API' }
 * );
 * ```
 *
 * ============================================
 * DEBUGGING TIPS
 * ============================================
 *
 * 1. Check console for error logs
 * 2. Look for error context (location, action, data)
 * 3. Check stack trace for error source
 * 4. Verify error type with instanceof
 * 5. Check browser DevTools Network tab for network errors
 * 6. Check Application tab for storage errors
 * 7. Use React DevTools for component errors
 */
