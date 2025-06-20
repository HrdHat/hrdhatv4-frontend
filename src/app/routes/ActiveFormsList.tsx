import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormService } from '@/lib/formService';
import { useAuthStore } from '@/stores/authStore';
import { useFormStore } from '@/stores/formStore';
import type { FormInstance } from '@/types/form';
import { logger } from '@/utils/logger';
import PanelHeader from '@/components/PageHeader/PanelHeader';
import Button from '@/components/Button/Button';
import '@/styles/components/form-card.css';

export default function ActiveFormsList() {
  const [forms, setForms] = useState<FormInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { currentForm, reset } = useFormStore();

  const loadActiveForms = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const activeForms = await FormService.getUserActiveForms(user.id);
      setForms(activeForms);
      logger.log('Active forms loaded', { count: activeForms.length });
    } catch (err) {
      logger.error('Failed to load active forms', err);
      setError(err instanceof Error ? err.message : 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadActiveForms();
  }, [user, loadActiveForms]);

  const handleOpenForm = (formId: string) => {
    logger.log('Opening form', { formId });
    navigate(`/form/${formId}`);
  };

  const handleDeleteForm = async (form: FormInstance) => {
    const confirmMessage = `Are you sure you want to delete the form "${form.title || form.form_number}"?\n\nThis action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      logger.log('User cancelled form deletion', { formId: form.id });
      return;
    }

    try {
      logger.log('Deleting form', { formId: form.id });

      // Check if this is the currently open form
      const isCurrentlyOpenForm = currentForm?.id === form.id;

      await FormService.deleteFormInstance(form.id);

      // Remove from local state
      setForms(prevForms => prevForms.filter(f => f.id !== form.id));

      // If this was the currently open form, navigate away
      if (isCurrentlyOpenForm) {
        logger.log('Deleted form was currently open, navigating to home', {
          formId: form.id,
        });
        reset();
        navigate('/', { replace: true });
      }

      logger.log('Form deleted successfully', { formId: form.id });
    } catch (err) {
      logger.error('Failed to delete form', err);
      setError(err instanceof Error ? err.message : 'Failed to delete form');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className='active-forms-list'>
        <PanelHeader title='Active Forms' />
        <div className='loading'>Loading forms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='active-forms-list'>
        <PanelHeader title='Active Forms' />
        <div className='error'>
          <p>Error: {error}</p>
          <button onClick={loadActiveForms}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className='active-forms-list'>
      <PanelHeader title='Active Forms' />

      {forms.length === 0 ? (
        <div className='empty-state'>
          <p>No active forms found.</p>
          <p>Create a new FLRA form to get started.</p>
        </div>
      ) : (
        <div className='forms-grid'>
          {forms.map(form => (
            <div key={form.id} className='form-card'>
              <div
                className='form-card-header-row'
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <h3 className='form-card-title' style={{ margin: 0 }}>
                  {(form.title || 'FLRA').toUpperCase()}
                </h3>
                <span className='form-card-date'>
                  {formatDate(form.created_at)}
                </span>
              </div>

              <div
                className='form-card-actions'
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  width: '100%',
                }}
              >
                <Button
                  variant='green'
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.75rem',
                    flex: 1,
                    minWidth: 'auto',
                  }}
                  onClick={() => handleOpenForm(form.id)}
                >
                  Open
                </Button>
                <Button
                  variant='error'
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.75rem',
                    flex: 1,
                    minWidth: 'auto',
                  }}
                  onClick={() => handleDeleteForm(form)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
