# HrdHat Development Plan - Updated with Core Modules & Accessibility

## 📋 **Chapter Overview**

| Chapter | Focus Area                                      | Duration    | Key Deliverables                                              |
| ------- | ----------------------------------------------- | ----------- | ------------------------------------------------------------- |
| 1       | Project Setup & Architecture                    | 1 week      | Vite, TypeScript, folder structure, routing                   |
| 2       | Authentication & User Management                | 1 week      | Supabase auth, user profiles, session handling                |
| 3       | Core UI Components & Design System              | 1 week      | Button, Input, Modal, responsive layouts                      |
| **3.5** | **CRITICAL: Form Analysis & Module Definition** | **1 week**  | **Complete FormSAMPLE.html analysis, finalized module specs** |
| 4       | Error Handling & Resilience                     | 1 week      | Error boundaries, offline support, auto-save                  |
| **5**   | **Core Module Development**                     | **2 weeks** | **Photos, Signatures, Form Header modules**                   |
| 6       | Form Instance Management                        | 2 weeks     | CRUD operations, data persistence, performance                |
| 7       | Form Rendering & Navigation                     | 2 weeks     | Dynamic modules, Quick/Guided modes, progress tracking        |
| 8       | PDF Generation & Export                         | 1 week      | PDF creation, construction-site formatting                    |
| 9       | Testing & Quality Assurance                     | 1 week      | Unit tests, integration tests, accessibility testing          |
| 10      | Deployment & Production                         | 1 week      | CI/CD, monitoring, performance optimization                   |

---

## **Chapter 1: Project Setup & Architecture (1 week)**

### **Overview**

Establish the foundational architecture for HrdHat v4, including project structure, TypeScript configuration, routing strategy, and development workflow. This chapter sets up the technical foundation that all subsequent development will build upon.

### **Phase 1.1: Project Foundation & TypeScript Setup (Days 1-2)**

**Vite + TypeScript Configuration:**

- [x] ✅ **COMPLETE**: Vite project initialized with TypeScript
- [x] ✅ **COMPLETE**: TypeScript configuration optimized for React development
- [x] ✅ **COMPLETE**: ESLint and Prettier configured for code quality
- [ ] Configure absolute imports with `@/` path mapping
- [ ] Set up development environment variables
- [ ] Configure build optimization for production

**Project Structure Setup:**

- [ ] Create feature-based folder architecture following unidirectional imports
- [ ] Set up `frontend/src/features/` directory structure
- [ ] Create `frontend/src/components/` for shared components
- [ ] Set up `frontend/src/hooks/`, `frontend/src/utils/`, `frontend/src/types/`
- [ ] Configure ITCSS styling structure in `frontend/src/styles/`
- [ ] Create testing directory structure

**Essential Dependencies:**

```json
{
  "dependencies": {
    "zustand": "^4.4.7", // State management (decided)
    "dompurify": "^3.0.5", // XSS protection
    "@supabase/supabase-js": "^2.38.0" // Backend integration
  },
  "devDependencies": {
    "@types/dompurify": "^3.0.5",
    "vitest": "^1.0.0", // Testing framework
    "@testing-library/react": "^14.0.0"
  }
}
```

### **Phase 1.2: Routing Architecture Implementation (Days 3-4)**

**✅ ROUTING STRATEGY RESOLVED**: Custom App.tsx routing (no external router library)

**Custom Routing Implementation:**

- [ ] Implement custom routing logic in `App.tsx`
- [ ] Create navigation state management with Zustand
- [ ] Set up browser history support (back/forward buttons)
- [ ] Implement URL parameter handling for form IDs and modes
- [ ] Add protected route logic for authentication

**Route Structure Implementation:**

```typescript
// HrdHat Route Map
const routes = {
  '/': 'Dashboard', // Active forms overview
  '/form/:id': 'FormEditor', // Form editing (Quick mode default)
  '/form/:id/guided': 'FormEditor', // Form editing (Guided mode)
  '/archived': 'ArchivedForms', // Archived forms list
  '/profile': 'Profile', // User profile settings
  '/auth/login': 'AuthFlow', // Authentication
  '/auth/signup': 'AuthFlow', // Registration
};
```

**Navigation Components:**

- [ ] Create `useNavigation` hook for route management
- [ ] Implement navigation components for each breakpoint (Mobile/Tablet/Desktop)
- [ ] Add deep linking support for form editing states
- [ ] Create route transition handling

**Routing Benefits for HrdHat:**

- ✅ **Lightweight**: No external dependencies, smaller bundle for mobile users
- ✅ **Simple**: Perfect for HrdHat's 6 main routes
- ✅ **Fast**: Direct route switching without router overhead
- ✅ **Integrated**: Seamless integration with Zustand state management
- ✅ **Controlled**: Full control over navigation logic and performance

### **Phase 1.3: State Management Architecture (Days 5-6)**

**✅ STATE MANAGEMENT RESOLVED**: Zustand selected for optimal performance

**Zustand Store Setup:**

- [ ] Create `useFormStore` for form data management
- [ ] Implement `useAuthStore` for user authentication
- [ ] Create `useNavigationStore` for routing state
- [ ] Set up `useOfflineStore` for offline queue management
- [ ] Configure store persistence with localStorage

**Core Store Interfaces:**

```typescript
// Form state management
interface FormState {
  formData: Record<string, any>;
  isDirty: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  currentFormId?: string;

  updateField: (field: string, value: any) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: (formId: string) => void;
  clearForm: () => void;
}

// Navigation state management
interface NavigationState {
  currentRoute: string;
  previousRoute: string;
  formId?: string;
  mode: 'quick' | 'guided';
  currentModule?: string;

  navigate: (route: string, params?: any) => void;
  goBack: () => void;
  setFormMode: (mode: 'quick' | 'guided') => void;
  setCurrentModule: (module: string) => void;
}
```

**State Management Benefits:**

- ✅ **Performance**: Minimal re-renders, optimized for mobile
- ✅ **TypeScript**: Full type safety across all stores
- ✅ **Persistence**: Automatic localStorage backup
- ✅ **Offline**: Queue management for network failures
- ✅ **Simple API**: Easy `set()` and `get()` operations

### **Phase 1.4: Development Workflow & Quality Setup (Day 7)**

**Code Quality Tools:**

- [ ] Configure ESLint rules for architectural boundaries
- [ ] Set up Prettier with format-on-save
- [ ] Add pre-commit hooks with Husky (future)
- [ ] Configure TypeScript strict mode
- [ ] Set up import organization rules

**Development Scripts:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

**Testing Foundation:**

- [ ] Set up Vitest for unit testing
- [ ] Configure React Testing Library
- [ ] Create test utilities and helpers
- [ ] Set up coverage reporting
- [ ] Add testing scripts to package.json

**Documentation Setup:**

- [ ] Create component documentation standards
- [ ] Set up API documentation structure
- [ ] Create development guidelines
- [ ] Document architectural decisions
- [ ] Set up changelog structure

---

**Chapter 1 Success Criteria:**

- ✅ **Project Structure**: Clean, scalable folder architecture following unidirectional imports
- ✅ **Routing System**: Custom App.tsx routing working with all 6 main routes
- ✅ **State Management**: Zustand stores configured for form, auth, and navigation
- ✅ **TypeScript**: Full type safety with strict configuration
- ✅ **Code Quality**: ESLint, Prettier, and testing framework operational
- ✅ **Development Workflow**: Efficient development scripts and quality checks
- ✅ **Performance Foundation**: Lightweight architecture optimized for mobile construction workers
- ✅ **Security Foundation**: Input sanitization and XSS protection setup

**Ready for Chapter 2**: Authentication & User Management can begin with solid architectural foundation

---

## **Chapter 3.5: CRITICAL - Form Analysis & Module Definition (1 week)**

### **⚠️ MANDATORY PREREQUISITE FOR DATABASE IMPLEMENTATION**

**Status**: 🚨 **CRITICAL PATH** - No database work begins until this chapter is 100% complete  
**Purpose**: Analyze FormSAMPLE.html with a fine-tooth comb and finalize all module specifications before any SQL database creation  
**Reference**: We have a rough draft in `@form-plan/` documentation that needs thorough review and finalization

### **Phase 3.5.1: Complete FormSAMPLE.html Analysis (Days 1-2)**

**🔍 Fine-Tooth Comb Analysis of FormSAMPLE.html:**

- [ ] **Field-by-Field Analysis**: Document every single input field, checkbox, dropdown, and interactive element
- [ ] **Data Type Mapping**: Define exact TypeScript interfaces for each field (string, number, boolean, Date, etc.)
- [ ] **Validation Requirements**: Determine required vs optional fields, field length limits, format validation
- [ ] **Layout Structure Analysis**: Document the exact HTML structure and CSS classes for each module
- [ ] **Interactive Element Behavior**: Analyze JavaScript functionality, event handlers, and dynamic content
- [ ] **Module Boundaries**: Clearly define where each module starts and ends
- [ ] **Cross-Module Dependencies**: Identify any fields that depend on other modules or fields

**📋 Detailed Documentation Requirements:**

```typescript
// Example of the level of detail needed for each field
interface ProjectNameField {
  htmlId: 'project-name';
  htmlName: 'project-name';
  fieldType: 'text';
  label: 'Project Name:';
  required: true;
  maxLength: 255;
  placeholder: undefined;
  validation: {
    minLength: 1;
    pattern: undefined;
    customRules: ['no-special-characters'];
  };
  gridPosition: { column: 1; row: 1 };
  moduleId: 'general-information';
  jsonbPath: 'modules.generalInformation.projectName';
  databaseMapping: 'form_data->modules->generalInformation->projectName';
}
```

### **Phase 3.5.2: Module Specification Finalization (Days 3-4)**

**📝 Complete Module Documentation:**

- [ ] **General Information Module**: Finalize all 9 fields with exact specifications
- [ ] **FLRA Pre-Job Checklist Module**: Document all 20 checkbox items with exact wording
- [ ] **PPE & Platform Inspection Module**: Define PPE section (8 items) and Platform section (9 items)
- [ ] **Task, Hazard, Control Module**: Analyze dynamic table structure, risk dropdowns, and entry limits
- [ ] **Signature Module**: Document worker signature grid, supervisor signature, and name fields
- [ ] **Photo Module**: Define photo capture requirements (not in current HTML but needed)

**🎯 Module Template Structure Definition:**

- [ ] **Update**: `frontend/docs/plan/form-plan/modules/` with finalized specifications
- [ ] **Create**: Complete TypeScript interfaces for each module
- [ ] **Define**: JSONB storage structure for each module
- [ ] **Document**: Validation rules and cross-module dependencies
- [ ] **Specify**: UI layout requirements and responsive behavior

### **Phase 3.5.3: Database Schema Planning (Days 5-6)**

**🗄️ JSONB Schema Design:**

- [ ] **Form Instance Structure**: Define top-level form metadata (id, user_id, created_at, status, etc.)
- [ ] **Module Data Structure**: Design JSONB structure for `form_data` column
- [ ] **Data Relationships**: Plan how modules relate to each other within JSONB
- [ ] **Performance Considerations**: Design for efficient querying and indexing
- [ ] **Migration Strategy**: Plan for future module additions and schema changes

**📊 Example JSONB Structure Planning:**

```sql
-- form_instances table structure planning
CREATE TABLE form_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  form_type VARCHAR(50) DEFAULT 'flra',
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived', 'deleted'

  -- CRITICAL: This JSONB structure must be 100% defined before implementation
  form_data JSONB NOT NULL DEFAULT '{}', -- Complete module data structure

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ,

  -- Metadata for performance and querying
  completion_percentage INTEGER DEFAULT 0,
  last_module_updated VARCHAR(50),
  device_info JSONB,

  -- Constraints and indexes to be defined
  CONSTRAINT valid_status CHECK (status IN ('active', 'archived', 'deleted')),
  CONSTRAINT valid_completion CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
);
```

### **Phase 3.5.4: Cross-Reference & Validation (Day 7)**

**🔍 Final Validation Before Database Implementation:**

- [ ] **HTML vs TypeScript**: Ensure every HTML element has corresponding TypeScript interface
- [ ] **TypeScript vs JSONB**: Verify TypeScript interfaces map correctly to JSONB structure
- [ ] **Module Dependencies**: Validate all cross-module relationships are documented
- [ ] **Performance Review**: Ensure JSONB structure supports efficient operations
- [ ] **Security Review**: Verify all user input fields have sanitization plans

**📋 Final Deliverables:**

- [ ] **Complete Module Specifications**: All modules 100% documented in `form-plan/modules/`
- [ ] **Finalized TypeScript Interfaces**: Ready for implementation
- [ ] **JSONB Schema Definition**: Complete database structure ready for MCP implementation
- [ ] **Validation Rules Documentation**: All field validation requirements defined
- [ ] **Implementation Checklist**: Step-by-step tasks for database creation

### **🚨 CRITICAL SUCCESS CRITERIA:**

- ✅ **Every HTML element** in FormSAMPLE.html has been analyzed and documented
- ✅ **Every field** has complete TypeScript interface definition
- ✅ **Every module** has finalized specification in form-plan documentation
- ✅ **JSONB structure** is completely defined and ready for database implementation
- ✅ **No ambiguity** remains about any aspect of the form structure
- ✅ **Database schema** is ready for MCP implementation with zero unknowns

### **📁 Documentation References:**

**Existing Rough Drafts** (to be refined and finalized):

- [ ] `frontend/docs/plan/form-plan/README.md` - Documentation guide
- [ ] `frontend/docs/plan/form-plan/photo-module-specification.md` - Photo module draft
- [ ] `frontend/docs/plan/form-plan/state-management-architecture.md` - State management decisions
- [ ] `frontend/docs/plan/form-plan/data-flow-architecture.md` - Data flow patterns

**New Documentation to Create**:

- [ ] `frontend/docs/plan/form-plan/modules/general-information-specification.md`
- [ ] `frontend/docs/plan/form-plan/modules/flra-checklist-specification.md`
- [ ] `frontend/docs/plan/form-plan/modules/ppe-platform-specification.md`
- [ ] `frontend/docs/plan/form-plan/modules/task-hazard-control-specification.md`
- [ ] `frontend/docs/plan/form-plan/modules/signature-specification.md`
- [ ] `frontend/docs/plan/form-plan/integration/jsonb-schema-final.md`
- [ ] `frontend/docs/plan/form-plan/integration/database-implementation-plan.md`

### **🔄 Process Flow:**

```
FormSAMPLE.html Analysis
         ↓
Module Specifications
         ↓
TypeScript Interfaces
         ↓
JSONB Schema Design
         ↓
Database Implementation Plan
         ↓
✅ READY FOR MCP DATABASE CREATION
```

---

**⚠️ IMPORTANT**: No work on Chapter 4 (Error Handling) or any subsequent chapters begins until Chapter 3.5 is 100% complete and all stakeholders have approved the final module specifications and database schema.

**🎯 Outcome**: Complete, unambiguous specifications ready for database implementation with zero unknowns or assumptions.

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

### **Phase 6.0: Data Flow Architecture Foundation (Prerequisite)**

**📋 Architectural Foundation Setup:**

- [x] **Complete Data Flow Specification**: See `form-plan/data-flow-architecture.md` for unified architecture
- [x] **State Management Decision**: Zustand selected (Chapter 1 of data-flow spec)
- [x] **API Integration Pattern**: Unified service layer defined (Chapter 2 of data-flow spec)
- [x] **CRUD Operation Flows**: Complete patterns documented (Chapter 3 of data-flow spec)
- [x] **Offline/Online Strategy**: Queue management specified (Chapter 4 of data-flow spec)
- [x] **Error Handling Integration**: Multi-layer error flow (Chapter 5 of data-flow spec)
- [x] **Security Architecture**: Input sanitization patterns (Chapter 6 of data-flow spec)
- [x] **Performance Framework**: Memory management and optimization (Chapter 7 of data-flow spec)

**🎯 Implementation Approach:**

```
Phase 6.1 → Implement data-flow-architecture.md Chapters 1-2 (State + API)
Phase 6.2 → Implement data-flow-architecture.md Chapter 3 (CRUD Operations)
Phase 6.3 → Implement data-flow-architecture.md Chapter 4 (Offline Sync)
Phase 6.4 → Integrate data-flow-architecture.md Chapters 5-7 (Error + Security + Performance)
```

**🔗 Key Components from Data Flow Spec:**

- **Zustand Store**: `useFormStore` with auto-save pipeline
- **API Service**: `api.forms`, `api.auth`, `api.storage` with retry logic
- **Offline Queue**: `OfflineQueue` class for network failures
- **Connection Manager**: `ConnectionManager` for online/offline transitions
- **Error Handler**: `ErrorHandler` with categorized error flows
- **Security Layer**: Input sanitization and secure storage
- **Memory Manager**: `MemoryManager` for performance optimization

**✅ Ready for Implementation**: All architectural decisions resolved, patterns defined

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
5. [x] **Archive Form**: ✅ **RESOLVED** - Dual archive approach (automatic + manual)
   - [x] **Auto-Archive**: Edge Function runs hourly, queries forms older than 16 hours, updates status to "archived"
   - [x] **Manual Archive**: User-initiated archive via frontend action (archive button/menu option)
   - [x] **Implementation**: Both paths update form status from "active" → "archived" + set archived_at timestamp
   - [x] **Benefits**: Server-side auto-archive + user control for immediate archiving
   - [x] **Security**: Service role access for auto-archive, user RLS policies for manual archive
   - [x] **User Experience**: Archive warnings, manual archive button, read-only status display
6. [ ] **Form Lifecycle Management**: Active (max 5) vs Archived states + error boundaries + state recovery + **memory management**
7. [ ] **Device Switching**: JSON serialization for cross-device editing + sync conflict handling + data validation + **optimized sync** + **secure data transfer**
8. [ ] **Offline Resilience**: localStorage backup for network issues + retry queue + integrity verification + **storage limits** + **encrypted local storage**

### 🔒 **Data Sanitization Requirements (Chapter 6):**

**Input Sanitization Strategy:**

- **All Text Fields**: Sanitize using DOMPurify before storage and display
- [ ] **JSONB Storage**: Validate and sanitize all data before database insertion
- [ ] **File Uploads**: Validate file types, scan for malicious content
- [ ] **User-Generated Content**: Strip all HTML tags, prevent script injection
- [ ] **Cross-Device Sync**: Sanitize data during sync operations

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

**🔗 Implementation Reference**: Follow `data-flow-architecture.md` Chapters 1-2

- [ ] **Zustand Store Setup**: Implement `useFormStore` from data-flow spec Chapter 1.1
- [ ] **API Service Layer**: Build `APIService` class from data-flow spec Chapter 2.1
- [ ] **Form State Management**: Implement `updateField()` and auto-save pipeline from data-flow spec Chapter 1.2
- [ ] **Error Boundaries Integration**: Use error handling patterns from data-flow spec Chapter 5.1
- [ ] **Input Sanitization**: Implement `secureUpdateField()` from data-flow spec Chapter 6.1
- [ ] **Performance Monitoring**: Add save metrics tracking from data-flow spec Chapter 7.1
- [ ] **Memory Management**: Initialize `MemoryManager` from data-flow spec Chapter 7.2
- [ ] **Essential Accessibility**: 48px touch targets, construction worker labels, clear required field indicators
- [ ] **Testing**: Validate CRUD operations against data-flow spec success metrics

**📋 Deliverables**:

- ✅ Working Zustand store with TypeScript
- ✅ API service with retry logic
- ✅ Secure input sanitization
- ✅ Performance budget monitoring
- ✅ Touch-friendly accessibility

**Phase 6.2: Form Lifecycle with Error Recovery + Memory Management + Secure Storage + Touch Accessibility (Week 2)**

**🔗 Implementation Reference**: Follow `data-flow-architecture.md` Chapter 3 (CRUD Operations)

- [ ] **Create Operation**: Implement `createForm()` flow from data-flow spec Chapter 3.1
- [ ] **Update Operation**: Build auto-save `updateFlow` from data-flow spec Chapter 3.2
- [ ] **Read Operation**: Implement `loadForm()` with conflict resolution from data-flow spec Chapter 3.3
- [ ] **Archive Operation**: Build `archiveForm()` with cleanup from data-flow spec Chapter 3.4
- [ ] **Memory Management**: Implement form eviction using `MemoryManager` from data-flow spec Chapter 7.2
- [ ] **Secure Storage**: Use `SecureStorage` class from data-flow spec Chapter 6.2
- [ ] **Device Switching**: ✅ **RESOLVED** - Implement backend-centric device switching with Supabase auth
  - [ ] **Session Management**: Use Supabase JWT authentication (automatic refresh)
  - [ ] **Sync Timing**: Implement on-focus sync + continuous auto-save (2s debounce)
  - [ ] **Conflict Resolution**: Last-write-wins based on `updated_at` timestamp
  - [ ] **User Experience**: Add sync status indicators (✓ Saved, ⟳ Syncing, ⚠ Offline, ✗ Error)
  - [ ] **Focus Event Handler**: Implement `handleAppFocus()` to fetch latest form data
  - [ ] **Notification System**: Simple "Form updated with latest changes" messages
  - [ ] **State Management**: Update Zustand store with latest backend data on device switch
- [ ] **Touch Accessibility**: 8px spacing, immediate response, work glove testing
- [ ] **Form Lifecycle**: Active → Archived state transitions with error recovery

**📋 Device Switching Implementation Details**:

```typescript
// Device switching service implementation
class DeviceSwitchingService {
  constructor(private supabase: SupabaseClient) {
    this.setupFocusListener();
  }

  private setupFocusListener() {
    window.addEventListener('focus', this.handleAppFocus);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleAppFocus = async () => {
    const { formId } = useFormStore.getState();
    if (!formId) return;

    try {
      // Fetch latest from backend
      const { data } = await this.supabase
        .from('form_instances')
        .select('*')
        .eq('id', formId)
        .single();

      // Update local state with latest
      useFormStore.setState({
        formData: data.form_data,
        lastSaved: new Date(data.updated_at),
        saveStatus: 'saved',
      });

      // Show notification
      this.showSyncNotification('Form updated with latest changes');
    } catch (error) {
      console.error('Failed to sync on focus:', error);
    }
  };
}
```

**📋 Deliverables**:

- ✅ Complete CRUD operations
- ✅ Device switching support (backend-centric approach)
- ✅ Secure local storage
- ✅ Memory-optimized form management
- ✅ Touch-accessible form lifecycle

**Phase 6.3: Offline Sync with Error Management + Storage Optimization + Security Validation (Week 3)**

**🔗 Implementation Reference**: Follow `data-flow-architecture.md` Chapter 4 (Offline/Online Sync)

- [ ] **Offline Queue**: Implement `OfflineQueue` class from data-flow spec Chapter 4.1
- [ ] **Connection Management**: Build `ConnectionManager` from data-flow spec Chapter 4.2
- [ ] **Queue Processing**: Implement automatic sync on connection restore
- [ ] **Storage Optimization**: Add cleanup strategies and payload optimization
- [ ] **Network Throttling**: Implement request batching from data-flow spec Chapter 7.1
- [ ] **Data Validation**: Add integrity checks during sync operations
- [ ] **Security Validation**: Implement secure sync protocols from data-flow spec Chapter 6.2
- [ ] **Error Recovery**: Use error handling patterns from data-flow spec Chapter 5.1
- [ ] **Performance Monitoring**: Track sync performance and storage usage

**📋 Deliverables**:

- ✅ Robust offline functionality
- ✅ Automatic sync on reconnection
- ✅ Optimized storage management
- ✅ Secure data synchronization
- ✅ Performance-monitored sync operations

**Phase 6.4: Integration & Validation + Performance Testing + Security Auditing (Week 4)**

**🔗 Implementation Reference**: Follow `data-flow-architecture.md` Chapters 5-7 (Error + Security + Performance)

- [ ] **Complete Error Integration**: Validate all error flows from data-flow spec Chapter 5
- [ ] **Security Auditing**: Test input sanitization and secure storage from data-flow spec Chapter 6
- [ ] **Performance Validation**: Verify all success metrics from data-flow spec Chapter 7
- [ ] **End-to-End Testing**: Test complete data flow: UI → Zustand → API → Supabase
- [ ] **Accessibility Validation**: Verify construction worker usability and touch accessibility
- [ ] **Memory Stress Testing**: Validate performance under maximum form loads
- [ ] **Security Penetration Testing**: Test XSS protection and data integrity
- [ ] **Cross-Device Testing**: Validate device switching and conflict resolution
- [ ] **Network Resilience Testing**: Test offline/online transitions and queue processing

**📋 Final Deliverables**:

- ✅ Complete data flow implementation
- ✅ Zero data loss under any condition
- ✅ < 100ms UI response time
- ✅ 100% offline functionality
- ✅ Construction site accessibility
- ✅ Security compliance
- ✅ Performance budget adherence

**🎯 Success Criteria**: All metrics from `data-flow-architecture.md` success section achieved

### 🔧 **Implementation Details (Chapter 6):**

**📋 Complete Technical Specifications**: See `form-plan/data-flow-architecture.md`

**🔗 Quick Reference**:

- **Security Implementation**: Chapter 6 of data-flow spec (Input sanitization, secure storage)
- **Performance Optimization**: Chapter 7 of data-flow spec (Memory management, debouncing)
- [ ] **Error Handling Patterns**: Chapter 5 of data-flow spec (Multi-layer error flows)
- [ ] **API Service Architecture**: Chapter 2 of data-flow spec (Unified service layer)
- [ ] **CRUD Operation Flows**: Chapter 3 of data-flow spec (Complete operation patterns)
- [ ] **Offline/Online Sync**: Chapter 4 of data-flow spec (Queue management, connection handling)

**🎯 Implementation Approach**:

1. **Study the data-flow spec** before implementing each phase
2. **Follow the exact patterns** defined in the architecture document
3. **Reference specific chapters** for detailed implementation guidance
4. **Validate against success metrics** defined in the data-flow spec

**✅ All architectural decisions resolved** - Ready for implementation

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
- [x] **Maintain form lifecycle**: Active/archived states with auto-archive via Edge Function and error recovery
- [ ] **Enable device switching**: JSON-based state management for cross-device editing with conflict resolution
- [ ] **Ensure data protection**: Zero data loss under any error conditions
- [ ] **Enforce smart limits**: 6 tasks, 5 photos, 20 signatures maximum for optimal performance
- [ ] **Optimize for mobile**: Blob storage, compressed images, efficient memory usage
