# Routes Directory Rules

> **Note:** React Router v6+ is the official routing solution for all navigation and URL management in HrdHat. Do not implement custom/manual routing or navigation state in Zustand. All route logic should use React Router components and hooks.

## Purpose

Contains application routes and page components.

## Guidelines

- Each route should be a separate file or directory
- Use consistent naming conventions for route files
- Keep route components focused on layout and data fetching
- Delegate business logic to features or hooks

## Structure

- Organize routes by feature or hierarchy
- Use index files for default routes
- Consider nested routing for complex applications

## Best Practices

- Use lazy loading for route components when appropriate
- Implement proper error boundaries for routes
- Keep route components thin - delegate to feature components
- Use consistent data fetching patterns across routes
- Implement proper loading states
