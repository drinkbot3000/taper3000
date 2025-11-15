import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { TodoItemProps, TodoPriority } from '../types';
import './TodoItem.css';

/**
 * TodoItem Component
 *
 * Displays a single todo item with edit, toggle, and delete functionality
 *
 * Features:
 * - Inline editing with double-click
 * - Keyboard navigation (Enter to save, Escape to cancel)
 * - Visual priority indicators
 * - Accessibility: ARIA labels, keyboard support
 * - Optimistic UI updates
 */
export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onUpdatePriority
}: TodoItemProps) {
  // Local state for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  /**
   * Enter edit mode
   */
  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  /**
   * Save edited todo
   */
  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      onEdit(todo.id, trimmedText);
    }
    setIsEditing(false);
  };

  /**
   * Cancel editing and revert changes
   */
  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  /**
   * Handle keyboard events in edit mode
   * Enter: save, Escape: cancel
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  /**
   * Handle text input change
   */
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  /**
   * Handle priority change
   */
  const handlePriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onUpdatePriority(todo.id, e.target.value as TodoPriority);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <li
      className={`todo-item ${todo.completed ? 'todo-item--completed' : ''} todo-item--${todo.priority}`}
    >
      <div className="todo-item__content">
        {/* Checkbox for toggling completion */}
        <button
          className="todo-item__checkbox"
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          aria-pressed={todo.completed}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {todo.completed && (
              <path
                d="M5 10L8.5 13.5L15 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <rect
              x="2"
              y="2"
              width="16"
              height="16"
              rx="3"
              stroke="currentColor"
              strokeWidth="2"
              fill={todo.completed ? 'currentColor' : 'none'}
              fillOpacity={todo.completed ? '0.1' : '0'}
            />
          </svg>
        </button>

        {/* Todo text (editable on double-click) */}
        {isEditing ? (
          <input
            type="text"
            className="todo-item__edit-input"
            value={editText}
            onChange={handleTextChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            maxLength={500}
            aria-label="Edit todo text"
          />
        ) : (
          <div
            className="todo-item__text"
            onDoubleClick={handleDoubleClick}
            role="button"
            tabIndex={0}
            aria-label={`${todo.text}. Double-click to edit`}
          >
            <span>{todo.text}</span>
            <span className="todo-item__meta">
              {formatDate(todo.createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="todo-item__actions">
          {/* Priority selector */}
          <select
            className="todo-item__priority-select"
            value={todo.priority}
            onChange={handlePriorityChange}
            aria-label="Change priority"
            disabled={todo.completed}
          >
            <option value="low">Low</option>
            <option value="medium">Med</option>
            <option value="high">High</option>
          </select>

          {/* Delete button */}
          <button
            className="todo-item__delete"
            onClick={() => onDelete(todo.id)}
            aria-label="Delete todo"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 4L14 14M14 4L4 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
}
