# Data Flow Architecture

**Last Updated**: December 2024  
**Status**: Implementation Ready  
**Purpose**: Unified data flow from user interaction to database storage

**📚 Related Documents**:

- For detailed Zustand implementation, see [`state-management-architecture.md`](./state-management-architecture.md)
- This document provides system-wide data flow context
- Both documents are complementary - this provides architectural breadth, state-management provides implementation depth

---

## 🎯 **Overview: The Complete Data Journey**

This document maps the complete data flow in HrdHat, showing how form data travels from user input through state management, API layers, and ultimately to persistent storage - both online and offline.

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌────────────┐
│ User Input  │ ──> │ Zustand Store│ ──> │ API Layer    │ ──> │ Supabase   │
└─────────────┘     └──────────────┘     └──────────────┘     └────────────┘
       │                    │                     │                    │
       v                    v                     v                    v
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌────────────┐
│ Validation  │     │ localStorage │     │ Retry Queue  │     │ Cloud Sync │
└─────────────┘     └──────────────┘     └──────────────┘     └────────────┘
```

---

## 📊 **Chapter 1: State Management Layer**

### **1.1 Zustand Store Architecture**

**Purpose**: Manage form data in memory with optimal performance

```typescript
// Core form store structure
const useFormStore = create<FormState>((set, get) => ({
  // State
  formData: {},
  formId: '',
  isDirty: false,
  saveStatus: 'idle',

  // Actions
  updateField: (field, value) => {
    // 1. Update in-memory state
    set({
      formData: { ...get().formData, [field]: value },
      isDirty: true,
    });

    // 2. Trigger save pipeline
    get().debouncedSave();
  },

  // Save pipeline entry point
  debouncedSave: debounce(() => {
    get().saveToLocalStorage();
    get().queueSupabaseSync();
  }, 2000),
}));
```

### **1.2 State Update Flow**

1. **User types** → Component calls `updateField()`
2. **Store updates** → In-memory state changes immediately
3. **Debounced save** → 2-second delay to batch changes
4. **Save pipeline** → Triggers localStorage + API sync

---

## 🔌 **Chapter 2: API Integration Architecture**

### **2.1 Service Layer Structure**

**Purpose**: Standardized interface for all backend communication

```typescript
// Unified API service architecture
class APIService {
  private supabase: SupabaseClient;
  private errorHandler: ErrorHandler;
  private retryManager: RetryManager;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    this.errorHandler = new ErrorHandler();
    this.retryManager = new RetryManager();
  }

  // Form service
  forms = {
    create: async (formData: FormData) =>
      this.executeWithRetry(() =>
        this.supabase.from('form_instances').insert(formData)
      ),

    update: async (id: string, formData: FormData) =>
      this.executeWithRetry(() =>
        this.supabase.from('form_instances').update(formData).eq('id', id)
      ),

    get: async (id: string) =>
      this.executeWithRetry(() =>
        this.supabase.from('form_instances').select('*').eq('id', id).single()
      ),

    archive: async (id: string) =>
      this.executeWithRetry(() =>
        this.supabase
          .from('form_instances')
          .update({ status: 'archived', archived_at: new Date() })
          .eq('id', id)
      ),
  };

  // Auth service
  auth = {
    signIn: async (email: string, password: string) =>
      this.executeWithRetry(() =>
        this.supabase.auth.signInWithPassword({ email, password })
      ),

    signOut: async () =>
      this.executeWithRetry(() => this.supabase.auth.signOut()),
  };

  // Storage service (for photos/signatures)
  storage = {
    upload: async (bucket: string, path: string, file: File) =>
      this.executeWithRetry(() =>
        this.supabase.storage.from(bucket).upload(path, file)
      ),

    getUrl: (bucket: string, path: string) =>
      this.supabase.storage.from(bucket).getPublicUrl(path),
  };

  // Retry wrapper with error handling
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    try {
      return await this.retryManager.execute(operation, maxRetries);
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }
}

// Single instance for entire app
export const api = new APIService();
```

### **2.2 API Call Flow**

1. **Component** → Calls API service method
2. **Service** → Wraps in retry logic
3. **Retry Manager** → Handles failures with exponential backoff
4. **Error Handler** → Logs and transforms errors
5. **Response** → Returns to component or queues for offline

---

## 💾 **Chapter 3: CRUD Operations Flow**

### **3.1 Create Operation**

```typescript
// Complete create flow from UI to database
const createForm = async () => {
  // 1. Initialize in Zustand
  const formId = generateId();
  useFormStore.setState({
    formId,
    formData: getDefaultFormTemplate(),
    isDirty: true,
  });

  // 2. Save to localStorage immediately
  localStorage.setItem(
    `form-${formId}`,
    JSON.stringify({
      ...getDefaultFormTemplate(),
      createdAt: new Date(),
      status: 'active',
    })
  );

  // 3. Queue API creation
  if (navigator.onLine) {
    try {
      await api.forms.create({
        id: formId,
        form_data: getDefaultFormTemplate(),
        status: 'active',
      });
    } catch (error) {
      // Add to offline queue
      offlineQueue.add('create', formId, getDefaultFormTemplate());
    }
  } else {
    // Offline - queue for later
    offlineQueue.add('create', formId, getDefaultFormTemplate());
  }
};
```

### **3.2 Update Operation**

```typescript
// Auto-save update flow
const updateFlow = {
  // Step 1: User input
  onFieldChange: (field: string, value: any) => {
    useFormStore.getState().updateField(field, value);
  },

  // Step 2: Debounced save (from Zustand)
  debouncedSave: debounce(async () => {
    const { formId, formData } = useFormStore.getState();

    // Save to localStorage
    localStorage.setItem(
      `form-${formId}`,
      JSON.stringify({
        ...formData,
        lastModified: new Date(),
      })
    );

    // Try to sync
    if (navigator.onLine) {
      try {
        await api.forms.update(formId, formData);
        useFormStore.setState({ saveStatus: 'saved' });
      } catch (error) {
        offlineQueue.add('update', formId, formData);
        useFormStore.setState({ saveStatus: 'queued' });
      }
    }
  }, 2000),
};
```

### **3.3 Read Operation**

```typescript
// Load form with fallback strategy
const loadForm = async (formId: string) => {
  // 1. Check localStorage first (instant)
  const localData = localStorage.getItem(`form-${formId}`);
  if (localData) {
    useFormStore.setState({
      formData: JSON.parse(localData),
      formId,
    });
  }

  // 2. Fetch from Supabase (latest version)
  if (navigator.onLine) {
    try {
      const { data } = await api.forms.get(formId);

      // 3. Resolve conflicts (newest wins)
      const localDate = localData ? JSON.parse(localData).lastModified : null;
      const remoteDate = data.updated_at;

      if (!localDate || new Date(remoteDate) > new Date(localDate)) {
        // Remote is newer
        useFormStore.setState({ formData: data.form_data });
        localStorage.setItem(`form-${formId}`, JSON.stringify(data.form_data));
      }
    } catch (error) {
      console.error('Failed to sync with server, using local data');
    }
  }
};
```

### **3.4 Archive Operation**

```typescript
// Archive with state cleanup
const archiveForm = async (formId: string) => {
  // 1. Update local state
  const formData = useFormStore.getState().formData;
  const archivedData = {
    ...formData,
    status: 'archived',
    archivedAt: new Date(),
  };

  // 2. Update localStorage
  localStorage.setItem(`form-${formId}`, JSON.stringify(archivedData));

  // 3. Clear from active state
  if (useFormStore.getState().formId === formId) {
    useFormStore.setState({ formData: {}, formId: '', isDirty: false });
  }

  // 4. Sync to Supabase
  if (navigator.onLine) {
    try {
      await api.forms.archive(formId);
    } catch (error) {
      offlineQueue.add('archive', formId, { status: 'archived' });
    }
  } else {
    offlineQueue.add('archive', formId, { status: 'archived' });
  }
};
```

---

## 🔄 **Chapter 4: Offline/Online Sync Flow**

### **4.1 Offline Queue Management**

```typescript
class OfflineQueue {
  private queue: QueueItem[] = [];

  add(operation: string, id: string, data: any) {
    this.queue.push({
      operation,
      id,
      data,
      timestamp: new Date(),
      retries: 0,
    });
    this.saveQueue();
  }

  async processQueue() {
    if (!navigator.onLine || this.queue.length === 0) return;

    const pending = [...this.queue];
    this.queue = [];

    for (const item of pending) {
      try {
        await this.executeOperation(item);
      } catch (error) {
        item.retries++;
        if (item.retries < 3) {
          this.queue.push(item);
        } else {
          console.error('Max retries reached for', item);
        }
      }
    }

    this.saveQueue();
  }

  private async executeOperation(item: QueueItem) {
    switch (item.operation) {
      case 'create':
        return api.forms.create(item.data);
      case 'update':
        return api.forms.update(item.id, item.data);
      case 'archive':
        return api.forms.archive(item.id);
    }
  }

  private saveQueue() {
    localStorage.setItem('offline-queue', JSON.stringify(this.queue));
  }
}
```

### **4.2 Connection State Management**

```typescript
// Monitor online/offline state
class ConnectionManager {
  private isOnline = navigator.onLine;
  private listeners: Set<(online: boolean) => void> = new Set();

  constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.notifyListeners(true);

    // Process offline queue
    offlineQueue.processQueue();

    // Sync all active forms
    this.syncActiveForms();
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.notifyListeners(false);

    // Save all dirty forms to localStorage
    this.saveAllDirtyForms();
  };

  private async syncActiveForms() {
    const activeForms = this.getActiveFormsFromLocalStorage();

    for (const formId of activeForms) {
      try {
        await loadForm(formId); // Triggers sync
      } catch (error) {
        console.error(`Failed to sync form ${formId}`);
      }
    }
  }
}
```

---

## 🚨 **Chapter 5: Error Handling Integration**

### **5.1 Error Flow Through Layers**

```typescript
// Comprehensive error handling at each layer
class ErrorHandler {
  handle(error: any, context?: string) {
    // 1. Categorize error
    const category = this.categorizeError(error);

    // 2. Handle based on category
    switch (category) {
      case 'network':
        this.handleNetworkError(error);
        break;
      case 'validation':
        this.handleValidationError(error);
        break;
      case 'auth':
        this.handleAuthError(error);
        break;
      default:
        this.handleGenericError(error);
    }

    // 3. Log for monitoring
    this.logError(error, category, context);
  }

  private handleNetworkError(error: any) {
    // Don't show error - queue for retry
    offlineQueue.add(error.operation, error.id, error.data);

    // Update UI state
    useFormStore.setState({
      saveStatus: 'queued',
      isOffline: true,
    });
  }

  private handleValidationError(error: any) {
    // Show user-friendly message
    showToast({
      type: 'error',
      message: 'Please check your form entries',
      details: error.validationErrors,
    });
  }
}
```

### **5.2 Data Integrity Protection**

```typescript
// Ensure data integrity throughout flow
class DataIntegrityManager {
  // Validate before save
  validateFormData(formData: any): boolean {
    // Check required fields
    if (!formData.id || !formData.createdAt) {
      throw new Error('Missing required form metadata');
    }

    // Check data structure
    if (!this.isValidFormStructure(formData)) {
      throw new Error('Invalid form structure');
    }

    // Check for data corruption
    if (this.detectCorruption(formData)) {
      throw new Error('Form data appears corrupted');
    }

    return true;
  }

  // Add checksums for critical data
  addIntegrityHash(formData: any) {
    return {
      ...formData,
      _integrity: {
        hash: this.calculateHash(formData),
        version: '1.0',
        timestamp: new Date(),
      },
    };
  }

  // Verify on load
  verifyIntegrity(formData: any): boolean {
    if (!formData._integrity) return false;

    const currentHash = this.calculateHash(formData);
    return currentHash === formData._integrity.hash;
  }
}
```

---

## 🔐 **Chapter 6: Security Integration**

### **6.1 Input Sanitization Flow**

```typescript
// Safe entry points through bullet proof UI
const secureUpdateField = (field: string, value: any) => {
  // 1. Value already clean from bullet proof UI component
  // 2. No validation needed - UI prevents invalid data
  // 3. Update state with guaranteed clean data
  useFormStore.getState().updateField(field, value);
};
```

### **6.2 Secure Storage**

```typescript
// Encrypt sensitive data in localStorage
class SecureStorage {
  async store(key: string, data: any) {
    // 1. Data already clean from bullet proof UI
    // 2. Encrypt sensitive fields
    const encrypted = await this.encryptSensitiveFields(data);

    // 3. Add integrity hash
    const withIntegrity = dataIntegrityManager.addIntegrityHash(encrypted);

    // 4. Store
    localStorage.setItem(key, JSON.stringify(withIntegrity));
  }

  async retrieve(key: string) {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // 1. Verify integrity
    if (!dataIntegrityManager.verifyIntegrity(parsed)) {
      throw new Error('Data integrity check failed');
    }

    // 2. Decrypt sensitive fields
    const decrypted = await this.decryptSensitiveFields(parsed);

    // 3. Sanitize again (defense in depth)
    return this.deepSanitize(decrypted);
  }
}
```

---

## 📊 **Chapter 7: Performance Optimization**

### **7.1 Data Flow Optimization**

```typescript
// Optimize data flow for performance
const performanceOptimizations = {
  // Debounce saves by module type
  debounceTimes: {
    textInput: 2000, // 2 seconds for text
    taskHazard: 3000, // 3 seconds for complex modules
    photo: 0, // Immediate for photos (already processed)
  },

  // Batch API calls
  batchSync: async (operations: Operation[]) => {
    const batched = operations.reduce((acc, op) => {
      if (!acc[op.type]) acc[op.type] = [];
      acc[op.type].push(op);
      return acc;
    }, {});

    // Execute batches in parallel
    await Promise.all([
      api.forms.batchUpdate(batched.update),
      api.forms.batchCreate(batched.create),
    ]);
  },

  // Progressive data loading
  loadFormProgressive: async (formId: string) => {
    // 1. Load critical data first
    const critical = await api.forms.getCritical(formId);
    useFormStore.setState({ formData: critical });

    // 2. Load modules async
    const modules = await api.forms.getModules(formId);
    useFormStore.setState(state => ({
      formData: { ...state.formData, modules },
    }));
  },
};
```

### **7.2 Memory Management**

```typescript
// Manage memory throughout data flow
class MemoryManager {
  private readonly MAX_ACTIVE_FORMS = 3;
  private activeForms = new Map();

  loadForm(formId: string, formData: any) {
    // Check memory limits
    if (this.activeForms.size >= this.MAX_ACTIVE_FORMS) {
      // Evict least recently used
      const lru = this.findLeastRecentlyUsed();
      this.evictForm(lru);
    }

    // Add to active forms
    this.activeForms.set(formId, {
      data: formData,
      lastAccessed: Date.now(),
    });
  }

  evictForm(formId: string) {
    const form = this.activeForms.get(formId);
    if (form && useFormStore.getState().isDirty) {
      // Save before evicting
      localStorage.setItem(`form-${formId}`, JSON.stringify(form.data));
    }

    this.activeForms.delete(formId);

    // Clean up blob URLs, listeners, etc.
    this.cleanup(formId);
  }
}
```

---

## 🎯 **Complete Data Flow Summary**

### **Online Flow**

```
User Input → Zustand → API Service → Supabase → Success
     ↓          ↓           ↓           ↓          ↓
Validation → Auto-save → Retry Logic → Response → UI Update
```

### **Offline Flow**

```
User Input → Zustand → localStorage → Offline Queue
     ↓          ↓           ↓              ↓
Validation → Auto-save → Encryption → Wait for Connection
                                          ↓
                                    Connection Restored
                                          ↓
                                    Process Queue → Supabase
```

### **Error Flow**

```
Any Operation → Error Occurs → Error Handler → Categorize
                                     ↓              ↓
                              Retry Strategy ← Network Error
                                     ↓
                              User Message ← Validation Error
                                     ↓
                              Re-auth ← Auth Error
```

---

## 📋 **Implementation Checklist**

### **Phase 1: Core Infrastructure**

- [ ] Implement Zustand store with TypeScript
- [ ] Create API service layer with retry logic
- [ ] Build offline queue system
- [ ] Add connection state management

### **Phase 2: CRUD Operations**

- [ ] Implement create flow with offline support
- [ ] Build update with auto-save
- [ ] Add read with conflict resolution
- [ ] Create archive with cleanup

### **Phase 3: Error & Security**

- [ ] Add comprehensive error handling
- [ ] Implement input sanitization
- [ ] Add data integrity checks
- [ ] Create secure storage layer

### **Phase 4: Performance**

- [ ] Add debouncing strategies
- [ ] Implement progressive loading
- [ ] Add memory management
- [ ] Create batch operations

---

## 🚀 **Success Metrics**

### **Data Flow Goals**

- ✅ Zero data loss under any condition
- ✅ < 100ms UI response time
- ✅ < 2s save confirmation
- ✅ 100% offline functionality
- ✅ Automatic conflict resolution

### **Performance Goals**

- ✅ < 10MB memory per form
- ✅ < 3 active forms in memory
- ✅ < 500ms API response time
- ✅ Batch sync when possible

### **Security Goals**

- ✅ 100% input sanitization
- ✅ Encrypted sensitive data
- ✅ Data integrity verification
- ✅ Secure API communication

---

**Status**: Complete Architecture Ready for Implementation  
**Dependencies**: Zustand, Supabase Client, DOMPurify, localStorage  
**Next Steps**: Begin Phase 1 implementation with core infrastructure
