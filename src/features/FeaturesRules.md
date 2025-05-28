# Features Directory Rules

## Purpose

Contains feature-based modules that encapsulate related functionality.

## Guidelines

- Each feature should be self-contained and independent
- Features should have their own components, hooks, and utilities
- Use clear boundaries between features
- Minimize dependencies between features
- Each feature should have a clear public API

## Structure

Each feature directory should contain:

- `components/` - Feature-specific components
- `hooks/` - Feature-specific hooks
- `services/` - Feature-specific API calls and business logic
- `types/` - Feature-specific type definitions
- `utils/` - Feature-specific utility functions
- `index.ts` - Public API exports

## Best Practices

- Keep features loosely coupled
- Use dependency injection for shared services
- Implement proper error handling within features
- Write comprehensive tests for feature functionality
- Document feature APIs and usage
- Use consistent patterns across all features
- Consider feature flags for experimental features
