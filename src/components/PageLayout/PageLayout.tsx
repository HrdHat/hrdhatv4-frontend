import React, { useState } from 'react';

import Sidebar from '@/components/Sidebar/Sidebar';
import DoubleArrowIcon from '@/components/Icon/DoubleArrowIcon';

// PageLayout – standard content wrapper that enforces 360px side spacing on desktop via the `l-page` object.
// Mirrors the main application shell (sidebar + toggle) so any simple page (About, Terms, Gallery, etc.)
// can inherit consistent layout rules without duplicating markup.
// Visual styling is driven by ITCSS layers; this component owns no additional styles.
import './page-layout.css';

export interface PageLayoutProps {
  children: React.ReactNode;
  /** Optionally hide the sidebar entirely (e.g., auth pages). */
  hideSidebar?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, hideSidebar }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!hideSidebar && (
        <>
          <Sidebar isOpen={open} onClose={() => setOpen(false)} />
          {/* Toggle button */}
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
        </>
      )}

      <div className='l-page'>{children}</div>
    </>
  );
};

export default PageLayout;
