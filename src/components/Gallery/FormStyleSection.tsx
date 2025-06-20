import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button/Button';

const FormStyleSection: React.FC = () => (
  <section style={{ padding: '1rem 0' }}>
    <h2>Form Paper Preview</h2>
    <Link to='/form-sample'>
      <Button variant='green'>Open Form Sample Page</Button>
    </Link>
  </section>
);

export default FormStyleSection;
