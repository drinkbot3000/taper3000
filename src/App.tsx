import { useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import { TodoStats } from './components/TodoStats';
import './App.css';

/**
 * App Component
 *
 * Root component of the application
 *
 * Architecture patterns demonstrated:
 * - Container/Presenter pattern (App manages state, components present)
 * - Custom hooks for business logic
 * - Props drilling (for small apps; use Context/Redux for larger ones)
 * - Side effects with useEffect
 *
 * PWA features:
 * - Service worker registration
 * - Install prompt handling
 * - Update notifications
 */
function App() {
  // Get todo state and actions from custom hook
  const { todos, filter, stats, actions } = useTodos();

  /**
   * Service Worker Registration & Update Handling
   *
   * Best practices:
   * - Register on mount
   * - Handle updates gracefully
   * - Notify user of new versions
   */
  useEffect(() => {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.ready.then(registration => {
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      });

      // Handle controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Show update notification
        if (confirm('New version available! Reload to update?')) {
          window.location.reload();
        }
      });
    }
  }, []);

  /**
   * Install Prompt Handling
   *
   * Modern PWA pattern for install prompts:
   * - Capture beforeinstallprompt event
   * - Show custom install UI
   * - Track install events for analytics
   */
  useEffect(() => {
    let deferredPrompt: Event | null = null;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default browser install prompt
      e.preventDefault();

      // Stash the event for later use
      deferredPrompt = e;

      // Show your custom install button/UI here
      console.log('PWA install prompt available');
    };

    const handleAppInstalled = () => {
      console.log('PWA installed successfully');
      deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Offline/Online Status Handling
   *
   * Provides feedback when app goes offline/online
   */
  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online');
      // Could show a toast notification here
    };

    const handleOffline = () => {
      console.log('App is offline - using cached data');
      // Could show offline indicator here
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="app__header">
        <h1 className="app__title">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.1" />
            <path
              d="M10 16L14 20L22 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Taper Todo
        </h1>
        <p className="app__subtitle">Simple, fast, offline-ready task management</p>
      </header>

      {/* Main content */}
      <main className="app__main">
        <div className="app__container">
          {/* Add todo form */}
          <AddTodo onAdd={actions.addTodo} />

          {/* Statistics */}
          <TodoStats stats={stats} />

          {/* Filters */}
          <TodoFilters
            filter={filter}
            onFilterChange={actions.setFilter}
            activeCount={stats.active}
            completedCount={stats.completed}
            onClearCompleted={actions.clearCompleted}
          />

          {/* Todo list */}
          <TodoList
            todos={todos}
            onToggle={actions.toggleTodo}
            onDelete={actions.deleteTodo}
            onEdit={actions.editTodo}
            onUpdatePriority={actions.updatePriority}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="app__footer">
        <p className="app__footer-text">
          Double-click to edit • Works offline • Data saved locally
        </p>
        {/* Online/offline indicator */}
        <div
          className={`app__status ${navigator.onLine ? 'app__status--online' : 'app__status--offline'}`}
          role="status"
          aria-live="polite"
        >
          <span className="app__status-dot" />
          {navigator.onLine ? 'Online' : 'Offline'}
        </div>
      </footer>
    </div>
  );
}

export default App;
