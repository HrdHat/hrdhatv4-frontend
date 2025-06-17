import React from 'react';
import Input from '@/components/Input/Input';
import Checkbox from '@/components/Input/Checkbox';

const FieldSection: React.FC = () => (
  <section style={{ padding: '1rem 0' }}>
    <h2>Label &amp; Input</h2>
    <div style={{ maxWidth: '320px' }}>
      <Input
        label='First Name'
        tooltip='Use your legal given name for records.'
      />
      <Checkbox label='I agree to the terms' />
    </div>
  </section>
);

export default FieldSection;
