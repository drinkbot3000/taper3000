import { TodoListProps } from '../types';
import { TodoItem } from './TodoItem';
import './TodoList.css';

/**
 * TodoList Component
 *
 * Renders a list of todo items
 *
 * Best practices:
 * - Semantic HTML: <ul> for list
 * - Key prop for efficient React reconciliation
 * - Props drilling (alternative: Context API for deep nesting)
 * - Empty state handling
 */
export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onUpdatePriority
}: TodoListProps) {
  // Handle empty state
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          />
          <path
            d="M22 32L28 38L42 24"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
        </svg>
        <p className="todo-list-empty__text">No todos yet</p>
        <p className="todo-list-empty__hint">Add one above to get started!</p>
      </div>
    );
  }

  return (
    <ul className="todo-list" role="list">
      {/**
       * Map todos to TodoItem components
       *
       * Key prop: React uses keys to identify which items have changed
       * Using todo.id ensures stable identity across re-renders
       *
       * Performance note: For large lists (1000+ items), consider:
       * - Virtualization (react-window, react-virtual)
       * - Pagination
       * - Infinite scroll
       */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onUpdatePriority={onUpdatePriority}
        />
      ))}
    </ul>
  );
}
