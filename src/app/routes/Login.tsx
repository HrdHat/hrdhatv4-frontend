import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    logger.log('Login form submitted', { email });
    await login(email, password);
    if (!useAuthStore.getState().error) {
      logger.log('Login successful, navigating to /');
      navigate('/');
    } else {
      logger.error('Login failed', { error: useAuthStore.getState().error });
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='login-email'>Email</label>
          <input
            id='login-email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='login-password'>Password</label>
          <input
            id='login-password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' disabled={loading}>
          Login
        </button>
      </form>
      {error && (
        <div style={{ color: 'red' }}>
          {error}
          {error === 'Email not confirmed' && (
            <div style={{ marginTop: 8, fontSize: '0.9em' }}>
              <p>
                Please check your email inbox (and spam folder) for a
                verification link.
              </p>
              <p>You must verify your email address before you can log in.</p>
            </div>
          )}
        </div>
      )}
      <button
        type='button'
        onClick={() => {
          logger.log('Navigating to signup from login');
          navigate('/auth/signup');
        }}
      >
        Create Account
      </button>
    </div>
  );
}
