import { create } from 'zustand';

import { FormService } from '@/lib/formService';
import type { FormInstance } from '@/types/form';
import { logger } from '@/utils/logger';

interface FormsListState {
  // Active forms list
  activeForms: FormInstance[];
  activeFormsLoading: boolean;
  activeFormsError: string | null;

  // Archived forms list (for future use)
  archivedForms: FormInstance[];
  archivedFormsLoading: boolean;
  archivedFormsError: string | null;

  // Actions
  loadActiveForms: (userId: string) => Promise<void>;
  loadArchivedForms: (userId: string) => Promise<void>;
  refreshActiveForms: (userId: string) => Promise<void>;
  refreshArchivedForms: (userId: string) => Promise<void>;
  addNewForm: (newForm: FormInstance) => void;
  removeForm: (formId: string) => void;
  updateForm: (formId: string, updates: Partial<FormInstance>) => void;
  reset: () => void;
}

export const useFormsListStore = create<FormsListState>((set, get) => ({
  // Initial state
  activeForms: [],
  activeFormsLoading: false,
  activeFormsError: null,
  archivedForms: [],
  archivedFormsLoading: false,
  archivedFormsError: null,

  loadActiveForms: async (userId: string) => {
    set({ activeFormsLoading: true, activeFormsError: null });

    try {
      logger.log('Loading active forms for user', { userId });
      const forms = await FormService.getUserActiveForms(userId);

      set({
        activeForms: forms,
        activeFormsLoading: false,
        activeFormsError: null,
      });

      logger.log('Active forms loaded successfully', { count: forms.length });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load active forms';
      logger.error('Failed to load active forms', error);

      set({
        activeFormsLoading: false,
        activeFormsError: errorMessage,
      });
    }
  },

  loadArchivedForms: async (userId: string) => {
    set({ archivedFormsLoading: true, archivedFormsError: null });

    try {
      logger.log('Loading archived forms for user', { userId });
      // TODO: Implement getUserArchivedForms when ready
      // const forms = await FormService.getUserArchivedForms(userId);
      const forms: FormInstance[] = [];

      set({
        archivedForms: forms,
        archivedFormsLoading: false,
        archivedFormsError: null,
      });

      logger.log('Archived forms loaded successfully', { count: forms.length });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load archived forms';
      logger.error('Failed to load archived forms', error);

      set({
        archivedFormsLoading: false,
        archivedFormsError: errorMessage,
      });
    }
  },

  refreshActiveForms: async (userId: string) => {
    logger.log('Refreshing active forms', { userId });
    await get().loadActiveForms(userId);
  },

  refreshArchivedForms: async (userId: string) => {
    logger.log('Refreshing archived forms', { userId });
    await get().loadArchivedForms(userId);
  },

  addNewForm: (newForm: FormInstance) => {
    const currentForms = get().activeForms;
    logger.log('Adding new form to active forms list', {
      newFormId: newForm.id,
      newFormNumber: newForm.form_number,
      previousCount: currentForms.length,
    });

    // Use explicit state update to ensure React re-renders
    const updatedActiveForms = [newForm, ...currentForms];

    set({
      activeForms: updatedActiveForms,
    });

    logger.log('New form added successfully', {
      formId: newForm.id,
      newCount: updatedActiveForms.length,
    });
  },

  removeForm: (formId: string) => {
    set(state => ({
      activeForms: state.activeForms.filter(form => form.id !== formId),
      archivedForms: state.archivedForms.filter(form => form.id !== formId),
    }));
    logger.log('Form removed from forms lists', { formId });
  },

  updateForm: (formId: string, updates: Partial<FormInstance>) => {
    set(state => ({
      activeForms: state.activeForms.map(form =>
        form.id === formId ? { ...form, ...updates } : form
      ),
      archivedForms: state.archivedForms.map(form =>
        form.id === formId ? { ...form, ...updates } : form
      ),
    }));
    logger.log('Form updated in forms lists', { formId, updates });
  },

  reset: () => {
    set({
      activeForms: [],
      activeFormsLoading: false,
      activeFormsError: null,
      archivedForms: [],
      archivedFormsLoading: false,
      archivedFormsError: null,
    });
    logger.log('Forms list store reset');
  },
}));
