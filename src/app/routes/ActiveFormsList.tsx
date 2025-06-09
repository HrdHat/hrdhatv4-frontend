import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useFormStore } from '@/stores/formStore';
import { FormService } from '@/lib/formService';
import { logger } from '@/utils/logger';
import type { FormInstance } from '@/types/form';

export default function ActiveFormsList() {
  const [forms, setForms] = useState<FormInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { currentForm, reset } = useFormStore();

  useEffect(() => {
    loadActiveForms();
  }, [user]);

  const loadActiveForms = async () => {
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
  };

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className='active-forms-list'>
        <h2>Active Forms</h2>
        <div className='loading'>Loading forms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='active-forms-list'>
        <h2>Active Forms</h2>
        <div className='error'>
          <p>Error: {error}</p>
          <button onClick={loadActiveForms}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className='active-forms-list'>
      <h2>Active Forms</h2>

      {forms.length === 0 ? (
        <div className='empty-state'>
          <p>No active forms found.</p>
          <p>Create a new FLRA form to get started.</p>
        </div>
      ) : (
        <div className='forms-grid'>
          {forms.map(form => (
            <div key={form.id} className='form-card'>
              <div className='form-card-header'>
                <h3 className='form-title'>{form.title || form.form_number}</h3>
                <span className='form-number'>{form.form_number}</span>
              </div>

              <div className='form-card-meta'>
                <p className='form-date'>
                  Created: {formatDate(form.created_at)}
                </p>
                <p className='form-date'>
                  Updated: {formatDate(form.updated_at)}
                </p>
              </div>

              <div className='form-card-actions'>
                <button
                  onClick={() => handleOpenForm(form.id)}
                  className='btn-primary'
                >
                  Open
                </button>
                <button
                  onClick={() => handleDeleteForm(form)}
                  className='btn-danger'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
