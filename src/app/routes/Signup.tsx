import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';
import Input from '@/components/Input/Input';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Input/Checkbox';
import DoubleArrowIcon from '@/components/Icon/DoubleArrowIcon';
import '@/styles/components/login-header.css';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const signup = useAuthStore(state => state.signup);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);
  const { toggleSidebar, sidebarOpen } = useOutletContext<{
    toggleSidebar: () => void;
    sidebarOpen: boolean;
  }>();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous password error
    setPasswordError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      logger.error('Signup validation failed: passwords do not match');
      return;
    }

    // Validate password length (basic validation)
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      logger.error('Signup validation failed: password too short');
      return;
    }

    // Validate email format
    const emailPattern = /.+@.+\..+/;
    if (!emailPattern.test(email)) {
      setEmailError('Please include an @ symbol in the email address.');
      logger.error('Signup validation failed: invalid email');
      return;
    }
    setEmailError('');

    logger.log('Signup form submitted', {
      email,
      firstName,
      lastName,
      company,
    });
    await signup(email, password, { firstName, lastName, company });
    if (!useAuthStore.getState().error) {
      logger.log('Signup successful, navigating to /');
      navigate('/');
    } else {
      logger.error('Signup failed', { error: useAuthStore.getState().error });
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
        <h2 className='login-header-title'>Sign Up</h2>
      </header>
      <div className='o-stack o-stack--sm' style={{ maxWidth: '320px' }}>
        <form
          onSubmit={handleSignup}
          className='o-stack o-stack--sm'
          noValidate
        >
          <Input
            id='signup-first-name'
            label='First Name'
            type='text'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            autoComplete='given-name'
          />
          <Input
            id='signup-last-name'
            label='Last Name'
            type='text'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            autoComplete='family-name'
          />
          <Input
            id='signup-company'
            label='Company'
            type='text'
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
            autoComplete='organization'
          />
          <Input
            id='signup-email'
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
            id='signup-password'
            label='Password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete='new-password'
          />
          <Input
            id='signup-confirm-password'
            label='Confirm Password'
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            autoComplete='new-password'
          />
          <Checkbox label='Accept Terms & Conditions' required />
          {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <LoadingButton
            type='submit'
            label='Create Account'
            variant='green'
            fullWidth
            disabled={loading}
          />
        </form>
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
            Already have an account?
          </p>
          <Button
            type='button'
            variant='green'
            fullWidth
            onClick={() => {
              logger.log('Navigating to login from signup');
              navigate('/auth/login');
            }}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
