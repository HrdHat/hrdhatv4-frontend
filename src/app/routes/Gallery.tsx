import React from 'react';
import { GalleryLayout } from '@/components/GalleryLayout/GalleryLayout';
import TypographySection from '@/components/Gallery/TypographySection';
import ButtonsSection from '@/components/Gallery/ButtonsSection';
import FieldSection from '@/components/Gallery/FieldSection';
import MessageBoxesSection from '@/components/Gallery/MessageBoxesSection';
import FormStyleSection from '@/components/Gallery/FormStyleSection';
import { Link } from 'react-router-dom';
import Button from '@/components/Button/Button';

const Gallery: React.FC = () => {
  return (
    <GalleryLayout>
      <div className='o-snap-y'>
        <TypographySection />
        <ButtonsSection />
        <FieldSection />
        <MessageBoxesSection />
        <FormStyleSection />
        <div style={{ padding: '1rem 0' }}>
          <Link to='/form-sample'>
            <Button variant='green'>Open Form Sample Page</Button>
          </Link>
        </div>
      </div>
    </GalleryLayout>
  );
};

export default Gallery;
