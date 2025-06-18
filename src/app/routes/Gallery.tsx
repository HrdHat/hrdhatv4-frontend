import React from 'react';
import { GalleryLayout } from '@/components/GalleryLayout/GalleryLayout';
import TypographySection from '@/components/Gallery/TypographySection';
import ButtonsSection from '@/components/Gallery/ButtonsSection';
import FieldSection from '@/components/Gallery/FieldSection';
import MessageBoxesSection from '@/components/Gallery/MessageBoxesSection';
import FormStyleSection from '@/components/Gallery/FormStyleSection';

const Gallery: React.FC = () => {
  return (
    <GalleryLayout>
      <div className='o-snap-y'>
        <TypographySection />
        <ButtonsSection />
        <FieldSection />
        <MessageBoxesSection />
        <FormStyleSection />
      </div>
    </GalleryLayout>
  );
};

export default Gallery;
