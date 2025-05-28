# Project Standards

Enforcing project standards is crucial for maintaining code quality, consistency, and scalability in the HrdHat React application. By establishing and adhering to a set of best practices, developers can ensure that the codebase remains clean, organized, and easy to maintain.

## Code Quality Tools

### ESLint

ESLint serves as our primary linting tool, configured with comprehensive rules for TypeScript, React, and architectural constraints. Our ESLint configuration enforces:

- **Naming conventions** for all code elements
- **Architectural boundaries** preventing cross-feature imports
- **Import organization** with automatic sorting
- **React best practices** and accessibility rules

**Key ESLint Features in HrdHat:**

```javascript
// Enforces naming conventions
'@typescript-eslint/naming-convention': [
  'error',
  { selector: 'interface', format: ['PascalCase'] },
  { selector: 'function', format: ['camelCase', 'PascalCase'] },
  // ... more rules
]

// Prevents cross-feature imports
'import/no-restricted-paths': [
  'error',
  {
    zones: [
      {
        target: './src/features/auth',
        from: './src/features',
        except: ['./auth'],
      },
      // ... more restrictions
    ],
  },
]
```

### Prettier

Prettier maintains consistent code formatting across the HrdHat codebase. With "format on save" enabled, code is automatically formatted according to our `.prettierrc` configuration. This ensures uniform code style and provides immediate feedback on syntax errors.

**HrdHat Prettier Integration:**

- Auto-formatting on save in VS Code
- Integrated with ESLint for seamless workflow
- Consistent formatting across all team members
- Catches syntax errors through formatting failures

### TypeScript

TypeScript provides static type checking that catches errors at build time, especially valuable during large refactoring processes. In HrdHat, TypeScript helps ensure type safety across our form data structures, API responses, and component props.

**TypeScript Benefits in HrdHat:**

- Type-safe form data handling
- Compile-time error detection
- Enhanced IDE support with autocomplete
- Safer refactoring of complex form logic

### Husky (Future Implementation)

Husky will be implemented to run git hooks that validate code quality before commits. This ensures no faulty code reaches the repository.

**Planned Husky Workflow:**

```bash
# Pre-commit hooks
npm run lint          # ESLint validation
npm run format:check  # Prettier formatting check
npm run type-check    # TypeScript validation
npm run test          # Unit tests (when implemented)
```

## Import Configuration

### Absolute Imports

HrdHat uses absolute imports configured in `tsconfig.json` to avoid messy relative paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Benefits:**

- Clean import statements: `@/components/Button` instead of `../../../components/Button`
- Easy file movement without breaking imports
- Clear distinction between internal and external dependencies

**Usage Examples:**

```typescript
// ✅ Good - absolute imports
import { FormBuilder } from '@/components/FormBuilder';
import { useFormData } from '@/hooks/useFormData';
import { FormInstance } from '@/types/form';

// ❌ Avoid - relative imports
import { FormBuilder } from '../../../components/FormBuilder';
```

## File and Folder Naming Conventions

### Enforced Naming Rules

Our ESLint configuration enforces consistent naming across the codebase:

```javascript
// File naming enforcement (future implementation)
'check-file/filename-naming-convention': [
  'error',
  {
    '**/*.{ts,tsx}': 'KEBAB_CASE',
  },
  {
    ignoreMiddleExtensions: true,
  },
],

// Folder naming enforcement
'check-file/folder-naming-convention': [
  'error',
  {
    'src/**/!(__tests__)': 'KEBAB_CASE',
  },
],
```

### HrdHat Naming Standards

| Item            | Convention            | Example                                   |
| --------------- | --------------------- | ----------------------------------------- |
| Folders         | `kebab-case`          | `form-components/`, `user-management/`    |
| Component files | `PascalCase.tsx`      | `FormBuilder.tsx`, `RiskAssessment.tsx`   |
| Hook files      | `useCamelCase.ts`     | `useFormData.ts`, `useRiskCalculation.ts` |
| Utility files   | `camelCase.ts`        | `formHelpers.ts`, `dateUtils.ts`          |
| Test files      | `[source].test.ts(x)` | `FormBuilder.test.tsx`                    |

## Architectural Standards

### Unidirectional Architecture

HrdHat enforces a strict unidirectional architecture:

```
Shared Components (components/, hooks/, lib/, types/, utils/)
    ↓
Features (features/*)
    ↓
App (app/*)
```

**Rules:**

- Features cannot import from other features
- Features cannot import from app layer
- Shared components cannot import from features or app
- Compose features at the application level

### ITCSS Styling Standards

Our styling follows ITCSS methodology with strict layer hierarchy:

1. **Settings** - CSS variables only
2. **Tools** - Mixins and helpers
3. **Generic** - Normalize and resets
4. **Base** - Element styling
5. **Objects** - Layout patterns
6. **Components** - UI components
7. **Utilities** - Single-purpose classes

## Development Workflow

### Quality Checklist

Before submitting any code, ensure:

1. ✅ `npm run lint` passes without errors
2. ✅ `npm run format:check` passes
3. ✅ `npm run type-check` passes
4. ✅ Follow naming conventions
5. ✅ Respect architectural boundaries
6. ✅ Components have corresponding Storybook stories
7. ✅ ITCSS layer rules are followed

### IDE Setup

**Required VS Code Extensions:**

- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features

**Recommended Settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  }
}
```

This comprehensive approach ensures HrdHat maintains high code quality, consistency, and scalability as the project grows.

---

# Naming Convention Guide

## Folder & File Naming

### Folders

Use **kebab-case** for all folder names:

```
src/
  components/
  services/
  db/
  modules/
  utils/
```

### Files

- **Components**: `PascalCase.tsx` matching the exported name
- **Hooks**: `useCamelCase.ts`
- **Utility/logic files**: `camelCase.ts`
- **Tests**: Mirror source file plus `.test.tsx` or `.test.ts`

## Service Functions (TypeScript)

Defined in **camelCase**, exporting async functions:

```typescript
// src/services/formService.ts
export async function getFormInstances(): Promise<FormInstance[]> { … }
export async function getFormInstanceById(id: string): Promise<FormInstance> { … }
export async function createFormInstance(data: NewFormInstance): Promise<FormInstance> { … }
export async function updateFormInstance(id: string, data: Partial<NewFormInstance>): Promise<FormInstance> { … }
export async function deleteFormInstance(id: string): Promise<void> { … }
```

## Supabase Table & Column Names

Always use **lowercase, snake_case**, no quotes:

```sql
-- Tables
form_instances
form_instance_modules
form_data_photos

-- Columns
created_at
user_form_id
```

## TypeScript Types & Mapping

### Interfaces/Types

Use **PascalCase** for interfaces/types, **camelCase** for properties:

```typescript
export interface FormInstance {
  id: string;
  createdAt: string;
  userFormId: string | null;
  // …
}
```

### Database Row Mapping

Raw DB rows use **snake_case**; map with a helper before returning to UI:

```typescript
function mapFormInstance(row: any): FormInstance {
  return {
    id: row.id,
    createdAt: row.created_at,
    userFormId: row.user_form_id,
    // …
  };
}
```

> **💡 Tip**: Consider using a generic "snake_to_camel" mapper (e.g. `camelcase-keys`) to automate mapping across all services.

## API / Edge Function Naming

### Files

Use **camelCase.ts** under `supabase/functions/`:

```
supabase/functions/
  saveFormModuleData.ts
  deleteFormInstance.ts
  listActiveForms.ts
```

### Exports

Default handler named `handler` or `serve`

## Quick Reference Table

| Item                        | Convention            | Example                        |
| --------------------------- | --------------------- | ------------------------------ |
| Folders                     | `kebab-case`          | `form-components/`             |
| Component files             | `PascalCase.tsx`      | `FormBuilder.tsx`              |
| Hook files                  | `useCamelCase.ts`     | `useFormData.ts`               |
| Logic/util files            | `camelCase.ts`        | `formHelpers.ts`               |
| Tests                       | `[source].test.ts(x)` | `FormBuilder.test.tsx`         |
| Service functions           | `camelCase`           | `getFormInstances()`           |
| TS interfaces/types         | `PascalCase`          | `FormInstance`                 |
| Constants                   | `UPPER_SNAKE_CASE`    | `MAX_FILE_SIZE`                |
| Tables & columns (Postgres) | `snake_case`          | `form_instances`, `created_at` |
| Env vars                    | `UPPER_SNAKE_CASE`    | `DATABASE_URL`                 |
