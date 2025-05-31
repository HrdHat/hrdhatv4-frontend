# HrdHat Testing Strategy

**Document Status**: 🚧 In Development  
**Last Updated**: December 2024  
**Addresses**: Plan Audit Critical Gap #1 - Testing Strategy Implementation

---

## 🚨 **AGREED MINIMAL TESTING APPROACH (MVP)**

**DECISION**: Implement minimal testing foundation early to protect form data integrity, then build comprehensive testing post-MVP.

### **📋 IMPLEMENTATION TIMELINE:**

- **Chapter 1.5 (1 Week)**: Minimal testing setup with 6 critical tests
- **Chapters 4-7**: Add 2-3 tests per chapter as features are built (~15 total tests for MVP)
- **Post-MVP**: Enhanced testing suite with integration tests
- **Phase 2**: Comprehensive testing (E2E, A11y, Performance)

### **🎯 MINIMAL VIABLE TESTING SETUP:**

#### **Dependencies (ONLY 4 packages):**

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0"
  }
}
```

#### **Critical Safety Tests (Maximum 6 tests):**

```typescript
// src/testing/critical.test.tsx
describe('HrdHat Critical Safety Tests', () => {
  // 1. DATA PROTECTION (Most Critical)
  it('preserves form data during component crashes', () => {
    // Error boundary recovery test
  });

  it('saves form data to localStorage on network failure', () => {
    // Offline backup test
  });

  it('recovers form data after page reload', () => {
    // Data persistence test
  });

  // 2. CORE WORKFLOW (Second Priority)
  it('creates new form successfully', () => {
    // Basic form creation
  });

  it('saves form data to Supabase', () => {
    // Basic CRUD test
  });

  // 3. ERROR BOUNDARIES (Third Priority)
  it('catches and recovers from form module errors', () => {
    // Component error handling
  });
});
```

#### **Minimal Jest Configuration:**

```javascript
// jest.config.js (MINIMAL)
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/testing/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // NO coverage requirements for MVP
  // NO performance testing
  // NO accessibility testing
};
```

#### **Basic CI/CD:**

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

### **🚫 WHAT WE'RE NOT IMPLEMENTING (Build Later/Phase 2):**

- ❌ **E2E Testing** (Playwright) - Phase 2
- ❌ **Accessibility Testing** (jest-axe) - Phase 2
- ❌ **Performance Testing** (bundlesize) - Post-MVP
- ❌ **API Mocking** (MSW) - Build Later
- ❌ **Coverage Requirements** - Post-MVP
- ❌ **Visual Regression** - Phase 2
- ❌ **Automated Deployment** - Build Later

### **📊 SUCCESS CRITERIA:**

- ✅ **6 critical tests** passing consistently
- ✅ **Basic CI pipeline** working
- ✅ **Zero data loss** in test scenarios
- ✅ **Development velocity** maintained
- ✅ **Testing foundation** ready for incremental expansion

### **🔄 INCREMENTAL TESTING PLAN:**

- **Chapter 4 (Data Persistence)**: Add 2-3 CRUD operation tests
- **Chapter 5 (Form Workflows)**: Add 2-3 workflow tests
- **Chapter 6 (Frontend Layout)**: Add 1-2 basic UI tests
- **Chapter 7 (PDF Generation)**: Add 1-2 PDF generation tests
- **Total MVP Tests**: ~15 tests maximum

---

## 🎯 **COMPREHENSIVE TESTING PHILOSOPHY (Future Reference)**

_The following sections outline our long-term testing strategy for post-MVP and Phase 2 implementation._

## 🎯 **Testing Philosophy for HrdHat**

HrdHat serves **construction workers in challenging field conditions** where reliability is critical. Our testing strategy prioritizes:

- **Field Reliability**: Forms must work consistently on construction sites
- **Data Integrity**: No form data can be lost during submission or device switching
- **Performance**: Fast loading and responsive interactions on mobile devices
- **Accessibility**: Usable with work gloves, in bright sunlight, and by workers with disabilities
- **Offline Resilience**: Graceful handling of network interruptions

---

## 🏗️ **Testing Architecture**

### **Testing Pyramid for HrdHat**

```
                    E2E Tests (10%)
                 ┌─────────────────┐
                 │ Complete Workflows │
                 │ Cross-device sync  │
                 │ PDF generation     │
                 └─────────────────┘

            Integration Tests (30%)
         ┌─────────────────────────┐
         │ Form CRUD operations    │
         │ Supabase interactions   │
         │ Module combinations     │
         │ Auto-save functionality │
         └─────────────────────────┘

        Unit Tests (60%)
    ┌─────────────────────────────┐
    │ Form modules & components   │
    │ Validation logic            │
    │ Utility functions           │
    │ State management            │
    │ Error handling              │
    └─────────────────────────────┘
```

---

## 🧪 **Testing Framework Stack**

### **Core Testing Tools**

```json
{
  "unitTesting": {
    "framework": "Jest",
    "reactTesting": "@testing-library/react",
    "userInteraction": "@testing-library/user-event",
    "assertions": "Jest + @testing-library/jest-dom"
  },
  "integrationTesting": {
    "apiMocking": "MSW (Mock Service Worker)",
    "supabaseMocking": "Custom Supabase mock client",
    "storageSimulation": "localStorage/sessionStorage mocks"
  },
  "e2eTesting": {
    "framework": "Playwright",
    "crossBrowser": "Chrome, Firefox, Safari",
    "mobileSimulation": "iOS Safari, Android Chrome"
  },
  "accessibilityTesting": {
    "automated": "jest-axe",
    "manual": "Screen reader testing checklist"
  },
  "performanceTesting": {
    "bundleSize": "bundlesize package",
    "renderPerformance": "@testing-library/react performance utils",
    "lighthouse": "Lighthouse CI"
  }
}
```

### **Package Dependencies**

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "msw": "^2.0.0",
    "playwright": "^1.40.0",
    "jest-axe": "^8.0.0",
    "bundlesize": "^0.18.0"
  }
}
```

---

## 📋 **Testing Categories & Requirements**

### **1. Unit Testing (60% of test coverage)**

#### **Form Module Testing**

```typescript
// Example: General Information Module
describe('GeneralInfoModule', () => {
  it('validates required fields correctly', () => {
    // Test field validation
  });

  it('handles auto-save with debouncing', () => {
    // Test auto-save functionality
  });

  it('preserves data during device switching', () => {
    // Test JSON serialization/deserialization
  });

  it('displays validation errors appropriately', () => {
    // Test error display
  });
});
```

#### **Critical Unit Test Areas**

- ✅ **Form Validation Logic**: All validation rules for each module
- ✅ **Auto-save Functionality**: Debounced saving with network simulation
- ✅ **Data Serialization**: JSON conversion for device switching
- ✅ **Error Handling**: Component error boundaries and recovery
- ✅ **Utility Functions**: Date formatting, data transformation, etc.

### **2. Integration Testing (30% of test coverage)**

#### **CRUD Operations Testing**

```typescript
describe('Form CRUD Integration', () => {
  beforeEach(() => {
    // Setup MSW handlers for Supabase API
    server.use(
      rest.post('*/rest/v1/forms', (req, res, ctx) => {
        return res(ctx.json({ id: 'test-form-id' }));
      })
    );
  });

  it('creates new form with default modules', async () => {
    // Test complete form creation workflow
  });

  it('saves form data to Supabase correctly', async () => {
    // Test data persistence
  });

  it('handles network failures gracefully', async () => {
    // Test offline queue and retry logic
  });
});
```

#### **Critical Integration Test Areas**

- ✅ **Supabase CRUD Operations**: Create, read, update forms
- ✅ **Auto-archive Workflow**: 16-hour auto-archive functionality
- ✅ **PDF Generation**: Complete form → PDF conversion
- ✅ **Photo Upload**: Image compression and storage
- ✅ **Offline Sync**: localStorage backup and restoration
- ✅ **Device Switching**: Cross-device form continuation

### **3. End-to-End Testing (10% of test coverage)**

#### **Complete User Workflows**

```typescript
// Playwright E2E test
test('Complete FLRA workflow - mobile device', async ({ page }) => {
  // 1. User signup
  await page.goto('/signup');
  await page.fill('[data-testid="first-name"]', 'John');
  await page.fill('[data-testid="last-name"]', 'Worker');
  await page.fill('[data-testid="company"]', 'ABC Construction');
  await page.click('[data-testid="create-account"]');

  // 2. Create new form
  await page.click('[data-testid="new-flra"]');

  // 3. Fill out form in Quick mode
  await page.fill('[data-testid="project-name"]', 'Site Safety Check');
  await page.selectOption('[data-testid="risk-level"]', 'medium');

  // 4. Switch to Guided mode
  await page.click('[data-testid="guided-mode"]');

  // 5. Complete all modules
  // ... detailed form filling steps

  // 6. Submit and generate PDF
  await page.click('[data-testid="submit-form"]');
  await page.click('[data-testid="generate-pdf"]');

  // 7. Verify PDF download
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toContain('FLRA');
});
```

#### **Critical E2E Test Scenarios**

- ✅ **Complete Form Lifecycle**: Create → Fill → Submit → Archive → PDF
- ✅ **Cross-Device Continuation**: Start on mobile, finish on tablet
- ✅ **Network Interruption Recovery**: Form completion with connectivity issues
- ✅ **Multi-Module Workflows**: Forms with all module types
- ✅ **Accessibility Navigation**: Complete form using only keyboard
- ✅ **Performance Under Load**: Large forms with many photos

---

## ♿ **Accessibility Testing Requirements**

### **WCAG 2.1 AA Compliance**

#### **Automated Testing**

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Form modules are accessible', async () => {
  const { container } = render(<GeneralInfoModule />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### **Manual Testing Checklist**

- ✅ **Screen Reader Navigation**: Test with NVDA/JAWS/VoiceOver
- ✅ **Keyboard Navigation**: All interactions accessible via keyboard
- ✅ **High Contrast Mode**: Readable in Windows high contrast
- ✅ **Touch Target Size**: Minimum 44px for mobile interactions
- ✅ **Focus Management**: Clear focus indicators and logical tab order
- ✅ **Error Announcements**: Screen reader announces validation errors

### **Construction Site Specific A11y**

- ✅ **Work Glove Usability**: Touch targets work with thick gloves
- ✅ **Bright Sunlight Readability**: High contrast ratios for outdoor use
- ✅ **Voice Input**: Compatible with voice control software
- ✅ **Simplified Language**: Clear, construction-appropriate terminology

---

## 🚀 **Performance Testing Standards**

### **Performance Budgets**

```json
{
  "performanceBudgets": {
    "bundleSize": {
      "maxInitialBundle": "250KB gzipped",
      "maxFormModule": "50KB gzipped",
      "maxPDFLibrary": "100KB gzipped"
    },
    "loadingTimes": {
      "initialPageLoad": "< 3 seconds on 3G",
      "formModuleLoad": "< 1 second",
      "autoSaveResponse": "< 500ms",
      "pdfGeneration": "< 10 seconds"
    },
    "interactionTimes": {
      "formFieldResponse": "< 100ms",
      "modeSwitch": "< 200ms",
      "photoUpload": "< 5 seconds"
    }
  }
}
```

### **Performance Test Implementation**

```typescript
describe('Performance Tests', () => {
  it('loads form modules within budget', async () => {
    const startTime = performance.now();
    render(<GeneralInfoModule />);
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(1000); // 1 second budget
  });

  it('handles large forms efficiently', async () => {
    const largeFormData = generateLargeFormData(100); // 100 fields
    const { rerender } = render(<FormBuilder data={largeFormData} />);

    const startTime = performance.now();
    rerender(<FormBuilder data={updatedLargeFormData} />);
    const rerenderTime = performance.now() - startTime;

    expect(rerenderTime).toBeLessThan(500); // 500ms budget
  });
});
```

---

## 🔧 **Test Configuration & Setup**

### **Jest Configuration**

```javascript
// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/testing/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/testing/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
};
```

### **Testing Utilities Setup**

```typescript
// src/testing/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// MSW server setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
    storage: {
      from: jest.fn(),
    },
  },
}));
```

### **MSW API Mocking**

```typescript
// src/testing/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Forms API
  rest.get('*/rest/v1/forms', (req, res, ctx) => {
    return res(ctx.json([{ id: '1', title: 'Test FLRA', status: 'active' }]));
  }),

  rest.post('*/rest/v1/forms', (req, res, ctx) => {
    return res(ctx.json({ id: 'new-form-id' }));
  }),

  // Storage API
  rest.post('*/storage/v1/object/*', (req, res, ctx) => {
    return res(ctx.json({ path: 'photos/test-photo.jpg' }));
  }),
];
```

---

## 📊 **Test Execution & CI/CD Integration**

### **NPM Scripts**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "jest --testNamePattern='accessibility'",
    "test:performance": "jest --testNamePattern='performance'",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

### **GitHub Actions Integration**

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npx bundlesize
```

---

## 🎯 **Testing Priorities by Development Phase**

### **Phase 1: MVP Foundation**

1. ✅ **Form Module Unit Tests** - Core functionality
2. ✅ **CRUD Integration Tests** - Data persistence
3. ✅ **Basic E2E Workflows** - Happy path scenarios
4. ✅ **Accessibility Basics** - Keyboard navigation, screen readers

### **Phase 2: Production Readiness**

1. ✅ **Performance Testing** - Load times, bundle sizes
2. ✅ **Error Scenario Testing** - Network failures, edge cases
3. ✅ **Cross-Device E2E** - Device switching workflows
4. ✅ **Advanced A11y** - Construction site specific requirements

### **Phase 3: Optimization**

1. ✅ **Load Testing** - Multiple concurrent users
2. ✅ **Security Testing** - XSS, data validation
3. ✅ **Regression Testing** - Automated visual testing
4. ✅ **User Acceptance Testing** - Real construction worker feedback

---

## 📈 **Success Metrics & Quality Gates**

### **Coverage Requirements**

- **Unit Tests**: 80% line coverage minimum
- **Integration Tests**: 100% of CRUD operations covered
- **E2E Tests**: 100% of critical user workflows covered
- **Accessibility**: 0 automated violations, manual checklist complete

### **Performance Gates**

- **Bundle Size**: Must pass bundlesize checks
- **Load Times**: Must meet performance budget
- **Lighthouse Score**: 90+ for Performance, Accessibility, Best Practices

### **Quality Gates for Deployment**

```yaml
# All must pass before deployment
- Unit test coverage ≥ 80%
- All E2E tests passing
- 0 accessibility violations
- Performance budget met
- Security scan clean
```

---

## 🔄 **Continuous Improvement**

### **Test Maintenance Strategy**

- **Weekly**: Review test failures and flaky tests
- **Monthly**: Update test data and scenarios
- **Quarterly**: Review coverage gaps and add missing tests
- **Per Release**: Update E2E scenarios for new features

### **Feedback Integration**

- **User Reports**: Convert bug reports into regression tests
- **Performance Monitoring**: Add tests for performance regressions
- **Accessibility Feedback**: Expand A11y test coverage based on user needs

---

**Status**: 🚧 Ready for Implementation  
**Next Steps**: Set up Jest + RTL configuration and create first form module tests  
**Owner**: Development Team  
**Review Date**: After Phase 1 implementation
