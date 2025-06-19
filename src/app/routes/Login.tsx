import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';
import Input from '@/components/Input/Input';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Input/Checkbox';
import DoubleArrowIcon from '@/components/Icon/DoubleArrowIcon';
import MessageBox from '@/components/MessageBox/MessageBox';
import '@/styles/components/login-header.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);

  // Access sidebar toggle from parent layout (SidebarLoggedOut)
  const { toggleSidebar, sidebarOpen } = useOutletContext<{
    toggleSidebar: () => void;
    sidebarOpen: boolean;
  }>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    logger.log('Login form submitted', { email });
    // Validate email format
    const emailPattern = /.+@.+\..+/;
    if (!emailPattern.test(email)) {
      setEmailError('Please include an @ symbol in the email address.');
      return;
    }
    setEmailError('');
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
      <header className='login-header'>
        <button
          type='button'
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          className='login-header-toggle'
        >
          <DoubleArrowIcon direction={sidebarOpen ? 'left' : 'right'} />
        </button>
        <h2 className='login-header-title'>Login</h2>
      </header>
      <div className='o-stack o-stack--sm' style={{ maxWidth: '320px' }}>
        <form onSubmit={handleLogin} className='o-stack o-stack--sm' noValidate>
          <Input
            id='login-email'
            label='Email'
            type='email'
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            required
            autoComplete='email'
            error={emailError}
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
          <MessageBox variant='warning'>
            <div>
              <p style={{ margin: 0 }}>{error}</p>
              {error === 'Email not confirmed' && (
                <p style={{ margin: 0, fontSize: '0.9em' }}>
                  Please check your inbox (and spam folder) for the verification
                  link.
                </p>
              )}
            </div>
          </MessageBox>
        )}
        <div
          className='o-stack'
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          style={{ '--spacing-stack': '0.5rem' } as React.CSSProperties}
        >
          <p
            style={{
              fontSize: '0.9rem',
              textAlign: 'center',
              margin: 0,
              color: 'var(--color-neon-green)',
            }}
          >
            Don&apos;t have an account?
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
