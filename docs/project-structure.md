# Project Structure

src
|
+-- app # application layer containing:
| | # this folder might differ based on the meta framework used
| +-- routes # application routes / can also be pages (managed by React Router v6+)
| +-- app.tsx # main application component (sets up React Router)
| +-- provider.tsx # application provider that wraps the entire application with different global providers - this might also differ based on meta framework used
| +-- router.tsx # application router configuration (React Router v6+)
+-- assets # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components # shared components used across the entire application
|
+-- config # global configurations, exported env variables etc.
|
+-- features # feature based modules
|
+-- hooks # shared hooks used across the entire application
|
+-- lib # reusable libraries preconfigured for the application
|
+-- stores # global state stores
|
+-- testing # test utilities and mocks
|
+-- types # shared types used across the application
|
+-- utils # shared utility functions

## A feature could have the following structure:

src/features/awesome-feature
|
+-- api # exported API request declarations and api hooks related to a specific feature
|
+-- assets # assets folder can contain all the static files for a specific feature
|
+-- components # components scoped to a specific feature
|
+-- hooks # hooks scoped to a specific feature
|
+-- stores # state stores for a specific feature
|
+-- types # typescript types used within the feature
|
+-- utils # utility functions for a specific feature

## Code Organization Best Practices

### 🚫 Avoid Barrel Files

- **Don't use** barrel files (index.js exports) for features
- **Problem**: Causes issues with Vite tree shaking and performance
- **Solution**: Import files directly instead

### 🔒 Feature Independence

- **Avoid cross-feature imports** (e.g., auth importing from comments)
- **Compose features at the application level** instead
- **Benefits**: Keeps features independent and reduces code complexity

### ⬆️ Unidirectional Architecture

Follow this import flow hierarchy:

```
Shared Components → Features → App
```

- **Shared parts** (components, hooks, lib, types, utils) can be used anywhere
- **Features** can only import from shared parts
- **App** can import from both features and shared parts

## ESLint Enforcement

Use ESLint rules to automatically enforce these patterns:

### Prevent Cross-Feature Imports

```javascript
'import/no-restricted-paths': [
  'error',
  {
    zones: [
      // disables cross-feature imports:
      // eg. src/features/discussions should not import from src/features/comments, etc.
      {
        target: './src/features/auth',
        from: './src/features',
        except: ['./auth'],
      },
      {
        target: './src/features/comments',
        from: './src/features',
        except: ['./comments'],
      },
      {
        target: './src/features/discussions',
        from: './src/features',
        except: ['./discussions'],
      },
      {
        target: './src/features/teams',
        from: './src/features',
        except: ['./teams'],
      },
      {
        target: './src/features/users',
        from: './src/features',
        except: ['./users'],
      },
      // More restrictions...
    ],
  },
],
```

### Enforce Unidirectional Flow

```javascript
'import/no-restricted-paths': [
  'error',
  {
    zones: [
      // Previous restrictions...

      // enforce unidirectional codebase:
      // e.g. src/app can import from src/features but not the other way around
      {
        target: './src/features',
        from: './src/app',
      },

      // e.g src/features and src/app can import from these shared modules but not the other way around
      {
        target: [
          './src/components',
          './src/hooks',
          './src/lib',
          './src/types',
          './src/utils',
        ],
        from: ['./src/features', './src/app'],
      },
    ],
  },
],
```

This approach creates a **predictable, maintainable codebase** where dependencies flow in one clear direction, making the code easier to understand and debug.

## Features Directory Note

> **Note:** See `src/features/README.md` for the feature module structure and removability principle. Each feature must be self-contained and removable without breaking the app.

## Routing Architecture

- All routing and navigation logic is handled by React Router v6+.
- Route definitions and navigation components live in the app layer (e.g., `src/app/routes/`, `src/app/app.tsx`).
- Do not implement custom/manual routing or navigation state in Zustand.
- Use React Router hooks (`useNavigate`, `useParams`, etc.) for navigation and URL parameter handling.

## State Management

- Zustand is used for application state only (e.g., form data, authentication, offline queue).
- Do not use Zustand for navigation or routing state.
