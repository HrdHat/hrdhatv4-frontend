Audit of Versioning Proposal

    Separation of Definition vs. Instance

        Strength: You correctly identify that definitions (templates) must be immutable and instances reference a specific version.

        Potential gap: How will you store each definition snapshot? Will you copy the full JSON/schema into a "definitions" table, or point to a git-like diff? Full copies ensure simplicity, but can grow large over time.

        Answer: Store the full JSON/schema for each version in a form_definitions table. This is the fastest to implement (just a JSONB column), requires no diff logic, and is easy to query. It matches our current plan (see "JSONB schema design for database" in Chapter 1.5.1 and "form_templates" in appplansteps.md). If storage ever becomes an issue, we can add diffing or pruning later.

    Definition Storage and Immutability

        Feedback: Ensure you have a dedicated "form_definitions" (or similar) table that never allows in-place edits; every change must create a new row with an incremented version.

        Question: Do you plan to store the entire module structure in JSONB for each version, or keep separate module records and link them? Keeping module definitions normalized reduces duplication but complicates lookups.

        Answer: Store the entire module structure as a single JSONB blob per definition version. This is the least work (one table, one column), and matches our current database schema (see "form_templates" and "form_data JSONB" in appplansteps.md). If we need to deduplicate modules in the future, we can refactor to normalization.

    Version Identifier Granularity

        Feedback: You suggest a simple integer/string (v1, v2). That works—but consider whether semantic versioning (e.g., 2.1.0 vs. 2.2.0) could help when you make minor tweaks (e.g., label text changes vs. field-type changes).

        Question: How granular do you need version numbers? Will a cosmetic change bump the version, or only structural/validation changes?

        Answer: Use a simple integer version (v1, v2, v3) for now. This is the easiest to implement and reason about, and matches our current plan (see "version" field in form metadata). If we need more granularity, we can switch to semantic versioning later without breaking existing data.

    Impact on Rendering & Validation

        Feedback: Storing formDefinitionVersion on each instance lets you render old forms correctly. However, your validation logic must explicitly load the matching definition-version to validate field types, required flags, etc. If you later remove a field from v3, how will you validate an instance still containing that field?

        Question: Do you plan to archive validation rules for each version in the database (e.g., Zod schemas tied to version), or rely on code branches?

        Answer: Archive a validation schema (as JSON or TypeScript type definition) in the database with each definition version. This is lightweight (just a field in the definition record), and lets us expand to more complex validation logic later. Our docs require versioned validation (see "validation rules and cross-module relationships defined" in Chapter 1.5.1). We do not use Zod, so this will be a plain object or type.

    User-Specific Customizations (“Forks”)

        Feedback: You mention storing a customDefinition or "diff" for user overrides. That can be complex. A simpler approach is: when a user customizes, create a new definition-version that inherits from the base, then let future base changes either merge or diverge.

        Question: Will users be able to rebase their custom version onto a newer base definition, or will their fork effectively "freeze" at its original version? How will you manage conflicts?

        Answer: For now, user forks are immutable (frozen) at their version. This is the least work and avoids merge logic. If we need rebasing/merging, we can add a parentVersion field and build migration tools later. This matches our plan for user-specific customization in Phase 2+ (see "user-specific customization" in Versioning Note).

    Audit Trail & Change History

        Feedback: You include an "Audit Trail" field under metadata. Clarify whether this tracks only instance-level edits (e.g., user changed "Site Location"), or also definition-level edits (e.g., you modified the template). These are separate concerns; consider two audit tables—one for definition changes, one for instance changes.

        Question: Do you need granular "who changed what field on what version" history, or is "updated_at / updated_by" per definition/instance sufficient?

        Answer: Use updated_at and updated_by for now (already in our schema). This is the least work and covers most audit needs. If we need field-level history, we can add a change log table later. This matches our current audit log plan (see "audit_logs" in appplansteps.md).

    Migration Strategy for New Versions

        Feedback: When you release v4 with a new required field, what happens to existing v3 instances? They keep their v3 version, so you must ensure your UI does not accidentally prompt for a field they don't have.

        Question: Do you intend to backfill older instances to the new structure, or leave them immutable and only apply new fields to fresh forms?

        Answer: Leave old instances immutable. This is the least work, safest, and matches our plan (see "Each form instance references the form definition and version it was created from" in Versioning Note). If we ever need to migrate, we can write explicit scripts.

    Storage Bloat & Cleanup

        Feedback: If each definition-version stores a full JSON, over time you'll accumulate a lot of redundant data. Consider whether minor label tweaks warrant a new version, or if they can be grouped.

        Question: Do you have a plan to prune very old definition versions, or will you keep every tiny change forever?

        Answer: Keep all versions for now. This is the least work and ensures full auditability. If storage becomes an issue, we can add pruning/archiving logic later. This matches our "preserve audit trails" principle in the docs.

    Metadata Fields: Completeness

        Feedback: Your metadata list is comprehensive. One addition: store a definitionTimestamp (when that version was created) on the definition record itself—separate from instance timestamps—so you can audit changes chronologically.

        Question: Do you need a migratedFromVersion field on definitions if you ever merge branches or revert to older templates?

        Answer: Not needed for now. This is the least work. If we add merging/rebasing, we can add migratedFromVersion or parentVersion later. This matches our "future-proofing" approach in the docs.

    Rendering Logic in Codebase

    Feedback: Code must load the correct version at runtime. Ensure your service layer can look up SELECT * FROM form_definitions WHERE id= :formDefinitionId AND version= :formDefinitionVersion.

    Question: Have you planned how front-end components know which renderer to invoke based on version? For example, if v2 changed a "date picker" component to a "calendar widget," how will the UI choose the right component for an instance created under v1?

    Answer: The frontend loads the form definition (and version) for each instance and uses that to determine rendering logic. This is the least work and matches our "Module Registry" and "dynamic form assembly" plan (see Chapter 5.5 in appplansteps.md). If we need more complex logic, we can add a versioned registry or mapping later.

---

    Separation of Definition vs. Instance

        Storing the entire JSONB blob per version is fine for now.

        Follow-up question: Have you considered whether you'll need any JSONB indexes (e.g., GIN) to query definitions quickly by module or field? If you later need to search within those blobs, performance could suffer without an index.

        Answer: We will add a GIN index to the JSONB column in Phase 2 to support fast recall and advanced search. This is a simple, low-risk migration and aligns with our future recall/search features. See appplansteps.md (Phase 1.5.2: Core Database Schema Implementation) and backend-mangement-plan.md for this plan.

    Definition Storage and Immutability

        A dedicated form_definitions table with one JSONB column per row is straightforward.

        Follow-up question: How will you enforce that every definition row matches your expected schema shape (e.g., moduleList is an array of objects with keys: id, type, label, etc.)? Without some server-side validation, someone could insert malformed JSON. Consider a lightweight JSON schema check when inserting.

        Answer: For now, rely on TypeScript types and frontend validation. In the future, add a lightweight JSON schema validation (e.g., ajv or custom check) on the backend before insert. This is the least work now, and matches our "TypeScript-first" approach (see state-management-architecture.md).

    Version Identifier Granularity

        Using a simple integer version (1, 2, 3) is easy.

        Follow-up question: Do you have a documented policy for "which changes bump the version"? For example, will changing only a label bump from 2 → 3, or only structural/validation changes? If you treat every tiny text tweak as a new version, you may end up with many near-identical snapshots. Decide now whether "label only" updates count.

        Answer: For now, bump the version for any change that affects structure, validation, or user experience (including labels). Document this in the dev checklist. In the future, you can refine the policy to only bump for structural/validation changes if version churn becomes a problem. (See "version" field in form metadata and dev checklist in HrdhatConstructionDocs.)

    Impact on Rendering & Validation

        Archiving a validation schema (plain object or type definition) alongside the JSONB is sensible.

        Follow-up question: How will your runtime pick up that validation schema? Will you store it as a JSON-based rules object (e.g., { type: "string", required: true }) or as some serializable TypeScript structure? You'll need code that interprets it. Make sure you clarify format now, so front-end and back-end load it consistently.

        Answer: For now, store validation rules as a JSON object in the definition record (e.g., { type: "string", required: true }). Write a simple interpreter in the frontend to enforce these rules. In the future, you can formalize this as a JSON Schema or similar. (See "validation rules and cross-module relationships defined" in Chapter 1.5.1.)

    User-Specific Customizations (“Forks”)

        Immutable forks simplify implementation.

        Follow-up question: When displaying a list of available definitions to the user, how will you distinguish "base versions" vs. "their custom fork"? Will you surface a separate "My Custom Templates" list? If a user has multiple custom forks, ensure the UI doesn't confuse which version they're editing.

        Answer: For now, add a "createdBy" or "owner" field to each definition. In the UI, show "My Custom Templates" as a separate list from base templates. This is easy to implement and matches our user-centric design. In the future, add more metadata (e.g., forkedFrom) if needed. (See "user-specific customization" in Versioning Note.)

    Audit Trail & Change History

        Relying on updated_at/updated_by is acceptable for now.

        Follow-up question: If at any point you need to track "which field changed" (e.g., the user changed Site Location from A → B), you'll need a change-log table. Can you confirm that "per-field history" is truly out of scope? If, for compliance reasons, you later need to know "who changed the field X on March 1," it'll be a bigger change.

        Answer: Per-field history is out of scope for now. If needed, add a change-log table later. This matches our "audit_logs" plan in appplansteps.md and keeps the initial implementation light.

    Migration Strategy for New Versions

        Leaving old instances immutable is safest.

        Follow-up question: In the UI, you must detect formDefinitionVersion = 3 and hide any new fields introduced in v4. Do you already have logic to compare an instance's version against the current definition and render only the matching fields? If not, you'll need a utility that reads the JSONB definition and builds the form dynamically—otherwise v4 code might break on older data.

        Answer: For now, build the form UI dynamically from the loaded definition JSONB. Only render fields present in the instance's version. This is the least work and matches our "dynamic form assembly" plan (see Chapter 5.5 in appplansteps.md). In the future, add utilities for diffing and migration if needed.

    Storage Bloat & Cleanup

        Retaining every version for full audit is fine.

        Follow-up question: Do you have a rough estimate of how many definition-versions you'll accumulate in six months? If it becomes thousands of ~50 KB JSON blobs, disk space may matter. Even if you leave pruning until later, define a monitoring point (e.g., "if definitions table > 5 GB, revisit").

        Answer: For now, monitor table size periodically (e.g., monthly). If the table exceeds a threshold (e.g., 5 GB), revisit pruning. This is the least work and matches our "preserve audit trails" principle. Add a monitoring task to the ops checklist.

    Metadata Fields: Completeness

        You said you don't need a separate definitionTimestamp because you already have created_at. That works.

        Follow-up question: When someone browses the list of form definitions, will you surface the created_at timestamp so they can see "Version 3 created on 2025-06-01"? If not, consider adding a read-only field in the JSON table for clarity.

        Answer: For now, surface created_at in the UI when listing definitions. This is easy and leverages existing metadata. If more clarity is needed, add a read-only field in the JSON later. (See "created_at" in form_definitions schema.)

    Rendering Logic in Codebase

        Relying on the JSONB definition blob to drive rendering through a "module registry" is aligned with your plan.

        Follow-up question: If v2's schema defines a field as { type: "date" } but v3 changes it to { type: "datetime_picker" }, your code must detect that "renderer key." Have you mapped every possible field type to a component in a version-agnostic way? In practice, you'll need a mapping table (e.g., { "date": DatePickerComponent, "datetime_picker": DateTimePickerComponent }) that remains backward-compatible across versions.

        Answer: For now, maintain a simple mapping table in the frontend (e.g., { "date": DatePickerComponent, "datetime_picker": DateTimePickerComponent }). This is lightweight and matches our "Module Registry" plan (see Chapter 5.5 in appplansteps.md). Expand to a versioned registry if field/component mappings become complex.

Your answers close nearly every gap. A few remaining nitpicks and questions to tighten things up:

    JSONB Indexing (Phase 2 GIN)

        Affirmation: Deferring GIN until Phase 2 is fine—just remember to monitor query performance early on.

        Question: Will you add a database health-check in Phase 1 to log how long definition lookups take? If you see slow queries, you'll know to create that GIN index sooner rather than later.

        Answer: Yes, in Phase 1 we will add a simple health-check query (e.g., log query time for definition lookups) and review it monthly. If queries are slow, we will prioritize the GIN index earlier. This is easy to implement and matches our "monitor, then optimize" approach (see appplansteps.md, Phase 1.5.2).

    JSON Schema Validation on Insert

        You're relying on TypeScript and frontend validation today, with a plan to plug in AJV later. That works, but it means malformed definitions could slip through if someone bypasses the frontend.

        Question: Can you add a single backend check now (e.g., minimal structural assertion) rather than waiting until Phase 2? Even a quick if (!json.moduleList || !Array.isArray(json.moduleList)) throw Error would catch gross mistakes without pulling in a full JSON Schema library.

        Answer: Yes, we can add a minimal backend assertion now (e.g., check for required top-level keys and array types). This is a few lines of code and prevents gross errors. In Phase 2, we can expand to full JSON Schema validation. (See "TypeScript-first" and "validation rules" in state-management-architecture.md and Chapter 1.5.1.)

    Version Bump Policy

        Bumping on any UX/label change will create many snapshots. If you really want to capture "all changes," that's accurate, but be prepared to manage "Version 3 (label tweak)" vs. "Version 4 (structure change)."

        Question: Do you plan to expose every minor version to end users, or will you collapse some label-only updates into a "draft" staging environment before bumping? If you show every bump, users might feel overwhelmed by small increments.

        Answer: For now, only expose major/structural version bumps to end users. Label/UX tweaks can be staged as "draft" or "pending" and only published as a new version when ready. This keeps the UI clean and matches our "user-friendly" approach. (See dev checklist in HrdhatConstructionDocs.)

    Validation Schema Format

        Storing validation as a simple JSON object is workable. But your frontend interpreter must handle every rule (e.g., string length, regex, numeric range). If your rules object remains trivial ("required": true, "type": "string"), that's OK.

        Question: Have you sketched out the exact shape of that JSON object? For instance, do you need { "type": "string", "minLength": 3, "maxLength": 50 }? Clarify now so your interpreter can be written in one pass.

        Answer: Yes, the initial shape will be { type: string, required?: boolean, minLength?: number, maxLength?: number, pattern?: string }. This is easy to interpret and can be extended later. (See "validation rules" in Chapter 1.5.1.)

    User-Created Templates List

        Splitting "My Custom Templates" vs. "Base Templates" via a createdBy field is clear.

        Question: If an admin later wants to push a change to all users' base templates, how will you prevent overriding a user's existing custom fork? You might need a forkedFromVersion field to signal "this is a fork, not inherited."

        Answer: For now, a custom template is never overwritten by admin changes. In the future, we can add a forkedFromVersion field to track lineage and prevent accidental overwrites. (See "user-specific customization" in Versioning Note.)

    Audit-Level Detail

        Relying on updated_at/updated_by is minimal. Understand that you won't be able to answer "Who changed field X" without building a log.

        Question: If a compliance audit demands field-level history, are you comfortable with the work required then? If so, make sure your code paths never overwrite the old definition's JSONB—always create new rows.

        Answer: Yes, we are comfortable with the extra work if required. We will always create new rows for edits, never overwrite old JSONB. If field-level history is needed, we can add a change-log table in the future. (See "audit_logs" in appplansteps.md.)

    Rendering Older Versions

        Dynamically assembling the form from the JSONB ensures you never show fields not in version 3 on a v3 instance. That's good.

        Question: Do you have a fallback if a developer accidentally references a field that doesn't exist in that version's JSON? For example, if code in FormRenderer tries to read field.label but that key changed name in v4, you need a runtime guard so it fails gracefully rather than crashing the form.

        Answer: Yes, we will add runtime guards in the FormRenderer to check for field existence before access. If a field is missing, show a user-friendly error or fallback UI. This is a simple try/catch or optional chaining. (See "dynamic form assembly" in Chapter 5.5.)

    Monitoring Definition Table Size

        Checking table size once a month with a threshold is fine.

        Question: Who is responsible for that monitoring? Will you add a simple SQL metric to your existing application health dashboard, or rely on manual checks? Having an automated alert (e.g., "definition table > 4 GB") could save a headache later.

        Answer: For now, manual checks are sufficient (monthly review by the dev team). In the future, we can add an automated SQL metric and alert to the health dashboard. (See "monitoring task" in ops checklist.)

    Surfacing created_at

        Showing created_at in the UI is trivial. Just expose it in your definition-list component.

        Question: Do you also want to show "last updated" for definitions, so users know which version was edited most recently versus just when it was first created?

        Answer: Yes, we will show both created_at and last_updated in the UI for clarity. This is a simple addition to the definition-list component. (See "created_at" and "updated_at" in form_definitions schema.)

    Component Mapping Across Versions

        A flat mapping of { "date": DatePicker, "datetime_picker": DateTimePicker } is acceptable. As long as you never rename a component key without a migration, you're safe.

        Question: If a future version renames a field's type (e.g., "name": "full_name" → "name": "employee_name"), will you update all instances of that version's JSON? If not, you'll need a translation layer. Make sure you document any such renames to avoid mismatches.

        Answer: For now, we will avoid renaming field/component keys. If a rename is required, we will write a migration script to update all affected JSON instances, and document the change. If this becomes frequent, we can add a translation layer. (See "Module Registry" in Chapter 5.5.)
