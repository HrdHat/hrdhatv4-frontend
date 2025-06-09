import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormStore } from '@/stores/formStore';
import { useAuthStore } from '@/stores/authStore';
import { ModuleRenderer } from '@/components/form/ModuleRenderer';
import { logger } from '@/utils/logger';
import '@/styles/components/form-editor.css';

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

  useEffect(() => {
    logger.log('FormEditor opened', { formId: id, userId: user?.id });

    if (!user) {
      logger.warn('No authenticated user for form editor');
      return;
    }

    // Check if this is a new form or existing form
    const isNewForm = !id || id === 'new';
    const formId = isNewForm ? undefined : id;

    // Initialize form (new or existing)
    initializeForm(user.id, formId)
      .then(resultFormId => {
        // If we just created a new form, navigate to its URL
        if (isNewForm && resultFormId) {
          navigate(`/form/${resultFormId}`, { replace: true });
        }
      })
      .catch(error => {
        logger.error('Form initialization failed', error);
      });

    // Cleanup on unmount
    return () => {
      reset();
    };
  }, [id, user?.id, initializeForm, reset]);

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
      <div className='form-header'>
        <div className='form-title-section'>
          <h1>FLRA Form Editor</h1>
          <div className='form-metadata'>
            <span className='form-number'>Form #{currentForm.form_number}</span>
            {currentForm.title && (
              <span className='form-title'>{currentForm.title}</span>
            )}
          </div>
        </div>

        <div className='form-status'>
          <div className='save-status'>
            {saving && <span className='saving'>Saving...</span>}
            {hasUnsavedChanges && !saving && (
              <span className='unsaved'>Unsaved changes</span>
            )}
            {lastSaved && !hasUnsavedChanges && (
              <span className='saved'>
                Saved: {new Date(lastSaved).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className='form-actions'>
            <button
              onClick={handleSaveForm}
              disabled={saving || !hasUnsavedChanges}
              className='save-button'
            >
              {saving ? 'Saving...' : 'Save Form'}
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={saving}
              className='pdf-button'
            >
              Generate PDF
            </button>
          </div>
        </div>
      </div>

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
