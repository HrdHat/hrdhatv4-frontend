# HrdHat

## 🎯 **Mission Statement**

HrdHat is a **tool for tradespeople** to efficiently complete daily safety forms, not a data analytics or reporting platform. Our focus is on making safety paperwork fast, intuitive, and reliable for construction workers in the field.

## What the project does

HrdHat webapp is a tool that helps tradespeople and crews create, fill out, store, view and submit daily safety form with is core form being the FLRA form (Field Level Risk Assessment form)

It provides a either a quickfill or guided, one-question-at-a-time experience then generates professional PDF outputs.

It supports mobile, tablet and desktop screens.

A core feacher will be the "recall" function, where a user can click the "recall" button to help intuitavly fill out out section of the form based on the users previous data that was filled out.

## 🔧 **CRITICAL: Dynamic Form Architecture**

**⚠️ IMPORTANT: Understanding "Dynamic" in HrdHat**

HrdHat uses **dynamic module assembly**, NOT dynamic field creation:

### **What "Dynamic" Means:**

- ✅ **Module Selection**: Forms are built by combining predefined modules
- ✅ **Module Assembly**: Phase 2 allows users to choose which modules to include
- ✅ **Module Ordering**: Modules can be arranged in different sequences
- ✅ **Array-based Content**: Some modules have dynamic arrays (Task/Hazard/Control entries, worker signatures)

### **What "Dynamic" Does NOT Mean:**

- ✅ **Field Creation**: Dynamic field handling with flexible JSONB storage (no rigid TypeScript interfaces)
- ❌ **Schema Generation**: Field types and validation rules are predefined
- ❌ **Runtime Field Definition**: No user-created custom fields

### **Module Structure:**

```typescript
// Phase 1: Everyone gets the same 6 modules
const DEFAULT_MODULES = [
  'generalInformation', // Fixed fields: projectName, supervisorName, etc.
  'preJobChecklist', // Fixed 20 boolean safety checks
  'ppeAndPlatform', // Fixed PPE and platform checklists
  'taskHazardControl', // Dynamic array: up to 6 task/hazard/control sets
  'signatures', // Dynamic array: up to 20 worker signatures + supervisor
  'photos', // Dynamic array: up to 5 photos with captions
];

// Phase 2: Users can customize which modules appear
const USER_CUSTOM_MODULES = [
  'generalInformation', // Always required
  'taskHazardControl', // User choice
  'signatures', // User choice
  // User excludes: preJobChecklist, ppeAndPlatform, photos
];
```

### **Validation Strategy:**

- **NO ZOD**: Module structures are hardcoded, not dynamically generated
- **Loosely Enforced**: Fields are recommended but not strictly required
- **Guided Mode**: Prompts users to fill fields but allows skipping
- **Quick Mode**: No validation blocking - user can submit incomplete forms
- **Backend Permissive**: Server accepts incomplete forms without errors
- **UI Guidance Only**: Visual cues and suggestions, not hard stops

### **Progress Tracking:**

- **Right-Side Tracker**: Persistent completion indicator on all devices
- **Mobile**: 40px floating tracker with module status icons (✓ ○ ● !)
- **Tablet/Desktop**: 300px expanded panel with module names and progress bars
- **Psychology**: Visual design makes incomplete forms feel "unfinished"
- **Navigation**: Tap any module to jump directly to that section
- **Completion Logic**: Loosely enforced rules (e.g., 50% of fields = "complete")

### **Implementation Reference:**

- **Module Definitions**: `backend/docs/module-definitions.md`
- **Source HTML**: `c:\Users\Pawel\HRDhat\HRDhat\HrdHatFLRApdf.html`
- **Form Plan**: `frontend/docs/plan/form-plan/`

## 🚫 **Explicit Do Nots - Keep Focus on Tradesperson Tool**

**❌ DO NOT ADD:**

- Complex reporting queries or dashboards
- Data analytics or trend analysis features
- Advanced search across form content
- Business intelligence or metrics
- Cross-form data aggregation
- Supervisor analytics dashboards
- Performance reporting systems
- Data export for analysis tools
- Cross-user data analysis
- Statistical analysis features

**❌ DO NOT OPTIMIZE FOR:**

- Complex SQL queries across forms
- Reporting performance
- Data warehouse integration
- Business analytics use cases
- Trend reporting
- Management dashboards

**✅ DO FOCUS ON:**

- Fast form loading and saving
- Reliable device switching
- Offline form completion
- Quick PDF generation
- Simple form recall (Phase 2)
- User-specific form management
- Construction site usability
- Touch-first mobile experience
- Paper-like PDF output

## Project

## Why the project is useful

The goal is for this app to feel like a core "tool" for the daily safety paperwork by reducing the time spent filling out forms and making the intuitave

## Tech Stack

Front-end: React, Vite, TypeScript

**Routing:** React Router v6+ (official routing solution; all navigation and URL management handled by React Router)

**State Management:** Zustand (modular, type-safe, persistent stores; used for application state only, including authentication state)

Back-end: Supabase (Postgres + Edge Functions)

Storage: Supabase Storage for photos/signatures

Styling: ITCSS,

PDF: html2pdf or Puppeteer

DevOps: GitHub Actions (build, lint, deploy), Docker (local Supabase emulation)

## Essential Dependencies

This project uses the following core dependencies:

- **React**: UI library
- **Vite**: Build tool
- **TypeScript**: Type safety
- **Zustand**: State management (modular, persistent, TypeScript-friendly)
- **Supabase JS**: Backend client ([`@supabase/supabase-js`](https://github.com/supabase/supabase-js))
- **Bullet Proof UI Components**: XSS protection through input prevention (no runtime sanitization needed)
- [x] Install Vitest and React Testing Library

### Installing Dependencies

To install all dependencies, run:

```bash
npm install
```

To install Zustand (if not already present):

```bash
npm install zustand
```

To install Supabase client (if not already present):

```bash
npm install @supabase/supabase-js
```

Zustand is used for all application state management, with each store defined in its own file. Dynamic typing is used for flexible data structures. Persistence and debugging are enabled via Zustand middleware.

### Zustand for Authentication State

Zustand is used to manage authentication state in HrdHat. It holds the current user, loading, and error states, and provides actions for login, signup, logout, and session refresh. Zustand is kept in sync with Supabase Auth, which remains the single source of truth for authentication and session management. This enables protected routes and global access to user state throughout the app. All sensitive data and true authentication/authorization is handled by Supabase and Row-Level Security (RLS).

#Getting Started

Prerequisites (Node, npm/yarn, Supabase project)

Quick-start install & run

## Configuration

.env variables you need (VITE_SUPABASE_URL, anon key, etc.)

Optional Docker setup for local DB

## Git Workflow & Repository Structure

### Repository Organization

HrdHat uses a **multi-repository architecture**:

```
Hrdhatv4/
├── frontend/    # This repository (React app)
├── backend/     # Separate repository (Supabase functions/schemas)
├── .cursor/     # Global Cursor IDE configuration
└── .vscode/     # Global VS Code configuration
```

### Important Git Rules

⚠️ **CRITICAL: Each directory has its own git repository**

- `frontend/` → `https://github.com/HrdHat/hrdhatv4-frontend.git`
- `backend/` → `https://github.com/HrdHat/hrdhat4-backend.git`
- Root directory (`Hrdhatv4/`) is **NOT** a git repository

### Automated Git Workflow

Both frontend and backend repositories include automated git scripts:

#### Quick Usage

```bash
# Option 1: Auto-timestamp commit
./git-auto-push.sh

# Option 2: Custom commit message
./git-auto-push.sh "your commit message"

# Option 3: Windows batch version
git-auto-push.bat "your commit message"

# Option 4: Use Cursor snippet
# Type @git-auto-push in Cursor, then say "run git auto-push"
```

#### Automation Features

- ✅ **Retry Logic**: 5 attempts with exponential backoff
- ✅ **Conflict Resolution**: Auto-fetches and rebases remote changes
- ✅ **Safety Checks**: Validates repository and checks for changes
- ✅ **Color Output**: Status messages for easy debugging
- ✅ **Zero Disruption**: Guarantees completion or safe failure

#### What the Automation Does

1. Validates you're in a git repository
2. Checks for uncommitted changes
3. Fetches and rebases remote changes if needed
4. Stages all changes (`git add .`)
5. Commits with your message (or auto-timestamp)
6. Pushes to current branch with retry logic

### Manual Git Workflow

If you prefer manual control:

```bash
# Standard git workflow
git add .
git commit -m "your message"
git push origin master

# Check status
git status
git log --oneline
```

### Working Across Repositories

When working on features that span frontend and backend:

1. **Make frontend changes** in `frontend/` directory
2. **Commit and push** from `frontend/` directory
3. **Switch to backend** directory: `cd ../backend`
4. **Make backend changes** in `backend/` directory
5. **Commit and push** from `backend/` directory

#### Example Workflow

```bash
# Working on authentication feature
cd frontend/
# ... make frontend changes ...
./git-auto-push.sh "Add login form UI"

cd ../backend/
# ... make backend changes ...
./git-auto-push.sh "Add authentication endpoints"
```

### Common Mistakes to Avoid

❌ **DON'T** create git repositories in the root `Hrdhatv4/` directory
❌ **DON'T** try to commit both frontend and backend changes together
❌ **DON'T** work in the wrong directory when making commits

✅ **DO** always check your current directory before committing
✅ **DO** use the automated scripts for consistent workflow
✅ **DO** commit frontend and backend changes separately

### Troubleshooting Git Issues

If you encounter git problems:

1. **Check your location**: `pwd` (should be in `frontend/` or `backend/`)
2. **Check git status**: `git status`
3. **Remove lock files**: `rm -f .git/index.lock` (if git operations hang)
4. **Use automation**: The scripts handle most edge cases automatically

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

**Security Best Practice:** All user input is handled through bullet proof UI components that prevent XSS attacks at the input level. No runtime sanitization needed - components guarantee clean data by design.
