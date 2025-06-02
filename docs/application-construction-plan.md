# HrdHat Application Construction Plan

## 🎯 **Mission Statement**

HrdHat is a **tool for tradespeople** to efficiently complete daily safety forms, not a data analytics or reporting platform. Our focus is on making safety paperwork fast, intuitive, and reliable for construction workers in the field.

**📊 Plan Status**: 96% complete - Implementation ready after completing FormSAMPLE.html analysis and module templates

## 🚫 **Development Focus - Do Nots**

**❌ DO NOT ADD:**

- Complex reporting queries or dashboards
- Data analytics or trend analysis features
- Advanced search across form content
- Business intelligence or metrics
- Cross-form data aggregation
- Supervisor analytics dashboards
- Performance reporting systems

**✅ DO FOCUS ON:**

- Fast form loading and saving
- Reliable device switching
- Offline form completion
- Quick PDF generation
- Construction site usability
- Touch-first mobile experience
- Paper-like PDF output

---

PHASED APPROACH:

# Phase 1: MVP Roll-out & Core Form Workflow

## 1. User Journeys & Stories

- **Signup**

  - New users enter First Name, Last Name, Company, Email
  - Email authentication only required after 24 hours;

- **Create & Fill Form**

  - User taps "New FLRA" to create a blank form based on a default template
  - Two fill modes:
    - **Quick** (default): fast, single-screen checklist
    - **Guided**: step-through, one-question-at-a-time

- **Active Forms Drawer**

  - User can access up to 5 active forms
  - Forms older than 16 hours auto-archive (✅ **RESOLVED**: Supabase Edge Function with cron job)
  - Users can also manually archive forms at their convenience via archive button/action

- **Archive & PDF**
  - User can view archived forms list from Archived Forms drawer.
  - Archived forms become read-only; users can duplicate or export to PDF
  - PDF output mimics traditional paper forms, designed for construction site workflows

---

## 2. UI / UX Breakpoints & Features

| Tier    | Width (px) | Layout/Features                            |
| ------- | ---------- | ------------------------------------------ |
| Mobile  | 0 – 599    | Single-column, touch-first, camera upload  |
| Tablet  | 600 – 1023 | Two-column, moderate navigation visibility |
| Desktop | 1024+      | Multi-column, full toolbar and panels      |

- **Mobile-Only Features:**

  - Camera/photo upload
  - Sliding Sidebar on left.
  - Bottom drawer for Active Forms
  - Progress Tracker on right edge (40px width)
    - Module completion indicators (6 modules: ✓ complete, ○ incomplete, ● current)
    - Tap to jump to specific module
    - Overall completion percentage
    - Psychological design to make incomplete forms feel "unfinished"
  - Portrait mode only

- **Tablet/Desktop Features:**
  - Persistent sidebar and slide-out panel
  - Toolbar with navigation and fill mode options
  - Progress Tracker: Expanded right panel (300px width)
    - Module names + completion status
    - Progress bars per module
    - "Make user feel it's not done" visual cues
    - Overall form completion percentage

---

## 3. Data Model & Sync

- All form data is stored as JSONB in the database
- Only minimal metadata (form ID, creator, timestamps, etc.) is stored as separate fields
- The front-end maintains form state in memory and syncs it with the backend using debounced auto-save
- Upon switching devices or reloading, the latest form data is pulled from the backend and rehydrated on the client
- Local cache (localStorage/AsyncStorage) ensures no data loss if the device goes offline or the page reloads

### **Device Switching Implementation - RESOLVED**

**Status**: ✅ **COMPLETE** - Technical specifications defined and ready for implementation

**Implementation Strategy**:

```typescript
interface DeviceSwitchStrategy {
  sessionManagement: 'supabase-auth'; // JWT with automatic refresh
  stateSync: 'on-focus'; // Sync when app gains focus + auto-save
  conflictResolution: 'last-write-wins'; // Most recent timestamp wins
  syncIndicator: true; // Always show sync status
}
```

**Technical Details**:

1. **Session Management**: Supabase authentication with JWT tokens

   - User logs in once per device with same credentials
   - Automatic token refresh maintains session across devices
   - Zustand is used for authentication state, holding the current user, loading, and error states, and is kept in sync with Supabase Auth. This enables protected routes and global access to user state throughout the app.
   - No complex session synchronization needed

2. **Sync Timing**: On-focus sync + continuous auto-save

   - Primary: Sync when app gains focus (device switch detection)
   - Secondary: Debounced auto-save (2-second intervals)
   - Result: Latest data always available on any device

3. **Conflict Resolution**: Last-write-wins approach

   - Most recent `updated_at` timestamp wins
   - Simple, predictable behavior for construction workers
   - No complex merge logic - keeps implementation reliable

4. **User Experience**: Clear sync status indicators
   - Visual sync status (✓ Saved, ⟳ Syncing, ⚠ Offline, ✗ Error)
   - Simple notifications: "Form updated with latest changes"
   - No complex conflict resolution UI needed

**Implementation Flow**:

```typescript
// Device switching service implementation
const handleAppFocus = async () => {
  // 1. Fetch latest form data from Supabase
  const latestForm = await supabase
    .from('form_instances')
    .select('*')
    .eq('id', formId)
    .single();

  // 2. Update local state with latest data
  useFormStore.setState({
    formData: latestForm.form_data,
    lastSaved: new Date(latestForm.updated_at),
  });

  // 3. Show simple notification
  showNotification('Form updated with latest changes');
};
```

**Why This Approach Works**:

- **Backend-Centric**: Forms rebuild from Supabase data automatically
- **Simple**: No complex conflict resolution needed
- **Reliable**: Supabase handles authentication and data persistence
- **Fast**: JSON data loads quickly on device switch
- **Construction-Ready**: Workers don't need to understand complex sync logic

**Ready for Implementation**: Chapter 6.2 - Form Lifecycle with Device Switching Support

---

## 4. Routing Strategy & Navigation

### **Custom App.tsx Routing Approach**

HrdHat uses a **custom routing solution** implemented directly in `App.tsx` rather than external libraries like React Router. This approach is perfect for our construction worker-focused app because:

- **Lightweight**: No external dependencies, smaller bundle size for mobile users
- **Simple**: Only 6 main routes needed - no complex nested routing
- **Fast**: Direct route switching without router overhead
- **Integrated**: Seamless integration with Zustand state management for both navigation and authentication state
- **Controlled**: Full control over navigation logic and performance

### **Route Structure**

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

### **Implementation Strategy**

```typescript
// frontend/src/App.tsx - Core routing logic
function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});
  const { user } = useAuthStore();

  // Navigation function passed to all components
  const navigate = (path: string, params?: Record<string, string>) => {
    const url = params ? `${path}?${new URLSearchParams(params)}` : path;
    window.history.pushState({}, '', url);
    setCurrentRoute(path);
    setRouteParams(params || {});
  };

  // Browser back/forward support
  useEffect(() => {
    const handlePopState = () => setCurrentRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Protected route logic
  const renderRoute = () => {
    if (!user && !currentRoute.startsWith('/auth')) {
      return <AuthFlow onNavigate={navigate} />;
    }

    switch (currentRoute) {
      case '/': return <Dashboard onNavigate={navigate} />;
      case '/form': return <FormEditor formId={routeParams.id} mode="quick" onNavigate={navigate} />;
      case '/form/guided': return <FormEditor formId={routeParams.id} mode="guided" onNavigate={navigate} />;
      case '/archived': return <ArchivedForms onNavigate={navigate} />;
      case '/profile': return <Profile onNavigate={navigate} />;
      case '/auth/login':
      case '/auth/signup': return <AuthFlow mode={currentRoute.split('/')[2]} onNavigate={navigate} />;
      default: return <Dashboard onNavigate={navigate} />; // 404 fallback
    }
  };
}
```

### **Deep Linking & URL Parameters**

**Form Editing Deep Links:**

- `/form/abc123` - Opens form in Quick mode
- `/form/abc123/guided` - Opens form in Guided mode
- `/form/abc123?module=general` - Opens form at specific module
- `/form/abc123/guided?module=hazards&step=2` - Guided mode at specific step

**Navigation State Integration:**

```typescript
// Zustand store integration
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

### **Mobile-First Navigation Patterns**

**Mobile (0-599px):**

- Bottom navigation bar for main routes
- Swipe gestures for form module navigation
- Back button behavior respects form editing state

**Tablet (600-1023px):**

- Side navigation panel
- Breadcrumb navigation for form editing
- Tab-style navigation for Quick/Guided modes

**Desktop (1024px+):**

- Full navigation sidebar
- Keyboard shortcuts for power users
- Multi-panel layout with persistent navigation

### **Route-Specific Features**

**Dashboard (`/`):**

- Active forms grid/list
- Quick actions (New Form, Recent Forms)
- Navigation to archived forms

**Form Editor (`/form/:id`):**

- Mode switching (Quick ↔ Guided)
- Module navigation (Progress Tracker)
- Auto-save with URL state preservation
- Exit confirmation for unsaved changes

**Archived Forms (`/archived`):**

- Read-only form viewing
- PDF export functionality
- Form duplication to create new active forms

**Profile (`/profile`):**

- User settings
- Module template customization (Phase 2)
- Account management

### **Implementation Timeline**

**Chapter 6 - Frontend Layout (Current Priority):**

1. Implement basic App.tsx routing structure
2. Create placeholder components for each route
3. Add navigation function prop passing
4. Implement protected route logic

**Chapter 7 - Form Workflows:**

1. Add form-specific routing (mode switching)
2. Implement module navigation via URL params
3. Add deep linking for form editing states
4. Integrate with form auto-save

**Chapter 8 - Polish & Optimization:**

1. Add route transition animations
2. Implement advanced navigation patterns
3. Add keyboard shortcuts for desktop
4. Optimize route switching performance

### **Where to Start Implementation**

**Immediate Next Steps:**

1. **Update App.tsx** - Replace current placeholder with routing logic
2. **Create Route Components** - Basic placeholder components for each route
3. **Add Navigation Store** - Zustand store for navigation state
4. **Implement Protected Routes** - Auth-based route protection
5. **Test Basic Navigation** - Ensure all routes render correctly

**Recommended Implementation Order:**

```typescript
// Step 1: Basic routing in App.tsx
// Step 2: Dashboard component (form list)
// Step 3: AuthFlow component (login/signup)
// Step 4: FormEditor component (basic structure)
// Step 5: ArchivedForms component
// Step 6: Profile component
// Step 7: Add navigation between components
// Step 8: Implement deep linking and URL parameters
```

This routing strategy provides a solid foundation for HrdHat's navigation needs while maintaining the simplicity and performance required for construction site use.

---

## 5. Phase 1 Deliverables

1. **Account & Auth:**

   - Minimal sign-up flow, with email auth required after 24 hours

2. **Form Creation & Life-Cycle:**

   - New forms start as Active
   - Auto-archive after 16 hours
   - Archived forms are read-only

3. **Fill Modes & Navigation:**

   - Quick and Guided fill options
   - Responsive UI for all device tiers

4. **Data Persistence:**

   - All form content saved as JSONB
   - Debounced auto-save
   - Local client caching for resilience

5. **PDF Export:**
   - PDF generation mimics completed paper forms
   - Users can export and share filled FLRA PDFs

---

Goal:
Deliver a lightweight, cross-device FLRA app with account signup, form creation & editing, active-form management, archiving, and PDF generation—available on phone, tablet, and desktop in two fill modes (Quick & Guided).

From a ui/ux perspective the goal will be to have 2 ways to fill out a form. Quick (Defualt) and Guided mode. The goal for most modules (Ie: General Information Module) will be for them to

The app will be tailored toward Desktop, Tablets and Phones.
Tier Min-width (px) Max-width (px) Notes
Mobile 0 599 "Phone" view—single-column, touch-first
Tablet 600 1023 "Tablet"/small-desktop—two-column layouts
Desktop 1024 ∞ Full-width, multi-column, complex UI
There will be mobile-only features (e.g. camera upload)

A form will have a life cycle. A new form will be created as an "Active Form". Either by the users request or after 16h the form will Auto Archive.

The goal for creating an account should be as simple as possible with minimum authentication (email only, Only required after 24h.). When the person create and account it should be First Name, last name, company and thats it.

Each new form is instantiated from the user's default module template. In Phase 1, everyone's forms start with this predefined set of modules. (Module customization comes in Phase 2.)

An Archived form is a Read Only form that can be used for duplication & converting to pdf.

Select library for pdf converstion and implement. tml2pdf, Puppeteer, PDFKit? The pdf will mimic a completed peice of paper that construction workers are used. (Minimum pages with as many modules as reasonably possible)

Data Sync & Storage: Form Instances and Form Data will be stored as JSONB pulled from supbase

    How do you handle switching devices mid-form? JSON will help with rendering

Authentication & Onboarding

    You say "create an account," but what's the flow? Email/password? OAuth?

    Will you require email verification, password resets, multi-factor?

Form Lifecycle

    "Generate FLRA form" → does that mean "instantiate a new blank form" from a template?

    How do users pick which modules go into their form (or is that fixed in Phase 1)?

    What happens when they "archive" a form—does it get read-only?

Two Fill Modes

    Guided = zoomed-in, one question at a time

    Quick = multi-row (mid) view

    Which mode is default? Can users switch mid-form?

    Will answers auto-save on change or only on "Next"/"Save"?

PDF Generation

    Which library or approach? html2pdf, Puppeteer, PDFKit?

    Will the PDF exactly mirror the Quick view, or a custom print layout?

Responsive Targets

    You mention Desktop, Tablet, Phone—what breakpoints will you support?

    Are there any mobile-only features (e.g. camera upload)?

Data Sync & Storage

    Phase 1: local only, or live Supabase persistence?

    How do you handle switching devices mid-form?

Error & Edge Cases

    What if network drops? Offline support?

    Maximum number of active forms? (We'd discussed "5" earlier.)

## Phase 2:

(Module customization)
(Supervisor Review of Form)
(Reacall Button)
