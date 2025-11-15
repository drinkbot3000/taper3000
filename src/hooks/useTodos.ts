import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Todo, TodoPriority, TodoFilter, TodoStats } from '../types';

/**
 * Custom Hook: useTodos
 *
 * Encapsulates all todo-related business logic
 *
 * Modern React patterns demonstrated:
 * - Custom hooks for logic reusability
 * - useCallback for stable function references
 * - useMemo for computed values
 * - Immutable state updates
 * - Pure functions for state transformations
 *
 * @returns object containing todos state and action methods
 */
export function useTodos() {
  // Persist todos in localStorage with the useLocalStorage hook
  const [todos, setTodos] = useLocalStorage<Todo[]>('taper-todos', []);
  const [filter, setFilter] = useLocalStorage<TodoFilter>('taper-filter', 'all');

  /**
   * Generate unique ID using timestamp + random string
   * Alternative: use UUID library for production apps
   */
  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  /**
   * Add new todo
   *
   * useCallback prevents function recreation on every render
   * Dependencies array ensures function updates when needed
   */
  const addTodo = useCallback((text: string, priority: TodoPriority = 'medium') => {
    const newTodo: Todo = {
      id: generateId(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
      tags: []
    };

    // Immutable state update: create new array instead of mutating
    setTodos(prev => [newTodo, ...prev]);
  }, [setTodos]);

  /**
   * Toggle todo completion status
   *
   * Best practice: Use map for immutable updates
   * Each todo is recreated with updated properties
   */
  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date().toISOString() : undefined
            }
          : todo
      )
    );
  }, [setTodos]);

  /**
   * Delete todo by ID
   *
   * Uses filter to create new array without the deleted item
   */
  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, [setTodos]);

  /**
   * Edit todo text
   *
   * Validates text is not empty before updating
   */
  const editTodo = useCallback((id: string, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: trimmedText } : todo
      )
    );
  }, [setTodos]);

  /**
   * Update todo priority
   */
  const updatePriority = useCallback((id: string, priority: TodoPriority) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  }, [setTodos]);

  /**
   * Clear all completed todos
   */
  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, [setTodos]);

  /**
   * Filtered todos based on current filter
   *
   * useMemo caches the result and only recalculates when dependencies change
   * This prevents unnecessary filtering on every render
   */
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'all':
      default:
        return todos;
    }
  }, [todos, filter]);

  /**
   * Computed statistics
   *
   * useMemo prevents recalculation unless todos change
   */
  const stats = useMemo((): TodoStats => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      active,
      completed,
      completionRate
    };
  }, [todos]);

  /**
   * Sort todos by priority and creation date
   *
   * Priority order: high > medium > low
   * Within same priority: newest first
   */
  const sortedTodos = useMemo(() => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };

    return [...filteredTodos].sort((a, b) => {
      // First, sort by completion (active todos first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then by priority
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // Finally by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredTodos]);

  // Return public API of the hook
  return {
    todos: sortedTodos,
    filter,
    stats,
    actions: {
      addTodo,
      toggleTodo,
      deleteTodo,
      editTodo,
      updatePriority,
      clearCompleted,
      setFilter
    }
  };
}
