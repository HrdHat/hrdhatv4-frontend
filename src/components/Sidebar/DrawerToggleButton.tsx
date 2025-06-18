import React from 'react';
import Button from '@/components/Button/Button';
import { useGalleryDrawer } from '@/components/GalleryLayout/GalleryDrawerContext';

/**
 * DrawerToggleButton – green button that lives **inside the Sidebar** to toggle
 * the Gallery sandbox drawer. It inherits Sidebar z-index, so it naturally
 * appears above the drawer border.
 */
const DrawerToggleButton: React.FC = () => {
  const { open, toggle } = useGalleryDrawer();

  return (
    <div style={{ padding: '1rem', marginTop: '56px' }}>
      <Button
        variant='green'
        fullWidth
        onClick={toggle}
        aria-pressed={open}
        style={{ zIndex: 99997 }}
      >
        {open ? 'Close Drawer' : 'Open Drawer'}
      </Button>
    </div>
  );
};

export default DrawerToggleButton;
