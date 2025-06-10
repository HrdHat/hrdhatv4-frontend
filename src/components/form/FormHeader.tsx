import React from 'react';
import { supabase } from '@/config/supabaseClient';
import { LogoUpload } from '@/components/LogoUpload';
import { logger } from '@/utils/logger';
import { FormService } from '@/lib/formService';
import { useAuthStore } from '@/stores/authStore';
import type { FormInstance } from '@/types/form';

interface FormHeaderProps {
  form: FormInstance;
  onLogoUpdated?: (newLogoUrl: string) => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  form,
  onLogoUpdated,
}) => {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const { user } = useAuthStore();

  // Load user logo if available, else default logo
  React.useEffect(() => {
    const loadLogo = async () => {
      let userLogoUrl = null;
      if (user?.id) {
        userLogoUrl = await FormService.getUserLogo(user.id);
      }
      if (userLogoUrl) {
        setLogoUrl(userLogoUrl);
      } else {
        try {
          const { data } = await supabase.storage
            .from('logos')
            .getPublicUrl('HRDHAT LOGO & ICONT.svg');
          if (data.publicUrl) {
            setLogoUrl(data.publicUrl);
          }
        } catch (error) {
          logger.error('Failed to load default logo', error);
        }
      }
    };
    loadLogo();
  }, [user]);

  const handleLogoUpdate = (newLogoUrl: string) => {
    setLogoUrl(newLogoUrl);
    if (onLogoUpdated) {
      onLogoUpdated(newLogoUrl);
    }
  };

  return (
    <div className='form-header'>
      <div className='header-left'>
        <LogoUpload
          currentLogoUrl={logoUrl || undefined}
          onLogoUpdated={handleLogoUpdate}
          className='form-logo-upload'
        />
      </div>
      <div className='header-right'>
        <h2>{form.title || 'Field Level Risk Assessment (FLRA)'}</h2>
        <div className='form-number'>
          <label htmlFor='form-number'>Form #:</label>
          <input
            id='form-number'
            type='text'
            value={form.form_number}
            readOnly
            className='form-number-input'
          />
        </div>
      </div>
    </div>
  );
};
