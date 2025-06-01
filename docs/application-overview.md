# Application Overview

HrdHat lets users sign up, create, and manage daily safety forms — chiefly the FLRA (Field-Level Risk Assessment).

**📋 Architecture Status**: Complete implementation guides available for all major systems (state management, data flow, error handling, security, performance, accessibility, testing)

We have a form structure and every form is built of form modules(sections).

## 🔧 **CRITICAL: Dynamic Form Architecture**

**⚠️ IMPORTANT: HrdHat uses DYNAMIC MODULE ASSEMBLY, not dynamic field creation**

### **What "Dynamic" Means in HrdHat:**

- ✅ **Module Assembly**: Forms are built by combining predefined modules
- ✅ **Module Selection**: Phase 2 allows users to choose which modules to include
- ✅ **Array Content**: Some modules have dynamic arrays (Task/Hazard entries, signatures, photos)

### **What "Dynamic" Does NOT Mean:**

- ❌ **Field Creation**: Fields within modules are hardcoded TypeScript interfaces
- ❌ **Schema Validation**: No Zod needed - validation is module-specific functions
- ❌ **Runtime Field Definition**: No user-created custom fields

**Validation Strategy**: Loosely enforced - fields recommended but not required. Guided mode prompts, Quick mode allows blanks. Backend accepts incomplete forms.

## 📱 **Device Switching - Critical Construction Site Feature**

**Why Device Switching Matters**: Construction workers frequently need to switch between devices during form completion due to harsh site conditions, battery failures, shared equipment, and different tasks requiring different devices.

### **Real-World Scenarios:**

- **Phone → Tablet**: Worker starts FLRA on phone during site walk, continues on tablet in site office
- **Personal → Shared Device**: Worker's phone battery dies, continues on shared company tablet
- **Shift Handoffs**: Day shift starts form, night shift completes it on different device
- **Emergency Situations**: Device damage requires immediate continuation on backup device

### **Technical Implementation:**

```typescript
interface DeviceSwitchStrategy {
  sessionManagement: 'supabase-auth'; // JWT with automatic refresh
  stateSync: 'on-focus'; // Sync when app gains focus + auto-save
  conflictResolution: 'last-write-wins'; // Most recent timestamp wins
  syncIndicator: true; // Always show sync status
}
```

### **How It Works:**

1. **Authentication**: User logs in once per device with same credentials
2. **Data Sync**: Forms automatically sync when app gains focus + continuous auto-save
3. **Conflict Resolution**: Most recent changes win (simple, predictable for workers)
4. **User Experience**: Clear sync status indicators, simple notifications

**Backend-Centric Approach**: Since HrdHat has Supabase backend, forms are always rebuilt from latest server data, making device switching seamless and reliable.

There are Two primary ways to fill out an FLRA in HrdHat:

    Guided Mode

        One question per screen

        Smooth "click-in" transitions between fields

        Ideal for step-by-step focus

    Quick View

        Multiple rows/questions on a single scrollable page

        No columns—just a vertical list

        Faster "all-at-once" fill experience

## Progress Tracking

HrdHat includes a **right-side progress tracker** that shows module completion status:

- **Mobile**: Floating 40px tracker with completion indicators (✓ ○ ●)
- **Tablet/Desktop**: Expanded 300px panel with module names and progress bars
- **Psychology**: Designed to make incomplete forms feel "unfinished" to encourage completion
- **Navigation**: Tap any module indicator to jump directly to that section

## Data model

The application contains the following models:

- User - can have one of these roles:

  - `USER` - can:
    - edit own profile
    - create/fill out/access/stave/submit Forms:
      - Create
      - Fill out
      - Access Active and Archived form
      - Modify Active Forms
      - Generate Pdf
      - Modify what modules a user wants in there forms.
    - edit what modules are part of what form. (This is a phase 2)

**📝 Note**: Form auto-archive (16 hours) implemented via Supabase Edge Function. Manual archive also available via user action.

## Get Started

To get started with the HrdHat application:

1. **Prerequisites**: Ensure you have Node.js and npm installed
2. **Installation**: Clone the repository and install dependencies
3. **Configuration**: Set up your environment variables (see Configuration section in README)
4. **Development**: Run the development server

For detailed setup instructions, check the [README.md](../../README.md) file in the frontend directory.
