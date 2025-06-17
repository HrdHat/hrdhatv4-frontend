import React from 'react';
import Button from '@/components/Button/Button';
import LoadingButton from '@/components/LoadingButton/LoadingButton';

const ButtonsSection: React.FC = () => (
  <section style={{ padding: '1rem 0' }}>
    <h2>Buttons</h2>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant='green'>Green</Button>
      <Button variant='neon'>Neon Outline</Button>
      <LoadingButton
        label='Processing'
        variant='green'
        onClick={() => new Promise(r => setTimeout(r, 1500))}
      />
    </div>
  </section>
);

export default ButtonsSection;
