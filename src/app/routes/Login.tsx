import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';
import Input from '@/components/Input/Input';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Input/Checkbox';

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
      <div className='o-stack o-stack--sm' style={{ maxWidth: '320px' }}>
        <form onSubmit={handleLogin} className='o-stack o-stack--sm'>
          <Input
            id='login-email'
            label='Email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete='email'
          />
          <Input
            id='login-password'
            label='Password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete='current-password'
          />
          <Checkbox
            label='Keep me logged in'
            defaultChecked
            style={{ alignSelf: 'flex-start' }}
          />
          <LoadingButton
            type='submit'
            label='Login'
            variant='green'
            disabled={loading}
            fullWidth
          />
        </form>
        {error && (
          <div style={{ color: 'red' }}>
            {error}
            {error === 'Email not confirmed' && (
              <div style={{ fontSize: '0.9em' }}>
                <p>
                  Please check your email inbox (and spam folder) for a
                  verification link.
                </p>
                <p>You must verify your email address before you can log in.</p>
              </div>
            )}
          </div>
        )}
        <div
          className='o-stack'
          style={{ '--spacing-stack': '0.5rem' } as React.CSSProperties}
        >
          <p style={{ fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>
            Don't have an account?
          </p>
          <Button
            type='button'
            variant='green'
            fullWidth
            onClick={() => {
              logger.log('Navigating to signup from login');
              navigate('/auth/signup');
            }}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
