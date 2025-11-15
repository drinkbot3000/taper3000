import { useState, useEffect } from 'react';

/**
 * Custom Hook: useLocalStorage
 *
 * Modern React pattern for persistent state using localStorage
 *
 * Benefits:
 * - Synchronizes state with localStorage automatically
 * - Type-safe with TypeScript generics
 * - Handles JSON serialization/deserialization
 * - Error handling for quota exceeded and parsing errors
 * - Lazy initialization to avoid unnecessary computation
 *
 * @param key - localStorage key
 * @param initialValue - fallback value if no stored value exists
 * @returns tuple of [storedValue, setValue] like useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  /**
   * State initialization with lazy initializer function
   * This prevents reading from localStorage on every render
   */
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Check if running in browser environment
      if (typeof window === 'undefined') {
        return initialValue;
      }

      // Get from localStorage by key
      const item = window.localStorage.getItem(key);

      // Parse stored JSON or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Handle JSON parsing errors
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Setter function that updates both state and localStorage
   *
   * Supports both direct values and updater functions (like useState)
   * This allows for functional updates: setValue(prev => prev + 1)
   */
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function (same API as useState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Update state
      setStoredValue(valueToStore);

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Handle quota exceeded or other errors
      console.error(`Error saving localStorage key "${key}":`, error);

      // Show user-friendly message for quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Consider clearing old data.');
      }
    }
  };

  /**
   * Sync state when localStorage changes in other tabs/windows
   *
   * This enables cross-tab synchronization:
   * - User opens app in two tabs
   * - Changes in one tab reflect in the other
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
