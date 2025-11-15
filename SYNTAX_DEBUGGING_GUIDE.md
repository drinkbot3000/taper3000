# Syntax, Commenting, Debugging & Error Checking Guide

Complete reference for understanding the code structure, debugging tools, and error handling in Taper Todo.

## Table of Contents

1. [Syntax Patterns](#syntax-patterns)
2. [Commenting Standards](#commenting-standards)
3. [Debugging Tools](#debugging-tools)
4. [Error Checking](#error-checking)

---

## Syntax Patterns

### TypeScript Best Practices

#### Type Guards

```typescript
// SYNTAX: Type predicates use 'is' keyword
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

// Usage
if (isError(error)) {
  // TypeScript knows 'error' is Error type here
  console.log(error.message);
}
```

#### Generic Functions

```typescript
// SYNTAX: Generic type parameters preserve function signatures
export function withErrorHandling<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn | null> {
  // Function implementation
}
```

#### Discriminated Unions

```typescript
// SYNTAX: Union type with discriminant property 'success'
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Usage - TypeScript knows which properties exist
const result = validateTodoText(input);
if (result.success) {
  console.log(result.data); // ✅ TypeScript knows 'data' exists
} else {
  console.log(result.error); // ✅ TypeScript knows 'error' exists
}
```

#### Custom Error Classes

```typescript
// SYNTAX: Extend Error and restore prototype
export class StorageError extends Error {
  constructor(message: string, public readonly operation: string) {
    super(message);
    this.name = 'StorageError';

    // IMPORTANT: Restore prototype chain for instanceof checks
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}

// Usage
throw new StorageError('Failed to save', 'setItem');

// Check error type
if (error instanceof StorageError) {
  console.log(error.operation); // ✅ TypeScript knows this property exists
}
```

#### React Class Components (Error Boundaries)

```typescript
// SYNTAX: Error Boundaries MUST be class components
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props); // REQUIRED: Call super first
    this.state = { hasError: false };
  }

  // SYNTAX: Static method returns new state
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  // SYNTAX: Instance method handles side effects
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <div>Error occurred</div>;
    }
    return this.props.children;
  }
}
```

---

## Commenting Standards

### Comment Structure

Every file follows this pattern:

```typescript
/**
 * ============================================
 * SECTION TITLE
 * ============================================
 *
 * Brief description of what this section does
 *
 * SYNTAX:
 * - Syntax patterns used
 * - Special TypeScript features
 *
 * ERROR CHECKING:
 * - What errors are handled
 * - Validation performed
 *
 * DEBUGGING:
 * - How to debug this code
 * - What to check when things go wrong
 */
```

### Function Comments

```typescript
/**
 * Brief description of function
 *
 * SYNTAX: Explanation of syntax patterns used
 *
 * ERROR CHECKING: What validations are performed
 *
 * DEBUGGING: How to troubleshoot issues
 *
 * @param name - Parameter description
 * @returns Return value description
 */
export function myFunction(name: string): Result {
  // Implementation
}
```

### Inline Comments

```typescript
// ERROR CHECKING: Validate input is not empty
const trimmed = value.trim();
if (!trimmed) {
  return { success: false, error: 'Value required' };
}

// DEBUGGING: Log sanitized content in development
if (import.meta.env.DEV && sanitized !== original) {
  console.warn('Content was sanitized', { original, sanitized });
}

// SYNTAX: Type guard narrows unknown to Error
if (isError(error)) {
  return error.message;
}
```

### Usage Examples in Comments

```typescript
/**
 * ============================================
 * USAGE EXAMPLES
 * ============================================
 *
 * BASIC USAGE:
 * ```ts
 * const result = validateTodoText('Hello');
 * if (result.success) {
 *   console.log(result.data);
 * }
 * ```
 *
 * WITH ERROR HANDLING:
 * ```ts
 * try {
 *   throw new ValidationError('Invalid input', 'email');
 * } catch (error) {
 *   if (isValidationError(error)) {
 *     console.log(`Error in field: ${error.field}`);
 *   }
 * }
 * ```
 */
```

---

## Debugging Tools

### Logger Class

```typescript
import { createLogger } from './utils/debug';

const log = createLogger('MyComponent');

// Different log levels
log.info('Component initialized');      // Blue
log.success('Data loaded successfully'); // Green
log.warn('Deprecated API used');         // Yellow
log.error('Failed to save');             // Red
log.debug('Internal state:', state);     // Purple (only when debug enabled)

// Grouped logs
log.group('Processing items', () => {
  items.forEach(item => log.info(item));
});

// Table format
log.table(todos);
```

### Performance Monitoring

```typescript
import { measurePerformance, measureAsyncPerformance } from './utils/debug';

// Measure sync function
const processData = measurePerformance('processData', (data) => {
  // expensive operation
  return processed;
});

// Measure async function
const fetchData = measureAsyncPerformance('fetchData', async (url) => {
  const response = await fetch(url);
  return response.json();
});

// Console output:
// ⏱ [Performance] processData 45.23ms
// ⏱ [Async Performance] fetchData 123.45ms
```

### Component Debugging

```typescript
import { logRender, logMount, logUnmount } from './utils/debug';

function MyComponent(props) {
  // Track renders
  logRender('MyComponent', props);

  useEffect(() => {
    // Track mount
    logMount('MyComponent');

    // Track unmount
    return () => logUnmount('MyComponent');
  }, []);

  return <div>Content</div>;
}

// Console output:
// 🔄 [Render] MyComponent { prop1: 'value' }
// ⬆ [Mount] MyComponent
// ⬇ [Unmount] MyComponent
```

### State Change Tracking

```typescript
import { logStateChange } from './utils/debug';

const [todos, setTodos] = useState([]);

const addTodo = (newTodo) => {
  setTodos(prevTodos => {
    const nextTodos = [...prevTodos, newTodo];

    // Log state change
    logStateChange('todos', prevTodos, nextTodos);

    return nextTodos;
  });
};

// Console output:
// 📝 [State Change] todos
// Old: []
// New: [{ id: '1', text: 'New todo' }]
```

### Window Debugging

```typescript
import { exposeToWindow, devAssert } from './utils/debug';

// Expose value to window for console access
exposeToWindow('currentTodos', todos);

// Access in browser console:
// window.__DEBUG__.currentTodos

// Development assertions
devAssert(todos.length > 0, 'Todos array should not be empty');
// Throws error in development if condition false
```

### Debug Commands

Open browser console and use:

```javascript
// Enable debug logging
window.__DEBUG_COMMANDS__.enableDebug()

// Disable debug logging
window.__DEBUG_COMMANDS__.disableDebug()

// Show localStorage contents
window.__DEBUG_COMMANDS__.showStorage()

// Clear all localStorage
window.__DEBUG_COMMANDS__.clearStorage()

// Show performance metrics
window.__DEBUG_COMMANDS__.showPerformance()
```

### VS Code Debugger

1. **Set Breakpoints**: Click left margin in code editor
2. **Press F5**: Launch debugger
3. **Select Configuration**: Choose Chrome/Firefox/Edge
4. **Debug**: Step through code, inspect variables

Available configurations (`.vscode/launch.json`):
- Debug Chrome
- Debug Firefox
- Debug Edge

---

## Error Checking

### Error Boundary

Wraps entire app to catch React errors:

```tsx
// In main.tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

Features:
- Catches all rendering errors
- Shows user-friendly error UI
- Provides "Try Again" and "Reload" options
- Development mode shows full error details
- Production mode hides sensitive info
- Errors logged to console and sessionStorage

### Custom Errors

```typescript
import { StorageError, ValidationError, NetworkError } from './utils/errorHandler';

// Throw custom errors
throw new StorageError('Failed to save data', 'setItem');
throw new ValidationError('Invalid email', 'email', userInput);
throw new NetworkError('API request failed', '/api/todos', 500);

// Check error types
try {
  // risky code
} catch (error) {
  if (isStorageError(error)) {
    console.log('Storage operation failed:', error.operation);
  } else if (isValidationError(error)) {
    console.log('Validation failed for field:', error.field);
  } else if (isNetworkError(error)) {
    console.log('Network error at:', error.url, 'Status:', error.status);
  }
}
```

### Error Logging

```typescript
import { logError } from './utils/errorHandler';

try {
  // risky operation
} catch (error) {
  logError(error, 'error', {
    location: 'TodoList',
    action: 'delete todo',
    data: { todoId: '123' }
  });
}

// Console output:
// 🔴 Error Log: {
//   level: 'error',
//   error: { name: 'Error', message: '...', stack: '...' },
//   context: {
//     location: 'TodoList',
//     action: 'delete todo',
//     data: { todoId: '123' },
//     timestamp: '2025-11-15T12:00:00.000Z',
//     userAgent: '...',
//     url: '...'
//   }
// }
```

### Input Validation

```typescript
import { validateTodoText, validateTodoPriority } from './utils/validation';

// Validate todo text
const textResult = validateTodoText(userInput);
if (textResult.success) {
  // Use validated and sanitized text
  const cleanText = textResult.data;
} else {
  // Show error to user
  showError(textResult.error);
}

// Validate priority
const priorityResult = validateTodoPriority('high');
if (priorityResult.success) {
  const priority = priorityResult.data; // TypeScript knows this is TodoPriority
}

// Validation checks:
// ✅ Not empty (after trimming)
// ✅ Length limits (1-500 characters)
// ✅ XSS protection (HTML sanitization)
// ✅ Type validation (valid priority/filter)
```

### XSS Protection

```typescript
import { sanitizeHtml } from './utils/validation';

// Remove dangerous HTML
const userInput = '<script>alert("XSS")</script>Hello';
const safe = sanitizeHtml(userInput);
// Result: 'Hello'

// Automatic in validateTodoText
const result = validateTodoText(userInput);
// Text is automatically sanitized
```

### Safe JSON Parsing

```typescript
import { safeParseJSON } from './utils/validation';

// Instead of JSON.parse (which throws)
const result = safeParseJSON<Todo[]>(jsonString);

if (result.success) {
  setTodos(result.data);
} else {
  showError(result.error);
}

// No try-catch needed!
```

### Type Guards

```typescript
import { isTodo, isTodoPriority, isTodoFilter } from './utils/validation';

// Runtime type checking
const data = JSON.parse(storageData);

if (isTodo(data)) {
  // TypeScript knows data is Todo type
  console.log(data.text);
}

if (isTodoPriority(value)) {
  // TypeScript knows value is 'low' | 'medium' | 'high'
  setPriority(value);
}
```

### Function Wrapping

```typescript
import { withErrorHandling, withSyncErrorHandling } from './utils/errorHandler';

// Wrap async function with automatic error handling
const safeFetch = withErrorHandling(
  async (url: string) => {
    const response = await fetch(url);
    return response.json();
  },
  { location: 'API', action: 'fetch data' }
);

// Errors automatically logged, returns null on error
const data = await safeFetch('/api/todos');
if (data) {
  setTodos(data);
}

// Wrap sync function
const safeProcess = withSyncErrorHandling(
  (data) => processData(data),
  { location: 'DataProcessor' }
);
```

---

## Error Handling Checklist

### ✅ React Errors
- [x] ErrorBoundary wraps app
- [x] User-friendly error UI
- [x] Recovery options (try again, reload)
- [x] Error details in development
- [x] Errors logged to console and sessionStorage

### ✅ Input Validation
- [x] Todo text validated (non-empty, length, XSS)
- [x] Priority validated (type checking)
- [x] Filter validated (type checking)
- [x] Dates validated (ISO format, future dates)
- [x] HTML sanitized to prevent XSS

### ✅ Storage Errors
- [x] localStorage availability checked
- [x] Quota exceeded handled
- [x] JSON parse errors caught
- [x] Cross-tab sync errors handled

### ✅ Network Errors
- [x] Fetch failures caught
- [x] Timeout handling ready
- [x] Offline mode supported

### ✅ Error Logging
- [x] Errors logged with context
- [x] Stack traces preserved
- [x] Error tracking service integration ready
- [x] Development/production modes

---

## Debugging Checklist

### ✅ Development Tools
- [x] Logger class with colored output
- [x] Performance monitoring
- [x] Component render tracking
- [x] State change logging
- [x] Window debug commands
- [x] VS Code debugger configs

### ✅ Production Safety
- [x] Debug code tree-shaken in production
- [x] Conditional compilation (import.meta.env.DEV)
- [x] Debug mode toggle (localStorage)
- [x] No debug overhead in production

### ✅ Error Recovery
- [x] Graceful error handling
- [x] User-friendly messages
- [x] Recovery mechanisms
- [x] Data preservation

---

## Quick Reference

### Enable Debug Mode

```javascript
// In browser console
localStorage.setItem('debug', 'true')
// Reload page
```

### View Last Error

```javascript
// In browser console
JSON.parse(sessionStorage.getItem('lastError'))
```

### Access Debug Values

```javascript
// In browser console
window.__DEBUG__          // Exposed values
window.__DEBUG_COMMANDS__ // Debug commands
```

### Common Debugging Patterns

```typescript
// 1. Log with context
const log = createLogger('Component');
log.info('Action', data);

// 2. Validate input
const result = validateTodoText(input);
if (!result.success) {
  log.error(result.error);
  return;
}

// 3. Handle errors
try {
  await riskyOperation();
} catch (error) {
  logError(error, 'error', { location: 'Component' });
}

// 4. Measure performance
const fn = measurePerformance('operation', () => {
  // expensive code
});

// 5. Track renders
logRender('Component', props);
```

---

## Best Practices

### ✅ DO

- Use type guards for runtime checks
- Validate all user inputs
- Log errors with context
- Use ErrorBoundary for React errors
- Sanitize HTML to prevent XSS
- Return validation results instead of throwing
- Use debug utilities in development
- Write descriptive error messages

### ❌ DON'T

- Don't use `any` type
- Don't throw without catching
- Don't trust user input
- Don't leave console.logs in production (use logger)
- Don't ignore errors silently
- Don't use alert() for errors
- Don't expose sensitive info in error messages

---

## Troubleshooting

### Error Boundary Not Catching

Error boundaries don't catch:
- Event handler errors (use try-catch)
- Async errors (use .catch())
- setTimeout/setInterval errors
- Server-side rendering errors

Solution: Wrap async code and event handlers with try-catch

### Validation Always Failing

1. Check validation rules match your use case
2. Check for whitespace (validation trims)
3. Check console for sanitization warnings
4. Verify field name matches

### Debug Logs Not Showing

1. Check if in development mode: `import.meta.env.DEV`
2. Enable debug mode: `localStorage.setItem('debug', 'true')`
3. Reload page
4. Check console filters (show all messages)

### VS Code Debugger Not Working

1. Ensure dev server running (`npm run dev`)
2. Check debugger is attached (green bar in VS Code)
3. Verify breakpoints are not grayed out
4. Check source maps are generated
5. Try different browser config (Chrome/Firefox/Edge)

---

**All code is deployed and ready to use!** 🚀
