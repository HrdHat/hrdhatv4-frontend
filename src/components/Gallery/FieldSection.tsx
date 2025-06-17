import React from 'react';
import Input from '@/components/Input/Input';

const FieldSection: React.FC = () => (
  <section style={{ padding: '1rem 0' }}>
    <h2>Label &amp; Input</h2>
    <div style={{ maxWidth: '320px' }}>
      <Input
        label='First Name'
        helperText='Tip: Use your legal given name for records.'
      />
    </div>
  </section>
);

export default FieldSection;
