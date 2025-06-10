/**
 * Form Service Layer
 *
 * Handles all database interactions for forms, templates, and user data.
 * Provides clean API for form store and components.
 */

import { supabase } from '@/config/supabaseClient';
import { logger } from '@/utils/logger';
import type {
  FormDefinition,
  FormInstance,
  CreateFormResponse,
  AutofillData,
} from '@/types/form';

export class FormService {
  /**
   * Initialize user's FLRA template (lazy initialization)
   * Creates personal template if user doesn't have one
   */
  static async initializeUserTemplate(userId: string): Promise<string> {
    try {
      logger.log('Initializing user FLRA template', { userId });

      const { data: templateDefinitionId, error } = await supabase.rpc(
        'initialize_user_flra_template',
        { user_id: userId }
      );

      if (error) {
        logger.error('Failed to initialize user template', error);
        throw new Error(`Template initialization failed: ${error.message}`);
      }

      logger.log('User template initialized', { templateDefinitionId });
      return templateDefinitionId;
    } catch (error) {
      logger.error('Error in initializeUserTemplate', error);
      throw error;
    }
  }

  /**
   * Get user's personal FLRA template
   */
  static async getUserTemplate(userId: string): Promise<FormDefinition> {
    try {
      logger.log('Getting user FLRA template', { userId });

      const { data: template, error } = await supabase.rpc(
        'get_user_flra_template',
        { user_id: userId }
      );

      if (error) {
        logger.error('Failed to get user template', error);
        throw new Error(`Failed to get template: ${error.message}`);
      }

      logger.log('User template retrieved', {
        templateId: template.template_id,
      });
      return template;
    } catch (error) {
      logger.error('Error in getUserTemplate', error);
      throw error;
    }
  }

  /**
   * Create new form instance from user's template
   */
  static async createFormInstance(
    templateDefinitionId: string,
    userId: string
  ): Promise<CreateFormResponse> {
    try {
      logger.log('Creating new form instance', {
        templateDefinitionId,
        userId,
      });

      // Check if user already has 5 active forms
      const { data: activeForms, error: countError } = await supabase
        .from('form_instances')
        .select('id')
        .eq('created_by', userId)
        .eq('status', 'active');

      if (countError) {
        logger.error('Failed to check active form count', countError);
        throw new Error(`Failed to validate form limit: ${countError.message}`);
      }

      if (activeForms && activeForms.length >= 5) {
        logger.warn('User attempted to create more than 5 active forms', {
          userId,
          activeCount: activeForms.length,
        });
        throw new Error("Can't create more than 5 active forms");
      }

      // Get the template definition
      const { data: template, error: templateError } = await supabase
        .from('form_definitions')
        .select('*')
        .eq('id', templateDefinitionId)
        .single();

      if (templateError) {
        logger.error('Failed to get template for form creation', templateError);
        throw new Error(`Template not found: ${templateError.message}`);
      }

      // Generate unique form number (YYYYMMDD-NN format)
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

      // Get the highest number for today to find next available
      const { data: existingForms } = await supabase
        .from('form_instances')
        .select('form_number')
        .like('form_number', `${dateStr}-%`)
        .order('form_number', { ascending: false })
        .limit(1);

      let nextNumber = 1;
      if (existingForms && existingForms.length > 0) {
        const lastFormNumber = existingForms[0].form_number;
        const match = lastFormNumber.match(/-(\d+)$/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      const formNumber = `${dateStr}-${nextNumber.toString().padStart(2, '0')}`;

      // Create empty form data structure based on template
      const emptyFormData = this.createEmptyFormData(template.definition_jsonb);

      // Create form instance
      const { data: formInstance, error: instanceError } = await supabase
        .from('form_instances')
        .insert({
          form_definition_id: template.id,
          form_definition_version: template.version,
          template_id: template.template_id,
          form_number: formNumber,
          created_by: userId,
          form_data: emptyFormData,
        })
        .select()
        .single();

      if (instanceError) {
        logger.error('Failed to create form instance', instanceError);
        throw new Error(`Form creation failed: ${instanceError.message}`);
      }

      logger.log('Form instance created', { formId: formInstance.id });

      return {
        formInstance,
        formDefinition: template,
      };
    } catch (error) {
      logger.error('Error in createFormInstance', error);
      throw error;
    }
  }

  /**
   * Load existing form instance
   */
  static async loadFormInstance(formId: string): Promise<CreateFormResponse> {
    try {
      logger.log('Loading form instance', { formId });

      // Get form instance
      const { data: formInstance, error: instanceError } = await supabase
        .from('form_instances')
        .select('*')
        .eq('id', formId)
        .single();

      if (instanceError) {
        logger.error('Failed to load form instance', instanceError);
        throw new Error(`Form not found: ${instanceError.message}`);
      }

      // Get form definition
      const { data: formDefinition, error: definitionError } = await supabase
        .from('form_definitions')
        .select('*')
        .eq('id', formInstance.form_definition_id)
        .single();

      if (definitionError) {
        logger.error('Failed to load form definition', definitionError);
        throw new Error(
          `Form definition not found: ${definitionError.message}`
        );
      }

      logger.log('Form instance loaded', {
        formId,
        templateId: formDefinition.template_id,
      });

      return {
        formInstance,
        formDefinition,
      };
    } catch (error) {
      logger.error('Error in loadFormInstance', error);
      throw error;
    }
  }

  /**
   * Save form instance data
   */
  static async saveFormInstance(formInstance: FormInstance): Promise<void> {
    try {
      logger.log('Saving form instance', { formId: formInstance.id });

      const { error } = await supabase
        .from('form_instances')
        .update({
          form_data: formInstance.form_data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', formInstance.id);

      if (error) {
        logger.error('Failed to save form instance', error);
        throw new Error(`Save failed: ${error.message}`);
      }

      logger.log('Form instance saved successfully', {
        formId: formInstance.id,
      });
    } catch (error) {
      logger.error('Error in saveFormInstance', error);
      throw error;
    }
  }

  /**
   * Check if a form number already exists (for frontend validation warnings)
   */
  static async checkFormNumberExists(
    formNumber: string,
    excludeFormId?: string
  ): Promise<boolean> {
    try {
      let query = supabase
        .from('form_instances')
        .select('id')
        .eq('form_number', formNumber);

      // Exclude current form when editing
      if (excludeFormId) {
        query = query.neq('id', excludeFormId);
      }

      const { data, error } = await query.limit(1);

      if (error) {
        logger.error('Error checking form number existence', error);
        return false; // Assume doesn't exist on error
      }

      return data && data.length > 0;
    } catch (error) {
      logger.error('Error in checkFormNumberExists', error);
      return false;
    }
  }

  /**
   * Get count of active forms for a user
   */
  static async getActiveFormCount(userId: string): Promise<number> {
    try {
      const { data: activeForms, error } = await supabase
        .from('form_instances')
        .select('id')
        .eq('created_by', userId)
        .eq('status', 'active');

      if (error) {
        logger.error('Error getting active form count', error);
        return 0;
      }

      return activeForms ? activeForms.length : 0;
    } catch (error) {
      logger.error('Error in getActiveFormCount', error);
      return 0;
    }
  }

  /**
   * Get autofill data from user profile
   */
  static async getAutofillData(userId: string): Promise<AutofillData> {
    try {
      logger.log('Getting autofill data', { userId });

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.warn('No user profile found for autofill', error);
        return {}; // Return empty object if no profile
      }

      // Map profile data to form field names
      const autofillData: AutofillData = {
        project_name: profile.project_name,
        task_location: profile.task_location,
        supervisor_name: profile.supervisor_name,
        supervisor_contact: profile.supervisor_contact,
        crew_members: profile.crew_members?.toString(),
        todays_task: profile.todays_task,
      };

      // Add today's date
      const today = new Date().toISOString().slice(0, 10);
      autofillData.todays_date = today;

      logger.log('Autofill data retrieved', {
        fields: Object.keys(autofillData),
      });
      return autofillData;
    } catch (error) {
      logger.error('Error in getAutofillData', error);
      return {}; // Return empty object on error
    }
  }

  /**
   * Create empty form data structure based on template definition
   */
  private static createEmptyFormData(templateDefinition: any): any {
    const modules: any = {};

    if (!templateDefinition?.modules) {
      logger.warn('Template definition missing modules');
      return { modules };
    }

    // Initialize each module
    Object.entries(templateDefinition.modules).forEach(
      ([moduleKey, moduleConfig]: [string, any]) => {
        if (moduleConfig.renderType === 'simple' && moduleConfig.fields) {
          // Simple modules: create empty fields
          const moduleData: any = {};
          Object.entries(moduleConfig.fields).forEach(
            ([fieldKey, fieldConfig]: [string, any]) => {
              moduleData[fieldKey] = {
                value: this.getDefaultValue(fieldConfig.type),
                helperText1: fieldConfig.helperText1 || '',
                helperText2: fieldConfig.helperText2 || '',
              };
            }
          );
          modules[moduleKey] = moduleData;
        } else if (moduleConfig.renderType === 'custom') {
          // Custom modules: initialize based on type
          if (moduleKey === 'taskHazardControl') {
            modules[moduleKey] = { entries: [] };
          } else if (moduleKey === 'photos') {
            modules[moduleKey] = [];
          } else if (moduleKey === 'signatures') {
            modules[moduleKey] = [];
          }
        }
      }
    );

    return { modules };
  }

  /**
   * Get default value for field type
   */
  private static getDefaultValue(fieldType: string): any {
    switch (fieldType) {
      case 'boolean':
        return false;
      case 'integer':
        return 0;
      case 'string':
      case 'date':
      case 'time':
      default:
        return '';
    }
  }

  /**
   * Get active forms for a user
   */
  static async getUserActiveForms(userId: string): Promise<FormInstance[]> {
    try {
      logger.log('Getting user active forms', { userId });

      const { data: forms, error } = await supabase
        .from('form_instances')
        .select('*')
        .eq('created_by', userId)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      if (error) {
        logger.error('Error getting user active forms', error);
        throw new Error(`Failed to fetch active forms: ${error.message}`);
      }

      logger.log('Active forms retrieved', { count: forms?.length || 0 });
      return forms || [];
    } catch (error) {
      logger.error('Error in getUserActiveForms', error);
      throw error;
    }
  }

  /**
   * Delete a form instance
   */
  static async deleteFormInstance(formId: string): Promise<void> {
    try {
      logger.log('Deleting form instance', { formId });

      const { error } = await supabase
        .from('form_instances')
        .delete()
        .eq('id', formId);

      if (error) {
        logger.error('Failed to delete form instance', error);
        throw new Error(`Delete failed: ${error.message}`);
      }

      logger.log('Form instance deleted successfully', { formId });
    } catch (error) {
      logger.error('Error in deleteFormInstance', error);
      throw error;
    }
  }

  /**
   * Retrieve the user's uploaded logo from Supabase Storage
   */
  static async getUserLogo(userId: string): Promise<string | null> {
    try {
      // Assume logos are stored as 'user-logos/{userId}.png'
      const { data } = await supabase.storage
        .from('logos')
        .getPublicUrl(`user-logos/${userId}.png`);
      return data?.publicUrl || null;
    } catch (error) {
      logger.error('Failed to get user logo', error);
      return null;
    }
  }
}
