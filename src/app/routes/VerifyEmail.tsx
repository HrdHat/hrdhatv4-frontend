import React from 'react';

export default function VerifyEmail() {
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
        You must verify your email address within 24 hours to continue using
        HrdHat.
        <br />
        Please check your inbox for a verification link.
      </p>
      <button
        style={{ marginTop: 16, padding: '0.5rem 1.5rem', fontSize: 16 }}
        disabled
      >
        Resend Verification Email
      </button>
      <p style={{ marginTop: 16, color: '#888', fontSize: 14 }}>
        (If you don't see the email, check your spam or junk folder.)
      </p>
    </div>
  );
}
