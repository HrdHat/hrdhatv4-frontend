# HrdHat Offline Sync Strategy

**Document Status**: 🚧 In Development  
**Last Updated**: December 2024  
**Addresses**: Plan Audit Critical Gap #7 - Offline Sync Strategy Details

---

## 🎯 **Mission Statement**

HrdHat must function reliably in **construction site environments** where internet connectivity is intermittent, unreliable, or completely unavailable. Our offline sync strategy ensures that workers never lose form data and can seamlessly switch between devices while maintaining data integrity.

---

## 🏗️ **Construction Site Reality**

### **Connectivity Challenges**

- **Remote locations**: Construction sites often lack reliable internet
- **Intermittent signals**: Workers move between areas with varying connectivity
- **Device switching**: Workers start forms on phones, continue on tablets
- **Shift changes**: Forms must survive device handoffs between workers
- **Emergency situations**: Critical safety data must be preserved during unexpected interruptions

### **Data Loss Scenarios**

```typescript
// Critical scenarios our sync strategy must handle
const criticalScenarios = {
  deviceBatteryDeath: 'Worker phone dies mid-form completion',
  browserCrash: 'App crashes during form editing',
  networkFailure: 'Internet connection lost during auto-save',
  deviceSwitching: 'Worker switches from phone to tablet mid-form',
  shiftEnd: 'Worker leaves site with unsaved changes',
  emergencyEvacuation: 'Site emergency requires immediate app closure',
};
```

---

## 🗄️ **Multi-Layer Storage Architecture**

### **Storage Hierarchy**

```typescript
interface StorageArchitecture {
  // Layer 1: Active Working Memory
  reactState: {
    purpose: 'Real-time form editing and UI rendering';
    persistence: 'Memory only - lost on page refresh';
    updateFrequency: 'Every keystroke';
    size: 'Unlimited (within device memory)';
  };

  // Layer 2: Immediate Backup
  localStorage: {
    purpose: 'Form data + metadata backup';
    persistence: 'Survives page refresh and browser restart';
    updateFrequency: 'Debounced 500ms after changes';
    size: '5-10MB total capacity';
    data: 'Text, signatures, photo metadata only';
  };

  // Layer 3: Large File Storage
  cacheAPI: {
    purpose: 'Temporary photo storage for offline access';
    persistence: 'Survives browser restart, not uninstall';
    updateFrequency: 'Immediate on photo capture';
    size: '50-250MB browser managed';
    data: 'Compressed photo files';
  };

  // Layer 4: Permanent Cloud Storage
  supabaseStorage: {
    purpose: 'Permanent form and photo storage';
    persistence: 'Permanent cloud storage';
    updateFrequency: 'When connectivity available';
    size: 'Unlimited';
    data: 'Complete form instances and photos';
  };
}
```

---

## 📱 **Storage Strategy by Data Type**

### **Form Data (localStorage)**

```typescript
interface FormDataStorage {
  // ✅ Perfect for localStorage
  storage: 'localStorage';
  maxSize: '2-3MB for 5 forms';

  data: {
    generalInfo: FormGeneralInfo;
    riskAssessment: RiskAssessmentData;
    taskHazardControl: TaskHazardControlData;
    signatures: SignatureData[]; // Compressed base64
    photoMetadata: PhotoMetadata[]; // URLs and captions only
    formMetadata: FormMetadata;
  };

  // Automatic backup on every change
  autoSave: {
    trigger: 'debounced 500ms after user input';
    method: 'localStorage.setItem()';
    fallback: 'sessionStorage if localStorage full';
  };
}
```

### **Photos (Cache API + Supabase Storage)**

```typescript
interface PhotoStorageStrategy {
  // Temporary storage for offline access
  cacheAPI: {
    purpose: 'Offline photo access and display';
    storage: 'Browser Cache API';
    maxSize: '100MB for 25 photos (5 forms × 5 photos)';
    cleanup: 'Automatic after successful upload';
  };

  // Permanent cloud storage
  supabaseStorage: {
    purpose: 'Permanent photo backup and sync';
    storage: 'Supabase Storage buckets';
    maxSize: 'Unlimited';
    access: 'URL-based with authentication';
  };

  // Photo workflow
  workflow: {
    capture: 'Camera → Compress → Cache API';
    display: 'Blob URL from Cache API';
    upload: 'Cache API → Supabase Storage (when online)';
    cleanup: 'Remove from Cache API after upload';
  };
}
```

### **Signatures (localStorage)**

```typescript
interface SignatureStorage {
  // ✅ Small enough for localStorage
  storage: 'localStorage';
  format: 'Compressed base64 PNG';
  sizePerSignature: '10-50KB';
  maxSignatures: '21 per form (20 workers + 1 supervisor)';
  totalSize: '~500KB per form';

  compression: {
    quality: 0.8;
    maxDimensions: '400x200px';
    format: 'PNG with transparency';
  };
}
```

---

## 🔄 **Sync Queue Management**

### **Operation Priority System**

```typescript
interface SyncQueueStrategy {
  // High priority operations
  critical: {
    operations: ['form-save', 'signature-save', 'emergency-backup'];
    retryCount: 5;
    retryBackoff: 'exponential'; // 1s, 2s, 4s, 8s, 16s
    maxRetryDelay: 30000; // 30 seconds
    storage: 'indexedDB for reliability';
  };

  // Medium priority operations
  important: {
    operations: ['photo-upload', 'form-metadata-sync'];
    retryCount: 3;
    retryBackoff: 'linear'; // 2s, 4s, 6s
    maxRetryDelay: 10000; // 10 seconds
    storage: 'localStorage queue';
  };

  // Low priority operations
  background: {
    operations: ['form-archive', 'analytics', 'cleanup'];
    retryCount: 2;
    retryBackoff: 'fixed'; // 5s, 5s
    maxRetryDelay: 5000; // 5 seconds
    storage: 'sessionStorage';
  };
}
```

### **Batch Processing**

```typescript
class SyncQueueManager {
  private queue: SyncOperation[] = [];

  async processSyncQueue(): Promise<void> {
    // Process in batches when connectivity restored
    const batchSize = 5;
    const batchDelay = 1000; // 1 second between batches

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, batchSize);

      await Promise.allSettled(
        batch.map(operation => this.executeOperation(operation))
      );

      if (this.queue.length > 0) {
        await this.delay(batchDelay);
      }
    }
  }

  private async executeOperation(operation: SyncOperation): Promise<void> {
    try {
      switch (operation.type) {
        case 'form-save':
          await this.syncFormToSupabase(operation.data);
          break;
        case 'photo-upload':
          await this.uploadPhotoToSupabase(operation.data);
          break;
        case 'signature-save':
          await this.syncSignatureToSupabase(operation.data);
          break;
      }

      // Remove from queue on success
      this.removeFromQueue(operation.id);
    } catch (error) {
      // Handle retry logic
      await this.handleRetry(operation, error);
    }
  }
}
```

---

## ⚔️ **Conflict Resolution Strategy**

### **Conflict Types and Resolution**

```typescript
interface ConflictResolutionStrategy {
  // Primary strategy for most data
  defaultStrategy: 'last-write-wins';

  // Exception handling for critical fields
  criticalFieldStrategy: {
    signatures: {
      strategy: 'timestamp-priority-with-backup';
      reason: 'Legal signatures need clear precedence rules';
      ui: 'Keep most recent signature, backup older one with timestamp';
      fallback: 'If timestamps within 30 seconds, keep both with clear labels';
    };

    riskAssessments: {
      strategy: 'merge-conservative';
      reason: 'Safety data should combine all identified risks';
      ui: 'Merge all risk entries, highlight conflicts in red';
      priority: 'Higher risk ratings take precedence';
    };

    photos: {
      strategy: 'merge-all';
      reason: 'More documentation is always better for safety';
      ui: 'Keep all photos from both devices with device labels';
      sorting: 'Chronological order by timestamp';
    };

    formMetadata: {
      strategy: 'merge-with-priority';
      reason: 'Preserve all metadata with timestamps';
      priority: 'most recent timestamp wins';
    };
  };

  // Grace period for automatic resolution
  autoResolveWindow: 300000; // 5 minutes
}
```

### **Conflict Resolution UI**

```typescript
interface ConflictResolutionUI {
  // Smart automatic resolution (minimal user intervention)
  automaticResolution: {
    signatures: {
      approach: 'Keep most recent, show "Updated signature from [Device] at [Time]"';
      backup: 'Store previous signature as "signature_backup_[timestamp]"';
      notification: 'Simple toast: "Signature updated from tablet"';
    };

    riskAssessments: {
      approach: 'Merge all risks, take highest risk rating for duplicates';
      notification: 'Show: "Added 3 new risks from phone, updated 1 existing"';
      visual: 'Highlight new/changed items in yellow for 5 seconds';
    };

    photos: {
      approach: 'Keep all photos, add device labels automatically';
      notification: 'Show: "Added 2 photos from phone"';
      organization: 'Sort by timestamp, group by device if needed';
    };
  };

  // Only show conflict modal for truly ambiguous cases
  manualResolutionTriggers: {
    duplicateSignatures: 'Same person signed within 30 seconds on different devices';
    contradictoryRisks: 'Same hazard rated differently (e.g., High vs Low)';
    corruptedData: 'Data integrity check failed';
  };

  // Construction worker-friendly design
  design: {
    principle: 'Resolve automatically, notify simply, intervene minimally';
    notifications: {
      style: 'Large, clear toast messages';
      duration: '3 seconds for success, persistent for errors';
      language: 'Plain English, no technical jargon';
      examples: [
        '"Form updated with changes from tablet"',
        '"Added John\'s signature from phone"',
        '"Merged safety risks from both devices"',
      ];
    };

    whenManualNeeded: {
      modal: 'Full-screen, simple choice between A or B';
      buttons: 'Large (60px height), clear labels';
      preview: 'Show actual content, not technical details';
      language: 'Which signature should we keep?';
      options: [
        '"Keep signature from Phone (2:30 PM)"',
        '"Keep signature from Tablet (2:31 PM)"',
        '"Keep both signatures"',
      ];
    };
  };
}
```

### **Smart Conflict Resolution Examples**

```typescript
// Example 1: Signature conflict (automatic resolution)
const signatureConflict = {
  scenario: 'John Doe signed on phone at 2:30 PM, then tablet at 2:31 PM';
  resolution: 'Keep tablet signature (most recent)';
  backup: 'Store phone signature as backup';
  userNotification: '"Updated John\'s signature from tablet"';
  userAction: 'None required';
};

// Example 2: Risk assessment conflict (smart merge)
const riskConflict = {
  scenario: 'Height risk rated "Medium" on phone, "High" on tablet';
  resolution: 'Keep "High" rating (more conservative)';
  merge: 'Combine all other risk entries';
  userNotification: '"Merged safety risks - kept higher risk ratings"';
  userAction: 'None required';
};

// Example 3: Photo conflict (always merge)
const photoConflict = {
  scenario: '3 photos on phone, 2 photos on tablet';
  resolution: 'Keep all 5 photos';
  organization: 'Sort by timestamp, label by device';
  userNotification: '"Added 2 photos from tablet"';
  userAction: 'None required';
};

// Example 4: True conflict requiring user input
const trueConflict = {
  scenario: 'Same person signed twice within 10 seconds';
  resolution: 'Show simple choice modal';
  options: [
    'Keep signature from Phone (clearer)',
    'Keep signature from Tablet (more recent)',
    'Keep both signatures'
  ];
  userAction: 'Single tap to choose';
};
```

---

## 🔒 **Data Integrity Checks**

### **Validation Levels**

```typescript
interface DataIntegrityStrategy {
  // Checksum validation for data corruption detection
  checksumAlgorithm: 'sha256';

  // Validation strictness by data type
  validationLevels: {
    formStructure: {
      level: 'strict';
      checks: [
        'required modules present',
        'valid data types',
        'schema compliance',
      ];
      action: 'block save if invalid';
    };

    fieldData: {
      level: 'loose';
      checks: ['basic type validation', 'length limits'];
      action: 'allow save with warnings';
    };

    fileIntegrity: {
      level: 'strict';
      checks: ['file size', 'file type', 'corruption detection'];
      action: 'reject corrupted files';
    };
  };

  // Corruption handling
  corruptionHandling: {
    autoRepair: true; // Try to repair minor issues
    userNotification: true; // Alert user to data issues
    fallbackToLastKnown: true; // Revert to last good state
    createBackup: true; // Backup before repair attempts
  };
}
```

### **Data Recovery Mechanisms**

```typescript
class DataRecoveryManager {
  async detectCorruption(formData: FormInstance): Promise<CorruptionReport> {
    const report: CorruptionReport = {
      isCorrupted: false,
      issues: [],
      repairability: 'none',
    };

    // Check data structure integrity
    if (!this.validateFormStructure(formData)) {
      report.issues.push('Invalid form structure');
      report.isCorrupted = true;
    }

    // Check for missing required fields
    const missingFields = this.findMissingRequiredFields(formData);
    if (missingFields.length > 0) {
      report.issues.push(`Missing fields: ${missingFields.join(', ')}`);
      report.repairability = 'partial';
    }

    // Verify checksums
    const checksumValid = await this.verifyChecksums(formData);
    if (!checksumValid) {
      report.issues.push('Data checksum mismatch');
      report.isCorrupted = true;
      report.repairability = 'difficult';
    }

    return report;
  }

  async repairCorruptedData(formData: FormInstance): Promise<FormInstance> {
    // Attempt automatic repair
    let repairedData = { ...formData };

    // Restore missing modules from template
    repairedData = this.restoreMissingModules(repairedData);

    // Data already clean from bullet proof UI components
    // No sanitization needed - corruption repair only

    // Validate repaired data
    const isValid = this.validateFormStructure(repairedData);
    if (!isValid) {
      throw new Error('Unable to repair corrupted data');
    }

    return repairedData;
  }
}
```

---

## 📱 **User Notification System**

### **Sync Status Indicators**

```typescript
interface UserNotificationStrategy {
  // Visual sync status indicators
  syncIndicators: {
    synced: {
      icon: '✓';
      color: 'green';
      message: 'All changes saved';
      position: 'top-right corner';
    };

    syncing: {
      icon: '⟳';
      color: 'blue';
      message: 'Saving changes...';
      animation: 'rotating spinner';
    };

    offline: {
      icon: '⚠';
      color: 'orange';
      message: 'Working offline - changes saved locally';
      persistent: true;
    };

    conflict: {
      icon: '!';
      color: 'red';
      message: 'Sync conflict detected - action required';
      modal: true;
    };

    error: {
      icon: '✗';
      color: 'red';
      message: 'Sync failed - will retry automatically';
      retryButton: true;
    };
  };

  // Notification timing
  notifications: {
    immediate: ['conflict', 'error', 'data-corruption'];
    periodic: ['offline-reminder']; // Every 5 minutes
    onReconnect: ['sync-success', 'pending-changes-count'];
    onBackground: ['unsaved-changes-warning'];
  };
}
```

### **Construction Worker-Friendly Notifications**

```typescript
interface WorkerFriendlyNotifications {
  // Simple, clear messaging
  messages: {
    offline: 'No internet - your work is saved on this device';
    syncing: 'Uploading your form to the cloud...';
    conflict: 'This form was changed on another device. Choose which version to keep.';
    error: 'Could not save to cloud. Will try again automatically.';
    success: 'Form saved successfully';
  };

  // Visual design for construction sites
  design: {
    largeText: '18px minimum for readability';
    highContrast: 'Visible in bright sunlight';
    simpleIcons: 'Universally understood symbols';
    touchTargets: '44px minimum for work gloves';
  };

  // Audio feedback for noisy environments
  audioFeedback: {
    success: 'Short positive chime';
    error: 'Distinctive error sound';
    conflict: 'Attention-getting alert tone';
  };
}
```

---

## 🚨 **Sync on Close/Shutdown**

### **Browser Lifecycle Event Handling**

```typescript
interface SyncOnCloseStrategy {
  // Critical browser events to monitor
  lifecycleEvents: {
    beforeunload: {
      action: 'immediate-sync';
      timeout: 500; // Browser enforced limit
      method: 'sendBeacon';
      data: ['critical-form-data', 'signatures', 'current-edits'];
    };

    pagehide: {
      action: 'immediate-sync';
      timeout: 500;
      method: 'sendBeacon';
      data: ['all-pending-changes'];
    };

    visibilitychange: {
      action: 'conditional-sync';
      condition: 'document.visibilityState === "hidden"';
      timeout: 2000;
      method: 'fetch-keepalive';
    };

    blur: {
      action: 'debounced-sync';
      debounce: 1000;
      method: 'standard-fetch';
    };
  };

  // Mobile-specific events
  mobileEvents: {
    freeze: {
      action: 'immediate-sync';
      platform: 'iOS/Android';
      data: ['all-form-data'];
    };

    resume: {
      action: 'check-and-sync';
      platform: 'iOS/Android';
      data: ['sync-status-check'];
    };
  };
}
```

### **Emergency Sync Implementation**

```typescript
class EmergencySyncManager {
  private criticalData: FormInstance | null = null;
  private pendingChanges: boolean = false;

  constructor() {
    this.setupLifecycleListeners();
  }

  private setupLifecycleListeners(): void {
    // Critical: Browser/tab closing
    window.addEventListener('beforeunload', event => {
      if (this.hasPendingChanges()) {
        // Perform immediate sync
        this.performEmergencySync();

        // Show warning to user
        event.preventDefault();
        event.returnValue =
          'You have unsaved form data. Are you sure you want to leave?';
        return event.returnValue;
      }
    });

    // Critical: Page being hidden (mobile browser switching)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.hasPendingChanges()) {
        this.performFastSync();
      }
    });

    // Mobile: App going to background
    document.addEventListener('freeze', () => {
      this.performEmergencySync();
    });

    // Battery level monitoring
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        battery.addEventListener('levelchange', () => {
          if (battery.level < 0.05) {
            // 5% battery
            this.performEmergencySync();
            this.showBatteryWarning();
          }
        });
      });
    }
  }

  private performEmergencySync(): void {
    if (!this.hasPendingChanges()) return;

    const formData = this.getCriticalFormData();

    // Use sendBeacon for maximum reliability
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(formData)], {
        type: 'application/json',
      });

      const success = navigator.sendBeacon('/api/forms/emergency-save', blob);

      if (success) {
        this.markAsSynced();
      } else {
        // Fallback to localStorage
        this.saveToLocalStorage(formData);
      }
    } else {
      // Fallback for older browsers
      this.saveToLocalStorage(formData);
    }
  }
}
```

---

## 📊 **Performance Optimization**

### **Sync Performance Targets**

```typescript
interface PerformanceTargets {
  // Sync operation timing
  syncTiming: {
    immediateSync: '< 500ms'; // Emergency sync
    fastSync: '< 2 seconds'; // Background sync
    batchSync: '< 10 seconds'; // Full sync when online
    photoUpload: '< 30 seconds'; // Per photo
  };

  // Success rates
  successRates: {
    criticalOperations: '> 99%'; // Form saves, signatures
    photoUploads: '> 95%'; // Photo uploads
    conflictResolution: '> 90%'; // Automatic resolution
    dataRecovery: '> 95%'; // After corruption
  };

  // User experience
  userExperience: {
    syncNotificationDelay: '< 2 seconds';
    conflictResolutionTime: '< 30 seconds average';
    offlineIndicatorDelay: '< 1 second';
    dataLossRate: '< 0.1%';
  };
}
```

### **Optimization Strategies**

```typescript
interface OptimizationStrategies {
  // Data compression
  compression: {
    photos: 'JPEG quality 0.8, max 1920px width';
    signatures: 'PNG with transparency, max 400x200px';
    formData: 'JSON minification, remove whitespace';
  };

  // Debouncing and batching
  debouncing: {
    autoSave: '500ms after last keystroke';
    photoUpload: '1 second after capture';
    syncQueue: '2 seconds after network restoration';
  };

  // Caching strategies
  caching: {
    formTemplates: 'Cache for 24 hours';
    userPreferences: 'Cache indefinitely';
    photoThumbnails: 'Cache for 7 days';
  };

  // Network optimization
  network: {
    retryStrategy: 'Exponential backoff with jitter';
    connectionDetection: 'Online/offline event listeners';
    bandwidthAdaptation: 'Reduce quality on slow connections';
  };
}
```

---

## 🧪 **Testing Strategy**

### **Offline Sync Testing**

```typescript
interface OfflineSyncTesting {
  // Unit tests
  unitTests: [
    'localStorage save/restore functionality',
    'Cache API photo storage',
    'Conflict resolution algorithms',
    'Data integrity validation',
    'Sync queue management',
  ];

  // Integration tests
  integrationTests: [
    'Complete offline form workflow',
    'Device switching scenarios',
    'Network interruption handling',
    'Batch sync processing',
    'Emergency sync reliability',
  ];

  // End-to-end tests
  e2eTests: [
    'Multi-device form editing',
    'Offline photo capture and sync',
    'Browser crash recovery',
    'Network failure scenarios',
    'Conflict resolution workflows',
  ];

  // Performance tests
  performanceTests: [
    'Large form sync performance',
    'Multiple photo upload timing',
    'Sync queue processing speed',
    'Memory usage during offline operation',
    'Battery impact measurement',
  ];
}
```

---

## 🚀 **Implementation Roadmap**

### **Phase 1: Foundation (Week 1-2)**

```typescript
const phase1Tasks = [
  // Basic offline storage
  'Implement localStorage form data backup',
  'Add Cache API photo storage',
  'Create basic sync queue',
  'Implement simple conflict resolution (last-write-wins)',
  'Add basic sync status indicators',
];
```

### **Phase 2: Enhanced Reliability (Week 3-4)**

```typescript
const phase2Tasks = [
  // Advanced features
  'Add data integrity checking',
  'Implement advanced conflict resolution',
  'Create emergency sync on close',
  'Add batch sync optimization',
  'Implement user notification system',
];
```

### **Phase 3: Production Ready (Week 5-6)**

```typescript
const phase3Tasks = [
  // Production features
  'Add comprehensive error handling',
  'Implement performance monitoring',
  'Create data recovery mechanisms',
  'Add sync analytics',
  'Optimize for construction site conditions',
];
```

---

## 📋 **Success Criteria**

### **Functional Requirements**

- ✅ **Zero Data Loss**: No form data lost in any scenario
- ✅ **Offline Functionality**: Complete form workflow works offline
- ✅ **Device Switching**: Seamless handoff between devices
- ✅ **Conflict Resolution**: Automatic and manual conflict handling
- ✅ **Performance**: Fast sync with minimal user interruption

### **User Experience Goals**

- ✅ **Transparency**: Users always know sync status
- ✅ **Reliability**: Consistent behavior across all scenarios
- ✅ **Simplicity**: Minimal user intervention required
- ✅ **Recovery**: Easy recovery from any failure state
- ✅ **Construction Site Ready**: Works with gloves, in sunlight, on noisy sites

---

**Document Status**: 🚧 Ready for Implementation  
**Next Steps**: Begin Phase 1 implementation with localStorage and Cache API integration  
**Dependencies**: React state management, Supabase client setup, error handling framework
