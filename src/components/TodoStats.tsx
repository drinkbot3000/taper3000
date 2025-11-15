import { TodoStats as TodoStatsType } from '../types';
import './TodoStats.css';

/**
 * TodoStats Component
 *
 * Displays statistics about todos
 *
 * Modern CSS:
 * - CSS Grid for layout
 * - CSS custom properties (variables) for theming
 * - Smooth transitions
 */
interface TodoStatsProps {
  stats: TodoStatsType;
}

export function TodoStats({ stats }: TodoStatsProps) {
  /**
   * Format completion rate for display
   */
  const formatPercentage = (value: number): string => {
    return value.toFixed(0);
  };

  /**
   * Get color based on completion rate
   */
  const getProgressColor = (): string => {
    if (stats.completionRate >= 75) return 'var(--color-success)';
    if (stats.completionRate >= 50) return 'var(--color-warning)';
    return 'var(--color-primary)';
  };

  if (stats.total === 0) {
    return null; // Don't show stats when there are no todos
  }

  return (
    <div className="todo-stats">
      <h2 className="todo-stats__title">Statistics</h2>

      <div className="todo-stats__grid">
        {/* Total todos */}
        <div className="todo-stats__item">
          <div className="todo-stats__label">Total</div>
          <div className="todo-stats__value">{stats.total}</div>
        </div>

        {/* Active todos */}
        <div className="todo-stats__item">
          <div className="todo-stats__label">Active</div>
          <div className="todo-stats__value todo-stats__value--active">
            {stats.active}
          </div>
        </div>

        {/* Completed todos */}
        <div className="todo-stats__item">
          <div className="todo-stats__label">Done</div>
          <div className="todo-stats__value todo-stats__value--completed">
            {stats.completed}
          </div>
        </div>

        {/* Completion rate */}
        <div className="todo-stats__item todo-stats__item--wide">
          <div className="todo-stats__label">Progress</div>
          <div className="todo-stats__progress">
            <div className="todo-stats__progress-bar">
              <div
                className="todo-stats__progress-fill"
                style={{
                  width: `${stats.completionRate}%`,
                  backgroundColor: getProgressColor()
                }}
                role="progressbar"
                aria-valuenow={stats.completionRate}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${formatPercentage(stats.completionRate)}% complete`}
              />
            </div>
            <span className="todo-stats__percentage">
              {formatPercentage(stats.completionRate)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
