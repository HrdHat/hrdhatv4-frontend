# HrdHat

## What the project does

HrdHat webapp is a tool that helps tradespeople and crews create, fill out, store, view and submit daily safety form with is core form being the FLRA form (Field Level Risk Assessment form)

It provides a either a quickfill or guided, one-question-at-a-time experience then generates professional PDF outputs.

It supports mobile, tablet and desktop screens.

A core feacher will be the "recall" function, where a user can click the "recall" button to help intuitavly fill out out section of the form based on the users previous data that was filled out.

## Project

## Why the project is useful

The goal is for this app to feel like a core "tool" for the daily safety paperwork by reducing the time spent filling out forms and making the intuitave

## Tech Stack

Front-end: React, Vite, TypeScript

Back-end: Supabase (Postgres + Edge Functions)

Storage: Supabase Storage for photos/signatures

Styling: ITCSS,

PDF: html2pdf or Puppeteer

DevOps: GitHub Actions (build, lint, deploy), Docker (local Supabase emulation)

#Getting Started

Prerequisites (Node, npm/yarn, Supabase project)

Quick-start install & run

## Configuration

.env variables you need (VITE_SUPABASE_URL, anon key, etc.)

Optional Docker setup for local DB

## Testing & Quality

### Code Quality Tools

This project uses a comprehensive set of tools to maintain code quality and consistency:

- **ESLint**: TypeScript/React linting with custom naming conventions and architectural rules
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

### Available Scripts

```bash
# Linting
npm run lint              # Check for linting errors
npm run lint:fix          # Auto-fix linting errors where possible

# Formatting
npm run format            # Format all files with Prettier
npm run format:check      # Check if files are properly formatted

# Type Checking
npm run type-check        # Run TypeScript compiler without emitting files

# Development
npm run dev               # Start development server
npm run build             # Build for production
```

### Naming Conventions (Enforced by ESLint)

Our codebase follows strict naming conventions:

- **Files & Folders**: `kebab-case` for folders, `PascalCase.tsx` for components
- **Interfaces/Types**: `PascalCase` (e.g., `FormInstance`, `UserData`)
- **Functions**: `camelCase` or `PascalCase` (for React components)
- **Variables**: `camelCase`, `UPPER_CASE` for constants
- **Properties**: `camelCase` with semicolons in TypeScript interfaces

### Architectural Rules (Enforced by ESLint)

The project enforces a clean architecture with these rules:

1. **No Cross-Feature Imports**: Features must remain independent
2. **Unidirectional Architecture**: `Shared → Features → App`
3. **Import Organization**: Automatic sorting and grouping

```
✅ Allowed Import Flow:
Shared Components (components/, hooks/, lib/, types/, utils/)
    ↓
Features (features/*)
    ↓
App (app/*)
```

### IDE Integration

**VS Code** users get automatic:

- Format on save
- ESLint error fixing on save
- Import organization
- TypeScript error highlighting

**Recommended Extensions**:

- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features

### Running Tests

```bash
# Unit/Integration tests (when implemented)
npm run test
npm run test:watch
npm run test:coverage
```

## Deployment

How the live site/API is deployed (e.g., Supabase, Vercel)

## Contributing & Support

### Code Quality Requirements

Before submitting a PR, ensure:

1. `npm run lint` passes without errors
2. `npm run format:check` passes
3. `npm run type-check` passes
4. Follow the established naming conventions
5. Respect architectural boundaries (no cross-feature imports)

Contribution workflow (fork → branch → PR)

Issue templates, Code of Conduct, where to ask questions

## License & Maintainers

License type (MIT, Apache 2.0, etc.)

## Who to contact/credit
