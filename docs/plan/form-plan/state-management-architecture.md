# State Management Architecture

**Last Updated**: December 2024  
**Status**: Implementation Ready  
**Decision**: Zustand for HrdHat v4 Form State Management

**📚 Related Documents**:

- For complete data flow context, see [`data-flow-architecture.md`](./data-flow-architecture.md)
- This document focuses specifically on Zustand implementation details
- Both documents are complementary - this provides implementation depth, data-flow provides system breadth

---

## 🎯 **Architecture Decision**

### **Selected Solution: Zustand**

**Decision Date**: December 2024  
**Status**: ✅ APPROVED

**Rationale**:

- ✅ **Lightweight**: Perfect for mobile construction workers (small bundle)
- ✅ **TypeScript-First**: Native type safety for form interfaces
- ✅ **Simple API**: `set()` and `get()` - easy to learn and maintain
- ✅ **Performance**: Minimal re-renders for large forms
- ✅ **Integration**: Works seamlessly with localStorage offline strategy

### **Rejected Alternatives**

#### **❌ Redux Toolkit**

- **Reason**: Too much boilerplate for form state management
- **Impact**: Slower development, larger bundle size
- **Use Case**: Better for complex apps with many features

#### **❌ React Context + useReducer**

- **Reason**: Performance issues with large forms (re-renders entire form)
- **Impact**: Poor user experience during form filling
- **Use Case**: Better for simple, small forms

---

## 🏗️ **Form State Architecture**

### **Core State Structure**

```typescript
interface FormState {
  // Form Data
  formData: FormInstance;
  formId: string;
  formType: 'flra' | 'incident' | 'inspection';

  // State Management
  isDirty: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;

  // UI State
  currentModule: string;
  fillMode: 'quick' | 'guided';
  isOffline: boolean;

  // Actions
  updateField: (field: string, value: any) => void;
  updateModule: (moduleId: string, moduleData: any) => void;
  saveToLocalStorage: () => void;
  syncToSupabase: () => Promise<void>;
  setFillMode: (mode: 'quick' | 'guided') => void;
  navigateToModule: (moduleId: string) => void;
}
```

### **Store Implementation**

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useFormStore = create<FormState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        formData: {},
        formId: '',
        formType: 'flra',
        isDirty: false,
        saveStatus: 'idle',
        lastSaved: null,
        currentModule: 'general-info',
        fillMode: 'quick',
        isOffline: false,

        // Field Updates
        updateField: (field, value) => {
          const currentData = get().formData;
          const updatedData = {
            ...currentData,
            [field]: value,
            lastModified: new Date(),
          };

          set({
            formData: updatedData,
            isDirty: true,
            saveStatus: 'idle',
          });

          // Trigger auto-save (debounced)
          get().debouncedSave();
        },

        // Module Updates
        updateModule: (moduleId, moduleData) => {
          const currentData = get().formData;
          const updatedData = {
            ...currentData,
            modules: {
              ...currentData.modules,
              [moduleId]: {
                ...currentData.modules?.[moduleId],
                ...moduleData,
                lastModified: new Date(),
              },
            },
          };

          set({
            formData: updatedData,
            isDirty: true,
            saveStatus: 'idle',
          });

          get().debouncedSave();
        },

        // Local Storage Save
        saveToLocalStorage: () => {
          const { formData, formId } = get();
          try {
            localStorage.setItem(
              `form-${formId}`,
              JSON.stringify({
                ...formData,
                savedAt: new Date(),
              })
            );

            set({
              isDirty: false,
              saveStatus: 'saved',
              lastSaved: new Date(),
            });
          } catch (error) {
            console.error('Failed to save to localStorage:', error);
            set({ saveStatus: 'error' });
          }
        },

        // Supabase Sync
        syncToSupabase: async () => {
          const { formData, formId } = get();
          set({ saveStatus: 'saving' });

          try {
            // Save to Supabase
            await supabase.from('form_instances').upsert({
              id: formId,
              form_data: formData,
              updated_at: new Date(),
            });

            set({
              saveStatus: 'saved',
              lastSaved: new Date(),
            });
          } catch (error) {
            console.error('Failed to sync to Supabase:', error);
            set({ saveStatus: 'error' });
          }
        },

        // UI Actions
        setFillMode: mode => set({ fillMode: mode }),

        navigateToModule: moduleId => set({ currentModule: moduleId }),

        // Debounced save (implemented separately)
        debouncedSave: debounce(() => {
          get().saveToLocalStorage();
        }, 2000),
      }),
      {
        name: 'form-storage',
        partialize: state => ({
          formData: state.formData,
          formId: state.formId,
          formType: state.formType,
          fillMode: state.fillMode,
        }),
      }
    ),
    { name: 'form-store' }
  )
);
```

---

## 🔄 **Auto-Save Strategy**

### **Save Triggers**

1. **Field Updates**: 2-second debounce after user stops typing
2. **Module Navigation**: Immediate save when switching modules
3. **Mode Changes**: Save when switching Quick ↔ Guided
4. **App Background**: Save when app loses focus
5. **Periodic**: Every 30 seconds if form is dirty

### **Save Flow**

```typescript
// Auto-save implementation
const debouncedSave = debounce(formStore => {
  // 1. Save to localStorage (immediate)
  formStore.saveToLocalStorage();

  // 2. Queue Supabase sync (when online)
  if (navigator.onLine) {
    formStore.syncToSupabase();
  } else {
    // Add to sync queue for when online
    addToSyncQueue(formStore.formId, formStore.formData);
  }
}, 2000);

// Usage in components
const updateField = useFormStore(state => state.updateField);

const handleInputChange = (field: string, value: any) => {
  updateField(field, value); // Triggers auto-save
};
```

---

## 📱 **Device Switching Support**

### **Cross-Device State Sync**

```typescript
// Load form on app start
const loadFormFromStorage = (formId: string) => {
  // 1. Try to load from Supabase (latest version)
  const supabaseData = await supabase
    .from('form_instances')
    .select('*')
    .eq('id', formId)
    .single();

  // 2. Compare with localStorage version
  const localData = localStorage.getItem(`form-${formId}`);

  // 3. Use most recent version
  const mostRecent = getMostRecentVersion(supabaseData, localData);

  // 4. Load into store
  useFormStore.setState({
    formData: mostRecent.form_data,
    formId: formId,
    lastSaved: mostRecent.updated_at,
  });
};

// Conflict resolution
const getMostRecentVersion = (supabaseData, localData) => {
  if (!localData) return supabaseData;
  if (!supabaseData) return JSON.parse(localData);

  const localDate = new Date(JSON.parse(localData).savedAt);
  const supabaseDate = new Date(supabaseData.updated_at);

  return localDate > supabaseDate ? JSON.parse(localData) : supabaseData;
};
```

---

## 🔌 **Integration with Form Components**

### **Component Usage Patterns**

```typescript
// Form field component
const FormField = ({ fieldName, moduleId }) => {
  const updateField = useFormStore((state) => state.updateField);
  const fieldValue = useFormStore((state) =>
    state.formData.modules?.[moduleId]?.[fieldName]
  );

  const handleChange = (value) => {
    updateField(`modules.${moduleId}.${fieldName}`, value);
  };

  return (
    <input
      value={fieldValue || ''}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};

// Module component
const FormModule = ({ moduleId }) => {
  const updateModule = useFormStore((state) => state.updateModule);
  const moduleData = useFormStore((state) =>
    state.formData.modules?.[moduleId] || {}
  );

  const handleModuleUpdate = (updates) => {
    updateModule(moduleId, updates);
  };

  return (
    <div>
      {/* Module content */}
    </div>
  );
};

// Save status indicator
const SaveStatus = () => {
  const saveStatus = useFormStore((state) => state.saveStatus);
  const lastSaved = useFormStore((state) => state.lastSaved);

  return (
    <div className="save-status">
      {saveStatus === 'saving' && '💾 Saving...'}
      {saveStatus === 'saved' && `✅ Saved ${formatTime(lastSaved)}`}
      {saveStatus === 'error' && '❌ Save failed'}
    </div>
  );
};
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**

```typescript
// Store testing
describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState(initialState);
  });

  it('should update field and mark as dirty', () => {
    const { updateField } = useFormStore.getState();

    updateField('companyName', 'Test Company');

    const state = useFormStore.getState();
    expect(state.formData.companyName).toBe('Test Company');
    expect(state.isDirty).toBe(true);
  });

  it('should save to localStorage', () => {
    const { saveToLocalStorage } = useFormStore.getState();

    saveToLocalStorage();

    const saved = localStorage.getItem('form-test-id');
    expect(saved).toBeTruthy();
  });
});
```

### **Integration Tests**

```typescript
// Component integration
describe('Form Integration', () => {
  it('should auto-save after field update', async () => {
    render(<FormField fieldName="companyName" moduleId="general" />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Company' } });

    // Wait for debounced save
    await waitFor(() => {
      expect(localStorage.getItem('form-test-id')).toBeTruthy();
    }, { timeout: 3000 });
  });
});
```

---

## 🚀 **Performance Optimizations**

### **Selective Subscriptions**

```typescript
// Only subscribe to specific parts of state
const FormField = ({ fieldName }) => {
  // ✅ Good - only re-renders when this field changes
  const fieldValue = useFormStore(state => state.formData[fieldName]);

  // ❌ Bad - re-renders on any state change
  const state = useFormStore();
};
```

### **Debounced Updates**

```typescript
// Debounce auto-save to prevent excessive saves
const debouncedSave = useMemo(
  () =>
    debounce(formData => {
      saveToLocalStorage(formData);
    }, 2000),
  []
);
```

### **Memory Management**

```typescript
// Clean up on unmount
useEffect(() => {
  return () => {
    // Cancel pending saves
    debouncedSave.cancel();

    // Clear any timers
    clearInterval(periodicSaveTimer);
  };
}, []);
```

---

## 📋 **Implementation Checklist**

### **Phase 1: Basic State Management**

- [ ] **Zustand Setup**: Install and configure Zustand
- [ ] **Store Creation**: Create form store with basic state
- [ ] **Field Updates**: Implement updateField action
- [ ] **Module Updates**: Implement updateModule action
- [ ] **Auto-save**: Implement debounced localStorage save
- [ ] **Save Status**: Add save status indicators
- [ ] **DevTools**: Configure Zustand devtools

### **Phase 2: Advanced Features**

- [ ] **Persistence**: Add Zustand persist middleware
- [ ] **Supabase Sync**: Implement cloud sync
- [ ] **Conflict Resolution**: Handle device switching conflicts
- [ ] **Offline Queue**: Queue saves when offline
- [ ] **Performance**: Optimize subscriptions and re-renders

### **Phase 3: Testing & Polish**

- [ ] **Unit Tests**: Test store actions and state updates
- [ ] **Integration Tests**: Test component integration
- [ ] **Performance Tests**: Measure re-render frequency
- [ ] **Memory Tests**: Check for memory leaks

---

## 🎯 **Success Criteria**

### **Functional Goals**

- ✅ Form data persists across page reloads
- ✅ Auto-save works within 2 seconds of user input
- ✅ Forms sync across devices seamlessly
- ✅ Offline forms save locally and sync when online
- ✅ Save status is always visible to users

### **Performance Goals**

- ✅ Form updates render in < 100ms
- ✅ Auto-save completes in < 500ms
- ✅ Memory usage stays under 10MB for large forms
- ✅ No unnecessary re-renders during typing

### **Developer Experience Goals**

- ✅ Simple API for updating form fields
- ✅ TypeScript support for all state operations
- ✅ Easy debugging with Zustand devtools
- ✅ Clear patterns for component integration

---

**Status**: Implementation Ready  
**Dependencies**: Zustand installation, localStorage utilities, Supabase client  
**Next Steps**: Begin Phase 1 implementation with basic store setup
