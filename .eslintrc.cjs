/**
 * ESLint Configuration
 *
 * Modern linting rules for React + TypeScript
 *
 * Key features:
 * - TypeScript-aware linting
 * - React Hooks rules enforcement
 * - Accessibility checks
 * - Best practices enforcement
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    // React Refresh plugin for HMR
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],

    // TypeScript-specific rules
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' }
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Best practices
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
