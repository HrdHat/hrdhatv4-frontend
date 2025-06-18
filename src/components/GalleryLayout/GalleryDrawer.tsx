import React from 'react';
import { useGalleryDrawer } from './GalleryDrawerContext';
import Button from '@/components/Button/Button';

// Import component-level styles (ITCSS components layer)
import '@/styles/components/drawer.css';

/**
 * Drawer component for the Gallery sandbox.
 * – Appears to the right of the Sidebar on tablet/desktop.
 * – Replaces the Sidebar on mobile (Sidebar hidden via CSS/logic).
 * – Height grows with content (`max-content`) but never below 320px.
 */
export const GalleryDrawer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { open, toggle } = useGalleryDrawer();

  return (
    <aside className={`c-drawer ${open ? 'is-open' : ''}`}>
      {/* Close drawer button (visible only when open) */}
      {open && (
        <Button
          variant='green'
          onClick={toggle}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 99998,
          }}
        >
          Close
        </Button>
      )}
      {/* Placeholder content if none provided – developers can override in sandbox */}
      {children ?? (
        <div style={{ padding: '1rem', color: 'var(--color-white)' }}>
          <h3 style={{ marginTop: 0 }}>Sandbox Drawer</h3>
          <p style={{ fontSize: '0.875rem' }}>
            Add your sandbox form or components here. The drawer is sized by its
            content and has a minimum height of 320px.
          </p>
        </div>
      )}
    </aside>
  );
};

export default GalleryDrawer;
