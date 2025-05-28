# Hooks Directory Rules

## Purpose

Contains shared custom hooks used across the entire application.

## Guidelines

- Hooks should be reusable and generic
- Follow React hooks naming conventions (use prefix)
- Each hook should have a single responsibility
- Provide proper TypeScript types for all hooks
- Include comprehensive documentation and examples

## Structure

- Organize hooks by functionality or alphabetically
- Each hook should be in its own file
- Include hook implementation, types, and tests
- Use descriptive names that indicate the hook's purpose

## Best Practices

- Follow the Rules of Hooks
- Use proper dependency arrays in useEffect
- Implement proper cleanup in hooks
- Write unit tests for all custom hooks
- Use TypeScript generics for flexible hooks
- Provide sensible defaults for hook parameters
- Handle loading and error states appropriately
- Memoize expensive computations
- Use proper error boundaries for hooks that might fail
