import { TodoFiltersProps, TodoFilter } from '../types';
import './TodoFilters.css';

/**
 * TodoFilters Component
 *
 * Provides filtering controls and statistics
 *
 * Features:
 * - Filter tabs (All/Active/Completed)
 * - Todo count display
 * - Clear completed button
 * - Keyboard navigation
 */
export function TodoFilters({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted
}: TodoFiltersProps) {
  const filters: Array<{ value: TodoFilter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="todo-filters">
      {/* Statistics */}
      <div className="todo-filters__stats">
        <span className="todo-filters__count">
          <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
        </span>
      </div>

      {/* Filter tabs */}
      <div className="todo-filters__tabs" role="tablist">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            className={`todo-filters__tab ${
              filter === value ? 'todo-filters__tab--active' : ''
            }`}
            onClick={() => onFilterChange(value)}
            role="tab"
            aria-selected={filter === value}
            aria-label={`Show ${label.toLowerCase()} todos`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Clear completed button */}
      {completedCount > 0 && (
        <button
          className="todo-filters__clear"
          onClick={onClearCompleted}
          aria-label={`Clear ${completedCount} completed ${
            completedCount === 1 ? 'todo' : 'todos'
          }`}
        >
          Clear completed ({completedCount})
        </button>
      )}
    </div>
  );
}
