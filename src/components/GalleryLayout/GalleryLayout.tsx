import React, { useState } from 'react';

import Sidebar from '@/components/Sidebar/Sidebar';
import { GalleryDrawerContext } from './GalleryDrawerContext';
import DrawerToggleButton from '@/components/Sidebar/DrawerToggleButton';
import useBreakpoint from '@/hooks/useBreakpoint';
import GalleryDrawer from './GalleryDrawer';
import DoubleArrowIcon from '@/components/Icon/DoubleArrowIcon';

/**
 * Layout with separate sidebar and drawer controls for the Gallery sandbox.
 */
export const GalleryLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // sidebar visibility
  const [drawerOpen, setDrawerOpen] = useState(false); // drawer visibility
  const bp = useBreakpoint();

  return (
    <GalleryDrawerContext.Provider
      value={{
        open: drawerOpen,
        toggle: () => {
          setDrawerOpen(prev => {
            const next = !prev;
            // On mobile screens, close sidebar when opening drawer and vice-versa
            if (bp === 'mobile') {
              setSidebarOpen(!next);
            }
            return next;
          });
        },
      }}
    >
      {/* Sidebar – always rendered; its isOpen state drives animation */}
      <Sidebar isOpen={sidebarOpen}>
        {/* Button inside sidebar to open/close drawer */}
        <DrawerToggleButton />
      </Sidebar>

      {/* Drawer – appears next to sidebar on desktop/tablet, overlays on mobile */}
      <GalleryDrawer />

      {/* Arrow toggle for sidebar – always visible */}
      <button
        type='button'
        onClick={() => {
          if (sidebarOpen) {
            // Close drawer first if it's open, then sidebar
            if (drawerOpen) setDrawerOpen(false);
            setSidebarOpen(false);
          } else {
            setSidebarOpen(true);
          }
        }}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        style={{
          position: 'fixed',
          top: bp === 'mobile' ? '1rem' : '20px',
          left: bp === 'mobile' ? '1rem' : '20px',
          zIndex: 99999,
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <DoubleArrowIcon direction={sidebarOpen ? 'left' : 'right'} />
      </button>

      <div className='gallery-layout l-page'>{children}</div>
    </GalleryDrawerContext.Provider>
  );
};

export default GalleryLayout;
