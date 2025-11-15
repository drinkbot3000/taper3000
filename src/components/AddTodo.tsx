import { useState, FormEvent, ChangeEvent } from 'react';
import { AddTodoProps, TodoPriority } from '../types';
import './AddTodo.css';

/**
 * AddTodo Component
 *
 * Controlled form component for adding new todos
 *
 * Modern React patterns:
 * - Controlled inputs (React manages form state)
 * - FormEvent typing for type safety
 * - Accessibility: proper labels, ARIA attributes
 * - Semantic HTML: form, button elements
 */
export function AddTodo({ onAdd }: AddTodoProps) {
  // Local state for form inputs
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');

  /**
   * Handle form submission
   *
   * Best practices:
   * - Prevent default form behavior
   * - Validate input before submission
   * - Reset form after successful submission
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) {
      return; // Don't add empty todos
    }

    onAdd(trimmedText, priority);

    // Reset form
    setText('');
    setPriority('medium');
  };

  /**
   * Handle text input change
   * ChangeEvent<HTMLInputElement> provides type safety
   */
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  /**
   * Handle priority select change
   */
  const handlePriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value as TodoPriority);
  };

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <div className="add-todo__input-group">
        {/* Main text input */}
        <input
          type="text"
          className="add-todo__input"
          value={text}
          onChange={handleTextChange}
          placeholder="What needs to be done?"
          aria-label="New todo text"
          autoFocus
          maxLength={500}
        />

        {/* Priority selector */}
        <select
          className="add-todo__priority"
          value={priority}
          onChange={handlePriorityChange}
          aria-label="Todo priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Submit button */}
        <button
          type="submit"
          className="add-todo__button"
          aria-label="Add todo"
          disabled={!text.trim()}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10 5V15M5 10H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="add-todo__button-text">Add</span>
        </button>
      </div>
    </form>
  );
}
