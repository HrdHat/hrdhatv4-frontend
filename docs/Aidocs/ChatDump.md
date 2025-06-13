Architecture alignment
Replace the “custom App.tsx routing” idea with React Router v6+ everywhere (it is mandatory in the standards).
Finish absolute-import config in tsconfig.json ("@/_": ["src/_"]) and verify ESLint rules that forbid relative dot-dot paths.
Double-check that feature folders do not import from each other (enable the import/no-restricted-paths rules shown in project-standards.md).
Add a root <AppProvider> wrapper (context, React-Router’s <BrowserRouter>, React-Query in the future, etc.) so every screen lives inside a consistent provider tree—this prevents circular styling dependencies later.
State management foundation
Create empty but typed Zustand stores (useAuthStore, useFormStore, useNavigationStore, useOfflineStore) and export them from src/stores/.
Wire useAuthStore to Supabase Auth session listener; this is needed before layout & ITCSS so that auth-gated routes don’t flash.
Persist the stores with zustand/middleware (localStorage). The persistence directory will influence where global CSS for loading states lives.
Quality gatekeepers
Lock in ESLint + Prettier configs and add lint, format, type-check scripts. ITCSS class-name lint rules can then be layered on later.
Turn on strict TypeScript mode now—catching null/undefined issues before you convert them into CSS states is far easier.
Install Vitest & React-Testing-Library; create a single passing test (e.g., <App /> renders). This ensures that ITCSS refactors don’t silently break rendering.
Core layout & skeleton components (needed before ITCSS layers)
Minimal responsive layout shell: ResponsiveLayout (header, nav, content slot). Even placeholder markup is fine—but its DOM hierarchy dictates your ITCSS selectors.
Navigation components for each breakpoint (Mobile bottom bar, Tablet/Desktop side-bar). The markup scaffolding is required so you know which ITCSS layers (Objects vs Components) need to exist.
Error boundaries (<AppErrorBoundary>) and a generic <FullScreenLoader>—these wrap every route and must be styled at the ITCSS “Objects” level.
Global style primitives (the two ITCSS layers you should build before diving deeper)
src/styles/settings/\_variables.css – CSS custom properties for spacing, colors, font sizes, breakpoints.
src/styles/tools/\_mixins.css – reusable mixins/helper classes (e.g., visually-hidden, clearfix).
Getting these in early prevents a later sweep through every component.
Environment & config
Create .env.example with VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, etc.
Add a small src/config/supabase.ts that exports the Supabase client—every module, later on, will import from here; placing it now avoids future path rewrites.
Folder hygiene
Move any generic helpers that are currently sitting in feature folders to src/utils/.
Ensure there are no barrel (index.ts) re-exports inside feature folders—the ESLint rule should already ban them, but confirm.
Documentation & logs
Each time a structural milestone above is finished, add a quick entry in the daily log (file created earlier). This satisfies the doc-first workflow and keeps the plan in sync.
Once these items are complete you have a rock-solid skeleton—routes mounted, stores wired, linting & testing gates active, and a responsive layout shell in place. From there you can safely begin layering the full ITCSS stack (Generic reset, Base element styles, Objects, Components, Utilities) without worrying that fundamental refactors will invalidate your selectors.
Let me know when the above is in place or if you’d like code snippets for any specific bullet.
