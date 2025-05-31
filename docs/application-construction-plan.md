# HrdHat Application Construction Plan

## 🎯 **Mission Statement**

HrdHat is a **tool for tradespeople** to efficiently complete daily safety forms, not a data analytics or reporting platform. Our focus is on making safety paperwork fast, intuitive, and reliable for construction workers in the field.

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
  - Forms older than 16 hours auto-archive

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

---

## 4. Phase 1 Deliverables

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
