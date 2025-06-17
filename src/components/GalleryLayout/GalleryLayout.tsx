import React, { useState } from 'react';

import Sidebar from '@/components/Sidebar/Sidebar';
import { GalleryDrawerContext } from './GalleryDrawerContext';
import DoubleArrowIcon from '@/components/Icon/DoubleArrowIcon';

/**
 * Layout with a collapsible drawer/sidebar to mirror app shell.
 * Keeps logic simple for the component gallery demo.
 */
export const GalleryLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <GalleryDrawerContext.Provider
      value={{ open, toggle: () => setOpen(prev => !prev) }}
    >
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />

      {/* Icon toggle button */}
      <button
        type='button'
        onClick={() => setOpen(prev => !prev)}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1100,
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <DoubleArrowIcon direction={open ? 'left' : 'right'} />
      </button>

      <div className='gallery-layout l-page'>{children}</div>
    </GalleryDrawerContext.Provider>
  );
};

export default GalleryLayout;
