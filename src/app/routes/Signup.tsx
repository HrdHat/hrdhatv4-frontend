import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../stores/authStore';
import { logger } from '../../utils/logger';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const signup = useAuthStore(state => state.signup);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor='signup-first-name'>First Name</label>
          <input
            id='signup-first-name'
            type='text'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='signup-last-name'>Last Name</label>
          <input
            id='signup-last-name'
            type='text'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='signup-company'>Company</label>
          <input
            id='signup-company'
            type='text'
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='signup-email'>Email</label>
          <input
            id='signup-email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='signup-password'>Password</label>
          <input
            id='signup-password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' disabled={loading}>
          Sign Up
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button
        type='button'
        onClick={() => {
          logger.log('Navigating to login from signup');
          navigate('/auth/login');
        }}
      >
        Back to Login
      </button>
    </div>
  );
}
