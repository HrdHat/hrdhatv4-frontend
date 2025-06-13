import { create } from 'zustand';

import { FormService } from '@/lib/formService';
import type {
  FormDefinition,
  FormInstance,
  FormLoadingState,
  FormMode,
} from '@/types/form';
import { logger } from '@/utils/logger';

interface FormState extends FormLoadingState {
  // Current form data
  currentForm: FormInstance | null;
  formDefinition: FormDefinition | null;
  mode: FormMode;

  // Auto-save state
  autoSaveInterval: NodeJS.Timeout | null;
  hasUnsavedChanges: boolean;

  // Actions
  initializeForm: (userId: string, formId?: string) => Promise<string>;
  loadForm: (formId: string) => Promise<void>;
  createNewForm: (userId: string) => Promise<string>;
  updateFormData: (moduleKey: string, fieldKey: string, value: any) => void;
  updateModuleData: (moduleKey: string, moduleData: any) => void;
  saveForm: () => Promise<void>;
  applyAutofill: (userId: string) => Promise<void>;
  startAutoSave: () => void;
  stopAutoSave: () => void;
  reset: () => void;
  checkFormExists: (formId: string) => Promise<boolean>;
}

export const useFormStore = create<FormState>((set, get) => ({
  // Initial state
  currentForm: null,
  formDefinition: null,
  mode: 'new',
  loading: false,
  saving: false,
  error: null,
  lastSaved: null,
  autoSaveInterval: null,
  hasUnsavedChanges: false,

  initializeForm: async (userId: string, formId?: string) => {
    logger.log('Initializing form', { userId, formId });
    set({ loading: true, error: null });

    try {
      let resultFormId: string;

      if (formId) {
        // Load existing form
        await get().loadForm(formId);
        set({ mode: 'edit' });
        resultFormId = formId;
      } else {
        // Create new form
        const newFormId = await get().createNewForm(userId);
        logger.log('New form created', { formId: newFormId });
        set({ mode: 'new' });
        resultFormId = newFormId;
      }

      // Apply autofill for new forms
      if (!formId) {
        await get().applyAutofill(userId);
      }

      // Start auto-save
      get().startAutoSave();

      set({ loading: false });

      // Return the form ID for navigation purposes
      return resultFormId;
    } catch (error) {
      logger.error('Failed to initialize form', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
      throw error;
    }
  },

  loadForm: async (formId: string) => {
    logger.log('Loading form', { formId });
    set({ loading: true, error: null });

    try {
      const { formInstance, formDefinition } =
        await FormService.loadFormInstance(formId);

      set({
        currentForm: formInstance,
        formDefinition,
        loading: false,
        hasUnsavedChanges: false,
        lastSaved: formInstance.updated_at,
      });

      logger.log('Form loaded successfully', { formId });
    } catch (error) {
      logger.error('Failed to load form', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load form',
        loading: false,
      });
      throw error;
    }
  },

  createNewForm: async (userId: string): Promise<string> => {
    logger.log('Creating new form', { userId });
    set({ loading: true, error: null });

    try {
      // Initialize user template first
      const templateDefinitionId =
        await FormService.initializeUserTemplate(userId);

      // Create form instance
      const { formInstance, formDefinition } =
        await FormService.createFormInstance(templateDefinitionId, userId);

      set({
        currentForm: formInstance,
        formDefinition,
        loading: false,
        hasUnsavedChanges: false,
        lastSaved: formInstance.created_at,
      });

      logger.log('New form created successfully', { formId: formInstance.id });
      return formInstance.id;
    } catch (error) {
      logger.error('Failed to create new form', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create form',
        loading: false,
      });
      throw error;
    }
  },

  updateFormData: (moduleKey: string, fieldKey: string, value: any) => {
    const { currentForm } = get();
    if (!currentForm) {
      logger.warn('Cannot update form data: no current form');
      return;
    }

    logger.log('Updating form field', { moduleKey, fieldKey, value });

    const updatedForm = {
      ...currentForm,
      form_data: {
        ...currentForm.form_data,
        modules: {
          ...currentForm.form_data.modules,
          [moduleKey]: {
            ...currentForm.form_data.modules[moduleKey],
            [fieldKey]: {
              ...currentForm.form_data.modules[moduleKey]?.[fieldKey],
              value,
            },
          },
        },
      },
    };

    set({
      currentForm: updatedForm,
      hasUnsavedChanges: true,
    });
  },

  updateModuleData: (moduleKey: string, moduleData: any) => {
    const { currentForm } = get();
    if (!currentForm) {
      logger.warn('Cannot update module data: no current form');
      return;
    }

    logger.log('Updating module data', { moduleKey });

    const updatedForm = {
      ...currentForm,
      form_data: {
        ...currentForm.form_data,
        modules: {
          ...currentForm.form_data.modules,
          [moduleKey]: moduleData,
        },
      },
    };

    set({
      currentForm: updatedForm,
      hasUnsavedChanges: true,
    });
  },

  saveForm: async () => {
    const { currentForm, saving } = get();

    if (!currentForm) {
      logger.warn('Cannot save: no current form');
      return;
    }

    if (saving) {
      logger.log('Save already in progress, skipping');
      return;
    }

    logger.log('Saving form', { formId: currentForm.id });
    set({ saving: true, error: null });

    try {
      await FormService.saveFormInstance(currentForm);

      const now = new Date().toISOString();
      set({
        saving: false,
        hasUnsavedChanges: false,
        lastSaved: now,
        currentForm: {
          ...currentForm,
          updated_at: now,
        },
      });

      logger.log('Form saved successfully', { formId: currentForm.id });
    } catch (error) {
      logger.error('Failed to save form', error);
      set({
        error: error instanceof Error ? error.message : 'Save failed',
        saving: false,
      });
      throw error;
    }
  },

  applyAutofill: async (userId: string) => {
    const { currentForm, formDefinition } = get();

    if (!currentForm || !formDefinition) {
      logger.warn('Cannot apply autofill: missing form or definition');
      return;
    }

    logger.log('Applying autofill data', { userId });

    try {
      const autofillData = await FormService.getAutofillData(userId);

      if (Object.keys(autofillData).length === 0) {
        logger.log('No autofill data available');
        return;
      }

      // Apply autofill to relevant fields
      const modules = formDefinition.definition_jsonb?.modules || {};
      let hasUpdates = false;

      Object.entries(modules).forEach(
        ([moduleKey, moduleConfig]: [string, any]) => {
          if (moduleConfig.renderType === 'simple' && moduleConfig.fields) {
            Object.entries(moduleConfig.fields).forEach(
              ([fieldKey, fieldConfig]: [string, any]) => {
                if (fieldConfig.autofill && autofillData[fieldKey]) {
                  get().updateFormData(
                    moduleKey,
                    fieldKey,
                    autofillData[fieldKey]
                  );
                  hasUpdates = true;
                }
              }
            );
          }
        }
      );

      if (hasUpdates) {
        logger.log('Autofill data applied', {
          fields: Object.keys(autofillData),
        });
      }
    } catch (error) {
      logger.error('Failed to apply autofill', error);
      // Don't throw - autofill is not critical
    }
  },

  startAutoSave: () => {
    const { autoSaveInterval } = get();

    // Clear existing interval if any
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
    }

    // Start new auto-save interval (every 30 seconds)
    const interval = setInterval(() => {
      const { hasUnsavedChanges, saving } = get();
      if (hasUnsavedChanges && !saving) {
        logger.log('Auto-saving form');
        get()
          .saveForm()
          .catch(error => {
            logger.error('Auto-save failed', error);
          });
      }
    }, 30000);

    set({ autoSaveInterval: interval });
    logger.log('Auto-save started');
  },

  stopAutoSave: () => {
    const { autoSaveInterval } = get();

    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
      set({ autoSaveInterval: null });
      logger.log('Auto-save stopped');
    }
  },

  reset: () => {
    logger.log('Resetting form store');

    // Stop auto-save
    get().stopAutoSave();

    // Reset state
    set({
      currentForm: null,
      formDefinition: null,
      mode: 'new',
      loading: false,
      saving: false,
      error: null,
      lastSaved: null,
      autoSaveInterval: null,
      hasUnsavedChanges: false,
    });
  },

  checkFormExists: async (formId: string): Promise<boolean> => {
    try {
      logger.log('Checking if form exists', { formId });
      await FormService.loadFormInstance(formId);
      return true;
    } catch (error) {
      logger.log('Form does not exist or access denied', { formId, error });
      return false;
    }
  },
}));
