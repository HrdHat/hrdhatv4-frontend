# HrdHat Development Plan - Updated with Core Modules & Accessibility

## 📋 **Chapter Overview**

| Chapter | Focus Area                         | Duration    | Key Deliverables                                       |
| ------- | ---------------------------------- | ----------- | ------------------------------------------------------ |
| 1       | Project Setup & Architecture       | 1 week      | Vite, TypeScript, folder structure, routing            |
| 2       | Authentication & User Management   | 1 week      | Supabase auth, user profiles, session handling         |
| 3       | Core UI Components & Design System | 1 week      | Button, Input, Modal, responsive layouts               |
| 4       | Error Handling & Resilience        | 1 week      | Error boundaries, offline support, auto-save           |
| **5**   | **Core Module Development**        | **2 weeks** | **Photos, Signatures, Form Header modules**            |
| 6       | Form Instance Management           | 2 weeks     | CRUD operations, data persistence, performance         |
| 7       | Form Rendering & Navigation        | 2 weeks     | Dynamic modules, Quick/Guided modes, progress tracking |
| 8       | PDF Generation & Export            | 1 week      | PDF creation, construction-site formatting             |
| 9       | Testing & Quality Assurance        | 1 week      | Unit tests, integration tests, accessibility testing   |
| 10      | Deployment & Production            | 1 week      | CI/CD, monitoring, performance optimization            |

---

## **Chapter 5: Core Module Development (2 weeks)**

### **Overview**

Develop the three critical form modules that require specialized functionality: Photos (camera integration), Signatures (canvas drawing), and Form Header (project metadata). These modules form the foundation of the FLRA form experience.

### **Phase 5.1: Photo Module with Mobile Camera Support (Week 1)**

**Core Photo Module Features:**

- [ ] Create `PhotoModule` component with TypeScript interface
- [ ] Implement photo array management (max 5 photos)
- [ ] Add photo caption functionality
- [ ] Implement file size validation (max 5MB per photo)
- [ ] Add image compression (quality: 0.8)
- [ ] Create photo preview and deletion functionality

**Mobile Camera Integration:**

- [ ] Implement device camera detection and access
- [ ] Create camera capture interface for mobile/tablet
- [ ] Add photo orientation handling (EXIF data)
- [ ] Implement fallback file upload for desktop
- [ ] Add camera permission handling and error states
- [ ] Create photo retake functionality

**Photo Storage & Management:**

- [ ] Integrate with Supabase Storage for photo uploads
- [ ] Implement progressive upload with retry logic
- [ ] Add photo thumbnail generation
- [ ] Create photo gallery view component
- [ ] Implement photo metadata storage (timestamp, device info)

**Essential Accessibility (Phase 1):**

- [ ] Add alt text input for each photo
- [ ] Implement keyboard navigation for photo gallery
- [ ] Add screen reader announcements for photo actions
- [ ] Ensure 44px minimum touch targets for mobile controls
- [ ] Add high contrast mode support for photo controls

### **Phase 5.2: Signature Module with Canvas Drawing (Week 2)**

**Signature Canvas Implementation:**

- [ ] Create `SignatureModule` component with canvas drawing
- [ ] Implement touch/mouse signature capture
- [ ] Add signature clear and redo functionality
- [ ] Create signature validation (minimum stroke detection)
- [ ] Implement signature scaling for different screen sizes

**Multi-Signature Management:**

- [ ] Support up to 20 worker signatures + 1 supervisor
- [ ] Create signature list with name/role assignment
- [ ] Implement signature deletion and reordering
- [ ] Add signature timestamp and device tracking
- [ ] Create signature export to base64/PNG format

**Signature Quality & Validation:**

- [ ] Implement signature quality scoring
- [ ] Add minimum signature size requirements
- [ ] Create signature preview and confirmation
- [ ] Implement signature compression for storage
- [ ] Add signature verification visual feedback

**Essential Accessibility (Phase 1):**

- [ ] Add keyboard alternative for signature input
- [ ] Implement voice-to-text signature option
- [ ] Add screen reader support for signature status
- [ ] Ensure signature canvas has proper ARIA labels
- [ ] Add high contrast mode for signature interface

### **Phase 5.3: Form Header Module (Week 2)**

**Project Information Management:**

- [ ] Create `FormHeaderModule` with project metadata
- [ ] Implement project name, location, and date fields
- [ ] Add supervisor and crew information management
- [ ] Create weather and site condition inputs
- [ ] Implement form ID and reference number generation

**Smart Form Header Features:**

- [ ] Add project information auto-complete from previous forms
- [ ] Implement location services integration (optional)
- [ ] Create supervisor and crew member quick-select
- [ ] Add form template selection (Phase 1: default template only)
- [ ] Implement form duplication from header data

**Form Header Validation:**

- [ ] Create loose validation for required fields
- [ ] Implement field completion indicators
- [ ] Add form header progress tracking
- [ ] Create header data persistence and auto-save
- [ ] Implement header data export for PDF generation

**Essential Accessibility (Phase 1):**

- [ ] Add proper form labels and field associations
- [ ] Implement logical tab order for form navigation
- [ ] Add error announcements for screen readers
- [ ] Ensure all form controls meet 44px touch target minimum
- [ ] Add autocomplete attributes for better form filling

### **Phase 5.4: Module Integration & Testing (Week 2)**

**Cross-Module Integration:**

- [ ] Integrate all three modules with main form system
- [ ] Implement module data synchronization
- [ ] Create module state management and persistence
- [ ] Add module validation and error handling
- [ ] Implement module progress tracking integration

**Performance Optimization:**

- [ ] Optimize photo loading and caching
- [ ] Implement signature canvas performance tuning
- [ ] Add lazy loading for module components
- [ ] Create module data compression strategies
- [ ] Implement efficient module state updates

**Testing & Quality Assurance:**

- [ ] Create unit tests for each module component
- [ ] Implement integration tests for module interactions
- [ ] Add accessibility testing for all modules
- [ ] Create mobile device testing protocols
- [ ] Implement performance benchmarking

**Documentation & Standards:**

- [ ] Document module APIs and interfaces
- [ ] Create module usage guidelines
- [ ] Add troubleshooting guides for common issues
- [ ] Document accessibility features and compliance
- [ ] Create module customization documentation

---

**Chapter 5 Success Criteria:**

- ✅ Photo module supports camera capture on mobile/tablet
- ✅ Signature module handles multiple signatures with canvas drawing
- ✅ Form header manages project metadata efficiently
- ✅ All modules meet Phase 1 accessibility requirements
- ✅ Modules integrate seamlessly with form system
- ✅ Performance targets met for all module operations
- ✅ Comprehensive testing coverage for all modules

---

## Chapter 6: Data Persistence & Form Operations + Error Handling Integration + Performance Budgets + Data Sanitization

### 📋 **Chapter Overview**

- [ ] This chapter implements the fundamental CRUD operations that make HrdHat functional, **WITH** the comprehensive error handling infrastructure from Chapter 4 fully integrated **AND** performance budgets established to ensure optimal operation on construction site devices **AND** comprehensive data sanitization to prevent XSS attacks and ensure data integrity.

### 🏗️ **Feature Architecture Notes**

**Feature Folder Structure (Updated with Error Handling + Security Integration):**

- [ ] Create `frontend/src/features/form/` # Core form functionality
- [ ] Create `frontend/src/features/form/components/modules/` # Individual form modules
- [ ] Create `frontend/src/features/form/components/workflows/` # Quick Fill & Guided modes
- [ ] Create `frontend/src/features/form/components/shared/` # Shared form components
- [ ] Create `frontend/src/features/form/hooks/`
- [ ] Create `frontend/src/features/form/services/` # CRUD operations with error handling integration
- [ ] Create `frontend/src/features/form/stores/` # Form state management with backup integration
- [ ] Create `frontend/src/features/form/types/`
- [ ] Create `frontend/src/features/form/security/` **← NEW: Form data sanitization**
- [ ] Create `frontend/src/features/dashboard/` # Form lists, navigation, overview
- [ ] Create `frontend/src/features/offline-sync/` # localStorage backup, sync when online
- [ ] **Error handling integration**: All form operations will use the error handling infrastructure from Chapter 4
- [ ] **Performance optimization**: All form operations will implement performance budgets and monitoring
- [ ] **Security integration**: All form operations will implement comprehensive data sanitization

**Module Definitions Reference:**

- [ ] **Source**: `c:\Users\Pawel\HRDhat\HRDhat\HrdHatFLRApdf.html`
- [ ] **Modules Identified**: General Information, FLRA Pre-Job Checklist, PPE & Platform Inspection, Task/Hazard/Control, Signatures, Photos (missing from HTML)
- [ ] **Implementation**: Each module becomes a component in `features/form/components/modules/` with error boundaries
- [ ] **Performance Limits**: Task/Hazard/Control (6 entries max), Photos (5 max), Signatures (20 workers + 1 supervisor max)
- [ ] **Security**: All user input sanitized before storage, XSS protection on all text fields

### 🎯 **Core Operations to Implement (With Error Protection + Performance Optimization + Data Sanitization):**

1. [ ] **Create New Form**: Instantiate blank form with default module structure + immediate backup + error boundaries + **performance monitoring** + **input sanitization**
2. [ ] **Save Form Data**: Debounced auto-save to JSONB storage + error queue management + data integrity checks + **optimized payload size** + **sanitized data storage**
3. [ ] **Load Form**: Retrieve and hydrate form state from database + corruption detection + recovery + **progressive loading** + **sanitized data display**
4. [ ] **Modify Form**: Update existing form data in real-time + conflict resolution + backup sync + **debounced updates** + **real-time sanitization**
5. [ ] **Archive Form**: Auto-archive after 16 hours + data integrity checks + error logging + **cleanup optimization**
6. [ ] **Form Lifecycle Management**: Active (max 5) vs Archived states + error boundaries + state recovery + **memory management**
7. [ ] **Device Switching**: JSON serialization for cross-device editing + sync conflict handling + data validation + **optimized sync** + **secure data transfer**
8. [ ] **Offline Resilience**: localStorage backup for network issues + retry queue + integrity verification + **storage limits** + **encrypted local storage**

### 🔒 **Data Sanitization Requirements (Chapter 6):**

**Input Sanitization Strategy:**

- **All Text Fields**: Sanitize using DOMPurify before storage and display
- **JSONB Storage**: Validate and sanitize all data before database insertion
- **File Uploads**: Validate file types, scan for malicious content
- **User-Generated Content**: Strip all HTML tags, prevent script injection
- **Cross-Device Sync**: Sanitize data during sync operations

### ⚡ **Performance Budgets & Limits (Chapter 6):**

```typescript
interface Chapter6PerformanceLimits {
  formData: {
    maxActiveFormsInMemory: 3;        // Prevent memory bloat
    maxFormSizeInMemory: 15MB;        // 5 photos × 3MB average
    maxDOMNodesPerForm: 200;          // Manageable DOM size
    autoSaveDebounce: 800;            // Balance responsiveness vs performance
  };
  storage: {
    maxLocalStorageUsage: 50MB;       // Browser storage limit
    maxCachedForms: 5;                // Offline form cache
    cleanupThreshold: 40MB;           // Trigger cleanup at 80% capacity
  };
  network: {
    maxConcurrentRequests: 3;         // Prevent network congestion
    autoSaveTimeout: 5000;            // 5 second timeout
    retryBackoffMax: 30000;           // 30 second max retry delay
  };
  security: {
    sanitizationTimeout: 100;         // Max time for input sanitization
    maxInputLength: 10000;            // Prevent DoS via large inputs
    validationCacheSize: 1000;        // Cache sanitization results
  };
}
```

### **MODIFIED CHAPTER 6 PHASES (With Error Handling + Performance + Security Integration):**

**Phase 6.1: CRUD Operations with Error Protection + Performance Budgets + Data Sanitization + Essential Accessibility (Week 1)**

- [ ] Integrate form_instances CRUD with error boundaries from Chapter 4
- [ ] Implement auto-save with `AutoSaveManager` and `OfflineErrorQueue`
- [ ] Add data integrity checks using `DataIntegrityManager`
- [ ] **NEW**: Establish performance budgets and monitoring
- [ ] **NEW**: Implement form data size limits and validation
- [ ] **NEW**: Add memory usage tracking and cleanup
- [ ] **NEW**: Implement comprehensive input sanitization
- [ ] **NEW**: Add XSS protection for all text inputs
- [ ] **NEW**: Create secure JSONB storage with validation
- [ ] **NEW A11Y**: Implement 48px minimum touch targets for work glove compatibility
- [ ] **NEW A11Y**: Add construction worker-friendly labels ("Safety Check" vs "Risk Assessment Module")
- [ ] **NEW A11Y**: Ensure clear "(Required)" text for required fields
- [ ] Test CRUD operations with simulated network failures, performance constraints, XSS attacks, and work glove usability

**Phase 6.2: Form Lifecycle with Error Recovery + Memory Management + Secure Storage + Touch Accessibility (Week 2)**

- [ ] Build form lifecycle system with error boundaries
- [ ] Integrate `FormBackupManager` for crash recovery
- [ ] Add device switching support with conflict resolution
- [ ] **NEW**: Implement memory management for active forms (max 3 in memory)
- [ ] **NEW**: Add localStorage cleanup and optimization
- [ ] **NEW**: Optimize form serialization for device switching
- [ ] **NEW**: Implement encrypted local storage for sensitive data
- [ ] **NEW**: Add secure data transfer protocols for device switching
- [ ] **NEW A11Y**: Implement 8px spacing between touch targets to prevent accidental touches
- [ ] **NEW A11Y**: Add immediate response (no double-tap delays) for construction site efficiency
- [ ] **NEW A11Y**: Test form operations with thick work gloves
- [ ] Test form state recovery under various error conditions, memory constraints, security threats, and accessibility scenarios

**Phase 6.3: Offline Sync with Error Management + Storage Optimization + Security Validation (Week 3)**

- [ ] Implement offline form operations with error queue
- [ ] Build sync conflict resolution using error handling infrastructure
- [ ] Add form state management with backup integration
- [ ] **NEW**: Implement storage limits and cleanup strategies
- [ ] **NEW**: Optimize offline sync payload sizes
- [ ] **NEW**: Add network request throttling and batching
- [ ] **NEW**: Implement data validation during sync operations
- [ ] **NEW**: Add security checks for sync data integrity
- [ ] Test offline form completion and error recovery with storage constraints and security validation

**Phase 6.4: Integration & Validation + Performance Testing + Security Auditing (Week 4)**

- [ ] Build form list interfaces with error states
- [ ] Integrate all error handling systems with form operations
- [ ] Test create → save → load → modify → archive workflow with error scenarios
- [ ] Verify data protection under all failure conditions
- [ ] **NEW**: Comprehensive performance testing on target devices
- [ ] **NEW**: Validate performance budgets are met
- [ ] **NEW**: Test memory usage under stress conditions
- [ ] **NEW**: Comprehensive security testing and XSS vulnerability assessment
- [ ] **NEW**: Validate data sanitization effectiveness
- [ ] **NEW**: Test secure storage and transfer mechanisms

### 🔧 **Security Implementation Details (Chapter 6):**

**Comprehensive Input Sanitization:**

```typescript
import DOMPurify from 'dompurify';

// Secure form data handler with comprehensive sanitization
const useSecureFormData = () => {
  const sanitizeFormInput = (input: any, fieldType: string): any => {
    if (typeof input === 'string') {
      switch (fieldType) {
        case 'text':
          return DOMPurify.sanitize(input, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
            MAX_LENGTH: 1000,
          });

        case 'projectName':
        case 'taskDescription':
        case 'hazardDescription':
          // High-risk fields that could contain malicious content
          return DOMPurify.sanitize(input, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
            MAX_LENGTH: 500,
          }).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        case 'email':
          return DOMPurify.sanitize(input.toLowerCase().trim(), {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
          });

        case 'phone':
          return input.replace(/[^\d\-\+\(\)\s]/g, '');

        default:
          return DOMPurify.sanitize(input, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
          });
      }
    }

    if (Array.isArray(input)) {
      return input.map(item => sanitizeFormInput(item, fieldType));
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = sanitizeFormInput(value, key);
      }
      return sanitized;
    }

    return input; // Numbers, booleans, null are safe
  };

  const saveSecureFormData = async (formData: FormData) => {
    // 1. Sanitize all input data
    const sanitizedData = sanitizeFormInput(formData, 'form');

    // 2. Validate data structure
    if (!validateFormStructure(sanitizedData)) {
      throw new Error('Invalid form data structure');
    }

    // 3. Add data integrity hash
    const dataWithHash = {
      ...sanitizedData,
      metadata: {
        ...sanitizedData.metadata,
        dataIntegrityHash: generateDataHash(sanitizedData),
        lastSanitized: new Date().toISOString(),
      },
    };

    // 4. Save to database (triggers will perform additional server-side sanitization)
    await supabase.from('form_instances').upsert(dataWithHash);

    return dataWithHash;
  };

  return { sanitizeFormInput, saveSecureFormData };
};
```

**Secure Auto-save with Performance Monitoring:**

```typescript
// Performance-optimized auto-save with security
const useSecureAutoSave = (formData, moduleType) => {
  const [saveMetrics, setSaveMetrics] = useState({
    lastSaveTime: 0,
    averageSaveTime: 0,
    payloadSize: 0,
    sanitizationTime: 0,
  });

  const debouncedSecureSave = useMemo(
    () =>
      debounce(async data => {
        const startTime = performance.now();

        // 1. Sanitize data (with timing)
        const sanitizationStart = performance.now();
        const sanitizedData = sanitizeFormInput(data, moduleType);
        const sanitizationTime = performance.now() - sanitizationStart;

        // 2. Check payload size
        const payloadSize = new Blob([JSON.stringify(sanitizedData)]).size;

        // 3. Security check: Warn if payload is suspiciously large
        if (payloadSize > 2 * 1024 * 1024) {
          // 2MB warning
          console.warn(
            `Large form payload detected: ${payloadSize} bytes - possible attack?`
          );
        }

        // 4. Performance check: Warn if sanitization is slow
        if (sanitizationTime > 100) {
          // 100ms warning
          console.warn(
            `Slow sanitization detected: ${sanitizationTime}ms - possible DoS?`
          );
        }

        // 5. Save with error handling
        await saveFormDataSecurely(sanitizedData);

        const totalSaveTime = performance.now() - startTime;
        setSaveMetrics(prev => ({
          lastSaveTime: totalSaveTime,
          averageSaveTime: (prev.averageSaveTime + totalSaveTime) / 2,
          payloadSize,
          sanitizationTime,
        }));
      }, DEBOUNCE_CONFIG[moduleType]),
    [moduleType]
  );

  return { debouncedSecureSave, saveMetrics };
};
```

**Secure Local Storage with Encryption:**

```typescript
// Encrypted local storage for sensitive form data
class SecureFormStorage {
  private encryptionKey: string;

  constructor() {
    this.encryptionKey = this.generateOrRetrieveKey();
  }

  async storeFormData(formId: string, formData: any) {
    // 1. Sanitize data before storage
    const sanitizedData = sanitizeFormInput(formData, 'form');

    // 2. Encrypt sensitive data
    const encryptedData = await this.encryptData(sanitizedData);

    // 3. Store with integrity hash
    const storageData = {
      data: encryptedData,
      hash: generateDataHash(sanitizedData),
      timestamp: Date.now(),
      version: '1.0',
    };

    localStorage.setItem(`form_${formId}`, JSON.stringify(storageData));
  }

  async retrieveFormData(formId: string) {
    const stored = localStorage.getItem(`form_${formId}`);
    if (!stored) return null;

    try {
      const storageData = JSON.parse(stored);

      // 1. Decrypt data
      const decryptedData = await this.decryptData(storageData.data);

      // 2. Verify integrity
      const currentHash = generateDataHash(decryptedData);
      if (currentHash !== storageData.hash) {
        throw new Error('Data integrity check failed - possible tampering');
      }

      // 3. Sanitize again (defense in depth)
      return sanitizeFormInput(decryptedData, 'form');
    } catch (error) {
      console.error('Failed to retrieve secure form data:', error);
      return null;
    }
  }

  private async encryptData(data: any): Promise<string> {
    // Simple encryption for demo - use proper crypto in production
    const jsonString = JSON.stringify(data);
    return btoa(jsonString); // Base64 encoding (replace with proper encryption)
  }

  private async decryptData(encryptedData: string): Promise<any> {
    // Simple decryption for demo - use proper crypto in production
    const jsonString = atob(encryptedData); // Base64 decoding
    return JSON.parse(jsonString);
  }
}
```

### ♿ **Phase 1 Essential Accessibility Implementation Details (Chapters 6-8):**

**Touch Target Implementation (Chapter 6):**

```typescript
// Construction site touch target standards
const TOUCH_TARGETS = {
  minimum: 48,        // Larger than WCAG 44px for work gloves
  primary: 56,        // Primary buttons for critical actions
  spacing: 8,         // Minimum spacing between targets
  immediate: true,    // No double-tap delays
};

// Touch-friendly form controls
const FormButton = ({ children, ...props }) => {
  return (
    <button
      className="min-h-[48px] min-w-[48px] px-4 py-3 m-1"
      style={{
        minHeight: '48px',
        minWidth: '48px',
        margin: '4px', // 8px total spacing
        touchAction: 'manipulation' // Disable double-tap zoom
      }}
      {...props}
    >
      {children}
    </button>
  );
};
```

**Keyboard Navigation Implementation (Chapter 7):**

```typescript
// Complete keyboard navigation for form modules
const useKeyboardNavigation = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Tab':
        // Default browser behavior - move to next/previous field
        break;
      case 'Enter':
        // Submit/Activate current element
        event.preventDefault();
        activateCurrentElement();
        break;
      case 'Escape':
        // Cancel/Close current operation
        event.preventDefault();
        cancelCurrentOperation();
        break;
      case 'Space':
        // Toggle checkbox/button
        if (isToggleable(event.target)) {
          event.preventDefault();
          toggleElement(event.target);
        }
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        // Navigate within modules (radio groups, lists)
        if (isWithinModule(event.target)) {
          event.preventDefault();
          navigateWithinModule(event.key);
        }
        break;
    }
  };

  return { handleKeyDown };
};

// Focus indicator implementation
const FOCUS_STYLES = {
  outline: '3px solid #0066cc',
  outlineOffset: '2px',
  borderRadius: '4px',
};
```

**High Contrast Implementation (Chapter 8):**

```typescript
// Construction site high contrast theme
const HIGH_CONTRAST_THEME = {
  colors: {
    text: '#000000',           // Pure black text
    background: '#ffffff',     // Pure white background
    border: '#000000',         // Black borders
    error: '#cc0000',          // High contrast red for errors
    success: '#006600',        // High contrast green for success
  },
  contrast: {
    minimum: 4.5,              // WCAG AA standard
    preferred: 7.0,            // Better for outdoor use
    textShadow: '1px 1px 0px rgba(255,255,255,0.8)', // White shadow on dark text
  },
  borders: {
    width: '2px',              // Bold borders for visibility
    style: 'solid',
  },
};

// Outdoor visibility component
const OutdoorReadableText = ({ children, ...props }) => {
  return (
    <span
      style={{
        color: HIGH_CONTRAST_THEME.colors.text,
        textShadow: HIGH_CONTRAST_THEME.contrast.textShadow,
        fontWeight: '600', // Semi-bold for better visibility
      }}
      {...props}
    >
      {children}
    </span>
  );
};
```

**Construction Worker Language Implementation (All Chapters):**

```typescript
// Construction worker-friendly labels and messages
const CONSTRUCTION_LANGUAGE = {
  labels: {
    // Replace technical terms with construction-friendly language
    'Risk Assessment Module': 'Safety Check',
    Submit: 'Complete Safety Form',
    'Task/Hazard/Control Matrix': 'Job Safety Steps',
    'PPE Inspection': 'Safety Gear Check',
    'Field Level Risk Assessment': 'Daily Safety Form',
  },

  errorMessages: {
    required: 'This safety information is required',
    invalid: 'Please check this information',
    networkError: 'Connection lost - your work is saved locally',
    saveError: 'Could not save - trying again automatically',
  },

  confirmations: {
    formSaved: 'Your safety form has been saved',
    formSubmitted: 'Safety form completed successfully',
    photoUploaded: 'Photo added to safety record',
  },
};
```

---

## Chapter 7: Form Workflows + Advanced Error Management + Auto-save Performance

### 📋 **Chapter Overview**

- [ ] Now that core data operations work with comprehensive error protection and performance budgets, implement the two form interaction modes with advanced validation, offline error management, **and optimized auto-save performance with data limits**.

### 🏗️ **Feature Architecture Notes**

**Additional Features for Form Workflows:**

- [ ] Create `frontend/src/features/form/components/workflows/QuickFillMode.tsx`
- [ ] Create `frontend/src/features/form/components/workflows/GuidedMode.tsx`
- [ ] Create `frontend/src/features/form/components/workflows/ModeSwitch.tsx`
- [ ] Create `frontend/src/features/form/components/modules/GeneralInformation.tsx`
- [ ] Create `frontend/src/features/form/components/modules/PreJobChecklist.tsx`
- [ ] Create `frontend/src/features/form/components/modules/PPEPlatform.tsx`
- [ ] Create `frontend/src/features/form/components/modules/TaskHazardControl.tsx` **← 6 entries max**
- [ ] Create `frontend/src/features/form/components/modules/Signatures.tsx` **← 20 workers + 1 supervisor max**
- [ ] Create `frontend/src/features/form/components/modules/Photos.tsx` **← 5 photos max**
- [ ] Create `frontend/src/features/photo-capture/` # Camera integration, image compression
- [ ] Create `frontend/src/features/pdf-generation/` # PDF creation from completed forms

**Module Reference Implementation:**

- [ ] **Source**: Use `HrdHatFLRApdf.html` as exact field definition reference
- [ ] **Mapping**: HTML form fields → TypeScript interfaces → JSONB structure
- [ ] **Validation**: Each module component handles its own validation rules
- [ ] **Performance**: Each module implements data limits and optimized rendering

### ⚡ **Data Limits & Performance Impact (Chapter 7):**

```typescript
interface ModulePerformanceLimits {
  taskHazardControl: {
    maxEntries: 6;           // Prevents DOM explosion
    estimatedDOMNodes: 36;   // 6 entries × 6 fields each
    impact: 'LOW';           // Manageable array size
    autoSaveDebounce: 1200;  // Extra time for complex data
  };
  photos: {
    maxPhotos: 5;            // Mobile storage friendly
    maxFileSize: 5 * 1024 * 1024; // 5MB per photo
    totalMaxSize: 25 * 1024 * 1024; // 25MB total
    impact: 'MEDIUM';        // Controlled memory usage
    compressionQuality: 0.8; // Balance quality vs size
    maxDimensions: { width: 1920, height: 1080 };
  };
  signatures: {
    maxWorkers: 20;          // Large crew support
    maxSupervisors: 1;       // Single supervisor
    estimatedCanvasNodes: 21; // 20 workers + 1 supervisor
    impact: 'MEDIUM';        // Predictable canvas load
    canvasOptimization: true; // Use blob URLs, not base64
  };
}
```

### **MODIFIED CHAPTER 7 PHASES (With Advanced Error Handling + Performance Optimization):**

**Phase 7.1: Module Architecture with Data Limits + Essential Accessibility (Week 1)**

- [ ] Implement module-based architecture with error boundaries
- [ ] **NEW**: Enforce data limits in each module (6 tasks, 5 photos, 20 signatures)
- [ ] **NEW**: Implement blob storage for photos (not base64 in JSONB)
- [ ] **NEW**: Add canvas optimization for signatures
- [ ] **NEW**: Create performance monitoring for each module
- [ ] **NEW A11Y**: Implement keyboard navigation (Tab/Shift+Tab/Enter/Escape/Space/Arrow keys)
- [ ] **NEW A11Y**: Add visible focus indicators (3px solid blue outline) on all interactive elements
- [ ] **NEW A11Y**: Ensure logical tab order through all form modules
- [ ] Test module performance under maximum data limits and keyboard-only navigation

**Phase 7.2: Form Workflows with Optimized Auto-save + Keyboard Navigation (Week 2)**

- [ ] Create Quick Fill mode with real-time validation
- [ ] Create Guided mode with step-by-step error checking
- [ ] Connect to data persistence with error handling
- [ ] Add mode switching with state preservation
- [ ] **NEW**: Implement optimized auto-save with module-specific debouncing
- [ ] **NEW**: Add auto-save performance monitoring and feedback
- [ ] **NEW**: Optimize payload sizes for different module types
- [ ] **NEW A11Y**: Complete keyboard navigation implementation across both modes
- [ ] **NEW A11Y**: Add keyboard shortcuts (Enter=Submit/Activate, Escape=Cancel/Close, Space=Toggle)
- [ ] **NEW A11Y**: Test complete form workflow using only keyboard input

**Phase 7.3: Validation & Error Display + Performance Feedback + Clear Error Messages (Week 3)**

- [ ] Implement real-time validation system
- [ ] Create error display components (inline, toast, modal)
- [ ] Build notification system for offline/sync status
- [ ] Test form workflows with validation errors
- [ ] **NEW**: Add performance feedback in auto-save indicators
- [ ] **NEW**: Implement "breathing room" animations during processing
- [ ] **NEW**: Add data limit warnings and guidance
- [ ] **NEW A11Y**: Implement clear, actionable error messages for construction workers
- [ ] **NEW A11Y**: Add multiple error indicators (visual, text, focus management)
- [ ] **NEW A11Y**: Ensure critical errors are always visible, never hidden
- [ ] **NEW A11Y**: Test error message comprehension with construction worker language

**Phase 7.4: Workflow Integration + Performance Testing (Week 4)**

- [ ] Test offline form completion and sync
- [ ] Verify both modes produce identical JSONB data
- [ ] Validate error recovery workflows
- [ ] Test validation system across all modules
- [ ] **NEW**: Comprehensive performance testing with maximum data loads
- [ ] **NEW**: Validate auto-save performance under stress
- [ ] **NEW**: Test memory usage with all modules at capacity

### 🔧 **Performance Implementation Details (Chapter 7):**

**Photo Module Optimization:**

```typescript
// Photo upload with blob optimization and limits
const useOptimizedPhotoUpload = () => {
  const [photoMetrics, setPhotoMetrics] = useState({
    totalSize: 0,
    compressionRatio: 0,
    uploadTime: 0,
  });

  const uploadPhoto = async (file: File) => {
    // Enforce photo limits
    if (photos.length >= 5) {
      throw new Error('Maximum 5 photos allowed per form');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Photo must be smaller than 5MB');
    }

    const startTime = performance.now();

    // 1. Create immediate blob URL for preview
    const blobUrl = URL.createObjectURL(file);

    // 2. Compress image client-side
    const compressedFile = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8,
      format: 'webp',
    });

    // 3. Upload to Supabase Storage
    const { data } = await supabase.storage
      .from('form-photos')
      .upload(`${formId}/${photoId}`, compressedFile);

    const uploadTime = performance.now() - startTime;
    const compressionRatio = compressedFile.size / file.size;

    setPhotoMetrics(prev => ({
      totalSize: prev.totalSize + compressedFile.size,
      compressionRatio: (prev.compressionRatio + compressionRatio) / 2,
      uploadTime,
    }));

    // 4. Store only URL in JSONB (not base64)
    return {
      id: photoId,
      storageUrl: data.publicUrl,
      thumbnailUrl: await generateThumbnail(compressedFile),
      fileSize: compressedFile.size,
      timestamp: new Date().toISOString(),
    };
  };

  return { uploadPhoto, photoMetrics };
};
```

**Task/Hazard/Control Module with Limits:**

```typescript
// Task/Hazard/Control with 6 entry limit
const TaskHazardControlModule = () => {
  const [entries, setEntries] = useState([]);
  const maxEntries = 6;

  const addEntry = () => {
    if (entries.length >= maxEntries) {
      showWarning(`Maximum ${maxEntries} tasks allowed for optimal performance`);
      return;
    }

    setEntries(prev => [...prev, createNewEntry()]);
  };

  const removeEntry = (index) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  };

  // Performance monitoring
  const estimatedDOMNodes = entries.length * 6; // 6 fields per entry
  const performanceImpact = estimatedDOMNodes > 30 ? 'MEDIUM' : 'LOW';

  return (
    <div className="task-hazard-module">
      <div className="module-header">
        <h3>Task/Hazard/Control Assessment</h3>
        <div className="entry-counter">
          {entries.length} / {maxEntries} tasks
          {performanceImpact === 'MEDIUM' && (
            <span className="performance-warning">
              Consider fewer tasks for better performance
            </span>
          )}
        </div>
      </div>

      {entries.map((entry, index) => (
        <TaskHazardEntry
          key={entry.id}
          entry={entry}
          onUpdate={(updatedEntry) => updateEntry(index, updatedEntry)}
          onRemove={() => removeEntry(index)}
        />
      ))}

      <button
        onClick={addEntry}
        disabled={entries.length >= maxEntries}
        className="add-entry-button"
      >
        {entries.length >= maxEntries
          ? `Maximum ${maxEntries} tasks reached`
          : 'Add Task'
        }
      </button>
    </div>
  );
};
```

---

## Chapter 8: Frontend Layout + Error UI Integration + Loading States & Animations

### 📋 **Chapter Overview**

- [ ] With core functionality, comprehensive error handling, and performance optimization working, implement the responsive layout system with integrated error state displays, user feedback systems, **and "breathing room" animations that provide clear feedback during processing**.

### 🎯 **Key Areas to Define:**

1. [ ] **Layout Components**: Header, navigation, content areas, sidebars, drawers
2. [ ] **Responsive Behavior**: How layouts adapt across Mobile (0-599px), Tablet (600-1023px), Desktop (1024+px)
3. [ ] **Navigation Patterns**: Sliding sidebar (mobile), persistent sidebar (tablet/desktop), bottom drawer
4. [ ] **Form Layout**: Quick Fill vs Guided mode presentation
5. [ ] **Mobile-Specific Features**: Camera upload, progress tracker, touch-first design
6. [ ] **Performance Feedback**: Loading states, progress indicators, "breathing room" animations

### ⚡ **"Breathing Room" Animation Philosophy (Chapter 8):**

```typescript
interface LoadingStates {
  // Immediate feedback (< 100ms)
  buttonPress: {
    animation: 'gentle-press';
    duration: '150ms';
    feedback: 'haptic-light';
  };

  // Short operations (100ms - 1s)
  formSaving: {
    animation: 'gentle-pulse';
    message: 'Saving your work...';
    minimumDuration: '500ms';
  };

  // Medium operations (1s - 5s)
  photoUploading: {
    animation: 'progress-bar';
    message: 'Uploading photo {current} of {total}...';
    showProgress: true;
    estimatedTime: true;
  };

  // Long operations (5s+)
  pdfGenerating: {
    animation: 'document-building';
    message: 'Generating your FLRA PDF...';
    estimatedTime: '5-10 seconds';
    allowCancel: false;
    showTips: true;
  };
}
```

### **MODIFIED CHAPTER 8 PHASES (With Error UI + Performance Feedback):**

**Phase 8.1: Layout Foundation with Error States + Icon Preloading + High Contrast (Week 1)**

- [ ] Implement responsive layout components
- [ ] Integrate error boundary displays into layout
- [ ] Add connection status indicators
- [ ] Create error notification positioning system
- [ ] **NEW**: Implement critical icon preloading system
- [ ] **NEW**: Add skeleton loading states for all components
- [ ] **NEW**: Create staggered loading animations
- [ ] **NEW A11Y**: Implement high contrast mode (4.5:1 minimum, 7:1 preferred for outdoor use)
- [ ] **NEW A11Y**: Add black text on white background with 2px solid borders
- [ ] **NEW A11Y**: Implement text shadows for outdoor readability
- [ ] **NEW A11Y**: Eliminate light gray text - use black/white only

**Phase 8.2: Navigation with Error Feedback + Performance Indicators + Outdoor Visibility (Week 2)**

- [ ] Build navigation patterns with error states
- [ ] Implement mobile-specific error displays
- [ ] Add progress tracking with error indicators
- [ ] Create form layout with validation feedback
- [ ] **NEW**: Add auto-save performance indicators
- [ ] **NEW**: Implement "breathing room" minimum loading times
- [ ] **NEW**: Create performance feedback in navigation
- [ ] **NEW A11Y**: Test layout visibility in bright sunlight conditions
- [ ] **NEW A11Y**: Validate high contrast ratios across all UI elements
- [ ] **NEW A11Y**: Ensure bold borders (2px minimum) on all form elements

**Phase 8.3: Error UI Components + Loading Animations + Construction Worker UX (Week 3)**

- [ ] Build comprehensive error message templates
- [ ] Implement conflict resolution UI
- [ ] Create offline status displays
- [ ] Add sync progress indicators
- [ ] **NEW**: Implement comprehensive loading state system
- [ ] **NEW**: Add gentle animations for all user interactions
- [ ] **NEW**: Create performance-aware animation timing
- [ ] **NEW A11Y**: Implement construction worker-friendly language throughout UI
- [ ] **NEW A11Y**: Add visual confirmations for important actions
- [ ] **NEW A11Y**: Test UI comprehension with target construction worker audience

**Phase 8.4: Layout Integration & Performance Testing + Accessibility Validation (Week 4)**

- [ ] Test responsive behavior with error states
- [ ] Verify error UI across all breakpoints
- [ ] Validate touch-friendly error interactions
- [ ] Test accessibility of error feedback
- [ ] **NEW**: Performance testing of animations and loading states
- [ ] **NEW**: Validate "breathing room" timing feels natural
- [ ] **NEW**: Test layout performance on target devices
- [ ] **NEW A11Y**: Comprehensive accessibility testing (touch targets, keyboard navigation, contrast)
- [ ] **NEW A11Y**: Validate work glove compatibility across all breakpoints
- [ ] **NEW A11Y**: Test outdoor visibility and construction site usability

### 🔧 **Performance Implementation Details (Chapter 8):**

**Critical Icon Preloading:**

```typescript
const CRITICAL_ICONS = [
  // Form interaction icons
  '/icons/camera.svg', // Photo capture
  '/icons/signature.svg', // Signature module
  '/icons/hazard-warning.svg', // Risk assessment
  '/icons/ppe-helmet.svg', // Safety equipment

  // Feedback icons
  '/icons/save-spinner.svg', // Auto-save indicator
  '/icons/success-check.svg', // Save confirmation
  '/icons/error-warning.svg', // Error states
  '/icons/loading-dots.svg', // General loading

  // Navigation icons
  '/icons/menu-hamburger.svg', // Mobile menu
  '/icons/back-arrow.svg', // Navigation
  '/icons/forward-arrow.svg', // Guided mode
];

// Preload during app initialization
const preloadCriticalIcons = async () => {
  const preloadPromises = CRITICAL_ICONS.map(iconPath => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = iconPath;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  });

  await Promise.allSettled(preloadPromises);
};
```

**Breathing Room Auto-save Indicator:**

```typescript
const AutoSaveIndicator = ({ saveState, lastSaved, performanceMetrics }) => {
  const MINIMUM_LOADING_TIMES = {
    moduleTransition: 300,    // Always show transition for 300ms
    saveConfirmation: 1500,   // Show "saved" for 1.5s
    photoProcessing: 800,     // Minimum processing feedback
    formSubmission: 2000,     // Build anticipation for PDF generation
    errorDisplay: 3000,       // Give time to read error messages
  };

  const getIndicatorContent = () => {
    switch (saveState) {
      case 'pending':
        return (
          <div className="save-pending">
            <DotsIcon className="gentle-pulse" />
            <span>Changes pending...</span>
          </div>
        );

      case 'saving':
        return (
          <div className="save-active">
            <SpinnerIcon className="gentle-spin" />
            <span>Saving your work...</span>
            {performanceMetrics?.payloadSize > 1024 * 1024 && (
              <small>Large form - this may take a moment</small>
            )}
          </div>
        );

      case 'saved':
        return (
          <div className="save-success fade-in">
            <CheckIcon className="success-bounce" />
            <span>Saved {formatTimeAgo(lastSaved)}</span>
            {performanceMetrics?.lastSaveTime > 2000 && (
              <small>Slow save detected - check connection</small>
            )}
          </div>
        );

      case 'error':
        return (
          <div className="save-error">
            <WarningIcon className="gentle-shake" />
            <span>Save failed - trying again...</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auto-save-indicator">
      {getIndicatorContent()}
    </div>
  );
};
```

---

## Chapter 9: PDF Generation + Error Recovery Testing + Performance Optimization

### 📋 **Chapter Overview**

- [ ] Generate construction-site friendly PDFs with comprehensive error handling for generation failures, data integrity issues, robust error recovery testing across all systems, **and optimized PDF generation performance**.

### ⚡ **PDF Performance Targets (Chapter 9):**

```typescript
interface PDFPerformanceTargets {
  generation: {
    maxGenerationTime: 10000;     // 10 seconds maximum
    targetGenerationTime: 5000;   // 5 seconds target
    maxMemoryUsage: 50 * 1024 * 1024; // 50MB during generation
    maxPDFSize: 10 * 1024 * 1024;     // 10MB final PDF
  };
  userExperience: {
    showProgressAfter: 1000;      // Show progress after 1 second
    estimatedTimeDisplay: true;   // Show estimated completion time
    allowBackgroundGeneration: false; // Keep user engaged
    minimumFeedbackTime: 2000;    // Minimum "generating" display
  };
  optimization: {
    imageCompression: 0.7;        // Compress images in PDF
    fontSubsetting: true;         // Only include used font characters
    streamGeneration: true;       // Generate PDF in chunks
    memoryCleanup: true;          // Clean up during generation
  };
}
```

### **MODIFIED CHAPTER 9 PHASES (With PDF Error Handling + Performance Optimization):**

**Phase 9.1: PDF Generation with Error Handling + Performance Monitoring (Week 1)**

- [ ] Evaluate PDF libraries with error handling capabilities
- [ ] Implement `DataIntegrityManager` for PDF data validation
- [ ] Create PDF generation with failure recovery
- [ ] Add PDF template error checking
- [ ] **NEW**: Implement PDF generation performance monitoring
- [ ] **NEW**: Add memory usage tracking during PDF generation
- [ ] **NEW**: Create PDF generation progress indicators

**Phase 9.2: PDF Error Management + Generation Optimization (Week 2)**

- [ ] Build PDF generation error boundaries
- [ ] Implement retry logic for failed PDF generation
- [ ] Create fallback PDF templates
- [ ] Add PDF corruption detection
- [ ] **NEW**: Optimize PDF generation speed and memory usage
- [ ] **NEW**: Implement streaming PDF generation for large forms
- [ ] **NEW**: Add image compression and optimization

**Phase 9.3: Integration & Testing + Performance Validation (Week 3)**

- [ ] Test PDF generation under various error conditions
- [ ] Verify PDF data integrity checks
- [ ] Test cross-device PDF generation
- [ ] Validate PDF error recovery workflows
- [ ] **NEW**: Performance testing with maximum form data
- [ ] **NEW**: Memory stress testing during PDF generation
- [ ] **NEW**: Validate PDF generation times meet targets

**Phase 9.4: Comprehensive Error Testing + Performance Optimization (Week 4)**

- [ ] Comprehensive error scenario testing across all features
- [ ] Performance testing with error handling overhead
- [ ] User acceptance testing for error messages
- [ ] Final integration testing of all error systems
- [ ] **NEW**: End-to-end performance testing across all features
- [ ] **NEW**: Performance regression testing
- [ ] **NEW**: Final performance budget validation

---

## Chapter 10: Version Control & Git Workflow

### 📋 **Chapter Overview**

- [ ] Implement development workflow using the established multi-repository architecture with automated git scripts. Focus on coordinating frontend and backend development cycles while maintaining separation.

### CHAPTER 10 PHASES:

**Phases:**

1. [ ] **Use established multi-repo workflow**: Work within existing frontend/backend repository structure.
2. [ ] **Implement feature branches per repository**: Separate feature development in appropriate repository.
3. [ ] **Use automated git scripts**: Leverage existing ./git-auto-push.sh for consistent workflow.
4. [ ] **Coordinate cross-repo features**: Develop frontend and backend changes separately, coordinate integration.
5. [ ] **Follow established review process**: Use existing review standards and quality checks.

**Notes:**

- [ ] Each repository has its own branching strategy
- [ ] Use automated scripts for commits and pushes
- [ ] Coordinate but don't merge frontend/backend changes
- [ ] Follow established naming conventions and architectural rules

---

## 🚨 **COMPREHENSIVE SUCCESS CRITERIA (Including Performance & Security)**

### **Technical Metrics (Per Chapter)**

- [ ] **Chapter 4**: Error handling infrastructure 100% operational, zero data loss in crash tests
- [ ] **Chapter 6**: Zero data loss during CRUD operations, < 5s recovery time, 100% offline capability, **< 400ms auto-save response**, **100% input sanitization coverage**
- [ ] **Chapter 7**: 100% form completion capability offline, 95% error recovery success, seamless device switching, **data limits enforced (6/5/20)**, **XSS protection on all text inputs**
- [ ] **Chapter 8**: User-friendly error displays, 90% error message comprehension, intuitive error recovery, **< 2.5s initial page load**, **CSP headers implemented**
- [ ] **Chapter 9**: 100% PDF generation reliability, robust failure recovery, comprehensive error testing, **< 10s PDF generation**, **secure PDF content sanitization**

### **User Experience Metrics**

- [ ] **Error Comprehension**: Construction workers understand 90% of error messages without support
- [ ] **Recovery Success**: Users successfully recover from 95% of errors independently
- [ ] **Data Protection**: Zero form data lost due to errors, crashes, or network issues
- [ ] **Offline Resilience**: 100% form functionality available without connectivity
- [ ] **Support Reduction**: < 1% error-related support requests
- [ ] **Performance Satisfaction**: > 4.5/5 rating for app responsiveness
- [ ] **Form Completion Rate**: > 90% of started forms completed
- [ ] **Security Confidence**: > 95% user confidence in data security and privacy

### **Security Metrics (New)**

- [ ] **XSS Prevention**: 100% of user inputs sanitized, zero successful XSS attacks in testing
- [ ] **Data Integrity**: 100% data integrity maintained across all operations
- [ ] **Access Control**: RLS policies prevent 100% of unauthorized data access attempts
- [ ] **Input Validation**: All form inputs validated and sanitized before storage
- [ ] **Secure Storage**: Sensitive data encrypted in local storage and transit
- [ ] **Audit Compliance**: All data access and modifications logged for security auditing
- [ ] **Vulnerability Assessment**: Zero high-severity security vulnerabilities in production

### **Construction Site Validation**

- [ ] **Harsh Conditions**: App survives device drops, extreme temperatures, moisture
- [ ] **Network Variability**: Seamless operation across no signal → poor signal → good signal
- [ ] **Device Switching**: Workers can switch between phone/tablet without data loss
- [ ] **Time Pressure**: Error recovery doesn't impede urgent safety form completion
- [ ] **Performance Consistency**: App maintains responsiveness under all conditions
- [ ] **Security Resilience**: Data remains secure on shared devices and unsecured networks

### **Security Validation (New)**

- [ ] **Shared Device Security**: No data leakage between users on shared construction tablets
- [ ] **Network Security**: Data remains secure over unsecured construction site WiFi
- [ ] **Malicious Input Handling**: App safely handles and sanitizes malicious input attempts
- [ ] **Data Breach Prevention**: Unauthorized access attempts are blocked and logged
- [ ] **Compliance Readiness**: Security measures meet construction industry compliance requirements

---

## 🚋 **CRITICAL IMPLEMENTATION NOTES (Updated with Performance & Security)**

### **🔧 Implementation Strategy**

1. [ ] **Error Boundaries First**: Chapter 4 establishes robust data protection before any feature development
2. [ ] **Performance Built-In**: Performance budgets and monitoring implemented with each feature
3. [ ] **Security Foundation**: Input sanitization and XSS protection implemented from Chapter 2 onwards
4. [ ] **Data Protection Priority**: Form data backup happens before any user interaction
5. [ ] **Offline-First Design**: All features must work offline with error recovery
6. [ ] **User-Friendly Messages**: No technical jargon in error messages for construction workers
7. [ ] **Comprehensive Testing**: Error scenarios, performance testing, and security validation in every chapter
8. [ ] **Data Limits Enforced**: Smart limits prevent performance issues (6/5/20 rule)
9. [ ] **Input Sanitization**: All user input sanitized before storage and display
10. [ ] **RLS Security**: Database-level security enforced via Supabase Row-Level Security

### **🚨 Safety Protocols**

- [ ] **Backend Operations**: All database changes via MCP with error logging
- [ ] **Data Validation**: Multiple validation layers (client, server, integrity checks)
- [ ] **Backup Strategy**: localStorage + server backup + conflict resolution
- [ ] **Recovery Testing**: Simulate crashes, network failures, data corruption in every chapter
- [ ] **Performance Monitoring**: Track performance metrics from day one
- [ ] **Memory Management**: Enforce memory limits and cleanup strategies
- [ ] **Security Auditing**: Regular security testing and vulnerability assessment
- [ ] **Input Sanitization**: DOMPurify sanitization on all user inputs
- [ ] **Data Encryption**: Sensitive data encrypted in local storage and transit

### **🔒 Security Protocols (New)**

- [ ] **XSS Prevention**: All user input sanitized using DOMPurify before storage and display
- [ ] **RLS Enforcement**: Database access controlled via Supabase Row-Level Security policies
- [ ] **Content Security Policy**: Strict CSP headers to prevent script injection
- [ ] **Secure Storage**: Sensitive data encrypted in localStorage and Supabase Storage
- [ ] **Audit Logging**: All data access and modifications logged for security monitoring
- [ ] **Input Validation**: Server-side validation triggers for all JSONB data
- [ ] **Session Security**: Secure session management with automatic cleanup on logout
- [ ] **Vulnerability Testing**: Regular security testing including XSS and injection attacks

### **📊 Monitoring Integration**

- [ ] **Error Logging**: Categorized error tracking from Chapter 4 onwards
- [ ] **Performance Monitoring**: Real-time performance metrics and alerting
- [ ] **Security Monitoring**: Real-time security event logging and alerting
- [ ] **User Feedback**: Error message clarity testing with construction workers
- [ ] **Continuous Improvement**: Weekly error pattern, performance, and security analysis
- [ ] **Performance Budgets**: Automated performance budget enforcement in CI/CD
- [ ] **Security Audits**: Automated security scanning and vulnerability assessment

---

## IMMEDIATE QUESTIONS FOR REVIEW:

1. [ ] **Error Handling Priority**: Should we implement Chapter 4 (Error Handling Foundation) before Chapter 5 (Testing) to ensure error infrastructure is tested? **RECOMMENDED: Yes - Error handling must be foundational.**

2. [ ] **Performance Integration**: Should performance budgets be enforced in CI/CD from Chapter 6 onwards? **RECOMMENDED: Yes - Prevent performance regressions.**

3. [ ] **Data Limits Enforcement**: Should we implement the 6/5/20 limits (tasks/photos/signatures) as hard limits or soft warnings? **RECOMMENDED: Hard limits with user-friendly explanations.**

4. [ ] **Construction Worker Testing**: Should we validate error message clarity and performance satisfaction with actual construction workers? **RECOMMENDED: Yes - Include in user acceptance testing.**

5. [ ] **Performance Monitoring**: Should we implement real-time performance monitoring and alerting from day one? **RECOMMENDED: Yes - Built into each chapter.**

---

## CRITICAL SUCCESS FACTORS:

- [█] **Follow established architecture**: Unidirectional imports, ITCSS styling, TypeScript standards
- [ ] **Implement error handling first**: Chapter 4 establishes robust data protection before any form operations
- [ ] **Build performance in**: Performance budgets and monitoring with each feature
- [ ] **Use MCP workflow**: All database changes through established approval process with error logging
- [ ] **Respect multi-repo structure**: Separate frontend/backend development cycles
- [ ] **Implement JSONB strategy**: Module-based data storage for flexibility with data integrity checks
- [ ] **Focus on construction site UX**: Paper-like PDFs, touch-first mobile design, worker-friendly error messages
- [ ] **Maintain form lifecycle**: Active/archived states with auto-archive and error recovery
- [ ] **Enable device switching**: JSON-based state management for cross-device editing with conflict resolution
- [ ] **Ensure data protection**: Zero data loss under any error conditions
- [ ] **Enforce smart limits**: 6 tasks, 5 photos, 20 signatures maximum for optimal performance
- [ ] **Optimize for mobile**: Blob storage, compressed images, efficient memory usage
