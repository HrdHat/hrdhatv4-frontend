# Security

## Auth & Authorization in HrdHat (Supabase + RLS)

### Authentication

In HrdHat, all authentication is managed via **Supabase Auth**.

- **User Registration**: Users sign up with First Name, Last Name, Company, and Email
- **Automated Handling**: Supabase handles email confirmation, password resets, and session tokens automatically
- **SDK Integration**: The app uses the Supabase client SDK (`@supabase/supabase-js`) for all auth flows—no manual token handling required

#### Token Storage

- **Automatic Management**: Supabase automatically stores the session token securely (using localStorage)
- **No Manual Handling**: There's no need to manage tokens or cookies manually; the Supabase client handles refresh and expiration
- **Session Restoration**: On app reload, the Supabase client restores the session if the token is present

#### XSS Protection

- **Input Sanitization**: Always sanitize any user-generated HTML or markdown before rendering it in the UI
- **Trusted Libraries**: Use trusted libraries (e.g. DOMPurify) to avoid XSS attacks

### Handling User Data (Frontend State)

- **Global Access**: The authenticated user object is available globally through Supabase's client (`supabase.auth.getUser()` or `useUser` hook)
- **State Management**: User state should be available to any component via React context or your preferred state library
- **Security**: No sensitive data is ever stored outside the Supabase session

### Authorization

**Supabase Row-Level Security (RLS)** enforces all backend permissions:

- **Table Policies**: Every table (e.g., `form_instances`) has policies that restrict access based on `auth.uid()`
- **Client-Side Protection**: Even if a user manipulates the client, RLS prevents unauthorized access, changes, or reads
- **Database-Level Security**: True security enforcement happens at the database level

#### Example RLS Policy

```sql
-- Only allow users to read or update forms where created_by = auth.uid()
-- Admin/Supervisor roles (if needed) can be handled with a role field and RLS logic
```

### Role-Based Access Control (RBAC) and Permission-Based Access Control (PBAC)

- **Role Storage**: User roles (e.g., `USER`, `SUPERVISOR`, `ADMIN`) can be stored as custom claims in Supabase or in the user profile table
- **RLS Integration**: Use these roles in your RLS policies to control resource access at the database level
- **Frontend vs Backend**: The frontend may display or hide features, but the backend always enforces actual permissions

## Implementation Examples

### Frontend Auth Flow

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign up
const { user, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { firstName, lastName, company },
  },
});

// Sign in
const { user, session, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Get current user (anywhere in app)
const user = supabase.auth.getUser();
```

### RLS Policy for form_instances

```sql
-- Only allow a user to access their own forms
CREATE POLICY "Users can view their own forms"
ON form_instances
FOR SELECT
USING (created_by = auth.uid());

-- Only allow a user to update their own forms
CREATE POLICY "Users can update their own forms"
ON form_instances
FOR UPDATE
USING (created_by = auth.uid());
```

## Best Practices Checklist

### ✅ Security Requirements

- [ ] All backend data access is protected with Supabase RLS
- [ ] Never trust client-only checks for security
- [ ] Frontend only displays features based on user roles/permissions, but RLS is the true gatekeeper
- [ ] Use the Supabase session for all authentication logic—do not roll your own JWT/cookie handling
- [ ] Always sanitize user input/output in the UI to prevent XSS
- [ ] Audit RLS policies after every schema change or new feature

### 🔍 Regular Security Audits

1. **RLS Policy Review**: Verify all tables have appropriate row-level security policies
2. **Permission Testing**: Test user access with different roles and permissions
3. **XSS Prevention**: Review all user input handling and output rendering
4. **Session Management**: Ensure proper session handling and logout functionality

### 🛡️ Frontend Security Measures

```typescript
// Example: Sanitizing user input
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(userGeneratedContent);

// Example: Role-based UI rendering
const UserDashboard = () => {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;

  return (
    <div>
      {userRole === 'ADMIN' && <AdminPanel />}
      {userRole === 'SUPERVISOR' && <SupervisorTools />}
      <UserForms />
    </div>
  );
};
```

---

# Testing in HrdHat

Testing in HrdHat is built for **real-world reliability**—not just code coverage. Our priority is integration and end-to-end (E2E) tests that reflect actual user workflows, while unit tests catch errors in shared logic and components early.

## Types of Tests

### Unit Tests

**Purpose**: Validate individual utility functions, React components, and shared hooks in isolation.

**Examples in HrdHat**:

- Form field validation functions
- Utility helpers (e.g. date formatting, debounce logic)
- Rendering a single input field/component

**Tool**: Vitest (works out of the box with Vite/React)

**File location**: Place alongside code, e.g. `FormField.test.tsx`

```typescript
// Example: Unit test for form validation
import { describe, it, expect } from 'vitest';
import { validateFormField } from './formValidation';

describe('validateFormField', () => {
  it('should validate required fields', () => {
    expect(validateFormField('', true)).toBe('This field is required');
    expect(validateFormField('value', true)).toBe(null);
  });
});
```

### Integration Tests

**Purpose**: Ensure multiple components, hooks, or services work together as expected.

**Examples in HrdHat**:

- Full form modules rendering with their metadata/state
- Hook + service interaction for fetching/saving form data (mocking Supabase JSONB responses)
- Testing the complete fill and save flow for a module, including error boundaries

**Tool**: Vitest + React Testing Library

**File location**: `.test.tsx` or `.test.ts` in same directory or `__tests__` subfolders

```typescript
// Example: Integration test for form module
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormModule } from './FormModule';

describe('FormModule Integration', () => {
  it('should save form data when submitted', async () => {
    const mockSave = vi.fn();
    render(<FormModule onSave={mockSave} />);

    fireEvent.change(screen.getByLabelText('Risk Level'), { target: { value: 'High' } });
    fireEvent.click(screen.getByText('Save'));

    expect(mockSave).toHaveBeenCalledWith({
      modules: { riskAssessment: { riskLevel: 'High' } }
    });
  });
});
```

### End-to-End (E2E) Tests

**Purpose**: Simulate real user flows across frontend and backend.

**Examples in HrdHat**:

- User creates an account, fills out a new FLRA, saves
- Switches devices and resumes form
- Supervisor review and PDF export

**Tool**: Playwright or Cypress (Playwright recommended for React/Supabase integration)

**Run location**: CI pipeline or before major releases

```typescript
// Example: E2E test for FLRA lifecycle
import { test, expect } from '@playwright/test';

test('FLRA complete lifecycle', async ({ page }) => {
  // User creates account and logs in
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="login-button"]');

  // Creates new FLRA form
  await page.click('[data-testid="new-flra"]');
  await page.fill('[data-testid="project-name"]', 'Test Project');

  // Fills out risk assessment
  await page.selectOption('[data-testid="risk-level"]', 'High');
  await page.click('[data-testid="save-form"]');

  // Verifies form is saved
  await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
});
```

## Recommended Tooling

### Primary Testing Stack

- **Vitest**: Fast, modern, seamless with Vite + React. Use for all unit and integration tests
- **React Testing Library**: Simulate user interaction in integration tests
- **Playwright**: For full E2E coverage (recommended over Cypress for React/Supabase integration)

### Testing Commands

```bash
# Unit and Integration Tests
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report

# E2E Tests
npm run test:e2e          # Run Playwright E2E tests
npm run test:e2e:ui       # Run E2E tests with UI mode
```

## Best Practices for HrdHat

### 🎯 Test Priorities

1. **Integration tests for critical user journeys**: starting/saving a form, auto-archive, device switch, supervisor review
2. **Unit test complex helpers** and shared logic
3. **E2E tests should mirror user workflows** and edge cases: network failure during save, device switch, PDF export

### 📊 JSONB-Specific Testing

**Always mock Supabase with JSON-shaped data**:

- Shape mocked responses as `{ modules: { ... } }` to match your real JSONB backend

```typescript
// Example: Mocking Supabase JSONB response
const mockFormData = {
  id: '123',
  modules: {
    riskAssessment: {
      riskLevel: 'High',
      mitigationSteps: ['PPE required', 'Safety briefing'],
    },
    workDetails: {
      projectName: 'Test Project',
      location: 'Site A',
    },
  },
};
```

**Assert on real data**:

- Check that the correct module keys/values are present in loaded/saved JSON, not just UI state

**E2E Flow**:

- Fill, save, reload, verify—that's the real flow to test

### 📁 File Organization

- Keep test files close to code
- Use clear, descriptive names
- Run all tests on every commit in CI for fast, constant feedback

### Example Test File Names

```
src/
├── hooks/
│   ├── useFlraFormData.ts
│   └── useFlraFormData.test.ts        # Integration test for form data hook
├── components/
│   ├── FormToolbar.tsx
│   └── FormToolbar.test.tsx           # Unit test for toolbar component
└── e2e/
    └── flra-lifecycle.spec.ts         # E2E: from form creation to archive
```

## Testing Checklist

### ✅ Before Each Release

- [ ] All unit tests pass
- [ ] Integration tests cover critical form workflows
- [ ] E2E tests validate complete user journeys
- [ ] JSONB data structure is properly mocked and tested
- [ ] Error boundaries and edge cases are covered
- [ ] Performance tests for large forms are included

### 🔄 Continuous Testing

- [ ] Tests run on every commit
- [ ] Coverage reports are generated and reviewed
- [ ] Flaky tests are identified and fixed promptly
- [ ] Test data matches production JSONB structure

## References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)

## Summary

HrdHat's test strategy is built around **Vitest** for unit/integration tests and **Playwright** for E2E. Focus is on integration and real workflows—mirroring the way forms are actually saved and loaded as JSON. This is your safety net against regressions and your guarantee that every tradesperson has a dependable experience.

**Key Testing Principles**:

- Real-world reliability over code coverage metrics
- Integration tests for critical user workflows
- JSONB structure validation in all data tests
- E2E tests that mirror actual user behavior
- Fast feedback through continuous testing in CI

---

## References

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10 Client Risks](https://owasp.org/www-project-top-ten/)

## Summary

HrdHat relies on Supabase's built-in authentication and RLS for bulletproof backend security. The frontend consumes the authenticated session, manages user state, and exposes features accordingly—but the database always enforces true access control.

**Key Points:**

- No manual token or cookie logic is required beyond what Supabase provides
- Always keep XSS prevention and RLS audits in mind for every update
- Frontend security is about UX; backend security (RLS) is about actual protection
- Regular security audits ensure ongoing protection as the application evolves
