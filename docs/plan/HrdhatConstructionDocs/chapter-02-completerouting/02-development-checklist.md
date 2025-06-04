# Chapter 2: Complete routing

## Phase 1.1: Project Foundation & TypeScript Setup (Days 1-2)

for `/auth/login` and `/auth/signup` in `router.tsx`.

### Navigation Components

- [-] Implement navigation components for each breakpoint _(Moved to Chapter 3: Core UI Components & Design System in appplansteps.md)_
- [] Add deep linking support for form editing states (handled by React Router)
- [Redacted] ~~Create route transition handling (with animation library if needed)~~

> **Note:** The navigation component implementation and responsive layout tasks have been moved to Chapter 3 (Core UI Components & Design System) in appplansteps.md to better align with project structure and design system focus.

## Phase 1.3: State Management Architecture (Days 5-6)

### Zustand Store Setup

- [ ] Create `useFormStore` for form data management
- [ ] Implement `useAuthStore` for user authentication
- [ ] Set up `useOfflineStore` for offline queue management
- [ ] Configure store persistence with localStorage

### Store Implementation

- [ ] Implement FormState interface with type safety
- [ ] Implement NavigationState interface
- [ ] Create store persistence logic
- [ ] Add store hydration and dehydration
- [ ] Implement store debugging tools

## Phase 1.4: Development Workflow & Quality Setup (Day 7)

### Code Quality Tools

- [ ] Configure ESLint rules for architectural boundaries
- [ ] Set up Prettier with format-on-save
- [ ] Configure TypeScript strict mode
- [ ] Set up import organization rules
- [ ] Add pre-commit hooks configuration

### Development Scripts

- [ ] Configure development scripts in package.json
- [ ] Set up build and preview scripts
- [ ] Configure linting and formatting scripts
- [ ] Add type checking scripts
- [ ] Set up test scripts

### Testing Foundation

- [ ] Set up Vitest for unit testing
- [ ] Configure React Testing Library
- [ ] Create test utilities and helpers
- [ ] Set up coverage reporting
- [ ] Add testing scripts to package.json

### Documentation Setup

- [ ] Create component documentation standards
- [ ] Set up API documentation structure
- [ ] Create development guidelines
- [ ] Document architectural decisions
- [ ] Set up changelog structure

## ✅ Phase Completion Verification

### Phase 1.1 Complete When:

- [ ] All TypeScript configurations working
- [ ] Project structure follows unidirectional imports
- [ ] All essential dependencies installed
- [ ] Build process operational

### Phase 1.2 Complete When:

- [ ] All 6 main routes functional
- [ ] Navigation between routes working
- [ ] URL parameters handled correctly
- [ ] Route protection implemented

### Phase 1.3 Complete When:

- [ ] All Zustand stores created and functional
- [ ] Store persistence working
- [ ] Type safety across all stores
- [ ] Store debugging operational

### Phase 1.4 Complete When:

- [ ] Code quality tools operational
- [ ] Testing framework functional
- [ ] Documentation standards established
- [ ] Development workflow efficient

## 🚨 Blocking Issues Checklist

- [ ] TypeScript compilation errors resolved
- [ ] Import path issues resolved
- [ ] Route navigation issues resolved
- [ ] Store persistence issues resolved
- [ ] Build process issues resolved

## 📊 Success Metrics

- [ ] Project builds without errors
- [ ] All routes accessible and functional
- [ ] State management working across components
- [ ] Development workflow efficient
- [ ] Code quality standards enforced

Preparation complete. Here's what I found and what needs to be done:
Current State
Auth State:
Managed by Zustand (useAuthStore).
Provider (provider.tsx) syncs Supabase Auth to Zustand on mount and on auth state changes.
Login/Signup Forms:
Present, but both have // TODO: Call login/signup logic here and do not actually call the store or route on success.
Routing:
All routes currently render the "logged out" sidebar and login/signup forms.
There are no routes or logic for the logged in experience (SidebarLoggedIn, LoggedinHomePage) yet.
No conditional rendering based on auth state.
What Needs to Happen
Wire up login and signup forms:
Call useAuthStore.getState().login and signup on submit.
On success, route to / (dashboard).
Update router to support logged in experience:
If authenticated, render SidebarLoggedIn and LoggedinHomePage.
If not, render the current logged out experience.
Minimal implementation:
Only wire up enough to show SidebarLoggedIn and LoggedinHomePage after login/signup.
No extra features or UI polish.
Implementation Plan
Login.tsx / Signup.tsx
Call the appropriate auth store method on submit.
On success, use navigate('/') to go to the dashboard.
router.tsx
Add logic to check useAuthStore(state => state.user).
If user is present, render a route tree with SidebarLoggedIn and LoggedinHomePage.
If not, render the current logged out sidebar and forms.
Ready to implement this minimal login/signup-to-logged-in wiring.
Would you like to review this plan or should I proceed with the code changes?

> **Evidence of Completion:**
>
> - Route structure is defined in `frontend/src/app/router.tsx` using `<Routes>` and `<Route>`.
> - `BrowserRouter` is used for browser history support.
> - URL parameters (`:id`) are handled in routes for forms and guided mode.
> - Protected route logic is implemented via the `RequireEmailVerified` wrapper and conditional rendering based on authentication state (`user` from Zustand).
> - All required route components (`Dashboard`, `FormEditor`, `GuidedEditor`, `ArchivedFormsList`, `Profile`, `Login`, `Signup`) exist and are routed.
