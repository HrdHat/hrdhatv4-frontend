# Types Directory Rules

## Purpose

Contains shared type definitions used across the application.

## Guidelines

- Define reusable TypeScript interfaces and types
- Use consistent naming conventions for types
- Organize types by domain or functionality
- Provide comprehensive type documentation
- Maintain type safety throughout the application

## Structure

- `api.ts` - API request/response types
- `common.ts` - Common utility types
- `entities.ts` - Business entity types
- `events.ts` - Event and callback types
- `ui.ts` - UI component prop types

## Best Practices

- Use descriptive names for types and interfaces
- Prefer interfaces over types for object shapes
- Use union types for controlled vocabularies
- Implement proper generic constraints
- Use utility types for type transformations
- Document complex types with JSDoc comments
- Use strict TypeScript configuration
- Avoid `any` type usage
- Use proper type guards for runtime validation
- Keep types close to their usage when possible
