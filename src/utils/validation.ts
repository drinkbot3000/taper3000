/**
 * ============================================
 * INPUT VALIDATION UTILITIES
 * ============================================
 *
 * SYNTAX:
 * - Type guards for runtime type checking
 * - Zod-style validation API (without the library)
 * - Descriptive error messages
 *
 * ERROR CHECKING:
 * - Validates all user inputs
 * - Prevents XSS and injection attacks
 * - Ensures data integrity
 *
 * DEBUGGING:
 * - Clear validation error messages
 * - Field-specific error reporting
 */

import { ValidationError } from './errorHandler';
import { Todo, TodoPriority, TodoFilter } from '../types';

/**
 * ============================================
 * VALIDATION RESULT TYPE
 * ============================================
 *
 * SYNTAX: Discriminated union for type-safe results
 */

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; field?: string };

/**
 * ============================================
 * STRING VALIDATION
 * ============================================
 */

/**
 * Validate string is not empty
 *
 * ERROR CHECKING: Trims whitespace before checking
 *
 * @param value - String to validate
 * @param fieldName - Field name for error messages
 * @returns Validation result
 */
export function validateNonEmpty(
  value: string,
  fieldName = 'Field'
): ValidationResult<string> {
  // SYNTAX: Trim whitespace
  const trimmed = value.trim();

  // ERROR CHECKING: Check if empty
  if (!trimmed) {
    return {
      success: false,
      error: `${fieldName} cannot be empty`,
      field: fieldName
    };
  }

  return { success: true, data: trimmed };
}

/**
 * Validate string length
 *
 * ERROR CHECKING: Min and max length constraints
 *
 * @param value - String to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @param fieldName - Field name for error messages
 * @returns Validation result
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName = 'Field'
): ValidationResult<string> {
  const length = value.length;

  // ERROR CHECKING: Validate minimum length
  if (length < min) {
    return {
      success: false,
      error: `${fieldName} must be at least ${min} characters (currently ${length})`,
      field: fieldName
    };
  }

  // ERROR CHECKING: Validate maximum length
  if (length > max) {
    return {
      success: false,
      error: `${fieldName} must be at most ${max} characters (currently ${length})`,
      field: fieldName
    };
  }

  return { success: true, data: value };
}

/**
 * Sanitize HTML to prevent XSS
 *
 * ERROR CHECKING: Removes dangerous HTML/script tags
 *
 * DEBUGGING: Logs sanitized content in development
 *
 * @param value - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeHtml(value: string): string {
  // ERROR CHECKING: Remove script tags and event handlers
  let sanitized = value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // DEBUGGING: Log if content was sanitized
  if (import.meta.env.DEV && sanitized !== value) {
    console.warn('⚠️ Content was sanitized:', { original: value, sanitized });
  }

  return sanitized;
}

/**
 * ============================================
 * TODO VALIDATION
 * ============================================
 */

/**
 * Validate todo text
 *
 * ERROR CHECKING:
 * - Not empty
 * - Within length limits
 * - Sanitized for XSS
 *
 * @param text - Todo text to validate
 * @returns Validation result
 */
export function validateTodoText(text: string): ValidationResult<string> {
  // ERROR CHECKING: Check non-empty
  const nonEmptyResult = validateNonEmpty(text, 'Todo text');
  if (!nonEmptyResult.success) {
    return nonEmptyResult;
  }

  // ERROR CHECKING: Check length (1-500 characters)
  const lengthResult = validateLength(nonEmptyResult.data, 1, 500, 'Todo text');
  if (!lengthResult.success) {
    return lengthResult;
  }

  // ERROR CHECKING: Sanitize HTML
  const sanitized = sanitizeHtml(lengthResult.data);

  return { success: true, data: sanitized };
}

/**
 * Validate todo priority
 *
 * SYNTAX: Type guard to ensure valid priority
 *
 * @param priority - Priority to validate
 * @returns Validation result
 */
export function validateTodoPriority(
  priority: string
): ValidationResult<TodoPriority> {
  // ERROR CHECKING: Type guard for valid priorities
  const validPriorities: TodoPriority[] = ['low', 'medium', 'high'];

  if (!validPriorities.includes(priority as TodoPriority)) {
    return {
      success: false,
      error: `Priority must be one of: ${validPriorities.join(', ')}`,
      field: 'priority'
    };
  }

  return { success: true, data: priority as TodoPriority };
}

/**
 * Validate todo filter
 *
 * SYNTAX: Type guard for TodoFilter
 *
 * @param filter - Filter to validate
 * @returns Validation result
 */
export function validateTodoFilter(filter: string): ValidationResult<TodoFilter> {
  // ERROR CHECKING: Type guard for valid filters
  const validFilters: TodoFilter[] = ['all', 'active', 'completed'];

  if (!validFilters.includes(filter as TodoFilter)) {
    return {
      success: false,
      error: `Filter must be one of: ${validFilters.join(', ')}`,
      field: 'filter'
    };
  }

  return { success: true, data: filter as TodoFilter };
}

/**
 * Validate entire todo object
 *
 * ERROR CHECKING: Validates all required fields
 *
 * @param todo - Partial todo object to validate
 * @returns Validation result
 */
export function validateTodo(
  todo: Partial<Todo>
): ValidationResult<Pick<Todo, 'text' | 'priority'>> {
  // ERROR CHECKING: Validate text
  if (!todo.text) {
    return {
      success: false,
      error: 'Todo text is required',
      field: 'text'
    };
  }

  const textResult = validateTodoText(todo.text);
  if (!textResult.success) {
    return textResult;
  }

  // ERROR CHECKING: Validate priority
  const priority = todo.priority || 'medium';
  const priorityResult = validateTodoPriority(priority);
  if (!priorityResult.success) {
    return priorityResult;
  }

  return {
    success: true,
    data: {
      text: textResult.data,
      priority: priorityResult.data
    }
  };
}

/**
 * ============================================
 * DATE VALIDATION
 * ============================================
 */

/**
 * Validate ISO 8601 date string
 *
 * ERROR CHECKING: Ensures valid date format
 *
 * @param dateString - Date string to validate
 * @returns Validation result
 */
export function validateISODate(dateString: string): ValidationResult<Date> {
  // ERROR CHECKING: Try to parse date
  const date = new Date(dateString);

  // ERROR CHECKING: Check if date is valid
  if (isNaN(date.getTime())) {
    return {
      success: false,
      error: 'Invalid date format. Expected ISO 8601 format.',
      field: 'date'
    };
  }

  return { success: true, data: date };
}

/**
 * Validate date is in the future
 *
 * @param dateString - Date string to validate
 * @returns Validation result
 */
export function validateFutureDate(dateString: string): ValidationResult<Date> {
  const dateResult = validateISODate(dateString);
  if (!dateResult.success) {
    return dateResult;
  }

  const date = dateResult.data;
  const now = new Date();

  // ERROR CHECKING: Check if date is in future
  if (date <= now) {
    return {
      success: false,
      error: 'Date must be in the future',
      field: 'date'
    };
  }

  return { success: true, data: date };
}

/**
 * ============================================
 * TYPE GUARDS
 * ============================================
 *
 * SYNTAX: Type predicates for runtime type checking
 */

/**
 * Check if value is a valid todo priority
 *
 * SYNTAX: Type predicate 'value is TodoPriority'
 *
 * @param value - Value to check
 * @returns True if valid priority
 */
export function isTodoPriority(value: unknown): value is TodoPriority {
  return (
    typeof value === 'string' &&
    ['low', 'medium', 'high'].includes(value)
  );
}

/**
 * Check if value is a valid todo filter
 *
 * @param value - Value to check
 * @returns True if valid filter
 */
export function isTodoFilter(value: unknown): value is TodoFilter {
  return (
    typeof value === 'string' &&
    ['all', 'active', 'completed'].includes(value)
  );
}

/**
 * Check if object is a valid Todo
 *
 * ERROR CHECKING: Validates all required properties
 *
 * @param value - Value to check
 * @returns True if valid Todo
 */
export function isTodo(value: unknown): value is Todo {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const todo = value as Record<string, unknown>;

  // ERROR CHECKING: Check required properties
  return (
    typeof todo.id === 'string' &&
    typeof todo.text === 'string' &&
    typeof todo.completed === 'boolean' &&
    typeof todo.createdAt === 'string' &&
    isTodoPriority(todo.priority)
  );
}

/**
 * ============================================
 * SAFE PARSING
 * ============================================
 *
 * ERROR CHECKING: Parse JSON safely without throwing
 */

/**
 * Safely parse JSON
 *
 * SYNTAX: Generic type parameter for type-safe result
 *
 * ERROR CHECKING: Returns validation result instead of throwing
 *
 * @param json - JSON string to parse
 * @returns Validation result with parsed data
 */
export function safeParseJSON<T = unknown>(
  json: string
): ValidationResult<T> {
  try {
    // SYNTAX: JSON.parse may throw
    const data = JSON.parse(json) as T;
    return { success: true, data };
  } catch (error) {
    // ERROR CHECKING: Return error instead of throwing
    return {
      success: false,
      error: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * ============================================
 * USAGE EXAMPLES
 * ============================================
 *
 * VALIDATE TODO TEXT:
 * ```ts
 * const result = validateTodoText(userInput);
 * if (result.success) {
 *   // Use result.data (validated and sanitized)
 * } else {
 *   // Show error: result.error
 * }
 * ```
 *
 * TYPE GUARD:
 * ```ts
 * if (isTodo(unknownValue)) {
 *   // TypeScript knows unknownValue is Todo
 *   console.log(unknownValue.text);
 * }
 * ```
 *
 * SAFE JSON PARSING:
 * ```ts
 * const result = safeParseJSON<Todo[]>(jsonString);
 * if (result.success) {
 *   setTodos(result.data);
 * } else {
 *   showError(result.error);
 * }
 * ```
 *
 * ============================================
 * DEBUGGING TIPS
 * ============================================
 *
 * 1. Validation errors include field name
 * 2. Check console for sanitization warnings
 * 3. Use validation results for user feedback
 * 4. Type guards provide compile-time safety
 * 5. Sanitization logs show what was removed
 */
