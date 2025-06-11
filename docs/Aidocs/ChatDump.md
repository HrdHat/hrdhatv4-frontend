# Preventing Duplicate Form Creation in React StrictMode

**Purpose:**
Ensure that only one form is created, even when React StrictMode causes effects to run twice in development.

---

## Why This Happens

- React StrictMode intentionally double-invokes certain lifecycle methods and effects in development to help catch bugs.
- If your form creation logic is not idempotent or properly guarded, this can result in two forms being created.

---

## Bulletproof Pattern

### 1. Use a Ref to Track Initialization

Use a ref (e.g., `initializationStarted`) to track whether the form creation process has already started. This ref persists across re-renders and effect re-runs.

### 2. Check for Existing Form

Before creating a new form, check if a form already exists for the user. This can be done by querying your backend or checking your local state.

### 3. Make the Effect Idempotent

Ensure that your effect logic is idempotent—meaning that running it multiple times has the same effect as running it once. For example, if a form already exists, don't create another one.

### 4. Use a Flag to Prevent Duplicate Creation

If you're creating a form as a side effect, use a flag (like the ref) to ensure the creation logic only runs once.

---

## Example Implementation

```typescript
import React, { useEffect, useRef } from 'react';
import { useFormStore } from '@/stores/formStore';
import { useAuthStore } from '@/stores/authStore';

export default function FormEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const initializationStarted = useRef(false);
  const { currentForm, initializeForm } = useFormStore();

  useEffect(() => {
    if (!user) {
      logger.warn('No authenticated user for form editor');
      return;
    }

    // If we're on the 'new' route and don't have a form yet, create one
    if (
      (!id || id === 'new') &&
      !currentForm &&
      !initializationStarted.current
    ) {
      initializationStarted.current = true;
      initializeForm(user.id)
        .then(newFormId => {
          navigate(`/form/${newFormId}`, { replace: true });
        })
        .catch(error => {
          logger.error('Form initialization failed', error);
          initializationStarted.current = false;
        });
    }

    return () => {
      initializationStarted.current = false;
    };
  }, [id, user?.id, currentForm, initializeForm, navigate]);

  // ... rest of the component code ...
}
```

---

## Key Points

- **Ref for Tracking:** The `initializationStarted` ref ensures the form creation logic only runs once, even if the effect is invoked twice by StrictMode.
- **Check for Existing Form:** The condition `!currentForm` ensures we don't create a new form if one already exists.
- **Idempotent Logic:** The effect is designed to be idempotent—running it multiple times won't create duplicate forms.

---

**Summary:**

- Rendering twice in StrictMode: normal and expected.
- Creating two forms: a bug in your effect logic, not React's fault.
- This pattern guarantees that only one form is created, even in StrictMode.
