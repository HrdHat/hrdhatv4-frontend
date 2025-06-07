# Types Directory Rules

## Purpose

Contains **minimal** system-level type definitions for core application infrastructure. This project uses **bullet proof UI components** for data safety and **dynamic typing** for form modules to support flexible JSONB storage.

> **⚠️ ARCHITECTURAL NOTE**: This project uses **bullet proof UI components** for data safety and validation. UI components prevent invalid data entry, eliminating the need for complex runtime validation or sanitization.

## What to Include

- **System Types**: Authentication, routing, core app structure
- **API Types**: Basic request/response shapes
- **Infrastructure Types**: Database connections, error handling
- **Component Props**: UI component interface definitions

## What NOT to Include

- ❌ Form module interfaces (use dynamic typing)
- ❌ Form field definitions (stored in JSONB)
- ❌ Validation schemas (UI components handle validation)
- ❌ Sanitization types (UI components prevent malicious input)

## Structure

- `auth.ts` - Authentication and user types
- `api.ts` - Basic API request/response types
- `common.ts` - Common utility types
- `ui.ts` - UI component prop types
- `system.ts` - Core system and infrastructure types

## Bullet Proof UI Philosophy

- **Form Data**: Use `any` or `Record<string, any>` for flexibility
- **Component Safety**: UI components guarantee valid, clean data
- **No Runtime Validation**: Components prevent invalid input at source
- **Security by Design**: UI prevents XSS, injection, type errors
- **Clean Data Flow**: Database receives valid data by design

## Best Practices

- Keep type definitions minimal and focused on infrastructure
- Use `any` for form data - UI components ensure safety
- Build security into UI components, not validation layers
- Document expected data shapes in component props, not interfaces
- Use TypeScript for UI components and system-level code only
- Trust bullet proof components to deliver clean, valid data
