# Form Plan Documentation

**Status:** Implementation Ready  
**Last Reviewed:** Thu, Jun 5, 2025

> For implementation details on versioning, audit, and metadata, see the "Form Versioning & Definition Management Plan" at the end of this document.

## Module Classification: Simple vs. Complex

In HrdHat, form modules are classified as either **Simple** or **Complex** based on their rendering and logic requirements:

- **Simple Modules**: Use standard rendering (text inputs, checkboxes, radio buttons, etc.) and do not require custom logic. These modules are straightforward, reusable, and have no dependencies on user profile or dynamic data.
- **Complex Modules**: Require custom rendering and/or logic. These modules may interact with user profile data, generate hidden metadata, handle dynamic arrays, or have advanced UI/UX requirements. Examples include: FormHeader (metadata), General Information (user profile integration), PhotosModule, SignaturesModule, and Task Hazard Control Module.

## Purpose of This Folder

This folder contains all documentation and specifications related to form operation in HrdHat, including:

- How forms load and operate per user
- Logic and workflow for form handling
- Field definitions for all modules (Simple and Complex)
- User-specific behaviors and data flows
- Guidelines for module development and integration
- **Versioning, audit, and metadata standards** (see plan at end)

All form-related logic, field specifications, and operational details will be maintained here to ensure clarity and consistency across the project.

## Form Structure

Every form in HrdHat consists of two always-present top-level blocks:

### 1. Form Header (Display)

- **Logo**: The organization or project logo (displayed at the top of the form).
- **Full Form Name**: The human-readable name of the form (e.g., "Field Level Risk Assessment").
- **Form Number**: A modifiable, auto-generated identifier. Format: [YYYYMMDD]-[NN], where NN is a 2-digit incrementing number for forms created on the same day. This field is visible and can be edited if needed.

### 2. Form Metadata (Hidden/System)

- **Unique Key**: System-generated unique identifier for the form (not shown in UI).
- **Date Created**: Timestamp of form creation (system-managed).
- **Last Updated**: Timestamp of last modification (system-managed).
- **Status**: Indicates the current state of the form. Allowed values: `active`, `archived`. All forms remain in a single table; status is used for filtering and workflow (e.g., only active forms are shown in the main UI, archived forms are accessible in a separate view).
- **Created By (User ID)**: Identifier of the user who created the form.
- **Last Modified By (User ID)**: Identifier of the user who last updated the form.
- **formDefinitionId**: Identifier for the form template/definition this instance is based on.
- **formDefinitionVersion**: The version of the form definition/template used to create this instance. (This is the only version field for the instance; see versioning plan for details.)
- **Audit Trail**: Log or reference for tracking changes (who, what, when). Currently limited to row-level metadata (`created_at`, `updated_at`, `created_by`, `updated_by`).
- **Organization ID**: (Optional, Phase 2) For multi-tenant support, links form to an organization.
- **Project ID**: (Optional, Phase 2) For project-scoped forms, links form to a project.
- **Submission Timestamp**: (Optional, Phase 2) When the form is formally submitted for review/approval.
- **Other Metadata**: Any additional system fields required for tracking, auditing, or integration. Not rendered in the form UI.

> **Note:** Storing all forms in a single table with a status field is preferred over using separate tables for active and archived forms. This approach simplifies data management, preserves audit trails, and allows for flexible status handling as the application evolves.
>
> **Versioning Note:**
> Each form instance references the form definition and version it was created from using `formDefinitionId` and `formDefinitionVersion`. This ensures that even as form structures and modules evolve, each instance can be rendered and validated according to its original definition. In Phase 2+, full versioning and user-specific customization (such as user-specific form structure or module overrides) will be implemented. Audit trails will track changes to both definitions and instances for traceability.

# Form Versioning & Definition Management Plan (Implementation Summary)

**Status:** Implementation Ready  
**Last Updated:** Thu, Jun 5, 2025  
**Cross-References:** Project Standards, Project Structure, State Management Architecture, Data Flow Architecture

---

## 🎯 Purpose & Scope

Define how HrdHat will version, store, validate, and manage form definitions and instances. Covers:

- Immutable storage and versioning of form templates
- Separation between definition (template) and instance (user submission)
- Minimal backend checks and JSONB storage
- Draft vs. published workflow
- User-forked templates
- Auditability, cleanup, and monitoring

---

## 🗂️ Key Principles

- **Immutable Definitions:** Every modification creates a new row/version; no in-place edits.
- **Instance-Definition Separation:** Form instances always reference a specific definition version.
- **JSONB Storage:** Entire definition (modules + validation) lives in one JSONB blob.
- **Auditability:** All versions are preserved. Old rows never overwritten.
- **User Customization:** Forks are immutable, tracked separately from base templates.
- **UI Consistency:** Only major/structural version bumps are exposed; drafts remain hidden until published.

---

## 📝 Detailed Plan

### 1. Definition vs. Instance

- **Decision:** Keep all form templates in a dedicated form_definitions table. Each form instance refers to its definition by formDefinitionId and formDefinitionVersion.
- **Implementation:**
  - Create form_definitions table with columns:
    - id (UUID, PK)
    - version (integer)
    - created_by (UUID), updated_by (UUID)
    - created_at (timestamp), updated_at (timestamp)
    - status (text: "draft" or "published")
    - forked_from_version (integer, nullable)
    - definition_jsonb (JSONB)
    - validation_rules (JSON)
  - When inserting a new template:
    - Verify that definition_jsonb.moduleList exists and is an array (backend assertion).
    - Assign version = (highest existing version for this template ID) + 1.
    - Default status = draft for in-progress edits; only update to published when ready.
  - For each form instance, add columns:
    - formDefinitionId (UUID)
    - formDefinitionVersion (integer)

### 2. Storage & Immutability

- **Decision:** Store entire module structure and validation schema in definition_jsonb. No normalization at this stage; one row = one full JSONB snapshot.
- **Implementation:**
  - Backend assertion before each INSERT:
    ```js
    if (
      !payload.definition_jsonb.moduleList ||
      !Array.isArray(payload.definition_jsonb.moduleList)
    ) {
      throw new Error('Invalid definition: missing or malformed moduleList');
    }
    ```
  - Never UPDATE the existing JSONB; always insert a new row for any change.
  - If duplication concerns arise, refactor later to normalize common modules, but defer until Phase 2.

### 3. Versioning Policy

- **Decision:** Use simple integer versioning (v1, v2, ...). "Published" versions are visible; "draft" versions remain hidden until published.
- **Implementation:**
  - On template creation, set version = 1 and status = published.
  - For any subsequent change:
    - Create a new row with version = previousVersion + 1 and status = draft.
  - Only mark status = published when structural/UX changes are finalized.
  - Document in the developer checklist which changes require a version bump:
    - Structural (adding/removing fields, rearranging modules)
    - Validation rule changes
    - Label/UI text changes intended for end users
    - Minor text tweaks can remain in draft until grouped for a published version

### 4. Validation & Rendering

- **Decision:** Store a validation schema JSON alongside each definition. Frontend will interpret at runtime to validate inputs. Forms render only fields defined in that version.
- **Implementation:**
  - Add validation_rules column in form_definitions:
    ```json
    {
      "fields": {
        "fieldKey1": {
          "type": "string",
          "required": true,
          "minLength": 3,
          "maxLength": 50,
          "pattern": "[A-Za-z ]+"
        }
        // ...
      },
      "additionalRules": {
        /* optional extension */
      }
    }
    ```
  - Frontend FormRenderer steps:
    1. Load the definition JSONB for (definition_id, version).
    2. For each field in moduleList, find its corresponding rules in validation_rules.fields[fieldKey].
    3. Enforce required, minLength, maxLength, pattern. If new rule types needed (e.g., numeric ranges), extend additionalRules.
    4. Wrap rendering in runtime guards:
    ```jsx
    {field?.label ? (
      <Input label={field.label} ... />
    ) : (
      <Alert message={`Field '${key}' not available in this version.`}/>
    )}
    ```
    Show a clear fallback UI message rather than silently skipping missing fields.

### 5. User Customization & Forks

- **Decision:** Allow users to fork base templates; each fork is immutable and has its own version history. Custom templates never get overwritten by admin changes.
- **Implementation:**
  - On "Fork Template" action:
    - Copy the base template's JSONB into a new form_definitions row.
    - Set created_by = user_id, forked_from_version = baseVersion, status = published.
  - Template selector UI:
    - List "Base Templates": WHERE created_by IS NULL AND status = published
    - List "My Custom Templates": WHERE created_by = currentUserId
    - Display forked_from_version and updated_at so users know their fork's lineage and recency.
  - Future extension: if an admin publishes a new base version, custom forks remain on their original version unless user explicitly re-forks or migrates manually.

### 6. Audit Trail & Change History

- **Decision:** Rely on row-level metadata (created_at, updated_at, created_by, updated_by). Per-field change logs are out of scope for Phase 1.
- **Implementation:**
  - Always insert new rows on edits. Never overwrite existing JSONB.
  - If field-level history is later required, create definition_change_log with columns:
    - id (UUID)
    - definition_id (UUID)
    - field_key (text)
    - old_value (text)
    - new_value (text)
    - changed_by (UUID)
    - changed_at (timestamp)
  - Document migration path for digesting historical JSON blobs into a change-log table if ever needed.

### 7. Migration & Compatibility

- **Decision:** Existing form instances remain immutable. If a new version adds required fields, those fields simply won't appear on old instances. No automatic backfill.
- **Implementation:**
  - In FormRenderer, load definition_jsonb for the instance's (definition_id, version).
  - Only render fields present in that JSON. Newly added fields in version 4 won't render for instances on version 3.
  - If a field key is deprecated or renamed:
    - Write a one-off migration script to update all affected JSONB blobs in both form_definitions and form_instances table.
    - Log the migration in version control.
    - If multiple renames become common, consider adding a translation layer that maps old keys to new keys at runtime.

### 8. Storage Bloat & Cleanup

- **Decision:** Retain every definition version indefinitely to ensure full auditability.
- **Implementation:**
  - Add a monitoring task to the ops checklist: run monthly:
    ```sql
    SELECT pg_size_pretty(pg_total_relation_size('public.form_definitions'));
    ```
  - If size > 5 GB, convene a meeting to decide on pruning or archiving.
  - In Phase 2 (or sooner if performance degrades), add a GIN index on definition_jsonb to accelerate queries:
    ```sql
    CREATE INDEX idx_form_definitions_jsonb ON public.form_definitions USING GIN(definition_jsonb);
    ```

### 9. Metadata Completeness

- **Decision:** Surface both created_at and updated_at in the UI when listing templates. Format as YYYY-MM-DD HH:mm to avoid ambiguity.
- **Implementation:**
  - In the template list component, display:
    - Name (from JSONB, e.g. definition_jsonb.formName)
    - Version (integer)
    - Created At (formatted)
    - Last Updated (formatted)
    - Status ("draft" vs. "published")
    - Owner (if created_by is not null)

### 10. Component Mapping & UI Rendering

- **Decision:** Maintain a flat lookup from field type strings to React components. Avoid renaming type keys unless accompanied by a migration script.
- **Implementation:**
  - Create ComponentRegistry.ts:
    ```ts
    export const RENDERER_MAP: Record<string, React.ComponentType<any>> = {
      text: TextInputComponent,
      number: NumberInputComponent,
      date: DatePickerComponent,
      datetime_picker: DateTimePickerComponent,
      checkbox: CheckboxComponent,
      // ...other field types
    };
    ```
  - In FormRenderer:
    - For each field definition, do:
      ```ts
      const Renderer = RENDERER_MAP[field.type];
      if (!Renderer) {
        return <Alert message={`No renderer for type '${field.type}' (version ${version}).`} />;
      }
      return <Renderer field={field} ... />;
      ```
    - If a field's type is ever renamed:
      - Write a migration to update all JSONB blobs in form_definitions and existing form_instances.
      - Commit the migration and update ComponentRegistry.ts accordingly.

### 11. Monitoring & Health Checks

- **Decision:** Log query performance monthly; add automated alerts if needed.
- **Implementation:**
  - In Phase 1, instrument the code that fetches definitions:
    ```js
    const start = Date.now();
    const result = await db.query(
      'SELECT definition_jsonb FROM public.form_definitions WHERE id = $1 AND version = $2',
      [id, version]
    );
    const elapsed = Date.now() - start;
    await db.query(
      'INSERT INTO performance_metrics (query_name, elapsed_ms, measured_at) VALUES ($1, $2, NOW())',
      ['fetch_definition', elapsed]
    );
    ```
  - Review performance_metrics monthly. If average elapsed > 50 ms, schedule a GIN index earlier.
  - For table-size, run:
    ```sql
    SELECT pg_total_relation_size('public.form_definitions') AS total_size;
    ```
    —manually compare to threshold or automate an email alert if using any CI/cron pipeline.

### 12. Drafts vs. Published Workflow

- **Decision:** Keep minor/tweak changes in status = draft until ready. Only versions with status = published appear for selection.
- **Implementation:**
  - When editing an existing definition:
    - Copy the "published" row into a new row with status = draft and version = publishedVersion + 1.
    - Perform edits on the new draft row.
    - When QA is complete, update status = published and optionally mark the previous published row as "superseded."
  - In template selector UI:
    - Filter out status = draft.
    - Visually distinguish drafts (e.g., gray out, show "(Draft)" badge) in any internal lists.

### 13. Error Handling & Fallbacks

- **Decision:** Always show an explicit fallback if a field is missing or its renderer key is unknown.
- **Implementation:**
  - Wrap every lookup in FormRenderer with:
    ```ts
    if (!field || !field.key) {
      return <Alert message={`Field data missing for key: '${key}' (version ${version}).`} />;
    }
    ```
  - If component lookup fails (!Renderer), display:
    ```jsx
    <Alert
      message={`No renderer for type '${field.type}' in version ${version}.`}
    />
    ```
  - Log these errors to an "UI errors" table for later review.

---

## ✅ Implementation Checklist

- [ ] Create form_definitions table (with columns: id, version, status, created_by, updated_by, created_at, updated_at, forked_from_version, definition_jsonb, validation_rules)
- [ ] Add formDefinitionId and formDefinitionVersion to form_instances table
- [ ] Add minimal backend assertion for definition_jsonb.moduleList before insert
- [ ] Document/version bump policy in DEV_CHECKLIST (which changes trigger a new version)
- [ ] Implement "draft" vs. "published" workflow (status column + UI filters)
- [ ] Build validation-schema JSON shape and interpreter in front-end (covering type, required, minLength, maxLength, pattern, additionalRules)
- [ ] Add runtime guards/fallback messages in FormRenderer for missing fields or renderers
- [ ] Create ComponentRegistry.ts with type→component mapping; document naming conventions
- [ ] Separate "Base Templates" vs. "My Custom Templates" in selector UI; show created_at, updated_at, and forked_from_version where applicable
- [ ] Instrument definition lookup with EXPLAIN ANALYZE (or manual timing) and log to performance_metrics
- [ ] Add a monthly ops task to check:
  - Definition table size (pg_total_relation_size('form_definitions'))
  - Average lookup time (via performance_metrics)
- [ ] Format and surface timestamps as YYYY-MM-DD HH:mm in UI lists
- [ ] Maintain migration scripts/logs for any renames or schema updates
  - Write utilities (or document processes) for one-off JSONB migrations when renaming field/component keys

---

## 📚 References

- Project Standards
- Project Structure
- State Management Architecture
- Data Flow Architecture
- Module Registry & Dynamic Form Assembly
