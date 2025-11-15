# Contributing to Taper Todo

Thank you for your interest in contributing to Taper Todo! This document provides guidelines and information for contributors.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards others

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- Git
- Text editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and PWAs

### Development Setup

1. **Fork the repository**

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/taper3000.git
cd taper3000
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a branch**

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

4. **Start development server**

```bash
npm run dev
```

## Development Workflow

### Branch Naming

- Features: `feature/description`
- Bugs: `fix/description`
- Docs: `docs/description`
- Refactor: `refactor/description`

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat(todo): add due date functionality"
git commit -m "fix(storage): handle quota exceeded error"
git commit -m "docs(readme): update deployment instructions"
```

### Code Style

We use ESLint and TypeScript for code quality:

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

**Key principles:**

- Use TypeScript for type safety
- Follow existing code patterns
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

### TypeScript Guidelines

```typescript
// ✅ Good: Clear types and interfaces
interface TodoProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

// ❌ Bad: Using 'any'
const handleClick = (data: any) => { ... }

// ✅ Good: Explicit return types
const getTodos = (): Todo[] => { ... }

// ✅ Good: Using const assertions
const PRIORITIES = ['low', 'medium', 'high'] as const;
```

### React Best Practices

```typescript
// ✅ Good: Functional components with hooks
export function TodoItem({ todo, onToggle }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  // ...
}

// ✅ Good: useCallback for event handlers
const handleDelete = useCallback((id: string) => {
  deleteTodo(id);
}, [deleteTodo]);

// ✅ Good: useMemo for expensive computations
const sortedTodos = useMemo(() => {
  return todos.sort(/* ... */);
}, [todos]);
```

### CSS Guidelines

```css
/* ✅ Good: Use CSS custom properties */
.component {
  color: var(--color-primary);
  padding: var(--space-4);
}

/* ✅ Good: BEM naming convention */
.todo-item__text { }
.todo-item__text--completed { }

/* ✅ Good: Mobile-first responsive design */
.component {
  font-size: 14px; /* Mobile default */
}

@media (min-width: 768px) {
  .component {
    font-size: 16px; /* Desktop */
  }
}
```

## Testing

### Manual Testing

Before submitting a PR, test:

- ✅ Create, edit, delete todos
- ✅ Toggle completion
- ✅ Change priorities
- ✅ Filter todos
- ✅ Offline functionality
- ✅ Cross-tab sync
- ✅ PWA installation
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Mobile responsiveness

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Pull Request Process

### Before Submitting

1. **Update your fork**

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/taper3000.git
git fetch upstream
git rebase upstream/main
```

2. **Run quality checks**

```bash
# Lint code
npm run lint

# Build successfully
npm run build

# Test production build
npm run preview
```

3. **Update documentation**

- Update README.md if needed
- Add JSDoc comments to new functions
- Update type definitions

### Submitting the PR

1. **Push your branch**

```bash
git push origin feature/your-feature-name
```

2. **Create Pull Request on GitHub**

- Use a clear, descriptive title
- Reference any related issues (#123)
- Describe what changed and why
- Add screenshots for UI changes
- Check that all CI checks pass

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Works in Chrome, Firefox, Safari
- [ ] Mobile responsive
- [ ] Offline functionality tested
- [ ] Accessibility checked

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #123
```

### Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, it will be merged
- Your contribution will be recognized!

## Areas for Contribution

### Good First Issues

- Fix typos in documentation
- Improve error messages
- Add more comments
- Improve accessibility
- Write tests

### Feature Ideas

- [ ] Add tags/categories
- [ ] Implement search
- [ ] Add dark mode toggle
- [ ] Export/import todos
- [ ] Recurring todos
- [ ] Subtasks
- [ ] Drag-and-drop reordering
- [ ] Keyboard shortcuts
- [ ] Undo/redo
- [ ] Todo templates

### Improvements

- Performance optimization
- Better error handling
- Improved animations
- Better mobile UX
- Accessibility enhancements
- Internationalization (i18n)
- Better offline support

## Project Structure

```
src/
├── components/      # React components
│   ├── *.tsx       # Component logic
│   └── *.css       # Component styles
├── hooks/          # Custom React hooks
├── types.ts        # TypeScript definitions
├── App.tsx         # Root component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Key Concepts

### State Management

- Uses React hooks (useState, useReducer)
- Custom `useTodos` hook for todo logic
- `useLocalStorage` for persistence
- No external state library needed

### PWA Architecture

- Service worker via Vite plugin
- Workbox for caching strategies
- Offline-first approach
- Background sync ready

### Performance

- Code splitting via Vite
- Lazy loading components
- Memoization with useMemo
- Optimized re-renders

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Vite Documentation](https://vitejs.dev)
- [Accessibility Guide](https://www.w3.org/WAI/WCAG21/quickref/)

## Questions?

- Open an issue for bugs
- Start a discussion for questions
- Check existing issues first

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Recognized in the community

---

Thank you for contributing! 🎉
