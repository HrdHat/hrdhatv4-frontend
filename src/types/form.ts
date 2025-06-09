/**
 * Form Type Definitions
 *
 * Following bullet-proof UI philosophy:
 * - Dynamic typing for form data (JSONB flexibility)
 * - UI components ensure data safety and validation
 * - Minimal interfaces for system-level types only
 */

// Database entity types
export interface FormDefinition {
  id: string;
  template_id: string;
  version: number;
  form_name: string;
  description: string | null;
  is_system_template: boolean;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
  deprecated_at: string | null;
  forked_from_template_id: string | null;
  forked_from_version: number | null;
  definition_jsonb: any; // Dynamic JSONB - UI components ensure safety
  validation_rules: any; // Dynamic JSONB - UI components ensure safety
  organization_id: string | null;
  project_id: string | null;
}

export interface FormInstance {
  id: string;
  form_definition_id: string;
  form_definition_version: number;
  template_id: string;
  form_number: string;
  title: string | null;
  created_by: string;
  updated_by: string | null;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  form_data: any; // Dynamic JSONB structure - UI components ensure safety
  organization_id: string | null;
  project_id: string | null;
}

// UI state types
export interface FormLoadingState {
  loading: boolean;
  saving: boolean;
  error: string | null;
  lastSaved: string | null;
}

// Module rendering types
export interface ModuleDefinition {
  renderType: 'simple' | 'custom';
  title: string;
  description: string;
  fields?: Record<string, FieldDefinition>;
  maxEntries?: number; // For dynamic arrays like taskHazardControl
  [key: string]: any; // Allow additional properties
}

export interface FieldDefinition {
  label: string;
  type: 'string' | 'boolean' | 'date' | 'time' | 'integer';
  required: boolean;
  autofill?: boolean;
  helperText1: string;
  helperText2: string;
  min?: number;
  max?: number;
  [key: string]: any; // Allow additional properties
}

// Form creation/editing modes
export type FormMode = 'new' | 'edit' | 'view';

// API response types
export interface CreateFormResponse {
  formInstance: FormInstance;
  formDefinition: FormDefinition;
}

export interface AutofillData {
  project_name?: string;
  task_location?: string;
  supervisor_name?: string;
  supervisor_contact?: string;
  crew_members?: string;
  todays_task?: string;
  [key: string]: any; // Dynamic user profile data
}
