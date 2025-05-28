# Stores Directory Rules

## Purpose

Contains global state stores for application-wide state management.

## Guidelines

- Use a consistent state management pattern (Redux, Zustand, etc.)
- Keep stores focused on specific domains
- Implement proper state normalization
- Use immutable state updates
- Provide clear actions and selectors

## Structure

- Organize stores by domain or feature
- Include store definition, actions, and selectors
- Provide TypeScript types for all state
- Use consistent naming conventions

## Best Practices

- Keep state minimal and normalized
- Use proper action creators and reducers
- Implement middleware for logging and debugging
- Write tests for store logic
- Use selectors for computed state
- Implement proper error handling in stores
- Use proper state persistence when needed
- Avoid storing derived state
- Use proper state hydration for SSR
- Implement proper state cleanup
