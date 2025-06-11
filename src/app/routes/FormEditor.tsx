import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormStore } from '@/stores/formStore';
import { useAuthStore } from '@/stores/authStore';
import { ModuleRenderer } from '@/components/form/ModuleRenderer';
import { logger } from '@/utils/logger';
import '@/styles/components/form-editor.css';
import { FormHeader } from '@/components/form/FormHeader';

export default function FormEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentForm,
    formDefinition,
    loading,
    saving,
    error,
    lastSaved,
    hasUnsavedChanges,
    initializeForm,
    updateFormData,
    updateModuleData,
    saveForm,
    reset,
    checkFormExists,
  } = useFormStore();

  const lastInitializedId = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Skip re-initialization only if this specific form id has already been initialized
    if (id && lastInitializedId.current === id) return;
    lastInitializedId.current = id;
    logger.log('FormEditor opened', { formId: id, userId: user?.id });

    if (!user) {
      logger.warn('No authenticated user for form editor');
      return;
    }

    const isNewForm = !id || id === 'new';
    const formId = isNewForm ? undefined : id;

    initializeForm(user.id, formId)
      .then(resultFormId => {
        if (isNewForm && resultFormId) {
          navigate(`/form/${resultFormId}`, { replace: true });
        }
      })
      .catch(error => {
        logger.error('Form initialization failed', error);
      });

    return () => {
      reset();
    };
  }, [id, user?.id, initializeForm, reset, navigate]);

  // Check if form still exists (handle deletion from drawer/other tabs)
  useEffect(() => {
    if (!currentForm || !id || id === 'new') return;

    const checkInterval = setInterval(async () => {
      try {
        const exists = await checkFormExists(id);
        if (!exists) {
          logger.warn('Current form no longer exists, redirecting to home', {
            formId: id,
          });
          reset();
          navigate('/', { replace: true });
        }
      } catch (error) {
        logger.error('Error checking form existence', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }, [currentForm?.id, id, checkFormExists, reset, navigate]);

  const handleSaveForm = async () => {
    try {
      await saveForm();
      logger.log('Form saved manually');
    } catch (error) {
      logger.error('Manual save failed', error);
    }
  };

  const handleGeneratePDF = () => {
    logger.log('PDF generation requested');
    // TODO: Implement PDF generation
    alert('PDF generation coming soon!');
  };

  if (!user) {
    return (
      <div className='form-editor-error'>
        <h1>Authentication Required</h1>
        <p>Please log in to access the form editor.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='form-editor-loading'>
        <h1>FLRA Form Editor</h1>
        <div className='loading-spinner'>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='form-editor-error'>
        <h1>FLRA Form Editor</h1>
        <div className='error-message'>
          <h2>Error Loading Form</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      </div>
    );
  }

  if (!currentForm || !formDefinition) {
    return (
      <div className='form-editor-empty'>
        <h1>FLRA Form Editor</h1>
        <p>No form data available.</p>
      </div>
    );
  }

  const modules = formDefinition.definition_jsonb?.modules || {};
  const moduleList = formDefinition.definition_jsonb?.moduleList || [];

  return (
    <div className='form-editor'>
      {/* Form Header */}
      <FormHeader form={currentForm} />

      {/* Form Content */}
      <div className='form-content'>
        {moduleList.map((moduleKey: string) => {
          const moduleDefinition = modules[moduleKey];
          const moduleData = currentForm.form_data?.modules?.[moduleKey];

          if (!moduleDefinition) {
            logger.warn('Module definition not found', { moduleKey });
            return null;
          }

          return (
            <ModuleRenderer
              key={moduleKey}
              moduleKey={moduleKey}
              moduleDefinition={moduleDefinition}
              moduleData={moduleData}
              onFieldChange={(fieldKey: string, value: any) => {
                updateFormData(moduleKey, fieldKey, value);
              }}
              onModuleChange={(newModuleData: any) => {
                updateModuleData(moduleKey, newModuleData);
              }}
            />
          );
        })}
      </div>

      {/* Form Footer */}
      <div className='form-footer'>
        <div className='auto-save-notice'>
          <small>
            Form auto-saves every 30 seconds. Last saved:{' '}
            {lastSaved ? new Date(lastSaved).toLocaleString() : 'Never'}
          </small>
        </div>
      </div>
    </div>
  );
}
