# App Directory Rules

## Purpose

The application layer containing the main application structure and configuration.

## Guidelines

- This folder contains the core application setup
- Keep application-level concerns separate from feature-specific logic
- Maintain clean separation between routing, providers, and main app component

## Structure

- `routes/` - Application routes (can also be pages)
- `app.tsx` - Main application component
- `provider.tsx` - Application provider wrapping the entire app with global providers
- `router.tsx` - Application router configuration

## Best Practices

- Keep the main app component minimal and focused on layout
- Use providers for global state and context
- Configure routing in a centralized location

Logged in:
SidebarLoggedIn.tsx
(within SidebarLoggedIn) ActiveFormsList.tsx (drawer panel for listing active forms; supports actions like delete or move to archive)
(within SidebarLoggedIn) ArchivedFormsList.tsx (drawer panel for archived forms; supports actions like restore or delete)
(within SidebarLoggedIn) Profile.tsx (drawer panel for user profile)
(within SidebarLoggedIn) NewFormList.tsx (drawer panel for creating new forms)

FormEditor.tsx
(within FormEditor) GuidedEditor.tsx
(within FormEditor) QuickFillEditor.tsx
(within FormEditor) FormToolbar

LoggedinHomePage.tsx

Logged out:
SidebarLoggedOut.tsx
(within SidebarLoggedOut.tsx) Login.tsx
(within SidebarLoggedOut.tsx) Signup.tsx

LoggedoutHomePage.tsx

General Pages (accessible whether logged in or logged out, typically via footer):
About,
Safety blog,
Terms of use,
Contact us,
Report a bug,
FAQ

## App Structure & Routing Plan (2024 Update)

This section documents the planned structure, routing, and responsive layout for HrdHat as of 2024.

### 1. Responsive Layout

- ResponsiveLayout (wrapper for all pages)
  - Detects device type (desktop, tablet, mobile)
  - Renders DesktopLayout, TabletLayout, or MobileLayout as appropriate

### 2. Authentication State

- Logged In
  - SidebarLoggedIn
    - Drawers: ActiveFormsList, ArchivedFormsList, Profile, NewFormList
  - LoggedinHomePage (Dashboard)
  - FormEditor
    - GuidedEditor (step-by-step mode)
    - QuickFillEditor (full form mode)
    - FormToolbar
- Logged Out
  - SidebarLoggedOut
    - Login, Signup
  - LoggedoutHomePage

### 3. General Pages (Footer/Accessible to All)

- About, Safety Blog, Terms of Use, Contact Us, Report a Bug, FAQ

### 4. Routing Table

| Path               | Component/Page    | Notes                      |
| ------------------ | ----------------- | -------------------------- |
| `/`                | LoggedinHomePage  | Dashboard (if logged in)   |
| `/form/:id`        | FormEditor        | Quick Fill mode (default)  |
| `/form/:id/guided` | GuidedEditor      | Guided mode (step-by-step) |
| `/archived`        | ArchivedFormsList | Drawer or page             |
| `/profile`         | Profile           | Drawer or page             |
| `/auth/login`      | Login             | Logged out only            |
| `/auth/signup`     | Signup            | Logged out only            |
| `/about`           | About             | General page               |
| `/blog`            | Safety Blog       | General page               |
| `/terms`           | Terms of Use      | General page               |
| `/contact`         | Contact Us        | General page               |
| `/report-bug`      | Report a Bug      | General page               |
| `/faq`             | FAQ               | General page               |

### ASCII Diagram: App Structure & Routing

```
App.tsx
│
└── ResponsiveLayout
    │
    ├── DesktopLayout / TabletLayout / MobileLayout
    │   │
    │   ├── (if logged in)
    │   │   ├── SidebarLoggedIn
    │   │   │   ├── [Drawer] ActiveFormsList
    │   │   │   ├── [Drawer] ArchivedFormsList
    │   │   │   ├── [Drawer] Profile
    │   │   │   └── [Drawer] NewFormList
    │   │   │
    │   │   ├── Routes
    │   │   │   ├── "/"                → LoggedinHomePage (Dashboard)
    │   │   │   ├── "/form/:id"        → FormEditor
    │   │   │   │   ├── QuickFillEditor (default)
    │   │   │   │   └── FormToolbar
    │   │   │   ├── "/form/:id/guided" → GuidedEditor
    │   │   │   ├── "/archived"        → ArchivedFormsList
    │   │   │   ├── "/profile"         → Profile
    │   │   │   └── (other general pages)
    │   │   │
    │   │   └── Footer (links to About, Blog, Terms, etc.)
    │   │
    │   └── (if logged out)
    │       ├── SidebarLoggedOut
    │       │   ├── Login
    │       │   └── Signup
    │       ├── Routes
    │       │   ├── "/"            → LoggedoutHomePage
    │       │   ├── "/auth/login"  → Login
    │       │   ├── "/auth/signup" → Signup
    │       │   └── (other general pages)
    │       └── Footer (links to About, Blog, Terms, etc.)
    │
    └── General Pages (accessible from footer or direct route)
        ├── /about
        ├── /blog
        ├── /terms
        ├── /contact
        ├── /report-bug
        └── /faq
```

This structure is modular, scalable, and aligns with HrdHat's project rules and best practices as of 2024.

## 2024 Authentication State & Routing Logic

### Auth State Management

- **Zustand** is the official state manager for authentication state, acting as the single source of truth for user session and verification status.
- Zustand store is kept in sync with Supabase Auth using a global provider (`provider.tsx`).
- All components and routes should read auth state from Zustand, not directly from Supabase.

### Email Verification Enforcement

- **Frontend Enforcement**: Email verification is enforced in the router. If a user is logged in but not verified, they are redirected to `/verify-email` (handled by `VerifyEmail.tsx`).
- **Backend Enforcement**: Not yet implemented. Future work will add Row Level Security (RLS) or Edge Function checks to ensure unverified users cannot access protected data via API.
- **Resend Verification**: A button to resend the verification email will be added to `VerifyEmail.tsx`.

### Routing Logic (2024)

- **Protected Routes**: Only authenticated and verified users can access sensitive pages (e.g., dashboard, form editor, profile, archived forms).
- **Public Routes**: Login, signup, and general pages (about, blog, terms, etc.) are accessible to all users.
- **Route Redirection**:
  - Unauthenticated users are redirected to `/auth/login` when accessing protected routes.
  - Unverified users are redirected to `/verify-email`.
- **Staple Pages**: 404, 500, loading, unauthorized, and maintenance pages are required for robustness and should be placed in `src/app/routes/`.

### Key Files

- `provider.tsx`: Syncs Supabase Auth with Zustand store.
- `router.tsx`: Centralizes route definitions and enforces auth/verification logic.
- `VerifyEmail.tsx`: Page for users to complete email verification and (soon) resend verification email.

### Future Enhancements

- Backend enforcement of email verification (RLS/Edge Function).
- Full protected route wiring and UI for login/signup.
- Resend verification email functionality.

**See also:**

- `frontend/docs/security.md` for detailed auth state documentation
- `frontend/docs/application-construction-plan.md` for routing and session management
- `frontend/docs/ErrorLog/ErrorLog.md` and `frontend/docs/FutureLog/FutureLog.md` for pending issues and planned features

## Staple Pages (Required for Robustness)

Every robust React app should include the following staple pages:

- **404 Not Found (`NotFound.tsx`)**: Shown when a user navigates to a route that doesn't exist. Route: `<Route path="*" element={<NotFound />} />`
- **500/Internal Error (`ErrorPage.tsx` or `InternalError.tsx`)**: Shown when there's an unexpected error in the app (used with error boundaries).
- **Loading/Spinner (`Loading.tsx` or `Spinner.tsx`)**: Shown during lazy loading, data fetching, or suspense.
- **Access Denied/Unauthorized (`AccessDenied.tsx` or `Unauthorized.tsx`)**: Shown when a user tries to access a protected route without proper permissions. Route: `/unauthorized`.
- **Maintenance/Offline (`Maintenance.tsx` or `Offline.tsx`)**: (Optional) Shown when the app is in maintenance mode or offline.

**Best Practice:**

- Place these components in `src/app/routes/` or a `src/app/pages/` directory.
- Wire up the 404 route as the last `<Route path="*">` in your `<Routes>` block.
- Use error boundaries to catch and display the error page for unhandled exceptions.
