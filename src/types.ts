/**
 * Type Definitions for Todo Application
 *
 * Modern TypeScript best practices:
 * - Use interfaces for object shapes
 * - Use string literal types for fixed values
 * - Export all types for reusability
 */

/**
 * Priority levels for todos
 * String literal union type provides type safety and autocomplete
 */
export type TodoPriority = 'low' | 'medium' | 'high';

/**
 * Filter options for displaying todos
 */
export type TodoFilter = 'all' | 'active' | 'completed';

/**
 * Core Todo interface
 *
 * Best practices demonstrated:
 * - Immutable ID (readonly)
 * - ISO 8601 date strings for consistency
 * - Optional fields for flexibility
 */
export interface Todo {
  readonly id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  priority: TodoPriority;
  dueDate?: string;
  tags?: string[];
}

/**
 * Props interface for TodoItem component
 * Separating data from actions follows SRP (Single Responsibility Principle)
 */
export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onUpdatePriority: (id: string, priority: TodoPriority) => void;
}

/**
 * Props for TodoList component
 */
export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onUpdatePriority: (id: string, priority: TodoPriority) => void;
}

/**
 * Props for AddTodo component
 */
export interface AddTodoProps {
  onAdd: (text: string, priority: TodoPriority) => void;
}

/**
 * Props for TodoFilters component
 */
export interface TodoFiltersProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

/**
 * Statistics about todos
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
  completionRate: number;
}
