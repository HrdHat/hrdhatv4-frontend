import React, { useState } from 'react';

import { LogoUpload } from '../../components/LogoUpload';
import { supabase } from '../../config/supabaseClient';
import { FormService } from '../../lib/formService';
import { useAuthStore } from '../../stores/authStore';
import { logger } from '../../utils/logger';

export default function Profile() {
  const user = useAuthStore(state => state.user);

  // Editable profile fields
  const [firstName, setFirstName] = useState(
    user?.user_metadata?.firstName || user?.user_metadata?.first_name || ''
  );
  const [lastName, setLastName] = useState(
    user?.user_metadata?.lastName || user?.user_metadata?.last_name || ''
  );
  const [company, setCompany] = useState(user?.user_metadata?.company || '');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Logo management
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);

  // Save profile handler
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setProfileLoading(true);
    logger.log('Profile save submitted', { firstName, lastName, company });

    // Check session first and refresh if needed
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    logger.log('Current session check', {
      session: sessionData.session,
      error: sessionError,
    });

    if (!sessionData.session) {
      setProfileError('Session expired. Please log in again.');
      logger.error('No active session found');
      setProfileLoading(false);
      return;
    }

    const { error, data } = await supabase.auth.updateUser({
      data: {
        firstName,
        lastName,
        company,
      },
    });
    if (error) {
      setProfileError(error.message);
      logger.error('Profile update error', error);
    } else {
      setProfileSuccess('Profile updated successfully.');
      logger.log('Profile updated', data.user);
      useAuthStore.setState({ user: data.user });
    }
    setProfileLoading(false);
  };

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordLoading(true);
    logger.log('Password change form submitted');
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('All fields are required.');
      logger.error('Password change error: missing fields');
      setPasswordLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      logger.error('Password change error: passwords do not match');
      setPasswordLoading(false);
      return;
    }
    // Verify current password by sign-in
    const email = user?.email;
    if (!email) {
      setPasswordError('User email not found.');
      logger.error('Password change error: user email missing');
      setPasswordLoading(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (signInError) {
      setPasswordError('Current password is incorrect.');
      logger.error(
        'Password change error: incorrect current password',
        signInError
      );
      setPasswordLoading(false);
      return;
    }
    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      setPasswordError(updateError.message);
      logger.error('Password update error', updateError);
    } else {
      setPasswordSuccess('Password updated successfully.');
      logger.log('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
    setPasswordLoading(false);
  };

  // Load user logo on component mount
  React.useEffect(() => {
    const loadLogo = async () => {
      if (!user?.id) {
        setLogoLoading(false);
        return;
      }

      try {
        let userLogoUrl = null;
        userLogoUrl = await FormService.getUserLogo(user.id);

        if (userLogoUrl) {
          setLogoUrl(userLogoUrl);
        } else {
          // Load default logo as fallback
          const { data } = await supabase.storage
            .from('logos')
            .getPublicUrl('HRDHAT LOGO & ICONT.svg');
          if (data.publicUrl) {
            setLogoUrl(data.publicUrl);
          }
        }
      } catch (error) {
        logger.error('Failed to load logo', error);
      } finally {
        setLogoLoading(false);
      }
    };

    loadLogo();
  }, [user]);

  // Handle logo update
  const handleLogoUpdate = (newLogoUrl: string) => {
    setLogoUrl(newLogoUrl);
    logger.log('Profile logo updated', { logoUrl: newLogoUrl });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>Profile</h1>

      {/* Logo Management Section */}
      <section style={{ marginBottom: 32 }}>
        <h2>Logo</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>
          Upload your company logo to appear on forms and PDFs.
        </p>
        {logoLoading ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            Loading logo...
          </div>
        ) : (
          <LogoUpload
            currentLogoUrl={logoUrl || undefined}
            onLogoUpdated={handleLogoUpdate}
            className='profile-logo-upload'
          />
        )}
      </section>

      {/* Profile Information Section */}
      <section style={{ marginBottom: 32 }}>
        <h2>Profile Information</h2>
        <form onSubmit={handleProfileSave}>
          <div>
            <label htmlFor='profile-first-name'>First Name:</label>
            <input
              id='profile-first-name'
              type='text'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={{ marginLeft: 8 }}
              required
            />
          </div>
          <div>
            <label htmlFor='profile-last-name'>Last Name:</label>
            <input
              id='profile-last-name'
              type='text'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              style={{ marginLeft: 8 }}
              required
            />
          </div>
          <div>
            <label htmlFor='profile-company'>Company:</label>
            <input
              id='profile-company'
              type='text'
              value={company}
              onChange={e => setCompany(e.target.value)}
              style={{ marginLeft: 8 }}
              required
            />
          </div>
          <button
            type='submit'
            style={{ marginTop: 16 }}
            disabled={profileLoading}
          >
            {profileLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
        {profileError && (
          <div style={{ color: 'red', marginTop: 8 }}>{profileError}</div>
        )}
        {profileSuccess && (
          <div style={{ color: 'green', marginTop: 8 }}>{profileSuccess}</div>
        )}
      </section>

      {/* Password Change Section */}
      <section style={{ marginBottom: 32 }}>
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div>
            <label htmlFor='current-password'>Current Password</label>
            <input
              id='current-password'
              type='password'
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </div>
          <div>
            <label htmlFor='new-password'>New Password</label>
            <input
              id='new-password'
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </div>
          <div>
            <label htmlFor='confirm-new-password'>Confirm New Password</label>
            <input
              id='confirm-new-password'
              type='password'
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </div>
          <button
            type='submit'
            style={{ marginTop: 16 }}
            disabled={passwordLoading}
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        {passwordError && (
          <div style={{ color: 'red', marginTop: 8 }}>{passwordError}</div>
        )}
        {passwordSuccess && (
          <div style={{ color: 'green', marginTop: 8 }}>{passwordSuccess}</div>
        )}
      </section>
    </div>
  );
}
