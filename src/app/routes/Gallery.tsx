import React from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';
import TypographySection from '@/components/Gallery/TypographySection';
import ButtonsSection from '@/components/Gallery/ButtonsSection';
import FieldSection from '@/components/Gallery/FieldSection';
import MessageBoxesSection from '@/components/Gallery/MessageBoxesSection';
import FormStyleSection from '@/components/Gallery/FormStyleSection';

const Gallery: React.FC = () => {
  return (
    <PageLayout>
      <div className='o-snap-y'>
        <TypographySection />
        <ButtonsSection />
        <FieldSection />
        <MessageBoxesSection />
        <FormStyleSection />
      </div>
    </PageLayout>
  );
};

export default Gallery;
