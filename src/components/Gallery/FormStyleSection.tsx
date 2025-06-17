import React from 'react';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';

const FormStyleSection: React.FC = () => (
  <section style={{ padding: '1rem 0' }}>
    <h2>Form Style Sample</h2>
    <form
      style={{
        maxWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
      onSubmit={e => e.preventDefault()}
    >
      <Input
        label='Email'
        type='email'
        required
        placeholder='email@example.com'
      />
      <Input
        label='Password'
        type='password'
        required
        placeholder='Enter password'
      />
      <Button type='submit'>Submit</Button>
    </form>
  </section>
);

export default FormStyleSection;
