# FLRA: Field Level Risk Assessment — Form Definition

**Status:** Implementation Ready  
**Last Updated:** Thu, Jun 5, 2025  
**Cross-References:** [FormSAMPLE.html], [Photo Module Specification], [Form Versioning & Definition Management Plan]

---

## 🎯 Purpose

The FLRA form is the core safety form in HrdHat, used daily by field crews to assess and document site risks, controls, and compliance. It is composed of modular, versioned blocks as per project standards.

---

## 🏗️ FLRA Form Structure

### 1. **Form Metadata** (System/Hidden)

- See [Form Plan Documentation] for full metadata field list.
- Includes: unique key, created/updated timestamps, status, created_by, last_modified_by, formDefinitionId, formDefinitionVersion, audit trail, org/project IDs, submission timestamp, etc.

### 2. **Form Header** (Display)

- **Logo**: Organization/project logo.
- **Full Form Name**: "Field Level Risk Assessment (FLRA)".
- **Form Number**: Auto-generated, editable ([YYYYMMDD]-[NN]).

---

### 3. **Modules and Fields**

#### **A. General Information** (Simple Render, Autofill from Profile)

| Field Key          | Label                  | Type   | Required | Autofill | helperText1                       | helperText2                                             |
| ------------------ | ---------------------- | ------ | -------- | -------- | --------------------------------- | ------------------------------------------------------- |
| project_name       | Project Name           | string | false    | yes      | "Project name for this FLRA."     | "Autofilled from your profile if available."            |
| task_location      | Task Location          | string | false    | yes      | "Location of the task."           | "Autofilled from your profile if available."            |
| supervisor_name    | Supervisor's Name      | string | false    | yes      | "Name of the supervisor."         | "Autofilled from your profile if available."            |
| supervisor_contact | Supervisor's Contact # | string | false    | yes      | "Contact number for supervisor."  | "Autofilled from your profile if available."            |
| todays_date        | Today's Date           | date   | false    | yes      | "Date of assessment."             | "Date format: YYYY-MM-DD. Autofilled from system date." |
| crew_members       | # of Crew Members      | string | false    | yes      | "Number of crew members present." | "Autofilled from your profile if available."            |
| todays_task        | Today's Task           | string | false    | yes      | "Description of today's task."    | "Autofilled from your profile if available."            |
| start_time         | Start Time             | time   | false    | yes      | "Start time of the task."         | "Time format: HH:mm (24-hour)."                         |
| end_time           | End Time               | time   | false    | yes      | "End time of the task."           | "Time format: HH:mm (24-hour)."                         |

#### **B. FLRA Pre-Job/Task Checklist** (Simple Render, Boolean)

| Field Key                       | Label                                                                                          | Type    | Required | helperText1                                                 | helperText2                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------- | ------- | -------- | ----------------------------------------------------------- | ------------------------------------------------ |
| well_rested                     | Are you well-rested and fit for duty?                                                          | boolean | false    | "Confirm you are fit for duty."                             | "Check if you are well-rested."                  |
| trained_competent               | Are you trained and competent for your tasks today?                                            | boolean | false    | "Confirm you are trained for today's tasks."                | "Check if you have the required training."       |
| area_reviewed                   | Have you reviewed the work area for hazards?                                                   | boolean | false    | "Review the work area for hazards."                         | "Check for any visible hazards."                 |
| tools_inspected                 | Have you inspected your tools and equipment?                                                   | boolean | false    | "Inspect all tools and equipment before use."               | "Check for defects or issues."                   |
| ppe_required                    | Do you have the required PPE for today?                                                        | boolean | false    | "Ensure you have all required PPE."                         | "Check your PPE before starting work."           |
| control_measures_reviewed       | Have you reviewed the control measures needed today?                                           | boolean | false    | "Review all control measures for today's tasks."            | "Ensure all controls are in place."              |
| equipment_inspection_up_to_date | Is your equipment inspection up-to-date?                                                       | boolean | false    | "Confirm equipment inspections are current."                | "Check inspection records if unsure."            |
| emergency_procedures_reviewed   | Have you reviewed your emergency procedures?                                                   | boolean | false    | "Review emergency procedures before starting work."         | "Know what to do in an emergency."               |
| flra_completed                  | Have you completed your FLRA / hazard assessment?                                              | boolean | false    | "Complete your FLRA before starting work."                  | "Check that all sections are filled out."        |
| permits_in_place                | Are all required permits in place (if applicable)?                                             | boolean | false    | "Ensure all necessary permits are obtained."                | "Check permit validity dates."                   |
| signage_installed               | Has all safety signage been installed and checked?                                             | boolean | false    | "Install and check all required signage."                   | "Ensure signage is visible and legible."         |
| crew_communication              | Have you communicated with your crew about today's plan?                                       | boolean | false    | "Discuss today's plan with your crew."                      | "Ensure everyone understands their role."        |
| working_alone                   | Are you working alone today?                                                                   | boolean | false    | "Indicate if you are working alone."                        | "Special procedures may apply if working alone." |
| special_controls_needed         | Is there a need for spotters, barricades, or other special controls?                           | boolean | false    | "Identify if special controls are needed."                  | "Implement as required."                         |
| all_permits_for_tasks           | Do you have all required permits for today's tasks?                                            | boolean | false    | "Check for all required permits."                           | "Ensure permits are valid for today's work."     |
| weather_suitable                | Is the weather or environmental condition suitable for work?                                   | boolean | false    | "Assess weather/environmental conditions."                  | "Delay work if conditions are unsafe."           |
| barricades_signage_installed    | Have all necessary barricades, signage, and barriers been installed and are in good condition? | boolean | false    | "Install and check barricades, signage, barriers."          | "Ensure all are in good condition."              |
| know_first_aid_attendant        | Do you know who the designated first aid attendant is today?                                   | boolean | false    | "Identify the first aid attendant for today."               | "Know how to contact them in an emergency."      |
| emergency_access                | Do you have clear access to emergency exits and muster points?                                 | boolean | false    | "Ensure clear access to emergency exits and muster points." | "Do not block emergency routes."                 |
| site_notices                    | Are you aware of any specific site notices or bulletins today?                                 | boolean | false    | "Review all site notices and bulletins."                    | "Check for updates daily."                       |

#### **C. PPE & Platform Inspection** (Simple Render, Boolean)

| Field Key       | Label                   | Type    | Required | helperText1                                 | helperText2                                   |
| --------------- | ----------------------- | ------- | -------- | ------------------------------------------- | --------------------------------------------- |
| hardhat         | Hardhat                 | boolean | false    | "Wear your hardhat at all times."           | "Check for cracks or damage."                 |
| safety_vest     | Safety Vest             | boolean | false    | "Wear your safety vest."                    | "Ensure it is visible and in good condition." |
| safety_glasses  | Safety Glasses          | boolean | false    | "Wear safety glasses when required."        | "Check for scratches or damage."              |
| fall_protection | Fall Protection         | boolean | false    | "Use fall protection as needed."            | "Inspect before use."                         |
| coveralls       | Coveralls               | boolean | false    | "Wear coveralls if required."               | "Check for rips or tears."                    |
| gloves          | Gloves                  | boolean | false    | "Wear appropriate gloves."                  | "Inspect for holes or wear."                  |
| mask            | Mask                    | boolean | false    | "Wear a mask if required."                  | "Ensure proper fit."                          |
| respirator      | Respirator              | boolean | false    | "Use a respirator if required."             | "Check filters and fit."                      |
| ladder          | Ladder                  | boolean | false    | "Inspect ladder before use."                | "Ensure it is stable and undamaged."          |
| step_bench      | Step Bench / Work Bench | boolean | false    | "Inspect step bench/work bench before use." | "Ensure stability."                           |
| sawhorses       | Sawhorses               | boolean | false    | "Inspect sawhorses before use."             | "Ensure they are stable and undamaged."       |
| baker_scaffold  | Baker Scaffold          | boolean | false    | "Inspect baker scaffold before use."        | "Ensure all parts are secure."                |
| scaffold        | Scaffold                | boolean | false    | "Inspect scaffold before use."              | "Check for missing or damaged parts."         |
| scissor_lift    | Scissor Lift            | boolean | false    | "Inspect scissor lift before use."          | "Check controls and safety features."         |
| boom_lift       | Boom Lift               | boolean | false    | "Inspect boom lift before use."             | "Check for leaks or damage."                  |
| swing_stage     | Swing Stage             | boolean | false    | "Inspect swing stage before use."           | "Ensure all safety features are functional."  |
| hydro_lift      | Hydro Lift              | boolean | false    | "Inspect hydro lift before use."            | "Check for leaks or damage."                  |

#### **D. Task, Hazard, Control (THC) Module** (Custom Render: Dynamic Table)

Each entry:
| Field Key | Label | Type | Required | helperText1 | helperText2 |
|--------------|-------------|---------|----------|-------------|-------------|
| task | Task | string | false | "Describe the task." | "Be specific about the activity." |
| hazard | Hazard | string | false | "Identify the hazard." | "List all potential hazards for this task." |
| hazard_risk | Hazard Risk | integer | false | "Risk level before controls." | "Use the risk matrix provided." |
| control | Control | string | false | "Describe the control measure." | "What will you do to reduce risk?" |
| control_risk | Control Risk | integer | false | "Risk level after controls." | "Use the risk matrix provided." |

> **Note:** Helper texts for dynamic table rows are defined at the field level and reused for each entry. If unique guidance is needed per row, the renderer will provide context-specific helper text.

_Note: This module requires a custom renderer for dynamic rows and risk selectors._

#### **E. Photos Module** (Custom Render, Separate Table Storage)

**Storage Architecture:**

```typescript
photos: Array<string>; // Array of form_photos.id references (UUIDs)
```

**Database Storage:**

- **Table**: `form_photos` stores metadata and Supabase Storage references
- **File Storage**: Photo files stored in Supabase Storage (max 5MB per photo)
- **Constraints**: Maximum 5 photos per form (enforced in frontend)
- **Fields**: id (uuid), form_instance_id, storage_path, file_size, uploaded_at, caption

**Photo Upload Process:**

1. User selects/captures photo → Upload to Supabase Storage
2. Create record in `form_photos` table with storage reference
3. Add photo record ID to form JSONB `photos` array

#### **F. Signature and Confirmation** (Custom Render, Separate Table Storage)

**Storage Architecture:**

```typescript
signatures: Array<string>; // Array of form_signatures.id references (UUIDs)
```

**Database Storage:**

- **Table**: `form_signatures` stores metadata and Supabase Storage references
- **File Storage**: Signature images stored as PNG files in Supabase Storage (max 100KB per signature)
- **Flexible Roles**: `signer_role` field supports worker, supervisor, foreman, safety_officer, management, etc.
- **Legacy Support**: `signer_type` field maintained for backwards compatibility (worker/supervisor)
- **Immutable Records**: Signatures CANNOT be deleted once created (audit compliance)
- **Fields**: id (uuid), form_instance_id, signer_type, signer_role, signer_name, storage_path, file_size, signed_at

**Signature Capture Process:**

1. User draws signature on canvas → Convert to PNG
2. Upload PNG to Supabase Storage
3. Create record in `form_signatures` table with storage reference and signer details
4. Add signature record ID to form JSONB `signatures` array

**Validation Rules:**

- ✅ **NO SIGNATURES REQUIRED** for form submission (all signatures are optional)
- Multiple workers and supervisors can sign the same form
- Each signature is immutable once captured for audit compliance

_Note: This module requires a custom renderer for signature pads and dynamic signer management._

---

### 4. **Module Render Types**

| Module                    | Render Type | Reference/Notes                |
| ------------------------- | ----------- | ------------------------------ |
| General Information       | simple      | Autofill from profile          |
| FLRA Pre-Job Checklist    | simple      | Boolean grid                   |
| PPE & Platform Inspection | simple      | Boolean grid                   |
| Task, Hazard, Control     | custom      | Dynamic table, risk selector   |
| Photos                    | custom      | See photo-module-specification |
| Signature & Confirmation  | custom      | Signature pad, dynamic rows    |

---

## 📝 Example TypeScript Structure

> **Field Key Naming:**
>
> - All field keys are stored in snake_case in the database and mapped to camelCase in TypeScript interfaces using a mapping utility (see project-standards.md).

```typescript
interface FLRAFormInstance {
  // --- Metadata (system-managed) ---
  id: string;
  formDefinitionId: string;
  formDefinitionVersion: number;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  // ...other metadata fields

  // --- Form Data ---
  modules: {
    generalInformation: {
      projectName: { value: string; helperText1: string; helperText2: string };
      taskLocation: { value: string; helperText1: string; helperText2: string };
      supervisorName: {
        value: string;
        helperText1: string;
        helperText2: string;
      };
      supervisorContact: {
        value: string;
        helperText1: string;
        helperText2: string;
      };
      todaysDate: { value: string; helperText1: string; helperText2: string };
      crewMembers: {
        value: string | number;
        helperText1: string;
        helperText2: string;
      };
      todaysTask: { value: string; helperText1: string; helperText2: string };
      startTime: { value: string; helperText1: string; helperText2: string };
      endTime: { value: string; helperText1: string; helperText2: string };
    };
    preJobChecklist: {
      [field: string]: {
        value: boolean;
        helperText1: string;
        helperText2: string;
      };
    };
    ppeAndPlatform: {
      [field: string]: {
        value: boolean;
        helperText1: string;
        helperText2: string;
      };
    };
    taskHazardControl: {
      entries: Array<{
        task: { value: string; helperText1: string; helperText2: string };
        hazard: { value: string; helperText1: string; helperText2: string };
        hazardRisk: { value: number; helperText1: string; helperText2: string };
        control: { value: string; helperText1: string; helperText2: string };
        controlRisk: {
          value: number;
          helperText1: string;
          helperText2: string;
        };
      }>;
    };
    photos: Array<string>; // Array of form_photos.id references
    signatures: Array<string>; // Array of form_signatures.id references
  };
}
```

> **Storage Architecture Note:**
>
> Photos and signatures are stored in separate database tables (`form_photos`, `form_signatures`) with files in Supabase Storage. The form JSONB only contains array references (UUIDs) to these records. This architecture ensures:
>
> - **Optimal Performance**: Large binary data doesn't bloat JSONB queries
> - **Proper File Management**: Direct Supabase Storage integration
> - **Audit Compliance**: Immutable signature records for legal requirements
> - **Scalability**: Independent scaling of file storage and form data

---

## ✅ Validation & Completion Rules

- **NO SIGNATURES REQUIRED for form submission.** All fields including signatures are optional for maximum flexibility.
- UI/UX will encourage completion via progress tracker, guided mode, and helper texts, but nothing blocks submission.
- General Information fields are autofilled from user profile where possible.
- Every field must include `helperText1` and `helperText2` for tooltips/guided mode.
- For all date/time fields, specify the expected format in helperText2.

---

## 📋 Implementation Checklist

- [ ] Implement all modules as described above.
- [ ] Use the versioning and metadata standards from the main plan.
- [ ] Implement optional signature capture with separate table storage.
- [ ] Add `helperText1` and `helperText2` to every field in the schema.
- [ ] Integrate photo and signature modules per their specifications.
- [ ] Ensure all user input is sanitized (see security section).
- [ ] Test for mobile, tablet, and desktop usability.

---

## 📚 References

- [FormSAMPLE.html]
- [photo-module-specification.md]
- [Form Versioning & Definition Management Plan]
- [State Management Architecture]
- [Data Flow Architecture]

---

**This definition is implementation-ready and should be used as the canonical reference for the FLRA form.**

> **Note:** The UI should use `helperText1` and `helperText2` for tooltips, info icons, and guided mode prompts for every field. Both helperText1 and helperText2 must be accessible to screen readers, either by being visible or included in `aria-describedby`.
