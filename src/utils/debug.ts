/**
 * ============================================
 * DEBUGGING UTILITIES
 * ============================================
 *
 * Development tools for debugging the application
 *
 * DEBUGGING:
 * - Performance monitoring
 * - State inspection
 * - Event logging
 * - Component render tracking
 *
 * SYNTAX:
 * - Conditional compilation (tree-shaken in production)
 * - Type-safe logger
 * - Performance API integration
 *
 * ERROR CHECKING:
 * - Safe access to debug APIs
 * - Graceful degradation
 */

/**
 * Check if development mode
 *
 * SYNTAX: Vite environment variable
 */
export const isDev = import.meta.env.DEV;

/**
 * Check if debug mode enabled
 *
 * DEBUGGING: Set in localStorage to enable debug logging
 * localStorage.setItem('debug', 'true')
 */
export const isDebugEnabled = (): boolean => {
  try {
    return localStorage.getItem('debug') === 'true';
  } catch {
    return false;
  }
};

/**
 * ============================================
 * CONSOLE LOGGER
 * ============================================
 *
 * DEBUGGING: Enhanced console logging with colors and context
 *
 * SYNTAX: Only runs in development (tree-shaken in production)
 */

/**
 * Logger class for structured logging
 *
 * DEBUGGING: Provides consistent log format with colors
 */
export class Logger {
  /**
   * Log styles for different log types
   */
  private static styles = {
    info: 'color: #3b82f6; font-weight: bold',
    success: 'color: #10b981; font-weight: bold',
    warning: 'color: #f59e0b; font-weight: bold',
    error: 'color: #ef4444; font-weight: bold',
    debug: 'color: #8b5cf6; font-weight: bold'
  };

  constructor(private context: string) {}

  /**
   * Info log
   *
   * SYNTAX: ...args spreads remaining arguments
   */
  info(...args: unknown[]): void {
    if (!isDev && !isDebugEnabled()) return;
    console.log(`%c[${this.context}]`, Logger.styles.info, ...args);
  }

  /**
   * Success log
   */
  success(...args: unknown[]): void {
    if (!isDev && !isDebugEnabled()) return;
    console.log(`%c✓ [${this.context}]`, Logger.styles.success, ...args);
  }

  /**
   * Warning log
   */
  warn(...args: unknown[]): void {
    if (!isDev && !isDebugEnabled()) return;
    console.warn(`%c⚠ [${this.context}]`, Logger.styles.warning, ...args);
  }

  /**
   * Error log
   */
  error(...args: unknown[]): void {
    console.error(`%c✗ [${this.context}]`, Logger.styles.error, ...args);
  }

  /**
   * Debug log (only when debug enabled)
   */
  debug(...args: unknown[]): void {
    if (!isDebugEnabled()) return;
    console.log(`%c[DEBUG ${this.context}]`, Logger.styles.debug, ...args);
  }

  /**
   * Group logs together
   *
   * DEBUGGING: Collapsible log groups in console
   */
  group(label: string, fn: () => void): void {
    if (!isDev && !isDebugEnabled()) return;
    console.group(`%c[${this.context}] ${label}`, Logger.styles.info);
    fn();
    console.groupEnd();
  }

  /**
   * Log table data
   *
   * DEBUGGING: Nicely formatted table in console
   */
  table(data: unknown): void {
    if (!isDev && !isDebugEnabled()) return;
    console.log(`%c[${this.context}]`, Logger.styles.info);
    console.table(data);
  }
}

/**
 * Create logger instance
 *
 * USAGE:
 * ```ts
 * const log = createLogger('TodoList');
 * log.info('Component mounted');
 * ```
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

/**
 * ============================================
 * PERFORMANCE MONITORING
 * ============================================
 *
 * DEBUGGING: Measure function execution time
 */

/**
 * Measure function performance
 *
 * SYNTAX: Generic function wrapper
 *
 * DEBUGGING: Logs execution time in development
 *
 * @param name - Measurement name
 * @param fn - Function to measure
 * @returns Wrapped function
 */
export function measurePerformance<TArgs extends unknown[], TReturn>(
  name: string,
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn {
  if (!isDev && !isDebugEnabled()) {
    return fn; // No overhead in production
  }

  return (...args: TArgs): TReturn => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    const duration = end - start;

    console.log(
      `%c⏱ [Performance] ${name}`,
      'color: #8b5cf6; font-weight: bold',
      `${duration.toFixed(2)}ms`
    );

    return result;
  };
}

/**
 * Measure async function performance
 *
 * @param name - Measurement name
 * @param fn - Async function to measure
 * @returns Wrapped async function
 */
export function measureAsyncPerformance<TArgs extends unknown[], TReturn>(
  name: string,
  fn: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  if (!isDev && !isDebugEnabled()) {
    return fn;
  }

  return async (...args: TArgs): Promise<TReturn> => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    const duration = end - start;

    console.log(
      `%c⏱ [Async Performance] ${name}`,
      'color: #8b5cf6; font-weight: bold',
      `${duration.toFixed(2)}ms`
    );

    return result;
  };
}

/**
 * ============================================
 * REACT COMPONENT DEBUGGING
 * ============================================
 *
 * DEBUGGING: Track component renders and updates
 */

/**
 * Log component render
 *
 * USAGE: Call at start of component
 * ```tsx
 * function MyComponent(props) {
 *   logRender('MyComponent', props);
 *   // ...
 * }
 * ```
 */
export function logRender(componentName: string, props?: unknown): void {
  if (!isDev && !isDebugEnabled()) return;

  console.log(
    `%c🔄 [Render] ${componentName}`,
    'color: #3b82f6; font-weight: bold',
    props
  );
}

/**
 * Log component mount
 *
 * USAGE: Call in useEffect with empty deps
 * ```tsx
 * useEffect(() => {
 *   logMount('MyComponent');
 * }, []);
 * ```
 */
export function logMount(componentName: string): void {
  if (!isDev && !isDebugEnabled()) return;

  console.log(
    `%c⬆ [Mount] ${componentName}`,
    'color: #10b981; font-weight: bold'
  );
}

/**
 * Log component unmount
 *
 * USAGE: Return from useEffect
 * ```tsx
 * useEffect(() => {
 *   return () => logUnmount('MyComponent');
 * }, []);
 * ```
 */
export function logUnmount(componentName: string): void {
  if (!isDev && !isDebugEnabled()) return;

  console.log(
    `%c⬇ [Unmount] ${componentName}`,
    'color: #ef4444; font-weight: bold'
  );
}

/**
 * ============================================
 * STATE DEBUGGING
 * ============================================
 */

/**
 * Log state change
 *
 * DEBUGGING: Track state updates
 *
 * @param name - State name
 * @param oldValue - Previous value
 * @param newValue - New value
 */
export function logStateChange(
  name: string,
  oldValue: unknown,
  newValue: unknown
): void {
  if (!isDev && !isDebugEnabled()) return;

  console.log(
    `%c📝 [State Change] ${name}`,
    'color: #f59e0b; font-weight: bold'
  );
  console.log('Old:', oldValue);
  console.log('New:', newValue);
}

/**
 * ============================================
 * DEBUG HELPERS
 * ============================================
 */

/**
 * Expose value to window for debugging
 *
 * DEBUGGING: Access from browser console
 *
 * USAGE:
 * ```ts
 * exposeToWindow('myTodos', todos);
 * // In console: window.__DEBUG__.myTodos
 * ```
 */
export function exposeToWindow(name: string, value: unknown): void {
  if (!isDev) return;

  // ERROR CHECKING: Create __DEBUG__ if doesn't exist
  if (typeof window !== 'undefined') {
    (window as any).__DEBUG__ = (window as any).__DEBUG__ || {};
    (window as any).__DEBUG__[name] = value;

    console.log(
      `%c🔍 [Debug] Exposed to window.__DEBUG__.${name}`,
      'color: #8b5cf6; font-weight: bold',
      value
    );
  }
}

/**
 * Assert condition in development
 *
 * ERROR CHECKING: Throws if condition false
 *
 * DEBUGGING: Helps catch logic errors early
 *
 * @param condition - Condition to check
 * @param message - Error message if false
 */
export function devAssert(condition: boolean, message: string): void {
  if (!isDev) return;

  if (!condition) {
    console.error(`%c❌ [Assert Failed]`, 'color: #ef4444; font-weight: bold', message);
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * ============================================
 * DEBUGGING COMMANDS
 * ============================================
 *
 * DEBUGGING: Expose debug commands to window
 */

if (isDev && typeof window !== 'undefined') {
  (window as any).__DEBUG_COMMANDS__ = {
    /**
     * Enable debug logging
     */
    enableDebug: () => {
      localStorage.setItem('debug', 'true');
      console.log('✅ Debug mode enabled');
    },

    /**
     * Disable debug logging
     */
    disableDebug: () => {
      localStorage.removeItem('debug');
      console.log('❌ Debug mode disabled');
    },

    /**
     * Clear all localStorage
     */
    clearStorage: () => {
      localStorage.clear();
      console.log('🗑 localStorage cleared');
    },

    /**
     * Show localStorage contents
     */
    showStorage: () => {
      const storage: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          storage[key] = localStorage.getItem(key) || '';
        }
      }
      console.table(storage);
    },

    /**
     * Performance marks
     */
    showPerformance: () => {
      console.table(performance.getEntriesByType('measure'));
    }
  };

  console.log(
    '%c🛠 Debug Commands Available',
    'color: #8b5cf6; font-weight: bold; font-size: 14px'
  );
  console.log('window.__DEBUG_COMMANDS__');
  console.table((window as any).__DEBUG_COMMANDS__);
}

/**
 * ============================================
 * USAGE EXAMPLES
 * ============================================
 *
 * LOGGER:
 * ```ts
 * const log = createLogger('MyComponent');
 * log.info('Component initialized');
 * log.warn('Deprecated prop used');
 * log.error('Failed to load data');
 * ```
 *
 * PERFORMANCE:
 * ```ts
 * const processData = measurePerformance('processData', (data) => {
 *   // expensive operation
 * });
 * ```
 *
 * COMPONENT DEBUGGING:
 * ```tsx
 * function MyComponent(props) {
 *   logRender('MyComponent', props);
 *
 *   useEffect(() => {
 *     logMount('MyComponent');
 *     return () => logUnmount('MyComponent');
 *   }, []);
 * }
 * ```
 *
 * EXPOSE TO WINDOW:
 * ```ts
 * exposeToWindow('todos', todos);
 * // Access in console: window.__DEBUG__.todos
 * ```
 *
 * ============================================
 * DEBUGGING TIPS
 * ============================================
 *
 * 1. Enable debug logging:
 *    window.__DEBUG_COMMANDS__.enableDebug()
 *
 * 2. Check localStorage:
 *    window.__DEBUG_COMMANDS__.showStorage()
 *
 * 3. View performance metrics:
 *    window.__DEBUG_COMMANDS__.showPerformance()
 *
 * 4. Access exposed values:
 *    window.__DEBUG__.myValue
 *
 * 5. All debug code is tree-shaken in production builds
 */
