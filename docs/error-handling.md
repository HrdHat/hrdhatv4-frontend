# Error Handling & Logging Architecture for HrdHat

**Document Version**: 1.0  
**Created**: December 2024  
**Status**: ✅ ADDRESSES CRITICAL GAP from Plan Audit  
**Priority**: 🚨 CRITICAL - Required before Chapter 4 implementation

---

## 🎯 **OVERVIEW**

This document defines the comprehensive error handling and logging strategy for HrdHat, addressing the critical gap identified in the plan audit. The architecture is designed specifically for construction site conditions where network connectivity is unreliable and data integrity is paramount.

---

## 🏗️ **CONSTRUCTION SITE REQUIREMENTS**

### **Environmental Challenges**

- **Intermittent connectivity**: Workers move between areas with poor/no signal
- **Device switching**: Forms started on phone, continued on tablet
- **Harsh conditions**: Potential for unexpected app crashes
- **Time pressure**: Workers need quick error recovery, not technical details
- **Data criticality**: Safety form data cannot be lost

### **User Experience Priorities**

1. **Never lose form data** - Even during crashes or network failures
2. **Clear, actionable error messages** - No technical jargon
3. **Automatic recovery** - Minimal user intervention required
4. **Offline resilience** - Continue working without connectivity
5. **Quick sync resolution** - Fast conflict resolution when back online

---

## 🛡️ **ERROR BOUNDARY IMPLEMENTATION**

### **React Error Boundary Strategy**

```typescript
// Core error boundary for the entire application
interface AppErrorBoundaryState {
  hasError: boolean;
  errorType: 'form-data' | 'network' | 'component' | 'unknown';
  errorMessage: string;
  formDataBackup?: FormInstance;
  canRecover: boolean;
}

class AppErrorBoundary extends Component<Props, AppErrorBoundaryState> {
  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    // Classify error type and determine recovery strategy
    return {
      hasError: true,
      errorType: classifyError(error),
      errorMessage: getUserFriendlyMessage(error),
      formDataBackup: getCurrentFormData(),
      canRecover: isRecoverableError(error),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    ErrorLogger.logError({
      error,
      errorInfo,
      userContext: getCurrentUserContext(),
      formContext: getCurrentFormContext(),
      deviceInfo: getDeviceInfo(),
      timestamp: new Date().toISOString(),
    });
  }
}
```

### **Feature-Level Error Boundaries**

```typescript
// Form-specific error boundary with data preservation
interface FormErrorBoundaryProps {
  formId: string;
  onDataRecover: (data: FormInstance) => void;
}

// Auth error boundary with redirect capability
interface AuthErrorBoundaryProps {
  fallbackComponent: ComponentType;
  redirectTo?: string;
}

// Module-specific error boundaries for form sections
interface ModuleErrorBoundaryProps {
  moduleId: string;
  onModuleError: (moduleId: string, error: Error) => void;
}
```

---

## 📱 **OFFLINE ERROR QUEUE MANAGEMENT**

### **Error Queue Architecture**

```typescript
interface OfflineError {
  id: string;
  type: 'form-save' | 'form-submit' | 'auth' | 'file-upload';
  timestamp: Date;
  formId?: string;
  userId: string;
  errorData: any;
  retryCount: number;
  maxRetries: number;
  nextRetryAt: Date;
  priority: 'high' | 'medium' | 'low';
}

class OfflineErrorQueue {
  private queue: OfflineError[] = [];
  private isProcessing = false;

  // Add error to queue with automatic retry scheduling
  addError(error: OfflineError): void {
    this.queue.push(error);
    this.scheduleRetry(error);
  }

  // Process queue when connectivity restored
  async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    const sortedQueue = this.queue.sort((a, b) =>
      a.priority === 'high' ? -1 : 1
    );

    for (const error of sortedQueue) {
      try {
        await this.retryOperation(error);
        this.removeFromQueue(error.id);
      } catch (retryError) {
        this.handleRetryFailure(error, retryError);
      }
    }

    this.isProcessing = false;
  }
}
```

### **Retry Strategy Configuration**

```typescript
const RETRY_STRATEGIES = {
  'form-save': {
    maxRetries: 5,
    backoffMultiplier: 2,
    initialDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    priority: 'high',
  },
  'form-submit': {
    maxRetries: 10,
    backoffMultiplier: 1.5,
    initialDelay: 2000,
    maxDelay: 60000, // 1 minute
    priority: 'high',
  },
  'file-upload': {
    maxRetries: 3,
    backoffMultiplier: 3,
    initialDelay: 5000,
    maxDelay: 120000, // 2 minutes
    priority: 'medium',
  },
};
```

---

## ✅ **FORM VALIDATION ERROR DISPLAY**

### **Validation Error Types**

```typescript
interface ValidationError {
  field: string;
  moduleId: string;
  errorType: 'required' | 'format' | 'range' | 'dependency' | 'custom';
  message: string;
  severity: 'error' | 'warning' | 'info';
  canProceed: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  canSubmit: boolean;
  canSave: boolean;
}
```

### **Real-time Validation Strategy**

```typescript
// Validation timing configuration
const VALIDATION_CONFIG = {
  // Validate on field blur for immediate feedback
  onBlur: {
    enabled: true,
    debounce: 300,
    showErrors: true,
  },

  // Validate on input change for critical fields
  onChange: {
    enabled: true,
    debounce: 1000,
    showErrors: false, // Only show warnings
    criticalFields: ['hazard-level', 'safety-measures'],
  },

  // Full validation before save/submit
  onSubmit: {
    enabled: true,
    showAllErrors: true,
    blockSubmission: true,
  },
};
```

---

## 🌐 **NETWORK FAILURE RECOVERY**

### **Connection Monitoring**

```typescript
class NetworkMonitor {
  private isOnline = navigator.onLine;
  private connectionQuality: 'good' | 'poor' | 'offline' = 'good';
  private lastSuccessfulSync = new Date();

  // Monitor connection status and quality
  startMonitoring(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Periodic connection quality check
    setInterval(() => this.checkConnectionQuality(), 30000);
  }

  private async checkConnectionQuality(): Promise<void> {
    if (!this.isOnline) return;

    try {
      const start = Date.now();
      await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      const latency = Date.now() - start;

      this.connectionQuality = latency < 1000 ? 'good' : 'poor';
    } catch {
      this.connectionQuality = 'offline';
    }
  }
}
```

### **Auto-Save Failure Recovery**

```typescript
class AutoSaveManager {
  private saveQueue: FormSaveRequest[] = [];
  private isProcessing = false;

  async saveForm(formData: FormInstance): Promise<void> {
    const saveRequest: FormSaveRequest = {
      id: generateId(),
      formData,
      timestamp: new Date(),
      attempts: 0,
    };

    try {
      await this.attemptSave(saveRequest);
    } catch (error) {
      // Add to queue for retry when connection restored
      this.saveQueue.push(saveRequest);
      this.showOfflineNotification();
    }
  }

  private async processSaveQueue(): Promise<void> {
    if (this.isProcessing || this.saveQueue.length === 0) return;

    this.isProcessing = true;

    for (const request of this.saveQueue) {
      try {
        await this.attemptSave(request);
        this.removeFromQueue(request.id);
      } catch (error) {
        request.attempts++;
        if (request.attempts >= MAX_SAVE_ATTEMPTS) {
          this.handlePermanentSaveFailure(request);
        }
      }
    }

    this.isProcessing = false;
  }
}
```

---

## 🔒 **DATA CORRUPTION PREVENTION**

### **Data Integrity Checks**

```typescript
interface DataIntegrityCheck {
  checksum: string;
  version: number;
  lastModified: Date;
  deviceId: string;
  userId: string;
}

class DataIntegrityManager {
  // Generate checksum for form data
  generateChecksum(formData: FormInstance): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(formData))
      .digest('hex');
  }

  // Validate data integrity before save
  validateIntegrity(formData: FormInstance, expectedChecksum: string): boolean {
    const currentChecksum = this.generateChecksum(formData);
    return currentChecksum === expectedChecksum;
  }

  // Detect and resolve data conflicts
  async resolveConflict(
    localData: FormInstance,
    remoteData: FormInstance
  ): Promise<FormInstance> {
    const resolution = await this.analyzeConflict(localData, remoteData);

    switch (resolution.strategy) {
      case 'merge':
        return this.mergeFormData(localData, remoteData);
      case 'local-wins':
        return localData;
      case 'remote-wins':
        return remoteData;
      case 'user-choice':
        return await this.promptUserResolution(localData, remoteData);
    }
  }
}
```

---

## 📊 **ERROR LOGGING & MONITORING**

### **Error Classification System**

```typescript
enum ErrorCategory {
  CRITICAL = 'critical', // Data loss risk, app crash
  HIGH = 'high', // Feature broken, user blocked
  MEDIUM = 'medium', // Degraded experience
  LOW = 'low', // Minor UI issues
  INFO = 'info', // Informational events
}

enum ErrorSource {
  FORM_DATA = 'form-data',
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  STORAGE = 'storage',
  PDF_GENERATION = 'pdf',
  COMPONENT = 'component',
}

interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  category: ErrorCategory;
  source: ErrorSource;
  message: string;
  stack?: string;
  userContext: UserContext;
  formContext?: FormContext;
  deviceInfo: DeviceInfo;
  networkInfo: NetworkInfo;
  reproductionSteps?: string[];
}
```

---

## 🚨 **USER NOTIFICATION STRATEGY**

### **Error Message Templates**

```typescript
const ERROR_MESSAGES = {
  // Network-related errors
  NETWORK_OFFLINE: {
    title: 'Working Offline',
    message:
      'Your form is being saved locally. Changes will sync when connection returns.',
    action: 'Continue Working',
    type: 'info',
  },

  NETWORK_POOR: {
    title: 'Slow Connection',
    message: 'Saving may take longer than usual. Your work is safe.',
    action: 'Keep Working',
    type: 'warning',
  },

  // Form data errors
  FORM_SAVE_FAILED: {
    title: 'Save Failed',
    message:
      "Couldn't save your form. Don't worry - your work is backed up locally.",
    action: 'Try Again',
    type: 'error',
  },

  FORM_CONFLICT: {
    title: 'Form Updated Elsewhere',
    message:
      'This form was changed on another device. Choose which version to keep.',
    action: 'Resolve Conflict',
    type: 'warning',
  },

  // Validation errors
  VALIDATION_REQUIRED: {
    title: 'Required Information Missing',
    message:
      'Please fill in all required safety information before continuing.',
    action: 'Review Form',
    type: 'error',
  },
};
```

---

## 🔧 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Core Error Boundaries (Week 1)**

- [ ] Implement `AppErrorBoundary` with form data preservation
- [ ] Create `FormErrorBoundary` for form-specific errors
- [ ] Add `ModuleErrorBoundary` for individual form sections
- [ ] Test error boundary recovery with simulated crashes

### **Phase 2: Offline Error Management (Week 2)**

- [ ] Build `OfflineErrorQueue` with retry logic
- [ ] Implement `NetworkMonitor` for connection tracking
- [ ] Create `AutoSaveManager` with failure recovery
- [ ] Test offline form completion and sync

### **Phase 3: Validation & User Feedback (Week 3)**

- [ ] Implement real-time validation system
- [ ] Create error display components
- [ ] Build notification system (toast, banner, modal)
- [ ] Test validation error flows

### **Phase 4: Data Integrity & Logging (Week 4)**

- [ ] Implement `DataIntegrityManager` with conflict resolution
- [ ] Build `FormBackupManager` for crash recovery
- [ ] Create `ErrorLogger` with categorization
- [ ] Test data corruption scenarios

### **Phase 5: Integration & Testing (Week 5)**

- [ ] Integrate all error handling systems
- [ ] Comprehensive error scenario testing
- [ ] Performance testing with error handling overhead
- [ ] User acceptance testing for error messages

---

## 📈 **SUCCESS METRICS**

### **Technical Metrics**

- **Zero data loss**: No form data lost due to errors or crashes
- **Recovery time**: < 5 seconds to recover from most errors
- **Error categorization**: 95% of errors correctly classified
- **Offline resilience**: 100% form completion capability offline

### **User Experience Metrics**

- **Error comprehension**: Users understand 90% of error messages
- **Recovery success**: Users successfully recover from 95% of errors
- **Abandonment rate**: < 2% form abandonment due to errors
- **Support tickets**: < 1% error-related support requests

---

## 🔄 **MAINTENANCE & MONITORING**

### **Ongoing Monitoring**

- Daily error log review and categorization
- Weekly error pattern analysis
- Monthly user feedback review on error messages
- Quarterly error handling strategy review

### **Continuous Improvement**

- A/B testing of error message clarity
- Performance optimization of error handling overhead
- User research on error recovery workflows
- Regular updates to error classification rules

---

**Status**: ✅ COMPLETE - Ready for implementation  
**Next Step**: Begin Phase 1 implementation alongside Chapter 4 development  
**Dependencies**: None - can be implemented in parallel with other features

This architecture addresses all critical gaps identified in the plan audit and provides a robust foundation for reliable form data handling in construction site conditions.
