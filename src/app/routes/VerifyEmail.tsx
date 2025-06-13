import React, { useState } from 'react';

import { supabase } from '@/config/supabaseClient';
import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';

export default function VerifyEmail() {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);

  const handleResendVerification = async () => {
    if (!user?.email) {
      setResendError('No email address found. Please try logging in again.');
      logger.error('Resend verification: no user email found');
      return;
    }

    setResendLoading(true);
    setResendMessage(null);
    setResendError(null);
    logger.log('Resending verification email', { email: user.email });

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });

    if (error) {
      setResendError(error.message);
      logger.error('Resend verification error', error);
    } else {
      setResendMessage('Verification email sent! Please check your inbox.');
      logger.log('Verification email resent successfully');
    }

    setResendLoading(false);
  };
  return (
    <div
      style={{
        maxWidth: 400,
        margin: '2rem auto',
        padding: '2rem',
        textAlign: 'center',
        border: '1px solid #eee',
        borderRadius: 8,
      }}
    >
      <h2>Verify Your Email</h2>
      <p>
        You must verify your email address to continue using HrdHat.
        <br />
        Please check your inbox for a verification link.
      </p>
      <button
        style={{
          marginTop: 16,
          padding: '0.5rem 1.5rem',
          fontSize: 16,
          backgroundColor: resendLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: resendLoading ? 'not-allowed' : 'pointer',
        }}
        onClick={handleResendVerification}
        disabled={resendLoading}
      >
        {resendLoading ? 'Sending...' : 'Resend Verification Email'}
      </button>

      {resendMessage && (
        <div style={{ marginTop: 12, color: 'green', fontSize: 14 }}>
          {resendMessage}
        </div>
      )}

      {resendError && (
        <div style={{ marginTop: 12, color: 'red', fontSize: 14 }}>
          {resendError}
        </div>
      )}

      <p style={{ marginTop: 16, color: '#888', fontSize: 14 }}>
        (If you don&apos;t see the email, check your spam or junk folder.)
      </p>
    </div>
  );
}
