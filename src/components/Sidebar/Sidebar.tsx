import React from 'react';

import '@/styles/components/sidebar.css';

interface SidebarProps {
  /** Controls whether the sidebar is visible */
  isOpen: boolean;
  /** Sidebar contents (optional) */
  children?: React.ReactNode;
  /** Optional callback when sidebar should close (e.g. overlay click) */
  onClose?: () => void;
}

/**
 * Sidebar component – slides in from the left without pushing content.
 * Width is controlled by the `--spacing-sidebar-width` token.
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, children, onClose }) => {
  return (
    <>
      <aside className={`c-sidebar ${isOpen ? 'is-open' : ''}`}>
        {children}
      </aside>
      {/* Optional invisible overlay to catch outside clicks */}
      {isOpen && onClose && (
        <div
          role='button'
          aria-label='Close sidebar overlay'
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'transparent',
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
